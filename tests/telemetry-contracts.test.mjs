import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { baseInput, createInvoiceWorld } from "../examples/invoice-exception/invoice-world-fixture.mjs";
import { runInvoiceException } from "../examples/invoice-exception/reference-loop.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function validator(schemaName) {
  const schema = JSON.parse(await readFile(path.join(root, "schemas", schemaName), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

async function completedRun() {
  const world = createInvoiceWorld();
  const result = await runInvoiceException(structuredClone(baseInput), world.deps);
  return result;
}

test("reference traces and effect receipts satisfy the closed telemetry contracts", async () => {
  const [validateTrace, validateReceipt, result] = await Promise.all([
    validator("trace-event.schema.json"),
    validator("effect-receipt.schema.json"),
    completedRun(),
  ]);

  for (const event of result.trace) {
    assert.equal(validateTrace(event), true, JSON.stringify(validateTrace.errors));
  }
  assert.equal(validateReceipt(result.effect_receipt), true, JSON.stringify(validateReceipt.errors));
});

test("trace details reject credentials, raw prompts, PII, and unrestricted retrieved content", async () => {
  const validateTrace = await validator("trace-event.schema.json");
  const result = await completedRun();

  for (const [field, value] of [
    ["authorization_token", "Bearer secret"],
    ["raw_prompt", "hidden system prompt"],
    ["customer_email", "person@example.com"],
    ["retrieved_content", "unrestricted document body"],
    ["invoice_revision", "7"],
  ]) {
    const event = structuredClone(result.trace[0]);
    event.details[field] = value;
    assert.equal(validateTrace(event), false, `${field} unexpectedly passed`);
    assert.ok(validateTrace.errors.some((error) => error.keyword === "additionalProperties"));
  }
});

test("state details use workflow-neutral hashed and typed references", async () => {
  const validateTrace = await validator("trace-event.schema.json");
  const result = await completedRun();
  const event = structuredClone(result.trace[0]);
  event.state = "evidence_reconciled";
  event.telemetry["agent.workflow.state"] = event.state;
  event.details = {
    source_revisions: [{ source_id: "case_record", revision_digest: `sha256:${"a".repeat(64)}` }],
    decision_references: [{ decision_type: "sufficiency", decision_id: "00000000-0000-4000-8000-000000000010" }],
    artifact_references: [{
      artifact_type: "evidence_packet",
      artifact_id_hash: `sha256:${"b".repeat(64)}`,
      content_digest: `sha256:${"c".repeat(64)}`,
    }],
  };
  assert.equal(validateTrace(event), true, JSON.stringify(validateTrace.errors));
});

test("effect receipts require bound identity, policy, signed service evidence, and readback", async () => {
  const validateReceipt = await validator("effect-receipt.schema.json");
  const result = await completedRun();

  for (const mutate of [
    (receipt) => { delete receipt.tenant_hash; },
    (receipt) => { delete receipt.policy_revision; },
    (receipt) => { delete receipt.service_receipt.signature; },
    (receipt) => { delete receipt.readback.observed_postcondition_digest; },
  ]) {
    const receipt = structuredClone(result.effect_receipt);
    mutate(receipt);
    assert.equal(validateReceipt(receipt), false, JSON.stringify(validateReceipt.errors));
  }
});

test("forged service and readback attestations cannot prove completion", async () => {
  const forgedService = createInvoiceWorld({ forgeServiceReceipt: true });
  const serviceResult = await runInvoiceException(structuredClone(baseInput), forgedService.deps);
  assert.equal(serviceResult.state, "escalated");
  assert.equal(serviceResult.stop_reason, "service_receipt_invalid");
  assert.equal(forgedService.state.incidents, 1);

  const forgedReadback = createInvoiceWorld({ forgeReadbackAttestation: true });
  const readbackResult = await runInvoiceException(structuredClone(baseInput), forgedReadback.deps);
  assert.equal(readbackResult.state, "postcondition_failed");
  assert.equal(readbackResult.stop_reason, "readback_mismatch");
  assert.equal(forgedReadback.state.compensations, 1);
  assert.equal(forgedReadback.state.incidents, 1);
});
