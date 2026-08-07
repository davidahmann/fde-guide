import assert from "node:assert/strict";
import test from "node:test";

import { baseInput, createInvoiceWorld } from "./invoice-world-fixture.mjs";
import { referenceInternals, runInvoiceException } from "./reference-loop.mjs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function stageApprovedDirectRequest(deps) {
  const operationId = referenceInternals.digest({
    tenant_id: "tenant-a",
    invoice_id: "inv-100",
    invoice_revision: "7",
    action: "commit_resolution",
  });
  const proposalDigest = "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const staged = await deps.stageResolution({
    operation_id: operationId,
    tenant_id: "tenant-a",
    invoice_id: "inv-100",
    invoice_revision: "7",
    policy_revision: "policy-18",
    proposal: { action: "release_duplicate_hold" },
    proposal_digest: proposalDigest,
    idempotency_key: operationId,
  });
  const approval = await deps.requestApproval({
    proposal_id: staged.proposal_id,
    proposal_digest: proposalDigest,
    evidence: [],
    expires_seconds: 3600,
  });
  return {
    operation_id: operationId,
    tenant_id: "tenant-a",
    invoice_id: "inv-100",
    invoice_revision: "7",
    policy_revision: "policy-18",
    proposal_id: staged.proposal_id,
    proposal_digest: proposalDigest,
    approval_id: approval.approval_id,
    idempotency_key: operationId,
  };
}

test("authorized resolution commits and verifies exactly one effect", async () => {
  const { deps, state } = createInvoiceWorld();
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "completed");
  assert.equal(result.stop_reason, "completed");
  assert.match(result.run_id, uuidPattern);
  assert.match(result.operation_id, /^sha256:[a-f0-9]{64}$/);
  assert.equal(state.proposals.size, 1);
  assert.equal(state.effects.size, 1);
  assert.equal(result.readback.status, "resolved");
  assert.ok(state.events.some((event) => event.state === "readback_verified"));
});

test("read-only caller is denied before staging", async () => {
  const { deps, state } = createInvoiceWorld();
  const input = { ...baseInput, caller: { ...baseInput.caller, scopes: [] } };
  const result = await runInvoiceException(input, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "policy_denied");
  assert.equal(state.proposals.size, 0);
  assert.equal(state.effects.size, 0);
});

test("approval rejection prevents commit", async () => {
  const { deps, state } = createInvoiceWorld({ approved: false });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "rejected");
  assert.equal(result.stop_reason, "approval_rejected");
  assert.equal(state.proposals.size, 1);
  assert.equal(state.effects.size, 0);
});

test("duplicate delivery reuses stable proposal and effect receipts", async () => {
  const { deps, state } = createInvoiceWorld();
  const first = await runInvoiceException(baseInput, deps);
  const second = await runInvoiceException(baseInput, deps);

  assert.equal(first.state, "completed");
  assert.equal(second.state, "completed");
  assert.notEqual(first.run_id, second.run_id);
  assert.match(first.run_id, uuidPattern);
  assert.match(second.run_id, uuidPattern);
  assert.equal(first.operation_id, second.operation_id);
  assert.equal(first.idempotency_key, second.idempotency_key);
  assert.equal(first.operation_id, first.idempotency_key);
  assert.equal(first.effect.effect_id, second.effect.effect_id);
  assert.equal(state.proposals.size, 1);
  assert.equal(state.effects.size, 1);
});

test("changed proposal for the same business operation cannot create a second effect", async () => {
  const { deps, state } = createInvoiceWorld({
    proposalSequence: [
      { action: "release_duplicate_hold", amount: 0, rationale_code: "DUPLICATE_CONFIRMED" },
      { action: "release_duplicate_hold", amount: 25, rationale_code: "MANUAL_ADJUSTMENT" },
    ],
  });
  const first = await runInvoiceException(baseInput, deps);
  const second = await runInvoiceException(baseInput, deps);

  assert.equal(first.state, "completed");
  assert.equal(second.state, "escalated");
  assert.equal(second.stop_reason, "idempotency_conflict");
  assert.equal(first.operation_id, second.operation_id);
  assert.equal(state.proposals.size, 1);
  assert.equal(state.effects.size, 1);
  assert.equal(state.commitRequests.length, 1);
});

test("expired approval is rejected before commit", async () => {
  const { deps, state } = createInvoiceWorld({ approvalExpiresAt: "2026-08-07T16:59:59.000Z" });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "rejected");
  assert.equal(result.stop_reason, "approval_expired");
  assert.equal(state.commitRequests.length, 0);
  assert.equal(state.effects.size, 0);
});

test("approval digest mismatch is rejected before commit", async () => {
  const { deps, state } = createInvoiceWorld({ approvalDigestMismatch: true });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "approval_digest_mismatch");
  assert.equal(state.commitRequests.length, 0);
  assert.equal(state.effects.size, 0);
});

test("commit boundary denies caller scope revoked after orchestration authorization", async () => {
  const { deps, state } = createInvoiceWorld({ revokeAfterCommitAuthorization: true });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "policy_denied_at_commit");
  assert.equal(state.commitRequests.length, 1);
  assert.equal(state.effects.size, 0);
  assert.deepEqual(state.toolErrors.map((error) => error.code), ["POLICY_DENIED"]);
});

test("commit boundary denies policy rotated after orchestration authorization", async () => {
  const { deps, state } = createInvoiceWorld({ rotatePolicyAfterCommitAuthorization: true });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "policy_denied_at_commit");
  assert.equal(state.commitRequests.length, 1);
  assert.equal(state.effects.size, 0);
  assert.deepEqual(state.toolErrors.map((error) => error.code), ["POLICY_DENIED"]);
});

test("direct commit-tool invocation without approval fails closed", async () => {
  const { deps, state } = createInvoiceWorld({
    currentCallerScopes: ["invoice-resolution:stage", "invoice-resolution:commit"],
  });

  const operationId = referenceInternals.digest({
    tenant_id: "tenant-a",
    invoice_id: "inv-100",
    invoice_revision: "7",
    action: "commit_resolution",
  });
  await assert.rejects(
    deps.commitResolution({
      operation_id: operationId,
      tenant_id: "tenant-a",
      invoice_id: "inv-100",
      invoice_revision: "7",
      policy_revision: "policy-18",
      proposal_id: "proposal-bypass",
      proposal_digest: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      approval_id: "missing-approval",
      idempotency_key: operationId,
    }),
    (error) => error.code === "POLICY_DENIED" && error.retryable === false,
  );
  assert.equal(state.effects.size, 0);
  assert.equal(state.unapprovedLedgerMutations, 0);
});

test("commit boundary rejects a caller-supplied stale business revision", async () => {
  const { deps, state } = createInvoiceWorld({
    currentCallerScopes: ["invoice-resolution:stage", "invoice-resolution:commit"],
  });
  const request = await stageApprovedDirectRequest(deps);
  const forgedOperationId = referenceInternals.digest({
    tenant_id: request.tenant_id,
    invoice_id: request.invoice_id,
    invoice_revision: "999",
    action: "commit_resolution",
  });

  await assert.rejects(
    deps.commitResolution({
      ...request,
      invoice_revision: "999",
      operation_id: forgedOperationId,
      idempotency_key: forgedOperationId,
    }),
    (error) => error.code === "POLICY_DENIED" && error.retryable === false,
  );
  assert.equal(state.effectCreations, 0);
  assert.equal(state.effects.size, 0);
});

test("commit boundary rejects alternate operation IDs and preserves one effect", async () => {
  const { deps, state } = createInvoiceWorld({
    currentCallerScopes: ["invoice-resolution:stage", "invoice-resolution:commit"],
  });
  const request = await stageApprovedDirectRequest(deps);
  const first = await deps.commitResolution(request);
  const forgedOperationId = "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

  await assert.rejects(
    deps.commitResolution({
      ...request,
      operation_id: forgedOperationId,
      idempotency_key: forgedOperationId,
    }),
    (error) => error.code === "DIGEST_MISMATCH" && error.retryable === false,
  );
  assert.equal(first.status, "committed");
  assert.equal(state.effectCreations, 1);
  assert.equal(state.effects.size, 1);
  assert.equal(state.receipts.size, 1);
});

test("postcondition mismatch compensates and opens an incident", async () => {
  const { deps, state } = createInvoiceWorld({ readbackMatches: false });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "postcondition_failed");
  assert.equal(result.stop_reason, "readback_mismatch");
  assert.equal(state.compensations, 1);
  assert.equal(state.incidents, 1);
});

test("tenant mismatch stops before proposal or effect", async () => {
  const { deps, state } = createInvoiceWorld({ returnedTenant: "tenant-b" });
  const result = await runInvoiceException(baseInput, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "tenant_mismatch");
  assert.equal(state.proposals.size, 0);
  assert.equal(state.effects.size, 0);
});

test("read boundary denies a true cross-tenant request before returning data", async () => {
  const { deps, state } = createInvoiceWorld({ invoiceTenant: "tenant-a" });
  const input = {
    ...baseInput,
    tenant_id: "tenant-b",
    caller: { ...baseInput.caller, tenant_id: "tenant-b" },
  };
  const result = await runInvoiceException(input, deps);

  assert.equal(result.state, "escalated");
  assert.equal(result.stop_reason, "policy_denied");
  assert.equal(state.crossTenantReadAttempts, 1);
  assert.equal(state.crossTenantReads, 0);
  assert.equal(state.proposals.size, 0);
  assert.equal(state.effects.size, 0);
});
