import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const solutionsRoot = path.join(root, "solutions");
const flowsRoot = path.join(solutionsRoot, "business-flows");
const verticalsRoot = path.join(solutionsRoot, "verticals");

const expectedSolutions = new Map([
  ["deployment-and-operations.md", ["DEL-001", "OPS-003", "solution-release"]],
  ["enterprise-foundation.md", ["IAM-003", "SEC-005", "meter"]],
  ["integration-runtime.md", ["REL-001", "SEC-007", "dead-letter"]],
  ["secure-ai-workload.md", ["CTX-002", "TOL-005", "citation"]],
]);

const expectedFlows = new Map([
  ["exception-to-resolution.md", ["REL-001", "source-of-truth", "invoice-exception"]],
  ["request-to-activation.md", ["ADP-002", "first accepted outcome", "enterprise-foundation"]],
  ["risk-to-prioritized-action.md", ["ARC-004", "eligible population", "shipment-risk"]],
  ["signal-to-investigation.md", ["CTX-005", "claims-to-evidence", "case disposition"]],
]);

const expectedVerticals = new Map([
  ["financial-services-investigation.md", ["financial-services", "human", "confidential"]],
  ["healthcare-access-coordination.md", ["healthcare", "clinical", "coverage"]],
  ["industrial-operations-response.md", ["industrial", "equipment control", "safety"]],
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

test("the solution portfolio exposes four business flows and three vertical profiles", async () => {
  const flowFiles = (await readdir(flowsRoot))
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort();
  const verticalFiles = (await readdir(verticalsRoot))
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort();

  assert.deepEqual(flowFiles, [...expectedFlows.keys()].sort());
  assert.deepEqual(verticalFiles, [...expectedVerticals.keys()].sort());
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

test("business-flow patterns preserve outcome, decision, acceptance, operations, reuse, and non-claims", async () => {
  const requiredFlowSections = [
    "## Outcome and boundary",
    "## Business flow",
    "## Decision model",
    "## Smallest useful slice",
    "## Acceptance contract",
    "## Operating contract",
    "## Reuse and variation",
    "## What this does not prove",
  ];

  for (const [file, requiredTerms] of expectedFlows) {
    const body = await readFile(path.join(flowsRoot, file), "utf8");
    assert.match(body, /^# .+ Business Flow\n/);
    assert.match(body, /\*\*Maturity:\*\* reusable business-flow pattern/);
    for (const section of requiredFlowSections) assert.ok(body.includes(section), `${file} is missing ${section}`);
    for (const term of requiredTerms) assert.ok(body.toLowerCase().includes(term.toLowerCase()), `${file} is missing ${term}`);
    assert.match(body, /accepted[- ]outcome/i);
    assert.match(body, /\*\*Controls:\*\* `(?:[A-Z]{3}-\d{3}`)/);
  }
});

test("vertical profiles specialize the flows without claiming deployable or decision authority", async () => {
  const requiredVerticalSections = [
    "## Vertical outcome",
    "## Operational context",
    "## Reusable flow composition",
    "## Domain and action model",
    "## Mechanism allocation",
    "## Smallest useful slice",
    "## Acceptance and operating evidence",
    "## Customer-specific decisions",
    "## What this does not prove",
  ];

  for (const [file, requiredTerms] of expectedVerticals) {
    const body = await readFile(path.join(verticalsRoot, file), "utf8");
    assert.match(body, /^# .+ Solution Profile\n/);
    assert.match(body, /\*\*Maturity:\*\* worked vertical design profile/);
    for (const section of requiredVerticalSections) assert.ok(body.includes(section), `${file} is missing ${section}`);
    for (const term of requiredTerms) assert.ok(body.toLowerCase().includes(term.toLowerCase()), `${file} is missing ${term}`);
    assert.match(body, /authorized human|authorized investigator|authorized operator|authorized personnel/i);
    assert.match(body, /target|customer-specific/i);
    assert.match(body, /\*\*Controls:\*\* `(?:[A-Z]{3}-\d{3}`)/);
  }
});

test("all solution controls and governed portfolio artifacts resolve", async () => {
  const controls = JSON.parse(await readFile(path.join(root, "controls", "control-catalog.json"), "utf8"));
  const knownControls = new Set(controls.controls.map((control) => control.id));
  const catalog = JSON.parse(await readFile(path.join(root, "catalog.json"), "utf8"));
  const catalogByPath = new Map(catalog.artifacts.map((artifact) => [artifact.path, artifact]));

  for (const [directory, files] of [["business-flows", expectedFlows], ["verticals", expectedVerticals]]) {
    for (const file of files.keys()) {
      const relativePath = `solutions/${directory}/${file}`;
      const body = await readFile(path.join(solutionsRoot, directory, file), "utf8");
      const citedControls = new Set(body.match(/\b[A-Z]{3}-\d{3}\b/g) ?? []);
      assert.ok(citedControls.size >= 8, `${relativePath} does not cite a meaningful control set`);
      for (const controlId of citedControls) assert.ok(knownControls.has(controlId), `${relativePath} cites unknown control ${controlId}`);
      assert.equal(catalogByPath.get(relativePath)?.type, "blueprint", `${relativePath} must be cataloged as a blueprint`);
    }
  }
});

test("the solution index maps all twelve project ideas exactly once", async () => {
  const index = await readFile(path.join(solutionsRoot, "README.md"), "utf8");
  for (let number = 1; number <= 12; number += 1) {
    const id = `P${String(number).padStart(2, "0")}`;
    assert.equal(index.match(new RegExp(`\\| ${id} \\|`, "g"))?.length, 1, `${id} must have one primary mapping`);
  }

  assert.match(index, /None of these artifacts is a deployable product, a certification, or release evidence/i);
  assert.match(index, /business-flow patterns/i);
  assert.match(index, /vertical profiles/i);
  assert.match(index, /horizontal foundations/i);
  assert.match(index, /do not guarantee employment/i);
});

test("public navigation exposes business solutions without displacing the lifecycle", async () => {
  const [readme, agents, llms, playbook] = await Promise.all([
    readFile(path.join(root, "README.md"), "utf8"),
    readFile(path.join(root, "AGENTS.md"), "utf8"),
    readFile(path.join(root, "llms.txt"), "utf8"),
    readFile(path.join(root, "playbooks", "02-solution-and-delivery.md"), "utf8"),
  ]);

  assert.ok(readme.indexOf("## From idea to production") < readme.indexOf("## Start from a business flow"));
  assert.ok(readme.indexOf("## Start from a business flow") < readme.indexOf("## Optional: use it with a coding agent"));
  for (const body of [readme, agents, llms, playbook]) assert.match(body, /solutions\/README\.md/);
  for (const body of [readme, agents, llms]) assert.match(body, /solutions\/business-flows\/README\.md|solutions\/business-flows\/exception-to-resolution\.md/);
  for (const body of [readme, agents, llms]) assert.match(body, /solutions\/verticals\/README\.md|solutions\/verticals\/healthcare-access-coordination\.md/);
});
