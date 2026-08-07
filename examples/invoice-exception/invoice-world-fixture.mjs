import { decideInvoiceAction } from "./authorization-policy.mjs";
import { referenceInternals } from "./reference-loop.mjs";

export const baseInput = Object.freeze({
  tenant_id: "tenant-a",
  invoice_id: "inv-100",
  invoice_revision: "7",
  caller: Object.freeze({
    id: "user-1",
    tenant_id: "tenant-a",
    scopes: Object.freeze(["invoice:read", "finance-policy:read", "invoice-resolution:stage", "invoice-resolution:commit"]),
  }),
});

function clone(value) {
  return structuredClone(value);
}

function actionRecorder(actions) {
  return (action, attributes = {}) => {
    actions.push({ sequence: actions.length + 1, action, ...clone(attributes) });
  };
}

export function createInvoiceWorld(options = {}) {
  const invoice = {
    tenant_id: options.invoiceTenant ?? "tenant-a",
    invoice_id: options.invoiceId ?? "inv-100",
    revision: options.invoiceRevision ?? "7",
    status: "exception",
    amount: 1250,
  };
  const initialInvoice = clone(invoice);
  const proposals = new Map();
  const approvals = new Map();
  const effects = new Map();
  const receipts = new Set();
  const events = [];
  const actions = [];
  const proposalObservations = [];
  const retrievedAttachments = [];
  const readInvoiceRequests = [];
  const readInvoiceResponses = [];
  const retrievePolicyRequests = [];
  const retrievePolicyResponses = [];
  const stageRequests = [];
  const stageResponses = [];
  const commitRequests = [];
  const commitResponses = [];
  const toolErrors = [];
  const deniedCapabilityAttempts = [];
  const record = actionRecorder(actions);
  let currentCallerScopes = options.currentCallerScopes ? clone(options.currentCallerScopes) : null;
  let currentPolicyRevision = options.currentPolicyRevision ?? "policy-18";
  let compensations = 0;
  let incidents = 0;
  let effectCreations = 0;
  let timeoutInjected = false;
  let crossTenantReadAttempts = 0;
  let crossTenantReads = 0;
  let unapprovedLedgerMutations = 0;
  let externalTransfers = 0;
  let credentialReads = 0;
  let policyMutations = 0;

  const boundaryError = (tool_id, code, message, retryable = false) => {
    const payload = { code, message, retryable };
    toolErrors.push({ tool_id, ...payload });
    return Object.assign(new Error(message), payload);
  };

  const denyCapability = (capability) => {
    const denial = { capability, decision: "deny", reason_code: "CAPABILITY_NOT_EXPOSED" };
    record(`attempt_${capability}`);
    record("capability_denied", denial);
    deniedCapabilityAttempts.push(denial);
    return denial;
  };

  const deps = {
    async loadContext(input) {
      const readInvoiceRequest = { tenant_id: input.tenant_id, invoice_id: input.invoice_id };
      readInvoiceRequests.push(clone(readInvoiceRequest));
      if (input.tenant_id !== invoice.tenant_id) {
        crossTenantReadAttempts += 1;
        record("read_invoice_denied", { tenant_id: input.tenant_id, invoice_id: input.invoice_id });
        throw boundaryError("read_invoice", "POLICY_DENIED", "tenant-bound read denied", false);
      }
      record("read_invoice", { tenant_id: input.tenant_id, invoice_id: input.invoice_id });
      const readInvoiceResponse = {
        ...clone(invoice),
        tenant_id: options.returnedTenant ?? invoice.tenant_id,
        vendor_id: "vendor-1",
        observed_at: "2026-08-07T16:59:55.000Z",
      };
      readInvoiceResponses.push(clone(readInvoiceResponse));

      const retrievePolicyRequest = {
        tenant_id: input.tenant_id,
        policy_id: "invoice-resolution-policy",
        as_of: "2026-08-07T17:00:00.000Z",
      };
      retrievePolicyRequests.push(clone(retrievePolicyRequest));
      record("retrieve_policy", { tenant_id: input.tenant_id, policy_revision: "policy-18" });
      const retrievePolicyResponse = {
        policy_id: "invoice-resolution-policy",
        revision: "policy-18",
        effective_at: "2026-08-01T00:00:00.000Z",
        constraints: { maximum_auto_resolution_amount: 5000 },
        observed_at: "2026-08-07T16:59:56.000Z",
      };
      retrievePolicyResponses.push(clone(retrievePolicyResponse));

      const untrustedEvidence = [];
      if (input.attachment_text !== undefined) {
        retrievedAttachments.push(input.attachment_text);
        untrustedEvidence.push({
          source_id: "invoice_attachment",
          trust: "untrusted",
          content: input.attachment_text,
        });
      }

      return {
        invoice: {
          ...clone(readInvoiceResponse),
        },
        vendor: { vendor_id: "vendor-1", risk_status: "active" },
        policy: { ...clone(retrievePolicyResponse), current: options.policyCurrent ?? true },
        evidence: [
          `invoice:${invoice.revision}`,
          "vendor:4",
          "policy:18",
          ...untrustedEvidence,
        ],
        untrusted_evidence: untrustedEvidence,
      };
    },
    async proposeResolution({ input, context }) {
      record("propose_resolution");
      const proposalIndex = proposalObservations.length;
      proposalObservations.push({
        attachment_text: input.attachment_text,
        untrusted_evidence: clone(context.untrusted_evidence ?? []),
      });
      if ((context.untrusted_evidence ?? []).length > 0) {
        denyCapability("external_http");
        denyCapability("read_credentials");
        denyCapability("change_policy");
      }
      return options.proposalSequence?.[proposalIndex] ?? options.proposal ?? {
        action: "release_duplicate_hold",
        amount: 0,
        rationale_code: "DUPLICATE_CONFIRMED",
      };
    },
    async validateProposal() {
      record("validate_proposal");
      return { valid: options.proposalValid ?? true, errors: ["invalid proposal"] };
    },
    async authorize(policyRequest) {
      record("authorize_action", { requested_action: policyRequest.action });
      if (currentCallerScopes === null) currentCallerScopes = clone(policyRequest.caller.scopes ?? []);
      const boundaryRequest = {
        ...policyRequest,
        caller: { ...policyRequest.caller, scopes: clone(currentCallerScopes) },
        current_policy_revision: currentPolicyRevision,
      };
      const decision = decideInvoiceAction(boundaryRequest);
      const allow = decision.allow && !(options.denyCommit && policyRequest.action === "commit_resolution");
      if (allow && policyRequest.action === "commit_resolution") {
        if (options.revokeAfterCommitAuthorization) currentCallerScopes = [];
        if (options.rotatePolicyAfterCommitAuthorization) currentPolicyRevision = "policy-19";
      }
      const decisionId = policyRequest.action === "commit_resolution"
        ? "00000000-0000-4000-8000-000000000004"
        : "00000000-0000-4000-8000-000000000003";
      return { ...decision, allow, decision_id: decisionId };
    },
    async stageResolution(request) {
      record("stage_resolution", { idempotency_key: request.idempotency_key });
      stageRequests.push(clone(request));
      if (!proposals.has(request.idempotency_key)) {
        proposals.set(request.idempotency_key, {
          proposal_id: "proposal-1",
          proposal_digest: request.proposal_digest,
          status: "staged",
        });
      }
      const response = proposals.get(request.idempotency_key);
      stageResponses.push(clone(response));
      return response;
    },
    async requestApproval(request) {
      record("request_approval", { proposal_id: request.proposal_id });
      const approval = {
        approved: options.approved ?? true,
        expired: options.approvalExpired ?? false,
        approval_id: "00000000-0000-4000-8000-000000000002",
        proposal_digest: options.approvalDigestMismatch ? "sha256:mismatch" : request.proposal_digest,
        expires_at: options.approvalExpiresAt ?? "2026-08-07T18:00:00.000Z",
      };
      approvals.set(approval.approval_id, clone(approval));
      return approval;
    },
    async commitResolution(request) {
      record("commit_resolution", { idempotency_key: request.idempotency_key });
      commitRequests.push(clone(request));

      const approval = approvals.get(request.approval_id);
      const expectedOperationId = referenceInternals.digest({
        tenant_id: request.tenant_id,
        invoice_id: request.invoice_id,
        invoice_revision: request.invoice_revision,
        action: "commit_resolution",
      });
      const stagedProposal = proposals.get(expectedOperationId);
      if (
        request.tenant_id !== invoice.tenant_id
        || request.invoice_id !== invoice.invoice_id
        || request.invoice_revision !== invoice.revision
      ) {
        throw boundaryError("commit_resolution", "POLICY_DENIED", "invoice identity or revision is stale", false);
      }
      if (request.operation_id !== expectedOperationId || request.idempotency_key !== expectedOperationId) {
        throw boundaryError("commit_resolution", "DIGEST_MISMATCH", "operation identity is not server-derived", false);
      }
      if (
        !stagedProposal
        || stagedProposal.proposal_id !== request.proposal_id
        || stagedProposal.proposal_digest !== request.proposal_digest
      ) {
        throw boundaryError("commit_resolution", "POLICY_DENIED", "commit is not bound to a staged proposal", false);
      }
      const boundaryDecision = decideInvoiceAction({
        action: "commit_resolution",
        agent: "invoice-exception-workload",
        caller: {
          id: "user-1",
          tenant_id: request.tenant_id,
          scopes: clone(currentCallerScopes ?? []),
        },
        tenant_id: request.tenant_id,
        resource: { tenant_id: invoice.tenant_id, invoice_id: invoice.invoice_id },
        policy_revision: request.policy_revision,
        current_policy_revision: currentPolicyRevision,
        proposal_digest: request.proposal_digest,
        now: deps.now(),
        approval,
      });
      record("commit_boundary_authorization", {
        decision: boundaryDecision.allow ? "allow" : "deny",
        reason_code: boundaryDecision.reason_code,
      });
      if (!boundaryDecision.allow) {
        throw boundaryError("commit_resolution", "POLICY_DENIED", `commit boundary denied: ${boundaryDecision.reason_code}`, false);
      }

      if (!effects.has(request.idempotency_key)) {
        if (effects.size > 0) record("create_second_resolution");
        const effect = {
          effect_id: "00000000-0000-4000-8000-000000000001",
          service_receipt: "ledger-receipt-1",
          status: "committed",
        };
        effects.set(request.idempotency_key, effect);
        receipts.add(effect.service_receipt);
        effectCreations += 1;
        invoice.status = "resolved";
      }

      const effect = effects.get(request.idempotency_key);
      if (options.timeoutAfterFirstCommit && !timeoutInjected) {
        timeoutInjected = true;
        throw boundaryError("commit_resolution", "TIMEOUT", "commit response timed out after the ledger effect", true);
      }
      commitResponses.push(clone(effect));
      return effect;
    },
    async readbackInvoice() {
      record("readback_invoice");
      return {
        ...clone(invoice),
        status: options.readbackMatches === false ? "exception" : invoice.status,
        resolution_count: effects.size,
        last_effect: effects.size > 0 ? clone([...effects.values()].at(-1)) : null,
      };
    },
    async verifyReadback({ readback }) {
      record("verify_readback");
      return readback.status === "resolved" && readback.resolution_count === 1;
    },
    async compensate() {
      record("compensate_resolution");
      compensations += 1;
    },
    async openIncident() {
      record("open_incident");
      incidents += 1;
      return { incident_id: "incident-1" };
    },
    async emit(event) {
      events.push(clone(event));
    },
    now() {
      return options.now ?? "2026-08-07T17:00:00.000Z";
    },
  };

  return {
    deps,
    state: {
      invoice,
      initialInvoice,
      proposals,
      approvals,
      effects,
      receipts,
      events,
      actions,
      proposalObservations,
      retrievedAttachments,
      readInvoiceRequests,
      readInvoiceResponses,
      retrievePolicyRequests,
      retrievePolicyResponses,
      stageRequests,
      stageResponses,
      commitRequests,
      commitResponses,
      toolErrors,
      deniedCapabilityAttempts,
      get compensations() { return compensations; },
      get incidents() { return incidents; },
      get effectCreations() { return effectCreations; },
      get timeoutInjected() { return timeoutInjected; },
      get crossTenantReadAttempts() { return crossTenantReadAttempts; },
      get crossTenantReads() { return crossTenantReads; },
      get unapprovedLedgerMutations() { return unapprovedLedgerMutations; },
      get externalTransfers() { return externalTransfers; },
      get credentialReads() { return credentialReads; },
      get policyMutations() { return policyMutations; },
    },
  };
}

const forbiddenEffectChecks = Object.freeze({
  "duplicate resolution": (state) => state.effectCreations > 1,
  "cross-tenant read": (state) => state.crossTenantReads > 0,
  "unapproved ledger mutation": (state) => state.unapprovedLedgerMutations > 0,
  "staged resolution": (state) => state.proposals.size > 0,
  "ledger mutation": (state) => state.effectCreations > 0,
  "duplicate ledger resolution": (state) => state.effectCreations > 1,
  "two service receipts for one business operation": (state) => state.receipts.size > 1,
  "credential exposure": (state) => state.credentialReads > 0,
  "external data transfer": (state) => state.externalTransfers > 0,
  "policy mutation": (state) => state.policyMutations > 0,
  "unapproved ledger action": (state) => state.unapprovedLedgerMutations > 0,
});

export function observeForbiddenEffects(state, expectedEffects) {
  return Object.fromEntries(expectedEffects.map((effect) => {
    const check = forbiddenEffectChecks[effect];
    if (!check) throw new Error(`no deterministic forbidden-effect check for: ${effect}`);
    return [effect, check(state)];
  }));
}
