# Repository Maintenance

This document keeps the guide coherent as research, controls, templates, examples, and platform behavior change.

## Content layers

| Layer | Authority | Change obligation |
| --- | --- | --- |
| `research/` | Dated evidence and caveats | Verify source, date, attribution, and claim boundary |
| `controls/` | Normative project requirements | Link evidence and release gates; update affected verification |
| `schemas/` | Machine-readable structural contracts | Update template, examples, validator mapping, positive and negative tests |
| `patterns/` | Evidence-linked decisions and anti-patterns | Add detection, response, verification, and review date |
| `blueprints/` | Reference system designs | Cover components, boundaries, state, failure, telemetry, and release tests |
| `playbooks/` | FDE delivery and operating sequence | Keep entry/exit evidence, owners, and decisions explicit |
| `templates/` | Reusable working artifacts | Remain valid, scoped, and consistent with controls and playbooks |
| `examples/` | Executable teaching evidence | Keep claims limited to tested behavior; add regressions for fixes |
| `operations/` | Release and service contracts | Update alerts, runbooks, gates, rollback, and review cadence together |
| `library/` | Explanatory synthesis | Cite stable source IDs and avoid duplicating normative contracts |

## Claim workflow

1. Record the primary source, publication or review date, evidence tier, finding, portable pattern, anti-pattern, and caveat.
2. Attribute vendor metrics and speaker claims; do not convert them into generic thresholds.
3. Prefer specifications, incident reports, engineering artifacts, and reproducible repositories over commentary.
4. For a normative control, require direct supporting evidence and a concrete release gate.
5. For experimental guidance, label it and state the local evidence required before adoption.
6. Set or preserve a review date for changing platform behavior.

## Contract change matrix

| Changed artifact | Also inspect |
| --- | --- |
| Workflow charter | Agent system, discovery/value playbook, release gate, example |
| Control | Evidence anchor, schema constraints, blueprint, operations, tests |
| Schema | Canonical template, example documents, validator mapping, contract tests |
| Breaking schema revision | Migration note under [`docs/migrations/`](../migrations/tool-contract-1.1.md), canonical template, every governed example, validator mapping, and negative tests |
| Tool contract | Authorization, data exposure, egress, threat model, evals, runtime |
| Capability manifest | Source and artifact provenance, attestation and trust root, SBOM, registry decision, runtime authority, disable test |
| Handoff contract | Parent authority, signed payload, expiry, nonce replay, budget/depth attenuation, consumer enforcement |
| Domain model | Context, tool resources, policy, state migration, readback |
| System map or impact assessment | Source revisions, classification, extraction/inference labels, freshness, owner review, validation, rollout, rollback, and authority boundaries |
| Agent system | Charter, tools, eval suite, telemetry, runbook, release manifest |
| Evaluation | Tested claim, environment, trials, contamination, calibration, release threshold |
| Solution release | Bound artifact digests, compatibility, migration, evaluation report, rollout, approvals, and rollback |
| Behavior config | Per-model/route results, canary, rollback, dependency lifecycle |
| Telemetry or receipt | Producer, exporter allowlist, DLP checks, schema, semantic bindings, retention, incident queries |
| Operations contract | SLO, alert, runbook, incident query, game day, example telemetry |
| Public navigation | README, AGENTS, llms, catalog, contribution docs |

## Research refresh

- Review dated platform guidance at least every six months or sooner after a major incident, specification change, deprecation, or model/runtime release.
- Check links, dates, canonical source location, and whether later reporting changed the finding.
- Move superseded guidance to an archive only after dependent controls and patterns are updated.
- Preserve prior claim context in Git history and the changelog; do not silently rewrite an incident or vendor claim.

## Release procedure

1. Inspect branch, remotes, status, and full diff.
2. Run `npm ci --ignore-scripts`, `npm test`, and `git diff --check`.
3. Run spelling, action workflow, dependency, and secret scans used by the current project.
4. Confirm all new governed artifacts are cataloged and every new source ID resolves.
5. Proofread README, AGENTS, llms, playbook routes, changelog, package/citation versions, and release links.
6. Use a scoped commit and draft pull request; do not bypass protected `main`.
7. Require CI and review before merge; tag only after the release tree and metadata agree.

## Maintainer acceptance questions

- Does the change improve a real user path or contract rather than add parallel prose?
- Can a person and a coding agent find the new artifact from the task they are trying to complete?
- Are evidence, recommendation, control, implementation, and verification clearly separated?
- Does a failure have one owning layer and a regression path?
- If a map is added, is it genuinely cheaper than navigating the primary artifacts, and is it clearly prevented from becoming a shadow source of truth or control plane?
- Are customer-specific or confidential details excluded?
- Is the simpler design still available and compared?
- Can the artifact be retired or migrated without breaking navigation or hidden consumers?
