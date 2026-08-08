import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const controlCatalog = JSON.parse(
  readFileSync(new URL("../controls/control-catalog.json", import.meta.url), "utf8"),
);
const releaseGates = readFileSync(
  new URL("../operations/release-gates.md", import.meta.url),
  "utf8",
);

const headingByGate = {
  design: "Gate 0 — Design",
  sandbox: "Gate 1 — Sandbox",
  shadow: "Gate 2 — Shadow",
  canary: "Gate 3 — Canary",
  autonomy: "Gate 4 — Autonomy promotion",
  operations: "Gate 5 — Improve, expand, or retire",
};

function documentedControls(heading) {
  const sectionStart = releaseGates.indexOf(`## ${heading}`);
  assert.notEqual(sectionStart, -1, `missing release-gate heading: ${heading}`);
  const nextSection = releaseGates.indexOf("\n## ", sectionStart + 4);
  const section = releaseGates.slice(
    sectionStart,
    nextSection === -1 ? releaseGates.length : nextSection,
  );
  const match = section.match(/^Controls: (.+)\.$/m);
  assert.ok(match, `missing Controls line under ${heading}`);
  return [...match[1].matchAll(/`([A-Z]{3}-\d{3})`/g)].map((entry) => entry[1]);
}

for (const [gate, heading] of Object.entries(headingByGate)) {
  test(`${heading} mirrors control-catalog release_gates`, () => {
    const expected = controlCatalog.controls
      .filter((control) => control.release_gates.includes(gate))
      .map((control) => control.id)
      .sort();
    const actual = documentedControls(heading).sort();
    assert.deepEqual(actual, expected);
  });
}
