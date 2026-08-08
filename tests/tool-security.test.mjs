import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { toolContractSemanticErrors } from "../scripts/contract-invariants.mjs";

const repositoryRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function json(repositoryPath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, repositoryPath), "utf8"));
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(await json("schemas/tool-contract.schema.json"));

function assertSchemaAccepts(tool) {
  assert.equal(validate(tool), true, JSON.stringify(validate.errors));
}

function assertSchemaRejects(tool) {
  assert.equal(validate(tool), false, "unsafe contract unexpectedly passed JSON Schema validation");
}

async function publicOpenWorldTool() {
  const tool = await json("examples/invoice-exception/tools/read-invoice.json");
  tool.tool_id = "public_search";
  tool.purpose = "Search public sources through one isolated anonymous gateway capability";
  tool.input_schema = {
    type: "object",
    additionalProperties: false,
    required: ["query"],
    properties: { query: { type: "string", minLength: 1 } },
  };
  tool.output_schema = {
    type: "object",
    additionalProperties: false,
    required: ["results"],
    properties: { results: { type: "array", items: { type: "object" } } },
  };
  tool.authorization = {
    agent_principal: "public-research-workload",
    caller_context_required: false,
    required_scopes: ["public-search:query"],
    policy_decision_point: "public-search-gateway",
    tenant_binding: false,
    fail_mode: "closed",
  };
  tool.data_access = {
    reads_data: true,
    classifications: ["public"],
    maximum_sensitivity: "public",
    scope_fields: ["query"],
    max_records: 20,
    max_response_bytes: 131072,
    open_world: true,
    approval_policy: "none",
    request_fields: [
      {
        field: "query",
        classification: "public",
        source: "untrusted_source",
        allowed_sink_service_ids: ["public_search_gateway"],
        purpose: "execute one bounded public search",
      },
    ],
  };
  tool.network = {
    egress: "allowlist",
    destinations: [
      {
        service_id: "public_search_gateway",
        scheme: "https",
        authority: "public-search-gateway.internal",
        port: 443,
        path_prefix: "/v1/search",
      },
    ],
    allowed_operations: ["public_search"],
    allowed_methods: ["POST"],
    redirect_policy: "deny",
    address_resolution_policy: "pinned_service_identity",
    private_address_policy: "deny",
    server_fetch_policy: "separate_capability",
    target_account_binding: false,
    tenant_binding: false,
    request_max_bytes: 8192,
    response_max_bytes: 131072,
    credential_broker: null,
    public_gateway_capability: {
      service_id: "public_search_gateway",
      operation: "public_search",
    },
  };
  tool.observability = {
    span_name: "agent.tool.public_search",
    audit_event: "public_search.completed",
    redacted_fields: [],
    postcondition_readback: false,
  };
  tool.invariants = ["gateway returns only public data and has no ambient authenticated session"];
  return tool;
}

test("canonical tool contracts satisfy schema and semantic security invariants", async () => {
  for (const repositoryPath of [
    "templates/tool-contract.json",
    "examples/invoice-exception/tools/read-invoice.json",
    "examples/invoice-exception/tools/retrieve-policy.json",
    "examples/invoice-exception/tools/stage-resolution.json",
    "examples/invoice-exception/tools/commit-resolution.json",
  ]) {
    const tool = await json(repositoryPath);
    assertSchemaAccepts(tool);
    assert.deepEqual(toolContractSemanticErrors(tool, repositoryPath), []);
  }
});

test("network destinations are exact structured service boundaries", async () => {
  const canonical = await json("examples/invoice-exception/tools/read-invoice.json");

  const stringDestination = structuredClone(canonical);
  stringDestination.network.destinations = ["ap-ledger.internal"];
  assertSchemaRejects(stringDestination);

  for (const authority of ["*.example.com", "{tenant}.example.com", "user@example.com", "https://example.com"]) {
    const dynamicAuthority = structuredClone(canonical);
    dynamicAuthority.network.destinations[0].authority = authority;
    assertSchemaRejects(dynamicAuthority);
  }

  for (const pathPrefix of ["/", "v1/invoices", "/v1/*", "/v1/../admin", "/v1/%2e%2e/admin", "/v1/read?target=x"]) {
    const dynamicPath = structuredClone(canonical);
    dynamicPath.network.destinations[0].path_prefix = pathPrefix;
    assertSchemaRejects(dynamicPath);
  }
});

test("query tools cannot use mutating HTTP methods", async () => {
  const canonical = await json("examples/invoice-exception/tools/read-invoice.json");
  for (const method of ["PUT", "PATCH", "DELETE"]) {
    const tool = structuredClone(canonical);
    tool.network.allowed_methods = [method];
    assertSchemaRejects(tool);
  }
});

test("non-public reads require caller, tenant, account, broker, and policy binding", async () => {
  const canonical = await json("examples/invoice-exception/tools/read-invoice.json");
  const mutations = [
    (tool) => { tool.authorization.caller_context_required = false; },
    (tool) => { tool.authorization.tenant_binding = false; },
    (tool) => { tool.data_access.approval_policy = "none"; },
    (tool) => { tool.data_access.open_world = true; },
    (tool) => { tool.network.target_account_binding = false; },
    (tool) => { tool.network.tenant_binding = false; },
    (tool) => { tool.network.credential_broker = null; },
  ];

  for (const mutate of mutations) {
    const tool = structuredClone(canonical);
    mutate(tool);
    assertSchemaRejects(tool);
  }
});

test("public open-world reads use one anonymous exact gateway capability", async () => {
  const canonical = await publicOpenWorldTool();
  assertSchemaAccepts(canonical);
  assert.deepEqual(toolContractSemanticErrors(canonical, "public tool"), []);

  for (const mutate of [
    (tool) => { tool.network.credential_broker = "ambient-browser-session"; },
    (tool) => { tool.network.private_address_policy = "explicit_allowlist"; },
    (tool) => { tool.network.redirect_policy = "same_origin"; },
    (tool) => { tool.network.target_account_binding = true; },
    (tool) => { tool.data_access.maximum_sensitivity = "internal"; },
    (tool) => { tool.data_access.request_fields[0].classification = "restricted"; },
    (tool) => { tool.network.destinations.push(structuredClone(tool.network.destinations[0])); },
  ]) {
    const tool = structuredClone(canonical);
    mutate(tool);
    assertSchemaRejects(tool);
  }

  const mismatchedCapability = structuredClone(canonical);
  mismatchedCapability.network.public_gateway_capability.operation = "different_operation";
  mismatchedCapability.network.allowed_operations.push("different_operation");
  assertSchemaAccepts(mismatchedCapability);
  assert.ok(toolContractSemanticErrors(mismatchedCapability, "public tool")
    .some((error) => error.includes("exact public gateway capability")));
});

test("request fields bind declared inputs to declared sink services", async () => {
  const canonical = await json("examples/invoice-exception/tools/read-invoice.json");

  const unknownInput = structuredClone(canonical);
  unknownInput.data_access.request_fields[0].field = "raw_secret";
  assert.ok(toolContractSemanticErrors(unknownInput, "read tool")
    .some((error) => error.includes("not declared in input_schema.properties")));

  const unknownSink = structuredClone(canonical);
  unknownSink.data_access.request_fields[0].allowed_sink_service_ids = ["untrusted_sink"];
  assert.ok(toolContractSemanticErrors(unknownSink, "read tool")
    .some((error) => error.includes("undeclared sink service")));

  const duplicatePolicy = structuredClone(canonical);
  duplicatePolicy.data_access.request_fields.push({
    ...structuredClone(duplicatePolicy.data_access.request_fields[0]),
    purpose: "second conflicting flow rule",
  });
  assertSchemaAccepts(duplicatePolicy);
  assert.ok(toolContractSemanticErrors(duplicatePolicy, "read tool")
    .some((error) => error.includes("duplicates request-field policy")));

  const missingPolicy = structuredClone(canonical);
  missingPolicy.data_access.request_fields = missingPolicy.data_access.request_fields
    .filter((policy) => policy.field !== "invoice_id");
  assert.ok(toolContractSemanticErrors(missingPolicy, "read tool")
    .some((error) => error.includes("invoice_id has no request-field policy")));

  const extraOperation = structuredClone(canonical);
  extraOperation.network.allowed_operations.push("delete_invoice");
  assert.ok(toolContractSemanticErrors(extraOperation, "read tool")
    .some((error) => error.includes("allowed_operations must contain only")));

  const duplicateService = structuredClone(canonical);
  duplicateService.network.destinations.push({
    ...structuredClone(duplicateService.network.destinations[0]),
    path_prefix: "/v1/invoices/alternate",
  });
  assert.ok(toolContractSemanticErrors(duplicateService, "read tool")
    .some((error) => error.includes("duplicates network destination service_id")));
});

test("idempotency fields resolve to required inputs and commits bind idempotency_key", async () => {
  const canonical = await json("examples/invoice-exception/tools/commit-resolution.json");
  assert.deepEqual(toolContractSemanticErrors(canonical, "commit tool"), []);

  const unknownKey = structuredClone(canonical);
  unknownKey.execution.idempotency.key_fields.push("missing_key");
  assert.ok(toolContractSemanticErrors(unknownKey, "commit tool")
    .some((error) => error.includes("missing_key is not declared")));

  const optionalKey = structuredClone(canonical);
  optionalKey.input_schema.required = optionalKey.input_schema.required.filter((field) => field !== "business_operation_id");
  assert.ok(toolContractSemanticErrors(optionalKey, "commit tool")
    .some((error) => error.includes("business_operation_id is not required")));

  const missingCommitKey = structuredClone(canonical);
  missingCommitKey.execution.idempotency.key_fields = ["business_operation_id"];
  assert.ok(toolContractSemanticErrors(missingCommitKey, "commit tool")
    .some((error) => error.includes("must contain idempotency_key")));
});

test("retry declarations are complete, unique, and safe", async () => {
  const canonical = await json("examples/invoice-exception/tools/commit-resolution.json");

  const unknownRetry = structuredClone(canonical);
  unknownRetry.execution.retryable_errors.push("UNKNOWN");
  assert.ok(toolContractSemanticErrors(unknownRetry, "commit tool")
    .some((error) => error.includes("UNKNOWN has no matching retry-safe failure mode")));

  const missingRetry = structuredClone(canonical);
  missingRetry.execution.retryable_errors = missingRetry.execution.retryable_errors.filter((code) => code !== "TIMEOUT");
  assert.ok(toolContractSemanticErrors(missingRetry, "commit tool")
    .some((error) => error.includes("TIMEOUT is missing")));

  const duplicateFailure = structuredClone(canonical);
  duplicateFailure.failure_modes.push({
    code: "TIMEOUT",
    class: "terminal",
    retry: false,
    retry_safety: "never",
    escalate: true,
  });
  assertSchemaAccepts(duplicateFailure);
  assert.ok(toolContractSemanticErrors(duplicateFailure, "commit tool")
    .some((error) => error.includes("duplicates failure code TIMEOUT")));

  const unsafeAuthorizationRetry = structuredClone(canonical);
  const policyDenial = unsafeAuthorizationRetry.failure_modes.find((failure) => failure.code === "POLICY_DENIED");
  policyDenial.retry = true;
  policyDenial.retry_safety = "idempotent_replay";
  unsafeAuthorizationRetry.execution.retryable_errors.push("POLICY_DENIED");
  assertSchemaRejects(unsafeAuthorizationRetry);

  const noRetryAttempt = structuredClone(canonical);
  noRetryAttempt.execution.max_attempts = 1;
  assert.ok(toolContractSemanticErrors(noRetryAttempt, "commit tool")
    .some((error) => error.includes("max_attempts does not permit a retry")));
});
