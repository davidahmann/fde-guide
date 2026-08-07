import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { embeddedToolSchemaErrors, ontologyIdentityErrors, patternCatalogErrors } from "./contract-invariants.mjs";
import { markdownAnchors } from "./markdown-anchors.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ignoredDirectories = new Set([".git", "node_modules", "coverage"]);
const textExtensions = new Set([".cff", ".json", ".md", ".mjs", ".js", ".txt", ".yml", ".yaml"]);
const textBasenames = new Set([".editorconfig", ".gitattributes", ".gitignore", "CODEOWNERS", "LICENSE", "Makefile", "NOTICE"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function collectControlIds(value, ids = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectControlIds(item, ids));
    return ids;
  }
  if (!value || typeof value !== "object") return ids;
  for (const [key, item] of Object.entries(value)) {
    if (key === "control_ids" && Array.isArray(item)) {
      item.filter((id) => typeof id === "string").forEach((id) => ids.add(id));
    } else {
      collectControlIds(item, ids);
    }
  }
  return ids;
}

const files = await walk(root);
const textFiles = files.filter((file) => textExtensions.has(path.extname(file)) || textBasenames.has(path.basename(file)));
const contents = new Map();

for (const file of textFiles) {
  const body = await readFile(file, "utf8");
  contents.set(file, body);
  if (body.length === 0) fail(`${relative(file)} is empty`);
  body.split("\n").forEach((line, index) => {
    if (/[ \t]+$/.test(line)) fail(`${relative(file)}:${index + 1} has trailing whitespace`);
  });
  if (/\/Users\/|file:\/\//.test(body)) fail(`${relative(file)} contains a machine-local path`);
  if (relative(file) !== "scripts/validate-repository.mjs" && /\b(?:FIXME|TBD|TODO|XXX)\b|(?<!\$)\{\{[^}]+\}\}|\[INSERT[^\]]*\]/.test(body)) {
    fail(`${relative(file)} contains an unresolved placeholder`);
  }
}

const requiredPublicFiles = [
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/bug.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/design-proposal.yml",
  ".github/ISSUE_TEMPLATE/evidence-correction.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/dependabot.yml",
  ".github/workflows/validate.yml",
  "AGENTS.md",
  "CHANGELOG.md",
  "CITATION.cff",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "GOVERNANCE.md",
  "LICENSE",
  "NOTICE",
  "README.md",
  "SECURITY.md",
  "SUPPORT.md",
  "llms.txt",
];
for (const requiredFile of requiredPublicFiles) {
  try {
    await stat(path.join(root, requiredFile));
  } catch {
    fail(`missing required public-repository file ${requiredFile}`);
  }
}

const retiredRepositoryUrl = ["github.com/davidahmann", "agents"].join("/");
for (const [file, body] of contents) {
  if (body.includes(retiredRepositoryUrl)) {
    fail(`${relative(file)} contains the retired repository URL`);
  }
}

const readme = contents.get(path.join(root, "README.md")) ?? "";
if (!readme.startsWith("# Production Agent Engineering: An FDE Field Guide\n")) {
  fail("README.md does not use the canonical project title");
}
if (!readme.includes("not an external compliance standard")) {
  fail("README.md does not state the control-catalog boundary");
}

const citation = contents.get(path.join(root, "CITATION.cff")) ?? "";
for (const field of [
  "cff-version: 1.2.0",
  "title: \"Production Agent Engineering: An FDE Field Guide\"",
  "repository-code: \"https://github.com/davidahmann/production-agent-engineering\"",
  "license: Apache-2.0",
]) {
  if (!citation.includes(field)) fail(`CITATION.cff is missing required metadata: ${field}`);
}

const apacheLicense = contents.get(path.join(root, "LICENSE")) ?? "";
const apacheLicenseSha256 = createHash("sha256").update(apacheLicense).digest("hex");
if (apacheLicenseSha256 !== "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4") {
  fail("LICENSE does not match the canonical Apache-2.0 text");
}

const jsonFiles = files.filter((file) => path.extname(file) === ".json");
const documents = new Map();
for (const file of jsonFiles) {
  try {
    documents.set(file, JSON.parse(await readFile(file, "utf8")));
  } catch (error) {
    fail(`${relative(file)} is not valid JSON: ${error.message}`);
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const schemaFiles = jsonFiles.filter((file) => relative(file).startsWith("schemas/"));
for (const file of schemaFiles) {
  const schema = documents.get(file);
  if (!schema) continue;
  const expectedSchemaId = `https://github.com/davidahmann/production-agent-engineering/${relative(file)}`;
  if (schema.$id !== expectedSchemaId) {
    fail(`${relative(file)} has non-canonical $id ${schema.$id ?? "<missing>"}`);
  }
  try {
    ajv.addSchema(schema);
  } catch (error) {
    fail(`${relative(file)} schema compilation failed: ${error.message}`);
  }
}

const packageMetadata = documents.get(path.join(root, "package.json"));
if (packageMetadata) {
  if (packageMetadata.name !== "production-agent-engineering") fail("package.json has a non-canonical package name");
  if (packageMetadata.license !== "Apache-2.0") fail("package.json must declare Apache-2.0");
  if (packageMetadata.private !== true) fail("package.json must prevent accidental registry publication");
  if (packageMetadata.repository?.url !== "git+https://github.com/davidahmann/production-agent-engineering.git") {
    fail("package.json has a non-canonical repository URL");
  }
  if (!citation.includes(`version: ${packageMetadata.version}`)) {
    fail("CITATION.cff version does not match package.json");
  }
}

for (const [file, document] of documents) {
  if (schemaFiles.includes(file) || !document?.$schema?.startsWith(".")) continue;
  const schemaPath = path.resolve(path.dirname(file), document.$schema);
  const schema = documents.get(schemaPath);
  if (!schema) {
    fail(`${relative(file)} declares missing schema ${document.$schema}`);
    continue;
  }
  const validate = ajv.getSchema(schema.$id);
  if (!validate) {
    fail(`${relative(file)} schema ${relative(schemaPath)} was not compiled`);
    continue;
  }
  if (!validate(document)) {
    const errors = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
    fail(`${relative(file)} fails ${relative(schemaPath)}: ${errors}`);
  }
}

for (const [file, tool] of documents) {
  if (!tool?.tool_id) continue;
  for (const error of embeddedToolSchemaErrors(tool, relative(file))) fail(error);
}

const catalog = documents.get(path.join(root, "catalog.json"));
if (catalog) {
  const ids = new Set();
  for (const artifact of catalog.artifacts ?? []) {
    if (ids.has(artifact.id)) fail(`catalog.json duplicates artifact ID ${artifact.id}`);
    ids.add(artifact.id);
    const target = path.join(root, artifact.path);
    try {
      await stat(target);
    } catch {
      fail(`catalog.json points to missing path ${artifact.path}`);
    }
  }
}

const controlCatalog = documents.get(path.join(root, "controls/control-catalog.json"));
const definedControls = new Set();
const evidenceIds = new Set();
for (const content of contents.values()) {
  for (const match of content.matchAll(/<a\s+id=["']((?:r26|s)[0-9-]+)["']/gi)) evidenceIds.add(match[1].toUpperCase());
}
if (controlCatalog) {
  for (const control of controlCatalog.controls ?? []) {
    if (definedControls.has(control.id)) fail(`control catalog duplicates ${control.id}`);
    definedControls.add(control.id);
    for (const evidence of control.evidence ?? []) {
      if (evidence.startsWith("internal-")) continue;
      if (!evidenceIds.has(evidence.toUpperCase())) fail(`${control.id} references missing evidence ${evidence}`);
    }
  }
}
const controlPrefixes = new Set([...definedControls].map((controlId) => controlId.slice(0, 3)));

for (const [file, document] of documents) {
  if (!document?.patterns) continue;
  for (const error of patternCatalogErrors(document, evidenceIds, relative(file))) fail(error);
}

for (const [file, document] of documents) {
  for (const controlId of collectControlIds(document)) {
    if (!definedControls.has(controlId)) fail(`${relative(file)} references undefined control ${controlId}`);
  }
}
for (const [file, content] of contents) {
  if (path.extname(file) !== ".md") continue;
  for (const match of content.matchAll(/\b[A-Z]{3}-[0-9]{3}\b/g)) {
    if (!controlPrefixes.has(match[0].slice(0, 3))) continue;
    if (!definedControls.has(match[0])) fail(`${relative(file)} references undefined control ${match[0]}`);
  }
}

const markdownFiles = files.filter((file) => path.extname(file) === ".md");
const anchorsByFile = new Map();
for (const file of markdownFiles) anchorsByFile.set(file, markdownAnchors(contents.get(file) ?? ""));

for (const file of markdownFiles) {
  const content = contents.get(file) ?? "";
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let destination = match[1].trim();
    if (destination.startsWith("<") && destination.endsWith(">")) destination = destination.slice(1, -1);
    if (/^(?:https?:|mailto:)/i.test(destination)) continue;
    const [rawPath, fragment] = destination.split("#", 2);
    const target = rawPath ? path.resolve(path.dirname(file), decodeURIComponent(rawPath)) : file;
    try {
      await stat(target);
    } catch {
      fail(`${relative(file)} links to missing local path ${destination}`);
      continue;
    }
    if (fragment && path.extname(target) === ".md") {
      const anchors = anchorsByFile.get(target) ?? markdownAnchors(await readFile(target, "utf8"));
      if (!anchors.has(decodeURIComponent(fragment))) fail(`${relative(file)} links to missing anchor ${destination}`);
    }
  }
}

const explicitAnchorLocations = new Map();
for (const [file, content] of contents) {
  for (const match of content.matchAll(/<a\s+(?:name|id)=["']([^"']+)["'][^>]*>/gi)) {
    const key = `${relative(file)}#${match[1]}`;
    if (explicitAnchorLocations.has(key)) fail(`${key} is duplicated`);
    explicitAnchorLocations.set(key, true);
  }
}

const evalIds = new Set();
for (const [file, document] of documents) {
  if (!document?.case_id) continue;
  if (evalIds.has(document.case_id)) fail(`evaluation case ID ${document.case_id} is duplicated`);
  evalIds.add(document.case_id);
  const weight = (document.graders ?? []).reduce((sum, grader) => sum + grader.weight, 0);
  if (Math.abs(weight - 1) > 1e-9) fail(`${relative(file)} grader weights total ${weight}, expected 1`);
}

for (const [file, ontology] of documents) {
  if (!ontology?.ontology_id) continue;
  for (const error of ontologyIdentityErrors(ontology, relative(file))) fail(error);
  const entities = new Set((ontology.entities ?? []).map((entity) => entity.entity_id));
  const policies = new Set((ontology.policies ?? []).map((policy) => policy.policy_id));
  for (const relationship of ontology.relationships ?? []) {
    if (!entities.has(relationship.from)) fail(`${relative(file)} relationship ${relationship.relationship_id} has unknown from entity ${relationship.from}`);
    if (!entities.has(relationship.to)) fail(`${relative(file)} relationship ${relationship.relationship_id} has unknown to entity ${relationship.to}`);
  }
  for (const action of ontology.actions ?? []) {
    for (const entity of [...action.input_entities, ...action.output_entities]) {
      if (!entities.has(entity)) fail(`${relative(file)} action ${action.action_id} references unknown entity ${entity}`);
    }
    if (!policies.has(action.authorization_policy)) {
      fail(`${relative(file)} action ${action.action_id} references unknown policy ${action.authorization_policy}`);
    }
  }
}

for (const [file, threatModel] of documents) {
  if (!threatModel?.threats || !threatModel?.assets) continue;
  const assets = new Set(threatModel.assets.map((asset) => asset.asset_id));
  for (const threat of threatModel.threats) {
    for (const asset of threat.affected_assets) {
      if (!assets.has(asset)) fail(`${relative(file)} threat ${threat.threat_id} references unknown asset ${asset}`);
    }
    for (const caseId of threat.test_case_ids) {
      if (!evalIds.has(caseId)) fail(`${relative(file)} threat ${threat.threat_id} references unknown evaluation case ${caseId}`);
    }
  }
}

for (const [file, agent] of documents) {
  if (!agent?.system_id || !agent?.tools || !agent?.context) continue;
  const paths = [agent.context.ontology_uri, agent.verification?.evaluation_suite_uri, agent.operations?.runbook_uri, ...agent.tools.map((tool) => tool.contract_uri)];
  for (const uri of paths.filter(Boolean)) {
    if (/^[a-z]+:/i.test(uri)) continue;
    try {
      await stat(path.resolve(path.dirname(file), uri));
    } catch {
      fail(`${relative(file)} references missing system artifact ${uri}`);
    }
  }
  for (const tool of agent.tools) {
    const contractPath = path.resolve(path.dirname(file), tool.contract_uri);
    const contract = documents.get(contractPath);
    if (!contract) continue;
    if (contract.tool_id !== tool.tool_id) {
      fail(`${relative(file)} declares tool ${tool.tool_id}, but ${relative(contractPath)} declares ${contract.tool_id}`);
    }
  }
}

try {
  const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  for (const trackedFile of tracked) {
    const target = path.join(root, trackedFile);
    let metadata;
    try {
      metadata = await stat(target);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (metadata.isFile() && metadata.size === 0) fail(`${trackedFile} is a tracked empty file`);
  }
} catch (error) {
  fail(`git tracked-file check failed: ${error.message}`);
}

if (failures.length) {
  console.error(`Repository validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "passed",
    files: files.length,
    markdown_files: markdownFiles.length,
    json_files: jsonFiles.length,
    schemas: schemaFiles.length,
    controls: definedControls.size,
    evaluation_cases: evalIds.size,
    catalog_artifacts: catalog?.artifacts?.length ?? 0,
  }, null, 2));
}
