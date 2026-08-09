import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const frameworkPath = path.join(root, "library", "14-twelve-factors-ai-value-engineering.md");

test("the AI value-engineering framework contains twelve distinct evidence-backed factors", async () => {
  const body = await readFile(frameworkPath, "utf8");
  const headings = [...body.matchAll(/^## (\d+)\. (.+)$/gm)];
  assert.equal(headings.length, 12);
  assert.deepEqual(headings.map((match) => Number(match[1])), Array.from({ length: 12 }, (_, index) => index + 1));
  assert.equal(new Set(headings.map((match) => match[2])).size, 12);

  const factorSections = body.split(/^## \d+\. .+$/gm).slice(1, 13);
  assert.equal(factorSections.length, 12);
  for (const [index, section] of factorSections.entries()) {
    assert.match(section, /\*\*Evidence:\*\*/i, `factor ${index + 1} has no evidence contract`);
    assert.match(section, /\b[A-Z]{3}-\d{3}\b/, `factor ${index + 1} has no control mapping`);
  }
});

test("the framework measures incremental accepted outcomes and full economics rather than activity", async () => {
  const body = await readFile(frameworkPath, "utf8");
  for (const term of [
    "eligible volume",
    "expected adoption",
    "expected incremental accepted-outcome rate",
    "attributable incremental accepted outcomes",
    "expected lifecycle cost",
    "expected residual loss",
    "actual lifecycle cost",
    "realized loss",
    "cost per accepted outcome",
  ]) assert.ok(body.includes(term), `framework is missing ${term}`);

  assert.match(body, /Do not count the same avoided loss/i);
  assert.match(body, /Tokens are an input\. Autonomy is a design choice\. Accepted outcomes are the product\./);
  assert.match(body, /not a certification/i);
});

test("the four hard gates cannot be averaged away", async () => {
  const body = await readFile(frameworkPath, "utf8");
  const gateSection = body.match(/## Use the factors as gates, not an average\n([\s\S]*?)\n## Apply the framework/)?.[1] ?? "";
  assert.equal((gateSection.match(/^\d+\. /gm) ?? []).length, 4);
  for (const gate of ["owned, measurable outcome", "independent verifier", "Bounded authority", "positive value case after full cost"]) {
    assert.match(gateSection, new RegExp(gate, "i"));
  }
  assert.match(gateSection, /do_not_build/);
  assert.match(gateSection, /strong factors do not average away a failed gate/i);
});

test("every control cited by the framework resolves", async () => {
  const [framework, catalogText] = await Promise.all([
    readFile(frameworkPath, "utf8"),
    readFile(path.join(root, "controls", "control-catalog.json"), "utf8"),
  ]);
  const known = new Set(JSON.parse(catalogText).controls.map((control) => control.id));
  const cited = new Set(framework.match(/\b[A-Z]{3}-\d{3}\b/g) ?? []);
  assert.ok(cited.size >= 15);
  for (const controlId of cited) assert.ok(known.has(controlId), `framework cites unknown control ${controlId}`);
});

test("human and agent navigation place the framework above implementation detail", async () => {
  const [readme, agents, llms, valueGuide, discovery] = await Promise.all([
    readFile(path.join(root, "README.md"), "utf8"),
    readFile(path.join(root, "AGENTS.md"), "utf8"),
    readFile(path.join(root, "llms.txt"), "utf8"),
    readFile(path.join(root, "library", "11-value-engineering-and-frugal-architecture.md"), "utf8"),
    readFile(path.join(root, "playbooks", "01-discovery-and-value.md"), "utf8"),
  ]);
  const reference = "library/14-twelve-factors-ai-value-engineering.md";
  for (const body of [readme, agents, llms]) assert.ok(body.includes(reference));
  assert.ok(valueGuide.includes("14-twelve-factors-ai-value-engineering.md"));
  assert.ok(discovery.includes("../library/14-twelve-factors-ai-value-engineering.md"));
  assert.ok(readme.indexOf("12 Factors of AI Value Engineering") < readme.indexOf("## From idea to production"));
  assert.ok(readme.indexOf("## From idea to production") < readme.indexOf("## Start from a business flow"));
});
