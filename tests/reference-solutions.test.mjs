import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const solutionsRoot = path.join(root, "solutions");

const expectedSolutions = new Map([
  ["deployment-and-operations.md", ["DEL-001", "OPS-003", "solution-release"]],
  ["enterprise-foundation.md", ["IAM-003", "SEC-005", "meter"]],
  ["integration-runtime.md", ["REL-001", "SEC-007", "dead-letter"]],
  ["secure-ai-workload.md", ["CTX-002", "TOL-005", "citation"]],
]);

const requiredSections = [
  "## Outcome and boundary",
  "## Architecture",
  "## Smallest useful slice",
  "## Acceptance contract",
  "## Operating contract",
  "## Starter packet",
  "## What this does not prove",
];

test("the reference-solution layer exposes exactly four design accelerators", async () => {
  const files = (await readdir(solutionsRoot))
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort();
  assert.deepEqual(files, [...expectedSolutions.keys()].sort());
});

test("each accelerator has one honest and usable delivery contract", async () => {
  for (const [file, requiredTerms] of expectedSolutions) {
    const body = await readFile(path.join(solutionsRoot, file), "utf8");
    assert.match(body, /^# .+ Accelerator\n/);
    assert.match(body, /\*\*Maturity:\*\* design accelerator/);
    for (const section of requiredSections) assert.ok(body.includes(section), `${file} is missing ${section}`);
    for (const term of requiredTerms) assert.ok(body.toLowerCase().includes(term.toLowerCase()), `${file} is missing ${term}`);
    assert.match(body, /templates\/workflow-charter\.json/);
    assert.match(body, /templates\/value-case\.md/);
    assert.match(body, /templates\/solution-release\.json/);
    assert.match(body, /\*\*Controls:\*\* `(?:[A-Z]{3}-\d{3}`)/);

    for (const overclaim of ["production-ready", "guarantees employment", "ensures compliance", "works with any customer"]) {
      assert.equal(body.toLowerCase().includes(overclaim), false, `${file} contains overclaim: ${overclaim}`);
    }
  }
});

test("every control cited by an accelerator resolves to the governed catalog", async () => {
  const catalog = JSON.parse(await readFile(path.join(root, "controls", "control-catalog.json"), "utf8"));
  const knownControls = new Set(catalog.controls.map((control) => control.id));

  for (const file of expectedSolutions.keys()) {
    const body = await readFile(path.join(solutionsRoot, file), "utf8");
    const citedControls = new Set(body.match(/\b[A-Z]{3}-\d{3}\b/g) ?? []);
    assert.ok(citedControls.size >= 8, `${file} does not cite a meaningful control set`);
    for (const controlId of citedControls) {
      assert.ok(knownControls.has(controlId), `${file} cites unknown control ${controlId}`);
    }
  }
});

test("the solution index maps all twelve project ideas exactly once", async () => {
  const index = await readFile(path.join(solutionsRoot, "README.md"), "utf8");
  for (let number = 1; number <= 12; number += 1) {
    const id = `P${String(number).padStart(2, "0")}`;
    assert.equal(index.match(new RegExp(`\\| ${id} \\|`, "g"))?.length, 1, `${id} must have one primary mapping`);
  }

  assert.match(index, /Every accelerator in this folder is a \*\*design accelerator\*\*/);
  assert.match(index, /do not describe the result as production-ready, compliant, certified, or customer-proven/i);
  assert.match(index, /do not guarantee employment/i);
});

test("public navigation exposes solution accelerators without displacing the lifecycle", async () => {
  const [readme, agents, llms, playbook] = await Promise.all([
    readFile(path.join(root, "README.md"), "utf8"),
    readFile(path.join(root, "AGENTS.md"), "utf8"),
    readFile(path.join(root, "llms.txt"), "utf8"),
    readFile(path.join(root, "playbooks", "02-solution-and-delivery.md"), "utf8"),
  ]);

  assert.ok(readme.indexOf("## From idea to production") < readme.indexOf("## Start from a reference solution"));
  assert.ok(readme.indexOf("## Start from a reference solution") < readme.indexOf("## Learn from the reference systems"));
  for (const body of [readme, agents, llms, playbook]) assert.match(body, /solutions\/README\.md/);
});
