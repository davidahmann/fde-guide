import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skillsRoot = path.join(root, ".agents", "skills");

const expectedSkills = new Map([
  ["build-ai-evaluation", ["evaluation", "adversarial", "report"]],
  ["design-production-ai-system", ["architecture", "system", "production"]],
  ["engineer-ai-value", ["value", "cost", "adoption"]],
  ["operate-ai-service", ["slo", "incident", "cost"]],
  ["productize-field-learning", ["customer-specific", "recurrence", "reusable"]],
  ["qualify-ai-workflow", ["discovery", "workflow", "verifier"]],
  ["review-ai-production-readiness", ["release", "evidence", "rollback"]],
  ["secure-ai-action-boundary", ["identity", "authorization", "idempotency"]],
  ["select-ai-mechanism", ["deterministic", "ml", "agent"]],
  ["transfer-ai-service", ["handoff", "owner", "retire"]],
]);

function parseFrontmatter(body) {
  const match = body.match(/^---\n([\s\S]+?)\n---\n/);
  assert.ok(match, "SKILL.md must begin with YAML frontmatter");
  const entries = match[1].split("\n").map((line) => {
    const separator = line.indexOf(":");
    assert.notEqual(separator, -1, `invalid frontmatter line: ${line}`);
    return [line.slice(0, separator), line.slice(separator + 1).trim()];
  });
  return { metadata: Object.fromEntries(entries), body: body.slice(match[0].length) };
}

function quotedYamlValue(body, key) {
  const match = body.match(new RegExp(`^\\s{2}${key}: "([^"]+)"$`, "m"));
  assert.ok(match, `agents/openai.yaml must quote ${key}`);
  return match[1];
}

test("the repository exposes exactly ten focused FDE and AI engineering skills", async () => {
  const directories = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(directories, [...expectedSkills.keys()].sort());
});

test("skill instructions and interface metadata are complete and distinct", async () => {
  const descriptions = new Set();

  for (const [skillName, requiredTerms] of expectedSkills) {
    const skillDirectory = path.join(skillsRoot, skillName);
    const skillBody = await readFile(path.join(skillDirectory, "SKILL.md"), "utf8");
    const openaiBody = await readFile(path.join(skillDirectory, "agents", "openai.yaml"), "utf8");
    const { metadata, body } = parseFrontmatter(skillBody);

    assert.deepEqual(Object.keys(metadata), ["name", "description"]);
    assert.equal(metadata.name, skillName);
    assert.match(metadata.description, /^.+ Use (?:for|when) .+\.$/);
    assert.ok(metadata.description.length <= 1024);
    assert.equal(descriptions.has(metadata.description), false, `${skillName} duplicates another trigger description`);
    descriptions.add(metadata.description);

    assert.match(body.trimStart(), /^# /);
    assert.match(body, /\n## Read first\n/);
    assert.match(body, /\n## Workflow\n/);
    assert.match(body, /\n## Output contract\n/);
    for (const marker of ["TO", "FI", "TB", "XX"].map((prefix, index) => `${prefix}${["DO", "XME", "D", "X"][index]}`)) {
      assert.equal(skillBody.includes(marker), false, `${skillName} contains an unresolved marker`);
    }
    assert.ok(skillBody.split("\n").length <= 80, `${skillName} should remain progressively disclosed`);

    for (const term of requiredTerms) {
      assert.ok(skillBody.toLowerCase().includes(term), `${skillName} does not cover ${term}`);
    }

    const displayName = quotedYamlValue(openaiBody, "display_name");
    const shortDescription = quotedYamlValue(openaiBody, "short_description");
    const defaultPrompt = quotedYamlValue(openaiBody, "default_prompt");
    assert.ok(displayName.length > 0);
    assert.ok(shortDescription.length >= 25 && shortDescription.length <= 64);
    assert.ok(defaultPrompt.includes(`$${skillName}`));
    assert.doesNotMatch(openaiBody, /^dependencies:/m, `${skillName} is instruction-only and must not claim tool authority`);
  }
});

test("every skill is registered as a governed repository standard", async () => {
  const catalog = JSON.parse(await readFile(path.join(root, "catalog.json"), "utf8"));
  const entries = new Map(catalog.artifacts.map((artifact) => [artifact.path, artifact]));

  for (const skillName of expectedSkills.keys()) {
    const repositoryPath = `.agents/skills/${skillName}/SKILL.md`;
    const entry = entries.get(repositoryPath);
    assert.ok(entry, `${repositoryPath} is not cataloged`);
    assert.equal(entry.id, `skill.${skillName}`);
    assert.equal(entry.type, "standard");
    assert.ok(entry.tags.includes("skill"));
  }
});

test("the skill pack routes every control domain", async () => {
  const controlCatalog = JSON.parse(await readFile(path.join(root, "controls", "control-catalog.json"), "utf8"));
  const expectedPrefixes = new Set(controlCatalog.controls.map((control) => control.id.slice(0, 3)));
  const skillBodies = await Promise.all(
    [...expectedSkills.keys()].map((skillName) => readFile(path.join(skillsRoot, skillName, "SKILL.md"), "utf8")),
  );
  const routedPrefixes = new Set(
    skillBodies.join("\n").match(/\b[A-Z]{3}-[0-9]{3}\b/g)?.map((controlId) => controlId.slice(0, 3)) ?? [],
  );

  assert.deepEqual([...routedPrefixes].sort(), [...expectedPrefixes].sort());
});

test("public navigation leads with audience outcomes and keeps skills optional", async () => {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
  const llms = await readFile(path.join(root, "llms.txt"), "utf8");

  assert.ok(readme.indexOf("## Who this is for") < readme.indexOf("## Optional: use it with a coding agent"));
  assert.ok(readme.indexOf("## From idea to production") < readme.indexOf("## Optional: use it with a coding agent"));
  assert.match(readme, /npx skills add davidahmann\/fde-guide/);
  assert.match(readme, /The guide is complete as documentation/);
  assert.ok(agents.indexOf("## Repository map") < agents.indexOf("## Skill routes"));
  assert.ok(llms.indexOf("## Core entry points") < llms.indexOf("## Optional task skills"));
});
