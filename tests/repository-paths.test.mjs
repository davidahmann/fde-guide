import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  agentArtifactReferences,
  classifyReference,
  documentationLinkDestinations,
  expectedDocumentSchema,
  expectedCatalogTypes,
  isGovernedJsonDocument,
  isWithinDirectory,
  localLinkDocuments,
  resolveWithinRepository,
} from "../scripts/repository-paths.mjs";

let fixtureRoot;
let repositoryRoot;
let outsideFile;

before(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "production-agent-paths-"));
  repositoryRoot = path.join(fixtureRoot, "repository");
  outsideFile = path.join(fixtureRoot, "outside.txt");
  await mkdir(path.join(repositoryRoot, "nested"), { recursive: true });
  await writeFile(path.join(repositoryRoot, "nested", "artifact.md"), "artifact\n");
  await writeFile(outsideFile, "outside\n");
  await symlink(outsideFile, path.join(repositoryRoot, "nested", "outside-link.md"));
});

after(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

test("repository containment accepts direct paths and bounded parent traversal", async () => {
  const direct = await resolveWithinRepository({
    root: repositoryRoot,
    baseDirectory: repositoryRoot,
    candidate: "nested/artifact.md",
    requireRegularFile: true,
  });
  const boundedParent = await resolveWithinRepository({
    root: repositoryRoot,
    baseDirectory: path.join(repositoryRoot, "nested"),
    candidate: "../nested/artifact.md",
    requireRegularFile: true,
  });

  assert.equal(direct.resolvedTarget, boundedParent.resolvedTarget);
  assert.equal(isWithinDirectory(repositoryRoot, direct.lexicalTarget), true);
});

test("repository containment rejects lexical, absolute, and symlink escapes", async () => {
  const windowsPath = ["C", ":", "\\", "Users", "\\", "alice", "\\", "secret.txt"].join("");
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: "../outside.txt",
    }),
    /escapes the repository root/,
  );
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: outsideFile,
    }),
    /absolute paths/,
  );
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: windowsPath,
    }),
    /absolute paths/,
  );
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: "nested/outside-link.md",
    }),
    /resolved path escapes the repository root/,
  );
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: "nested/missing.md",
    }),
    /ENOENT/,
  );
});

test("catalog targets can require regular files", async () => {
  await assert.rejects(
    resolveWithinRepository({
      root: repositoryRoot,
      baseDirectory: repositoryRoot,
      candidate: "nested",
      requireRegularFile: true,
    }),
    /not a regular file/,
  );
});

test("agent dependency discovery includes the required trace contract", () => {
  const references = agentArtifactReferences({
    context: { ontology_uri: "./ontology.json" },
    verification: { evaluation_suite_uri: "./evals/" },
    operations: {
      trace_contract: "../../operations/telemetry-contract.md",
      runbook_uri: "../../operations/incident-runbook.md",
    },
    tools: [{ tool_id: "read_item", contract_uri: "./tools/read-item.json" }],
  });

  assert.deepEqual(
    references.map((reference) => reference.field),
    [
      "context.ontology_uri",
      "verification.evaluation_suite_uri",
      "operations.trace_contract",
      "operations.runbook_uri",
      "tools.read_item.contract_uri",
    ],
  );
});

test("governed path classes map to allowed catalog types", () => {
  assert.deepEqual([...expectedCatalogTypes(".agents/skills/qualify-ai-workflow/SKILL.md")], ["standard"]);
  assert.deepEqual([...expectedCatalogTypes("schemas/tool-contract.schema.json")], ["schema"]);
  assert.deepEqual([...expectedCatalogTypes("operations/telemetry-contract.md")], ["runbook", "standard"]);
  assert.deepEqual([...expectedCatalogTypes("research/2026-01-01--2026-02-01-ledger.md")], ["evidence"]);
  assert.deepEqual([...expectedCatalogTypes("solutions/enterprise-foundation.md")], ["blueprint"]);
  assert.deepEqual([...expectedCatalogTypes("solutions/business-flows/exception-to-resolution.md")], ["blueprint"]);
  assert.deepEqual([...expectedCatalogTypes("solutions/verticals/healthcare-access-coordination.md")], ["blueprint"]);
  assert.equal(expectedCatalogTypes("solutions/README.md"), null);
  assert.equal(expectedCatalogTypes("library/00-start-here.md"), null);
});

test("local documentation checks include the compact agent index", () => {
  const markdownFiles = [path.join(repositoryRoot, "README.md")];
  assert.deepEqual(localLinkDocuments(repositoryRoot, markdownFiles), [
    path.join(repositoryRoot, "README.md"),
    path.join(repositoryRoot, "llms.txt"),
  ]);
});

test("documentation link discovery includes inline and reference-style destinations", () => {
  const links = documentationLinkDestinations([
    "[inline](README.md#section)",
    "[source]: library/05-source-index.md#s01",
    "[angle]: <research/README.md>",
  ].join("\n"));
  assert.deepEqual(links, ["README.md#section", "library/05-source-index.md#s01", "research/README.md"]);
});

test("reference classification allowlists schemes and rejects machine paths", () => {
  const windowsPath = ["C", ":", "\\", "Users", "\\", "alice", "\\", "secret.txt"].join("");
  const fileUri = ["FILE", "://", "/etc/passwd"].join("");

  assert.deepEqual(classifyReference("https://example.com", ["http", "https", "mailto"]), { kind: "external", scheme: "https" });
  assert.deepEqual(classifyReference("mailto:security@example.com", ["http", "https", "mailto"]), { kind: "external", scheme: "mailto" });
  assert.equal(classifyReference("https://example.com/tool.json", []).kind, "unsupported");
  assert.equal(classifyReference("javascript:alert(1)", ["http", "https", "mailto"]).kind, "unsupported");
  assert.equal(classifyReference("data:text/plain,hello", ["http", "https", "mailto"]).kind, "unsupported");
  assert.equal(classifyReference(fileUri, ["http", "https", "mailto"]).kind, "unsupported");
  assert.equal(classifyReference(windowsPath, ["http", "https", "mailto"]).kind, "absolute");
});

test("governed JSON paths bind to their expected schemas", () => {
  assert.equal(isGovernedJsonDocument("package.json"), false);
  assert.equal(isGovernedJsonDocument("examples/invoice-exception/tools/read-invoice.json"), true);
  assert.equal(expectedDocumentSchema("catalog.json"), "schemas/artifact-catalog.schema.json");
  assert.equal(expectedDocumentSchema("templates/agent-system.json"), "schemas/agent-system.schema.json");
  assert.equal(expectedDocumentSchema("templates/ai-value-engineering-scorecard.json"), "schemas/ai-value-engineering-scorecard.schema.json");
  assert.equal(
    expectedDocumentSchema("examples/workflow/value-review.json", {
      assessment_id: "value_review",
      hard_gates: {},
      factors: [],
    }),
    "schemas/ai-value-engineering-scorecard.schema.json",
  );
  assert.equal(expectedDocumentSchema("examples/invoice-exception/evals/authorized-commit.json"), "schemas/evaluation-case.schema.json");
  assert.equal(expectedDocumentSchema("examples/invoice-exception/tools/read-invoice.json"), "schemas/tool-contract.schema.json");
});
