import { createHash, randomUUID } from "node:crypto";

const requiredInput = ["tenant_id", "invoice_id", "invoice_revision", "caller"];
const requiredDependencies = [
  "loadContext",
  "proposeResolution",
  "validateProposal",
  "authorize",
  "stageResolution",
  "requestApproval",
  "commitResolution",
  "readbackInvoice",
  "verifyReadback",
  "compensate",
  "openIncident",
];

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

function digest(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex")}`;
}

function assertContract(input, deps) {
  for (const field of requiredInput) {
    if (input[field] === undefined || input[field] === null) throw new TypeError(`missing input.${field}`);
  }
  for (const dependency of requiredDependencies) {
    if (typeof deps[dependency] !== "function") throw new TypeError(`missing dependency ${dependency}`);
  }
}

export async function runInvoiceException(input, deps) {
  assertContract(input, deps);

  const trace = [];
  const runId = randomUUID();
  const operationId = digest({
    tenant_id: input.tenant_id,
    invoice_id: input.invoice_id,
    invoice_revision: input.invoice_revision,
    action: "commit_resolution",
  });
  const telemetryIdentity = {
    tenant_hash: digest(input.tenant_id),
    agent_principal_hash: digest("invoice-exception-workload"),
    caller_id_hash: digest(input.caller.id ?? `${input.tenant_id}:anonymous`),
  };

  const transition = async (state, attributes = {}) => {
    const { stop_reason: stopReason, ...details } = attributes;
    const telemetry = {
      "agent.run.id": runId,
      "agent.operation.id": operationId,
      "agent.system.id": "invoice_exception_agent",
      "agent.system.version": "1.0.0",
      "agent.workflow.id": "invoice_exception_resolution",
      "agent.workflow.state": state,
      "agent.tenant.hash": telemetryIdentity.tenant_hash,
      "agent.principal.id_hash": telemetryIdentity.agent_principal_hash,
      "agent.caller.id_hash": telemetryIdentity.caller_id_hash,
      "agent.autonomy.level": "execute_reversible",
      "agent.steps.count": trace.length + 1,
    };
    if (stopReason) {
      telemetry["agent.stop.reason"] = stopReason;
      telemetry["agent.cost.usd"] = typeof deps.cost === "function" ? deps.cost() : 0;
      telemetry["agent.accepted_outcome"] = state === "completed";
    }
    const event = {
      run_id: runId,
      operation_id: operationId,
      state,
      details,
      telemetry,
      ...(stopReason ? { stop_reason: stopReason } : {}),
    };
    trace.push(event);
    if (deps.emit) await deps.emit(event);
  };

  const terminal = async (state, reason, artifacts = {}) => {
    await transition(state, { stop_reason: reason });
    return { run_id: runId, operation_id: operationId, state, stop_reason: reason, trace, ...artifacts };
  };

  await transition("received");
  let context;
  try {
    context = await deps.loadContext(input);
  } catch (error) {
    return terminal("escalated", error?.code === "POLICY_DENIED" ? "policy_denied" : "context_load_failed", {
      error_code: error?.code ?? "INTERNAL_ERROR",
    });
  }
  await transition("evidence_loaded", {
    invoice_revision: context.invoice.revision,
    policy_revision: context.policy.revision,
  });

  if (context.invoice.tenant_id !== input.tenant_id) {
    return terminal("escalated", "tenant_mismatch");
  }
  if (context.invoice.revision !== input.invoice_revision) {
    return terminal("escalated", "stale_invoice_revision");
  }
  if (!context.policy.current) {
    return terminal("escalated", "stale_policy");
  }

  const proposal = await deps.proposeResolution({ input, context });
  await transition("proposed");

  const validation = await deps.validateProposal({ proposal, context });
  if (!validation.valid) {
    return terminal("escalated", "validation_failed", { validation_errors: validation.errors ?? [] });
  }
  await transition("validated");

  const proposalDigest = digest({
    tenant_id: input.tenant_id,
    invoice_id: input.invoice_id,
    proposal,
    invoice_revision: context.invoice.revision,
    policy_revision: context.policy.revision,
  });
  const idempotencyKey = operationId;

  const stageDecision = await deps.authorize({
    action: "stage_resolution",
    agent: "invoice-exception-workload",
    caller: input.caller,
    tenant_id: input.tenant_id,
    resource: context.invoice,
    policy_revision: context.policy.revision,
  });
  await transition("stage_authorized", { policy_decision_id: stageDecision.decision_id });
  if (!stageDecision.allow) {
    return terminal("escalated", "policy_denied");
  }

  const staged = await deps.stageResolution({
    operation_id: operationId,
    tenant_id: input.tenant_id,
    invoice_id: input.invoice_id,
    invoice_revision: context.invoice.revision,
    policy_revision: context.policy.revision,
    proposal,
    proposal_digest: proposalDigest,
    idempotency_key: idempotencyKey,
  });
  if (staged.proposal_digest !== proposalDigest) {
    return terminal("escalated", "idempotency_conflict", {
      proposal_id: staged.proposal_id,
      staged_proposal_digest: staged.proposal_digest,
      attempted_proposal_digest: proposalDigest,
    });
  }
  await transition("staged", { proposal_id: staged.proposal_id, proposal_digest: proposalDigest });

  const approval = await deps.requestApproval({
    proposal_id: staged.proposal_id,
    proposal_digest: proposalDigest,
    evidence: context.evidence,
    expires_seconds: 3600,
  });
  const authorizationTime = deps.now ? deps.now() : new Date().toISOString();
  const approvalExpired = approval.expired === true
    || !approval.expires_at
    || !Number.isFinite(Date.parse(approval.expires_at))
    || Date.parse(approval.expires_at) <= Date.parse(authorizationTime);
  if (!approval.approved || approvalExpired) {
    return terminal("rejected", approvalExpired ? "approval_expired" : "approval_rejected", {
      proposal_id: staged.proposal_id,
    });
  }
  if (approval.proposal_digest !== proposalDigest) {
    return terminal("escalated", "approval_digest_mismatch", { proposal_id: staged.proposal_id });
  }
  await transition("approved", { approval_id: approval.approval_id });

  const commitDecision = await deps.authorize({
    action: "commit_resolution",
    agent: "invoice-exception-workload",
    caller: input.caller,
    tenant_id: input.tenant_id,
    resource: context.invoice,
    policy_revision: context.policy.revision,
    proposal_digest: proposalDigest,
    now: authorizationTime,
    approval,
  });
  await transition("commit_authorized", { policy_decision_id: commitDecision.decision_id });
  if (!commitDecision.allow) {
    return terminal("escalated", "policy_denied_before_commit", { proposal_id: staged.proposal_id });
  }

  const commitRequest = {
    operation_id: operationId,
    tenant_id: input.tenant_id,
    invoice_id: input.invoice_id,
    invoice_revision: context.invoice.revision,
    policy_revision: context.policy.revision,
    proposal_id: staged.proposal_id,
    proposal_digest: proposalDigest,
    approval_id: approval.approval_id,
    idempotency_key: idempotencyKey,
  };
  let effect;
  let readback;
  let completionReason = "completed";
  try {
    effect = await deps.commitResolution(commitRequest);
    await transition("committed", { effect_id: effect.effect_id, service_receipt: effect.service_receipt });
  } catch (error) {
    if (error?.code === "POLICY_DENIED") {
      return terminal("escalated", "policy_denied_at_commit", { error_code: error.code });
    }
    if (error?.code !== "TIMEOUT" || error.retryable !== true) {
      return terminal("escalated", "internal_error", { error_code: error?.code ?? "INTERNAL_ERROR" });
    }

    await transition("effect_unknown", { error_code: error.code });
    readback = await deps.readbackInvoice({
      tenant_id: input.tenant_id,
      invoice_id: input.invoice_id,
      operation_id: operationId,
    });
    if (!readback.last_effect) {
      return terminal("escalated", "timeout_exhausted", { error_code: error.code });
    }
    effect = readback.last_effect;
    completionReason = "completed_after_timeout_recovery";
    await transition("effect_recovered", {
      effect_id: effect.effect_id,
      service_receipt: effect.service_receipt,
    });
  }

  if (!readback) {
    readback = await deps.readbackInvoice({
      tenant_id: input.tenant_id,
      invoice_id: input.invoice_id,
      operation_id: operationId,
    });
  }
  const verified = await deps.verifyReadback({ readback, proposal, effect, context });
  const effectReceipt = {
    effect_id: effect.effect_id,
    run_id: runId,
    operation_id: operationId,
    action: "commit_resolution",
    resource_hash: digest({
      tenant_id: input.tenant_id,
      invoice_id: input.invoice_id,
      invoice_revision: context.invoice.revision,
    }),
    proposal_digest: proposalDigest,
    idempotency_key_hash: digest(idempotencyKey),
    policy_decision_id: commitDecision.decision_id,
    approval_id: approval.approval_id,
    service_receipt: effect.service_receipt,
    committed_at: authorizationTime,
    readback_status: verified ? "matched" : "mismatched",
  };
  if (!verified) {
    await deps.compensate({ effect, context, reason: "postcondition_mismatch" });
    const incident = await deps.openIncident({ run_id: runId, effect, readback, severity: "SEV-1" });
    return terminal("postcondition_failed", "readback_mismatch", {
      effect,
      effect_receipt: effectReceipt,
      incident_id: incident.incident_id,
    });
  }

  await transition("readback_verified");
  return terminal("completed", completionReason, {
    proposal_id: staged.proposal_id,
    effect,
    effect_receipt: effectReceipt,
    readback,
    idempotency_key: idempotencyKey,
  });
}

export const referenceInternals = { canonical, digest };
