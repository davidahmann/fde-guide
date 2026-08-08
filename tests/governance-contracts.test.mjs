import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { baseInput, createInvoiceWorld } from "../examples/invoice-exception/invoice-world-fixture.mjs";
import { runInvoiceException } from "../examples/invoice-exception/reference-loop.mjs";
import { capabilityRegistryDecisionDigest } from "../scripts/contract-invariants.mjs";
import {
  capabilityManifestSemanticErrors,
  consumeHandoffEnvelope,
  effectReceiptSemanticErrors,
  expectedHandoffEnvelopeDigest,
  expectedHandoffParentAuthorityDigest,
  handoffEnvelopeSemanticErrors,
  operationalOntologySemanticErrors,
  traceEventSemanticErrors,
  workflowCharterSemanticErrors,
} from "../scripts/governance-invariants.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function json(repositoryPath) {
  return JSON.parse(await readFile(path.join(root, repositoryPath), "utf8"));
}

async function validator(schemaName) {
  const schema = await json(`schemas/${schemaName}`);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

function sealHandoff(envelope) {
  envelope.authority.parent_authority_digest = expectedHandoffParentAuthorityDigest(envelope);
  envelope.envelope_digest = expectedHandoffEnvelopeDigest(envelope);
  envelope.attestation.subject_digest = envelope.envelope_digest;
  return envelope;
}

function currentRootParent(envelope) {
  const authority = envelope.authority;
  const parent = {
    authority_id: authority.parent_authority_id,
    state_revision: authority.parent_state_revision,
    active: true,
    kind: "root_authority",
    participant: structuredClone(envelope.producer),
    handoff_id: null,
    envelope_digest: null,
    tenant_hash: authority.tenant_hash,
    caller_ceiling_hash: authority.caller_ceiling_hash,
    actions: structuredClone(authority.parent_actions),
    scopes: structuredClone(authority.parent_scopes),
    effect_ceiling: authority.parent_effect_ceiling,
    actor_modes: structuredClone(authority.parent_actor_modes),
    budget: structuredClone(authority.parent_budget),
    policy_revision: authority.policy_revision,
    maximum_depth: authority.maximum_depth,
    depth: authority.parent_depth,
  };
  parent.authority_digest = expectedHandoffParentAuthorityDigest({
    authority: {
      parent_authority_id: parent.authority_id,
      parent_state_revision: parent.state_revision,
      tenant_hash: parent.tenant_hash,
      caller_ceiling_hash: parent.caller_ceiling_hash,
      parent_actions: parent.actions,
      parent_scopes: parent.scopes,
      parent_effect_ceiling: parent.effect_ceiling,
      parent_actor_modes: parent.actor_modes,
      parent_budget: parent.budget,
      policy_revision: parent.policy_revision,
      maximum_depth: parent.maximum_depth,
      parent_depth: parent.depth,
    },
  });
  return parent;
}

function currentNestedParent(parentEnvelope) {
  const authority = parentEnvelope.authority;
  const parent = {
    authority_id: `handoff:${parentEnvelope.handoff_id}`,
    state_revision: `envelope:${parentEnvelope.envelope_digest}`,
    active: true,
    kind: "handoff",
    consumed: true,
    participant: structuredClone(parentEnvelope.recipient),
    handoff_id: parentEnvelope.handoff_id,
    envelope_digest: parentEnvelope.envelope_digest,
    tenant_hash: authority.tenant_hash,
    caller_ceiling_hash: authority.caller_ceiling_hash,
    actions: structuredClone(authority.delegated_actions),
    scopes: structuredClone(authority.delegated_scopes),
    effect_ceiling: authority.delegated_effect_ceiling,
    actor_modes: [authority.delegated_actor_mode],
    budget: structuredClone(parentEnvelope.budget),
    policy_revision: authority.policy_revision,
    maximum_depth: authority.maximum_depth,
    depth: authority.current_depth,
    expires_at: parentEnvelope.expires_at,
  };
  parent.authority_digest = expectedHandoffParentAuthorityDigest({
    authority: {
      parent_authority_id: parent.authority_id,
      parent_state_revision: parent.state_revision,
      tenant_hash: parent.tenant_hash,
      caller_ceiling_hash: parent.caller_ceiling_hash,
      parent_actions: parent.actions,
      parent_scopes: parent.scopes,
      parent_effect_ceiling: parent.effect_ceiling,
      parent_actor_modes: parent.actor_modes,
      parent_budget: parent.budget,
      policy_revision: parent.policy_revision,
      maximum_depth: parent.maximum_depth,
      parent_depth: parent.depth,
    },
  });
  return parent;
}

function currentRecipient(envelope) {
  return {
    ...structuredClone(envelope.recipient),
    active: true,
    authenticated: true,
    state_revision: `recipient:${envelope.recipient.principal}:7`,
  };
}

function nestedHandoff(parentEnvelope) {
  const parent = currentNestedParent(parentEnvelope);
  const child = structuredClone(parentEnvelope);
  child.handoff_id = "00000000-0000-4000-8000-000000000020";
  child.nonce = "00000000-0000-4000-8000-000000000021";
  child.parent_handoff_id = parentEnvelope.handoff_id;
  child.parent_handoff_digest = parentEnvelope.envelope_digest;
  child.created_at = "2026-08-07T16:05:30Z";
  child.expires_at = "2026-08-07T16:12:00Z";
  child.producer = structuredClone(parentEnvelope.recipient);
  child.recipient.principal = "workflow-agent-review-worker";
  child.recipient.worker_role = "review_worker";
  child.recipient.run_id = "00000000-0000-4000-8000-000000000022";
  child.authority.parent_authority_id = parent.authority_id;
  child.authority.parent_state_revision = parent.state_revision;
  child.authority.parent_actions = structuredClone(parent.actions);
  child.authority.delegated_actions = ["read_work_item"];
  child.authority.parent_scopes = structuredClone(parent.scopes);
  child.authority.delegated_scopes = ["work-item:read"];
  child.authority.parent_effect_ceiling = parent.effect_ceiling;
  child.authority.delegated_effect_ceiling = "none";
  child.authority.parent_actor_modes = structuredClone(parent.actor_modes);
  child.authority.delegated_actor_mode = parent.actor_modes[0];
  child.authority.parent_budget = structuredClone(parent.budget);
  child.authority.parent_depth = parent.depth;
  child.authority.current_depth = parent.depth + 1;
  child.budget = {
    steps_remaining: 3,
    tool_calls_remaining: 2,
    time_remaining_ms: 20000,
    tokens_remaining: 5000,
    cost_remaining_usd: 0.1,
  };
  return sealHandoff(child);
}

function createDurableHandoffState(parents, recipients) {
  return {
    parents: new Map(parents.map((parent) => [parent.authority_id, structuredClone(parent)])),
    recipients: new Map(recipients.map((recipient) => [recipient.principal, structuredClone(recipient)])),
    handoffIds: new Map(),
    nonces: new Map(),
    budgets: new Map(),
    claims: new Map(),
  };
}

function createAtomicHandoffClaimService(state) {
  return async (request) => {
    const parent = state.parents.get(request.parent_authority_id);
    if (!parent || parent.active !== true
      || parent.state_revision !== request.parent_state_revision
      || parent.authority_digest !== request.parent_authority_digest
      || parent.handoff_id !== request.parent_handoff_id
      || parent.envelope_digest !== request.parent_handoff_digest) {
      return { status: "parent_stale" };
    }
    const recipient = state.recipients.get(request.recipient_principal);
    if (!recipient || recipient.active !== true || recipient.authenticated !== true
      || recipient.state_revision !== request.recipient_state_revision
      || recipient.system_id !== request.recipient_system_id
      || recipient.worker_role !== request.recipient_worker_role
      || recipient.run_id !== request.recipient_run_id
      || recipient.actor_mode !== request.recipient_actor_mode) {
      return { status: "recipient_stale" };
    }

    const priorHandoff = state.handoffIds.get(request.handoff_id);
    if (priorHandoff) {
      if (priorHandoff.nonce === request.nonce && priorHandoff.envelope_digest === request.envelope_digest) {
        return { status: "already_claimed", claim_id: priorHandoff.claim_id };
      }
      return { status: "handoff_id_conflict" };
    }
    if (state.nonces.has(request.nonce)) return { status: "nonce_conflict" };

    const budgetKey = `${request.parent_authority_id}:${request.parent_state_revision}:${request.parent_authority_digest}`;
    const budget = state.budgets.get(budgetKey) ?? {
      ceiling: structuredClone(parent.budget),
      reserved: Object.fromEntries(Object.keys(parent.budget).map((field) => [field, 0])),
    };
    for (const [field, requested] of Object.entries(request.requested_budget)) {
      if (budget.reserved[field] + requested > budget.ceiling[field] + Number.EPSILON) {
        return { status: "budget_exhausted" };
      }
    }

    const claim = {
      status: "claimed",
      claim_id: `claim:${request.handoff_id}`,
      parent_authority_id: request.parent_authority_id,
      parent_state_revision: request.parent_state_revision,
      parent_authority_digest: request.parent_authority_digest,
      parent_handoff_id: request.parent_handoff_id,
      parent_handoff_digest: request.parent_handoff_digest,
      handoff_id: request.handoff_id,
      nonce: request.nonce,
      envelope_digest: request.envelope_digest,
      requested_budget_digest: request.requested_budget_digest,
      recipient_principal: request.recipient_principal,
      recipient_state_revision: request.recipient_state_revision,
      recipient_system_id: request.recipient_system_id,
      recipient_worker_role: request.recipient_worker_role,
      recipient_run_id: request.recipient_run_id,
      recipient_actor_mode: request.recipient_actor_mode,
    };
    for (const [field, requested] of Object.entries(request.requested_budget)) budget.reserved[field] += requested;
    state.budgets.set(budgetKey, budget);
    state.handoffIds.set(request.handoff_id, claim);
    state.nonces.set(request.nonce, claim);
    state.claims.set(claim.claim_id, claim);
    return structuredClone(claim);
  };
}

function consumerOptions(state, { parent, recipient } = {}) {
  return {
    verifyAttestation: verifyHandoffAttestation,
    resolveCurrentParent: async ({ parent_authority_id: parentId }) => (
      parent ?? structuredClone(state.parents.get(parentId))
    ),
    resolveCurrentRecipient: async ({ principal }) => (
      recipient ?? structuredClone(state.recipients.get(principal))
    ),
    claimHandoffConsumption: createAtomicHandoffClaimService(state),
  };
}

const verifyHandoffAttestation = async (envelope) => (
  envelope.attestation.subject_digest === envelope.envelope_digest
);

test("canonical governance templates satisfy their cross-field invariants", async () => {
  const [handoff, capability, ontology, charter] = await Promise.all([
    json("templates/handoff-envelope.json"),
    json("templates/capability-manifest.json"),
    json("templates/operational-ontology.json"),
    json("templates/workflow-charter.json"),
  ]);
  assert.deepEqual(handoffEnvelopeSemanticErrors(handoff), []);
  assert.deepEqual(capabilityManifestSemanticErrors(capability), []);
  assert.deepEqual(operationalOntologySemanticErrors(ontology), []);
  assert.deepEqual(workflowCharterSemanticErrors(charter), []);
});

test("handoffs cannot widen authority, reset budget, overflow depth, or expire", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const forged = structuredClone(canonical);
  forged.authority.delegated_actions = ["delete_account"];
  forged.authority.delegated_scopes = ["account:admin"];
  forged.authority.delegated_effect_ceiling = "irreversible";
  forged.authority.delegated_actor_mode = "unattended_workload";
  forged.recipient.actor_mode = "unattended_workload";
  forged.authority.current_depth = 9;
  forged.budget.cost_remaining_usd = 100;
  forged.expires_at = "2026-08-07T15:59:00Z";
  const errors = handoffEnvelopeSemanticErrors(forged, "forged handoff", { now: "2026-08-07T16:05:00Z" });
  for (const fragment of ["delegated actions", "delegated scopes", "effect ceiling", "actor mode", "maximum_depth", "cost_remaining_usd", "expiry"]) {
    assert.ok(errors.some((error) => error.includes(fragment)), `missing ${fragment}: ${errors.join("; ")}`);
  }
});

test("handoff consumption fails closed without parent, recipient, verifier, and atomic claim service", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const errors = await consumeHandoffEnvelope(canonical, { now: "2026-08-07T16:05:00Z" });
  for (const fragment of ["parent resolver", "recipient resolver", "attestation verifier", "replay claim and budget reservation"]) {
    assert.ok(errors.some((error) => error.includes(fragment)), `missing ${fragment}: ${errors.join("; ")}`);
  }
});

test("handoff consumption rejects invented parents and replays by handoff ID or nonce", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const rootParent = currentRootParent(canonical);
  const recipient = currentRecipient(canonical);
  const state = createDurableHandoffState([rootParent], [recipient]);
  const options = consumerOptions(state);

  const inventedParent = structuredClone(canonical);
  inventedParent.authority.parent_authority_id = "attacker-invented-grant";
  inventedParent.authority.parent_state_revision = "attacker-revision-1";
  inventedParent.authority.parent_budget.cost_remaining_usd = 1000;
  sealHandoff(inventedParent);
  const inventedParentErrors = await consumeHandoffEnvelope(inventedParent, {
    now: "2026-08-07T16:05:00Z",
    ...options,
    resolveCurrentParent: async () => undefined,
  });
  assert.ok(inventedParentErrors.some((error) => error.includes("parent state is unavailable")));

  assert.deepEqual(await consumeHandoffEnvelope(canonical, {
    now: "2026-08-07T16:05:00Z",
    ...options,
  }), []);

  const sameIdNewNonce = sealHandoff(structuredClone(canonical));
  sameIdNewNonce.nonce = "00000000-0000-4000-8000-000000000099";
  sealHandoff(sameIdNewNonce);
  const handoffIdReplayErrors = await consumeHandoffEnvelope(sameIdNewNonce, {
    now: "2026-08-07T16:05:00Z",
    ...options,
  });
  assert.ok(handoffIdReplayErrors.some((error) => error.includes("handoff_id_conflict")));

  const sameNonceNewId = structuredClone(canonical);
  sameNonceNewId.handoff_id = "00000000-0000-4000-8000-000000000098";
  sealHandoff(sameNonceNewId);
  const nonceReplayErrors = await consumeHandoffEnvelope(sameNonceNewId, {
    now: "2026-08-07T16:05:00Z",
    ...options,
  });
  assert.ok(nonceReplayErrors.some((error) => error.includes("nonce_conflict")));
});

test("atomic parent reservation prevents sibling aggregate budget exhaustion", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const sibling = structuredClone(canonical);
  sibling.handoff_id = "00000000-0000-4000-8000-000000000030";
  sibling.nonce = "00000000-0000-4000-8000-000000000031";
  sealHandoff(sibling);

  const rootParent = currentRootParent(canonical);
  const recipient = currentRecipient(canonical);
  const state = createDurableHandoffState([rootParent], [recipient]);
  const options = {
    now: "2026-08-07T16:05:00Z",
    ...consumerOptions(state),
  };
  assert.deepEqual(await consumeHandoffEnvelope(canonical, options), []);
  const errors = await consumeHandoffEnvelope(sibling, options);
  assert.ok(errors.some((error) => error.includes("budget_exhausted")), errors.join("; "));
  assert.equal(state.handoffIds.has(sibling.handoff_id), false);
  assert.equal(state.nonces.has(sibling.nonce), false);
});

test("root and exact nested handoffs consume, while wrong nested lineage fails", async () => {
  const [canonical, validateHandoff] = await Promise.all([
    json("templates/handoff-envelope.json"),
    validator("handoff-envelope.schema.json"),
  ]);
  assert.equal(validateHandoff(canonical), true, JSON.stringify(validateHandoff.errors));

  const rootParent = currentRootParent(canonical);
  const rootRecipient = currentRecipient(canonical);
  const rootState = createDurableHandoffState([rootParent], [rootRecipient]);
  assert.deepEqual(await consumeHandoffEnvelope(canonical, {
    now: "2026-08-07T16:05:00Z",
    ...consumerOptions(rootState),
  }), []);

  const nested = nestedHandoff(canonical);
  const nestedParent = currentNestedParent(canonical);
  const nestedRecipient = currentRecipient(nested);
  const nestedState = createDurableHandoffState([nestedParent], [nestedRecipient]);
  assert.equal(validateHandoff(nested), true, JSON.stringify(validateHandoff.errors));
  assert.deepEqual(await consumeHandoffEnvelope(nested, {
    now: "2026-08-07T16:06:00Z",
    ...consumerOptions(nestedState),
  }), []);

  const wrongParentEnvelope = structuredClone(canonical);
  wrongParentEnvelope.handoff_id = "00000000-0000-4000-8000-000000000040";
  wrongParentEnvelope.nonce = "00000000-0000-4000-8000-000000000041";
  sealHandoff(wrongParentEnvelope);
  const wrongParent = currentNestedParent(wrongParentEnvelope);
  const wrongState = createDurableHandoffState([wrongParent], [nestedRecipient]);
  const errors = await consumeHandoffEnvelope(nested, {
    now: "2026-08-07T16:06:00Z",
    ...consumerOptions(wrongState, { parent: wrongParent }),
  });
  assert.ok(errors.some((error) => error.includes("parent_handoff_id")), errors.join("; "));
  assert.ok(errors.some((error) => error.includes("parent_handoff_digest")), errors.join("; "));
});

test("handoff consumption authenticates the exact current recipient before atomic claim", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const rootParent = currentRootParent(canonical);
  const recipient = currentRecipient(canonical);
  const mismatches = {
    principal: "workflow-agent-wrong-worker",
    system_id: "other_system",
    worker_role: "other_worker",
    run_id: "00000000-0000-4000-8000-000000000097",
    actor_mode: "unattended_workload",
  };
  for (const [field, value] of Object.entries(mismatches)) {
    const wrongRecipient = { ...structuredClone(recipient), [field]: value };
    const state = createDurableHandoffState([rootParent], [recipient]);
    const errors = await consumeHandoffEnvelope(canonical, {
      now: "2026-08-07T16:05:00Z",
      ...consumerOptions(state, { recipient: wrongRecipient }),
    });
    assert.ok(
      errors.some((error) => error.includes("does not match the authenticated current recipient")),
      `${field}: ${errors.join("; ")}`,
    );
    assert.equal(state.claims.size, 0, field);
    assert.equal(state.budgets.size, 0, field);
  }
});

test("durable atomic claims stop concurrent and restart re-consumption", async () => {
  const canonical = await json("templates/handoff-envelope.json");
  const rootParent = currentRootParent(canonical);
  const recipient = currentRecipient(canonical);
  const durableState = createDurableHandoffState([rootParent], [recipient]);
  const firstProcessOptions = {
    now: "2026-08-07T16:05:00Z",
    ...consumerOptions(durableState),
  };
  const concurrent = await Promise.all([
    consumeHandoffEnvelope(canonical, firstProcessOptions),
    consumeHandoffEnvelope(structuredClone(canonical), firstProcessOptions),
  ]);
  assert.equal(concurrent.filter((errors) => errors.length === 0).length, 1);
  assert.equal(concurrent.filter((errors) => errors.some((error) => error.includes("already_claimed"))).length, 1);
  assert.equal(durableState.claims.size, 1);

  const restartedProcessOptions = {
    now: "2026-08-07T16:05:30Z",
    ...consumerOptions(durableState),
  };
  const restartErrors = await consumeHandoffEnvelope(structuredClone(canonical), restartedProcessOptions);
  assert.ok(restartErrors.some((error) => error.includes("already_claimed")), restartErrors.join("; "));
  assert.equal(durableState.claims.size, 1);
});

test("approved capabilities require observed digests and independent trust verification", async () => {
  const capability = await json("templates/capability-manifest.json");
  capability.status = "approved";
  capability.provenance.source_repository = "https://github.com/acme/bounded-workflow-tool";
  capability.provenance.registry_record.decision = "approved";
  capability.provenance.registry_record.decision_digest = capabilityRegistryDecisionDigest(
    capability.provenance.registry_record,
  );
  const observedDigests = {
    artifact: capability.provenance.artifact_digest,
    sbom: capability.provenance.sbom_digest,
    executable: capability.artifacts.executable_digest,
    tool_contract: capability.artifacts.tool_contract.digest,
    input_schema: capability.artifacts.input_schema_digest,
    output_schema: capability.artifacts.output_schema_digest,
  };
  const attestationVerification = {
    verified: true,
    build_attestation_digest: capability.provenance.build_attestation_digest,
  };
  const registryVerification = {
    verified: true,
    decision_digest: capability.provenance.registry_record.decision_digest,
  };
  assert.deepEqual(capabilityManifestSemanticErrors(capability, "approved capability", {
    now: "2026-08-08T00:00:00Z",
    observedDigests,
    attestationVerification,
    registryVerification,
  }), []);

  const unverified = capabilityManifestSemanticErrors(capability, "unverified capability", {
    now: "2026-08-08T00:00:00Z",
  });
  assert.ok(unverified.some((error) => error.includes("observed artifact digest")));
  assert.ok(unverified.some((error) => error.includes("attestation was not verified")));
  assert.ok(unverified.some((error) => error.includes("registry decision was not verified")));

  const overscoped = capabilityManifestSemanticErrors(capability, "overscoped capability", {
    now: "2026-08-08T00:00:00Z",
    observedDigests,
    attestationVerification,
    registryVerification,
    requestedAuthority: {
      actor_mode: "unattended_workload",
      scopes: ["admin:all"],
      data_classes: ["restricted"],
      effect_ceiling: "irreversible",
      destinations: [{ service_id: "attacker", scheme: "https", authority: "attacker.example", port: 443, path_prefix: "/exfil" }],
      tenant_binding: false,
    },
  });
  for (const fragment of ["actor mode", "scopes", "data classes", "effect ceiling", "destination", "tenant binding"]) {
    assert.ok(overscoped.some((error) => error.includes(fragment)), `missing ${fragment}: ${overscoped.join("; ")}`);
  }

  const requestedAuthority = {
    actor_mode: capability.authority.actor_modes[0],
    scopes: [...capability.authority.scopes],
    data_classes: [...capability.authority.data_classes],
    effect_ceiling: capability.authority.effect_ceiling,
    destinations: structuredClone(capability.authority.destinations),
    tenant_binding: capability.authority.tenant_binding,
  };
  for (const status of ["candidate", "disabled", "retired"]) {
    const unavailable = structuredClone(capability);
    unavailable.status = status;
    const errors = capabilityManifestSemanticErrors(unavailable, `${status} capability`, {
      now: "2026-08-08T00:00:00Z",
      observedDigests,
      attestationVerification,
      registryVerification,
      requestedAuthority,
    });
    assert.ok(
      errors.some((error) => error.includes("runtime invocation requires an approved capability lifecycle")),
      `${status} capability was admitted: ${errors.join("; ")}`,
    );
  }

  const widened = structuredClone(capability);
  widened.authority.scopes = ["admin:all"];
  widened.authority.effect_ceiling = "irreversible";
  const widenedErrors = capabilityManifestSemanticErrors(widened, "widened capability", {
    now: "2026-08-08T00:00:00Z",
    observedDigests,
    attestationVerification,
    registryVerification,
    requestedAuthority: {
      ...requestedAuthority,
      scopes: ["admin:all"],
      effect_ceiling: "irreversible",
    },
  });
  assert.ok(widenedErrors.some((error) => error.includes("authority.digest does not match")));
  assert.ok(widenedErrors.some((error) => error.includes("registry record does not bind")));
});

test("ontology graph validation rejects undeclared states, evidence, transitions, and orphan semantics", async () => {
  const ontology = await json("templates/operational-ontology.json");
  ontology.entities[0].lifecycle_transitions[0].from_state = "invented";
  ontology.actions[0].permitted_transitions.push("invented_transition");
  ontology.actions[0].decision_contract.evidence_types.push("invented_evidence");
  ontology.actions[0].authorization_policy = "invented_policy";
  const errors = operationalOntologySemanticErrors(ontology, "forged ontology");
  for (const fragment of ["undeclared from_state", "unknown transition", "unknown evidence", "unknown policy"]) {
    assert.ok(errors.some((error) => error.includes(fragment)), `missing ${fragment}: ${errors.join("; ")}`);
  }
});

test("workflow approvals require independent principals and coherent lifecycle decisions", async () => {
  const charter = await json("examples/invoice-exception/workflow-charter.json");
  charter.decision.approvers[1].principal = charter.decision.approvers[0].principal;
  charter.decision.disposition = "defer";
  const errors = workflowCharterSemanticErrors(charter, "workflow");
  assert.ok(errors.some((error) => error.includes("not independent")));
  assert.ok(errors.some((error) => error.includes("conflicts with decision")));
});

test("closed telemetry rejects forged duplicate bindings and raw values outside hashed detail fields", async () => {
  const [validateTrace, validateReceipt] = await Promise.all([
    validator("trace-event.schema.json"),
    validator("effect-receipt.schema.json"),
  ]);
  const result = await runInvoiceException(structuredClone(baseInput), createInvoiceWorld().deps);
  for (const event of result.trace) assert.deepEqual(traceEventSemanticErrors(event), []);
  assert.deepEqual(effectReceiptSemanticErrors(result.effect_receipt), []);

  const trace = structuredClone(result.trace[0]);
  trace.details.source_revisions = [{ source_id: "invoice", revision_digest: "sk-production12345" }];
  assert.equal(validateTrace(trace), false, JSON.stringify(validateTrace.errors));
  trace.telemetry["agent.run.id"] = "00000000-0000-4000-8000-000000000099";
  assert.ok(traceEventSemanticErrors(trace).some((error) => error.includes("run_id disagrees")));

  const receipt = structuredClone(result.effect_receipt);
  receipt.source_revision = "sk-production12345";
  receipt.service_receipt.subject.source_revision = "sk-production12345";
  receipt.service_receipt.subject_digest = result.effect_receipt.service_receipt.subject_digest;
  assert.equal(validateReceipt(receipt), true, JSON.stringify(validateReceipt.errors));
  const receiptErrors = effectReceiptSemanticErrors(receipt);
  assert.ok(receiptErrors.some((error) => error.includes("sensitive raw value")));
  assert.ok(receiptErrors.some((error) => error.includes("canonical payload")));
});
