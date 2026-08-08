# Delivery and Adoption Plan

## Delivery contract

| Field | Value |
| --- | --- |
| Workflow charter and version | — |
| Initial segment and maximum effect | — |
| Accepted outcome and verifier | — |
| Delivery lead | — |
| Operational/product owner | — |
| Technical and service owner | — |
| Risk and data owners | — |
| Target pilot and production dates | — |
| Pilot adoption owner and instrumentation-ready date | — |
| Receiving harness owner and paired-operation start | — |
| Stop conditions | — |

## Requirement-to-release trace

| Requirement | Domain/state | Context/logic | Tool/effect | Security | UX/artifact | Eval | Telemetry | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — |

## Milestones

| Milestone | Demonstrable vertical slice | Entry evidence | Exit evidence | Owner |
| --- | --- | --- | --- | --- |
| Discovery complete | Charter and observed cases | Sponsor and operator access | Approved bounded workflow | — |
| Architecture complete | End-to-end design and threat paths | Charter | Contracts, tests, rollback design | — |
| Sandbox complete | Representative trigger through verified simulated effect | Versioned fixtures | Contracts and negative cases pass | — |
| Shadow complete | Real inputs, no production effect | Trace and reviewer capacity | Outcome, safety, cost, UX thresholds | — |
| Canary complete | Named segment and reversible/staged effect | On-call and rollback | SLO, adoption, value, recovery evidence | — |
| Bounded production | Supported service | Customer ownership exercised | Review cadence and expansion decision | — |

## Adoption measurement contract

Freeze this contract before pilot entry. Changes to the denominator, event definition, window, or source create a new measurement revision and require a documented rebaseline.

| Adoption metric | Eligible denominator and exclusions | Baseline value / as-of / status | Target | Guardrail and limit | Measurement window | Authoritative event/query source and revision | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — |

Record the identity-deduplication rule, late-event policy, timezone, missing-data behavior, and segment keys used to calculate the metric.

## Adoption design

| User group | Eligible segment | Current job and artifact | New surface | Benefit | New responsibility | Training | Feedback channel | Adoption contract row |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — |

The production surface must expose evidence, state, uncertainty, alternatives, and permitted actions. Users must be able to correct, pause, reject, escalate, and resume work without losing the audit trail.

## Pilot adoption and harness handoff

Open this workstream at pilot entry. The receiving team pairs on the actual harness, evaluation, release, support, and adoption paths before bounded production.

| Capability | Pilot exercise | FDE/delivery owner | Receiving owner | Start / customer-led date | Evidence | Blocking gate |
| --- | --- | --- | --- | --- | --- | --- |
| Harness configuration and bounded run | Trace one representative run from admission to terminal state | — | — | — | — | — |
| Behavior change | Review a model, prompt, context-policy, tool-bundle, or guardrail diff | — | — | — | — | — |
| Evaluation and case authoring | Add and execute a representative and a negative case | — | — | — | — | — |
| Adoption instrumentation | Reproduce numerator, denominator, exclusions, and guardrail from source | — | — | — | — | — |
| Release and rollback | Promote an isolated compatible release and restore the prior version | — | — | — | — | — |
| Alert, containment, and reconciliation | Run a game day using the production route and source-of-truth readback | — | — | — | — | — |
| User support and feedback triage | Resolve a pilot support case and classify the resulting learning | — | — | — | — | — |

Controls: `FDE-003`, `ADP-002`, `DEL-001`, `OPS-007`.

## Artifact ownership and lineage

| Artifact/release role | Authoritative URI | Version or digest | Upstream inputs and revisions | Producing path | Change owner | Receiving owner | Access/retention | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Workflow charter and value contract | — | — | — | — | — | — | — | — |
| Domain/data/context contract | — | — | — | — | — | — | — | — |
| Agent harness and behavior bundle | — | — | — | — | — | — | — | — |
| Tool, identity, and policy contracts | — | — | — | — | — | — | — | — |
| Evaluation suite and report | — | — | — | — | — | — | — | — |
| User surface and support assets | — | — | — | — | — | — | — | — |
| Runtime, telemetry, runbooks, and release manifest | — | — | — | — | — | — | — | — |

Each production release resolves these rows to immutable versions or digests; aliases such as `latest` do not establish lineage.

## Prototype-debt register

| Shortcut | Risk | Production disposition | Owner | Blocking gate |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

## Dependencies

| Dependency | Owner | Contract/version | Change notice | Failure mode | Degraded behavior | Exit path |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — |

## Customer enablement

| Capability | Learn | Pair | Customer leads | Evidence |
| --- | --- | --- | --- | --- |
| Architecture and contracts | — | — | — | — |
| Evaluation and case authoring | — | — | — | — |
| Harness and behavior change | — | — | — | — |
| Adoption measurement and rebaseline | — | — | — | — |
| Release and rollback | — | — | — | — |
| Monitoring and support | — | — | — | — |
| Incident and reconciliation | — | — | — | — |
| Access, policy, and dependency management | — | — | — | — |

## Decision log

| Date | Decision | Evidence | Alternatives | Owner | Revisit trigger |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |
