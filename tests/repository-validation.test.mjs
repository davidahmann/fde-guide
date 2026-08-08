import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const sourceRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const validator = path.join(sourceRoot, "scripts", "validate-repository.mjs");

async function runValidator(repositoryRoot) {
  try {
    const result = await execFileAsync(process.execPath, [validator], {
      env: { ...process.env, REPOSITORY_VALIDATION_ROOT: repositoryRoot },
      maxBuffer: 2 * 1024 * 1024,
    });
    return { exitCode: 0, output: `${result.stdout}${result.stderr}` };
  } catch (error) {
    return { exitCode: error.code, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

async function mutateFile(repositoryRoot, repositoryPath, transform, expectedFailure) {
  const target = path.join(repositoryRoot, repositoryPath);
  const original = await readFile(target, "utf8");
  try {
    await writeFile(target, transform(original));
    const result = await runValidator(repositoryRoot);
    assert.notEqual(result.exitCode, 0, result.output);
    assert.match(result.output, expectedFailure);
  } finally {
    await writeFile(target, original);
  }
}

function transformJson(transform) {
  return (body) => {
    const document = JSON.parse(body);
    transform(document);
    return `${JSON.stringify(document, null, 2)}\n`;
  };
}

test("repository validator rejects bypasses at its integrated boundaries", async (t) => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "production-agent-validator-"));
  const repositoryRoot = path.join(temporaryRoot, "repository");

  try {
    await cp(sourceRoot, repositoryRoot, {
      recursive: true,
      filter(source) {
        const topLevel = path.relative(sourceRoot, source).split(path.sep)[0];
        return ![".git", "coverage", "node_modules"].includes(topLevel);
      },
    });
    await execFileAsync("git", ["init", "--quiet"], { cwd: repositoryRoot });
    await execFileAsync("git", ["add", "--all"], { cwd: repositoryRoot });

    const baseline = await runValidator(repositoryRoot);
    assert.equal(baseline.exitCode, 0, baseline.output);

    await t.test("unsupported documentation schemes", async () => {
      await mutateFile(
        repositoryRoot,
        "llms.txt",
        (body) => `${body}\n[unsafe](javascript:alert(1))\n`,
        /unsupported or absolute link/,
      );
    });

    await t.test("machine-local documentation paths", async () => {
      const windowsPath = ["C", ":", "\\", "Users", "\\", "alice", "\\", "secret.txt"].join("");
      await mutateFile(
        repositoryRoot,
        "llms.txt",
        (body) => `${body}\n[unsafe](${windowsPath})\n`,
        /machine-local path|unsupported or absolute link/,
      );
    });

    await t.test("broken reference-style documentation links", async () => {
      await mutateFile(
        repositoryRoot,
        "llms.txt",
        (body) => `${body}\n[broken-reference]: missing.md\n`,
        /unsafe or missing local path/,
      );
    });

    await t.test("broken reference-style documentation anchors", async () => {
      await mutateFile(
        repositoryRoot,
        "llms.txt",
        (body) => `${body}\n[broken-reference]: README.md#missing-anchor\n`,
        /links to missing anchor/,
      );
    });

    await t.test("catalog omissions", async () => {
      await mutateFile(
        repositoryRoot,
        "catalog.json",
        transformJson((document) => document.artifacts.pop()),
        /omits governed artifact/,
      );
    });

    await t.test("duplicate catalog paths", async () => {
      await mutateFile(
        repositoryRoot,
        "catalog.json",
        transformJson((document) => { document.artifacts[1].path = document.artifacts[0].path; }),
        /maps .* to both/,
      );
    });

    await t.test("missing governed schema declarations", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/agent-system.json",
        transformJson((document) => { delete document.$schema; }),
        /must declare a repository-relative \$schema/,
      );
    });

    await t.test("external governed schema declarations", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/agent-system.json",
        transformJson((document) => { document.$schema = "https://example.com/schema.json"; }),
        /must declare a repository-relative \$schema/,
      );
    });

    await t.test("incorrect local schema declarations", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/agent-system.json",
        transformJson((document) => { document.$schema = "../schemas/tool-contract.schema.json"; }),
        /expected schemas\/agent-system\.schema\.json/,
      );
    });

    await t.test("renamed capability documents cannot evade governed schema detection", async () => {
      const target = path.join(repositoryRoot, "examples", "invoice-exception", "renamed-build-record.json");
      const document = JSON.parse(await readFile(path.join(repositoryRoot, "templates", "capability-manifest.json"), "utf8"));
      delete document.$schema;
      try {
        await writeFile(target, `${JSON.stringify(document, null, 2)}\n`);
        const result = await runValidator(repositoryRoot);
        assert.notEqual(result.exitCode, 0, result.output);
        assert.match(result.output, /renamed-build-record\.json must declare a repository-relative \$schema/);
      } finally {
        await rm(target, { force: true });
      }
    });

    await t.test("renamed handoff documents cannot evade governed schema detection", async () => {
      const releaseDirectory = path.join(repositoryRoot, "releases", "renamed-envelope");
      const target = path.join(releaseDirectory, "state-transfer.json");
      const document = JSON.parse(await readFile(path.join(repositoryRoot, "templates", "handoff-envelope.json"), "utf8"));
      delete document.$schema;
      try {
        await mkdir(releaseDirectory, { recursive: true });
        await writeFile(target, `${JSON.stringify(document, null, 2)}\n`);
        const result = await runValidator(repositoryRoot);
        assert.notEqual(result.exitCode, 0, result.output);
        assert.match(result.output, /state-transfer\.json must declare a repository-relative \$schema/);
      } finally {
        await rm(releaseDirectory, { recursive: true, force: true });
      }
    });

    await t.test("tool references with the wrong artifact type", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.tools[0].contract_uri = "../../README.md"; }),
        /does not reference a parsed tool contract/,
      );
    });

    await t.test("agent and tool principals must match", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/agent-system.json",
        transformJson((document) => { document.actor_identity.agent_principal = "different-workload"; }),
        /tool stage_proposal agent principal does not match actor_identity\.agent_principal/,
      );
    });

    await t.test("capabilities must admit the bound harness version", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/capability-manifest.json",
        transformJson((document) => { document.runtime.supported_harness_versions = ["9.9.9"]; }),
        /does not support harness version 0\.1\.0/,
      );
    });

    await t.test("tool effects cannot exceed the workflow charter", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/workflow-charter.json",
        transformJson((document) => { document.scope.maximum_effect = "none"; }),
        /tool stage_proposal exceeds the workflow charter maximum_effect/,
      );
    });

    await t.test("workflow-charter references with the wrong artifact type", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.charter_uri = "../../README.md"; }),
        /does not reference a parsed workflow charter/,
      );
    });

    await t.test("evaluation-report references with the wrong artifact type", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/evaluation-report.json",
        transformJson((document) => { document.system.agent_system_uri = "workflow-charter.json"; }),
        /does not reference schemas\/agent-system\.schema\.json/,
      );
    });

    await t.test("solution-release references cannot escape the repository", async () => {
      await mutateFile(
        repositoryRoot,
        "templates/solution-release.json",
        transformJson((document) => { document.artifacts[0].uri = "../../outside.json"; }),
        /unsafe or missing artifacts\.0\.uri/,
      );
    });

    await t.test("external agent artifact references", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.tools[0].contract_uri = "https://example.com/tool.json"; }),
        /unsupported or absolute tools\.read_invoice\.contract_uri/,
      );
    });

    await t.test("ontology references with the wrong artifact type", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.context.ontology_uri = "../../README.md"; }),
        /does not reference a parsed operational ontology/,
      );
    });

    await t.test("evaluation directories without cases", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.verification.evaluation_suite_uri = "../../scripts/"; }),
        /is not an owned evaluation case or evals directory/,
      );
    });

    await t.test("evaluation suites outside the owning system", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.verification.evaluation_suite_uri = "../.."; }),
        /is not an owned evaluation case or evals directory/,
      );
    });

    await t.test("missing trace contracts", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.operations.trace_contract = "../../operations/missing.md"; }),
        /unsafe or missing operations\.trace_contract/,
      );
    });

    await t.test("trace contracts with the wrong artifact type", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.operations.trace_contract = "../../README.md"; }),
        /is not a cataloged Markdown operations contract/,
      );
    });

    await t.test("trace contracts cannot use another operations subtype", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.operations.trace_contract = "../../operations/release-gates.md"; }),
        /is not a cataloged Markdown operations contract/,
      );
    });

    await t.test("incident runbooks cannot use a telemetry standard", async () => {
      await mutateFile(
        repositoryRoot,
        "examples/invoice-exception/agent-system.json",
        transformJson((document) => { document.operations.runbook_uri = "../../operations/telemetry-contract.md"; }),
        /is not a cataloged Markdown operations contract/,
      );
    });
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
