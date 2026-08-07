import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { embeddedToolSchemaErrors, ontologyIdentityErrors, patternCatalogErrors } from "../scripts/contract-invariants.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pairs = [
  ["artifact-catalog.schema.json", "catalog.json"],
  ["control-catalog.schema.json", "controls/control-catalog.json"],
  ["operational-ontology.schema.json", "templates/operational-ontology.json"],
  ["agent-system.schema.json", "templates/agent-system.json"],
  ["tool-contract.schema.json", "templates/tool-contract.json"],
  ["evaluation-case.schema.json", "templates/evaluation-case.json"],
  ["threat-model.schema.json", "templates/threat-model.json"],
  ["pattern-catalog.schema.json", "patterns/pattern-catalog.json"],
];

async function json(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

for (const [schemaName, fixturePath] of pairs) {
  test(`${schemaName} accepts its canonical template`, async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    addFormats(ajv);
    const validate = ajv.compile(await json(`schemas/${schemaName}`));
    const fixture = await json(fixturePath);
    assert.equal(validate(fixture), true, JSON.stringify(validate.errors));
  });

  test(`${schemaName} rejects missing required data and unknown fields`, async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    addFormats(ajv);
    const schema = await json(`schemas/${schemaName}`);
    const validate = ajv.compile(schema);
    const fixture = structuredClone(await json(fixturePath));
    const removable = schema.required.find((field) => field !== "$schema");
    delete fixture[removable];
    fixture.uncontrolled_field = true;
    assert.equal(validate(fixture), false);
    assert.ok(validate.errors.some((error) => error.keyword === "required"));
    assert.ok(validate.errors.some((error) => error.keyword === "additionalProperties"));
  });
}

test("evaluation schema rejects an agent-controlled pass signal", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/evaluation-case.schema.json"));
  const fixture = await json("templates/evaluation-case.json");
  fixture.evaluator_boundary.agent_can_emit_pass_signal = true;
  assert.equal(validate(fixture), false);
});

test("ontology schema rejects an undeclared effect class", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/operational-ontology.schema.json"));
  const fixture = await json("templates/operational-ontology.json");
  fixture.actions[0].side_effect = "model_defined";
  assert.equal(validate(fixture), false);
});

test("tool schema requires fail-closed authorization", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixture = await json("templates/tool-contract.json");
  fixture.authorization.fail_mode = "open";
  assert.equal(validate(fixture), false);
});

test("tool schema accepts canonical query, staged-write, commit-write, and irreversible contracts", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixtures = [
    await json("examples/invoice-exception/tools/read-invoice.json"),
    await json("templates/tool-contract.json"),
    await json("examples/invoice-exception/tools/commit-resolution.json"),
  ];
  const irreversible = structuredClone(fixtures[2]);
  irreversible.side_effects.class = "irreversible";
  irreversible.side_effects.compensation = null;
  fixtures.push(irreversible);

  for (const fixture of fixtures) {
    assert.equal(validate(fixture), true, `${fixture.tool_id}: ${JSON.stringify(validate.errors)}`);
  }
});

test("query tools cannot declare effects, approvals, idempotency keys, or postcondition writes", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixture = await json("examples/invoice-exception/tools/read-invoice.json");
  fixture.side_effects = { class: "staged", resources: ["invoice"], compensation: "discard" };
  fixture.approval = { required: true, role: "approver", proposal_digest_required: true, expires_seconds: 300 };
  fixture.execution.idempotency = { required: true, key_fields: ["invoice_id"], enforced_by: "ledger" };
  fixture.observability.postcondition_readback = true;
  assert.equal(validate(fixture), false);
});

test("staged writes require caller and tenant binding, a digest, idempotency, compensation, and readback", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixture = await json("templates/tool-contract.json");
  fixture.output_schema.required = fixture.output_schema.required.filter((field) => field !== "proposal_digest");
  fixture.authorization.caller_context_required = false;
  fixture.authorization.tenant_binding = false;
  fixture.execution.idempotency.required = false;
  fixture.execution.idempotency.key_fields = [];
  fixture.side_effects.resources = [];
  fixture.side_effects.compensation = null;
  fixture.approval = { required: true, role: "approver", proposal_digest_required: true, expires_seconds: 300 };
  fixture.observability.postcondition_readback = false;
  assert.equal(validate(fixture), false);
});

test("commit writes require caller and tenant binding, digest-bound approval, idempotency, effect semantics, and readback", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixture = await json("examples/invoice-exception/tools/commit-resolution.json");
  fixture.authorization.caller_context_required = false;
  fixture.authorization.tenant_binding = false;
  fixture.approval = { required: false, role: null, proposal_digest_required: false, expires_seconds: null };
  fixture.execution.idempotency.required = false;
  fixture.execution.idempotency.key_fields = [];
  fixture.side_effects.class = "staged";
  fixture.observability.postcondition_readback = false;
  assert.equal(validate(fixture), false);
});

test("compute and administrative side effects require generic effect controls", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const base = await json("examples/invoice-exception/tools/read-invoice.json");

  for (const kind of ["compute", "administrative"]) {
    const valid = structuredClone(base);
    valid.kind = kind;
    valid.execution.idempotency = { required: true, key_fields: ["tenant_id", "invoice_id"], enforced_by: "effect-service" };
    valid.side_effects = { class: "reversible", resources: ["work-item"], compensation: "restore prior revision" };
    valid.observability.postcondition_readback = true;
    assert.equal(validate(valid), true, `${kind}: ${JSON.stringify(validate.errors)}`);

    const invalid = structuredClone(valid);
    invalid.authorization.caller_context_required = false;
    invalid.authorization.tenant_binding = false;
    invalid.execution.idempotency = { required: false, key_fields: [], enforced_by: "effect-service" };
    invalid.side_effects.resources = [];
    invalid.observability.postcondition_readback = false;
    assert.equal(validate(invalid), false);
  }
});

test("every non-read effect requires brokered allowlisted network access", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const base = await json("examples/invoice-exception/tools/read-invoice.json");
  base.kind = "administrative";
  base.execution.idempotency = { required: true, key_fields: ["tenant_id", "invoice_id"], enforced_by: "effect-service" };
  base.side_effects = { class: "reversible", resources: ["work-item"], compensation: "restore prior revision" };
  base.observability.postcondition_readback = true;
  assert.equal(validate(base), true, JSON.stringify(validate.errors));

  for (const network of [
    { egress: "none", destinations: [], credential_broker: null },
    { egress: "allowlist", destinations: [], credential_broker: "workload-identity-gateway" },
    { egress: "allowlist", destinations: ["effect-service.internal"], credential_broker: null },
  ]) {
    const invalid = structuredClone(base);
    invalid.network = network;
    assert.equal(validate(invalid), false);
  }
});

test("irreversible effects are commit-only, approval-gated, and non-compensable", async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));
  const fixture = await json("examples/invoice-exception/tools/commit-resolution.json");
  fixture.side_effects.class = "irreversible";
  assert.equal(validate(fixture), false);

  fixture.side_effects.compensation = null;
  fixture.kind = "administrative";
  assert.equal(validate(fixture), false);
});

test("all embedded tool schemas compile and malformed input, output, or error schemas fail", async () => {
  const fixture = await json("templates/tool-contract.json");
  assert.deepEqual(embeddedToolSchemaErrors(fixture, "fixture"), []);

  for (const field of ["input_schema", "output_schema", "error_schema"]) {
    const malformed = structuredClone(fixture);
    malformed[field] = { type: "not-a-json-schema-type" };
    const errors = embeddedToolSchemaErrors(malformed, "fixture");
    assert.equal(errors.length, 1);
    assert.match(errors[0], new RegExp(`${field} schema compilation failed`));
  }
});

test("ontology identity keys resolve to declared attributes", async () => {
  const fixture = await json("templates/operational-ontology.json");
  assert.deepEqual(ontologyIdentityErrors(fixture, "fixture"), []);

  fixture.entities[0].identity_keys = ["missing_identity"];
  assert.deepEqual(
    ontologyIdentityErrors(fixture, "fixture"),
    ["fixture entity work_item identity key missing_identity is not declared as an attribute"],
  );
});

test("pattern catalogs require unique IDs, defined evidence, and ordered current review dates", async () => {
  const fixture = await json("patterns/pattern-catalog.json");
  const evidenceIds = new Set(fixture.patterns.flatMap((pattern) => pattern.evidence).filter((id) => !id.startsWith("internal-")));
  const reviewDate = new Date("2026-08-07T12:00:00Z");
  assert.deepEqual(patternCatalogErrors(fixture, evidenceIds, "fixture", reviewDate), []);

  fixture.patterns[1].id = fixture.patterns[0].id;
  fixture.patterns[0].evidence = ["R26-99"];
  fixture.patterns[0].reviewed_at = "2026-08-08";
  fixture.patterns[1].review_due = "2026-08-06";
  const errors = patternCatalogErrors(fixture, evidenceIds, "fixture", reviewDate);
  assert.ok(errors.some((error) => error.includes("duplicates pattern ID")));
  assert.ok(errors.some((error) => error.includes("references missing evidence")));
  assert.ok(errors.some((error) => error.includes("reviewed_at is in the future")));
  assert.ok(errors.some((error) => error.includes("review_due precedes reviewed_at")));
  assert.ok(errors.some((error) => error.includes("review is overdue")));
});
