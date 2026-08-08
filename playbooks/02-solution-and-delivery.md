# Solution Design and Delivery

The design unit is the operational decision, not the model call. The delivery unit is the smallest end-to-end solution slice that can prove a customer outcome with representative data, real controls, and a usable work surface.

## 1. Trace requirements to the solution

Create one row for every functional requirement:

| Requirement | Domain objects/state | Context and logic | Action/effect | Security | User surface | Verifier | Telemetry | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Named decision | Entities, relationships, lifecycle | Sources, freshness, rules, models | Tool, precondition, postcondition | Actor, scope, approval | Artifact, review, interruption | Outcome or readback | State, policy, effect, outcome | Accountable role |

If a component cannot be traced to a requirement, justify or remove it. If a requirement cannot be traced to state, action, verification, and ownership, the design is incomplete. Palantir's solution-design method uses object models, lifecycle diagrams, enrichments, and interface expectations to preserve this traceability. [R26-41]

Controls: `FDE-001`, `ARC-001`, `DEL-001`.

## 2. Model data, logic, action, and security together

Use the [operational-ontology template](../templates/operational-ontology.json) to represent:

- **Data:** real business entities, identity, relationships, source authority, time, classification, and evidence lineage
- **Logic:** deterministic rules, calculations, policies, optimizers, models, and agent judgment
- **Action:** lifecycle transitions, tool contracts, effects, approvals, compensation, and readback
- **Security:** actor identity, caller authority, tenant, purpose, data scope, policy, and audit

This is the portable architectural lesson from Palantir's decision-centric Ontology: model the operational world and the changes allowed within it, not merely the documents retrieved by the model. It does not require a specific vendor or graph technology. [R26-42]

Control: `ARC-002`.

## 3. Select the smallest sufficient execution model

Evaluate these in order:

1. Deterministic software
2. One model call with typed input and output
3. A coded workflow with model-assisted steps
4. One bounded agent with tools and stop conditions
5. Multiple workers only across a genuine context, permission, ownership, specialization, or latency boundary

Record the baseline and the measured failure that justifies each increase in agency. OpenAI and Anthropic both recommend incremental complexity and a single-agent baseline. [R26-40] [R26-56]

Control: `ARC-004`.

## 4. Use a layered production architecture

The [enterprise agent platform blueprint](../blueprints/enterprise-agent-platform.md) separates:

- Professional work surface and persistent artifact
- Durable workflow and agent harness
- Operational domain and context assembly
- Typed tools and effect gateway
- Identity, authorization, secrets, egress, and sandbox controls
- Evaluation, observability, and evidence stores
- Delivery control plane for versions, branches, promotion, and rollback

The model proposes. Trusted software validates, authorizes, executes, persists, and proves.

## 5. Build a vertical slice

The first slice must cross the real boundaries of the workflow:

```text
representative trigger
  -> authorized context
  -> bounded reasoning
  -> typed proposal
  -> policy decision
  -> staged or simulated effect
  -> source-of-truth verification
  -> persistent user artifact
  -> trace and accepted-outcome event
```

Do not begin with every integration, user segment, or exception. Use one representative segment with the final identity, tool, telemetry, evaluation, and review patterns. Replace only those production dependencies that cannot safely be exercised, and record every substitute.

Controls: `ARC-001`, `TOL-001`, `REL-003`, `OPS-001`.

## 6. Treat the solution as one release unit

Version these together:

| Layer | Required identity |
| --- | --- |
| Data and context | Source, schema, freshness rule, retrieval/index revision |
| Domain | Ontology/domain-model version and migration |
| Behavior | Behavior-bundle ID/version/digest binding model, prompt/instruction, route, harness, context policy, complete tool membership, and guardrail |
| Capabilities | Tool contract plus exact capability-manifest ID/version/digest, implementation provenance, authorization, network policy, and lifecycle |
| State | Workflow schema, checkpoint, migration, retention |
| Assurance | Threat model, evaluation suite, grader, world fixture |
| Experience | User surface, evidence packet, approval contract |
| Operations | Runtime, deployment, alert, runbook, rollback |

Isolate cross-resource changes, review compatibility, and test them end to end. Merge is a source-control event; deployment is an independently gated production event. [R26-44]

Every tool addition or change requires a new capability decision, behavior-bundle membership update, affected-route evaluation, and solution-release digest. A semantic version without exact artifact and authority digests is not a release binding.

Controls: `DEL-001`, `DEL-002`, `OPS-007`.

## 7. Deliver with users, not toward them

Use a short evidence loop:

```text
observe case -> update requirement -> build slice -> replay cases
-> operator reviews artifact -> measure friction and outcome -> decide next slice
```

Recommended cadence:

| Cadence | Participants | Decision |
| --- | --- | --- |
| Daily field sync | FDE, technical owner, operator representative | New facts, blockers, risky assumptions |
| Twice-weekly case review | Operators, domain expert, FDE | Correctness, exceptions, UX, evidence quality |
| Weekly outcome review | Operational owner, product, technical, risk | Scope, metric movement, stop/continue decision |
| Release gate | Technical, operational, risk, service owners | Evidence-based promotion or rollback |

Keep a product backlog and an assurance backlog. A feature is not complete when its behavior, security, observability, support, or training remains undefined.

## 8. Predeclare adoption evidence

Before pilot entry, define the adoption metric independently of the observed result:

| Field | Required definition |
| --- | --- |
| Eligible denominator | Users or workflow opportunities that could validly use the agent, with exclusions and deduplication |
| Baseline | Value, status, as-of date, and comparison population |
| Target | Dated threshold for the named segment |
| Guardrail | Maximum abandonment, rework, unsafe approval, reviewer load, or support burden |
| Window | Event time, timezone, late-event rule, and reporting period |
| Source | Authoritative event/query, schema, and revision |
| Owner | Role accountable for definition, data quality, review, and rebaseline |

Instrument eligible exposure, completion, accepted outcome, override, rejection, abandonment, reviewer wait, and support events during the pilot. A denominator, source, window, or exclusion change creates a new metric revision; it is not an in-place correction to an unfavorable result.

Use the [delivery and adoption plan](../templates/delivery-and-adoption-plan.md).

Controls: `FDE-003`, `VAL-001`, `VAL-002`, `OPS-006`.

## 9. Build the professional work surface

An agent interaction must resolve into a durable artifact: case file, spreadsheet, document, notebook, review table, ticket, code change, or operational application. The user needs local evidence, editable state, alternatives, uncertainty, and permitted actions. Chat may initiate or explain work; it should not be the only review and accountability surface. [R26-43] [R26-54]

Control: `ADP-001`.

## 10. Manage prototype debt explicitly

Before shadow use, classify every shortcut:

| Shortcut | Required disposition |
| --- | --- |
| Mock or copied data | Replace with governed source or keep the slice non-production |
| Broad user/service credential | Replace with actor-aware least privilege |
| Prompt-only rule | Move enforcement below the model |
| Live mutable eval | Replace with versioned replay environment |
| Manual hidden step | Model as state, tool, review, or named operator procedure |
| Best-effort retry | Add timeout, idempotency, terminal state, and recovery |
| Unstructured approval | Bind reviewer, proposal digest, policy, expiry, and effect |
| Ad hoc deployment | Add compatible release manifest, canary, rollback, and owner |

## 11. Start adoption and harness handoff at pilot entry

At pilot entry, bind every solution artifact to its authoritative URI, version or digest, upstream lineage, change owner, receiving owner, promotion path, and retention policy. The customer technical and service owners pair on harness and behavior changes, adoption queries, evaluation construction, release, alerts, incidents, and support. Before bounded production, they lead those paths with the FDE observing. The final handoff is proof of exercised capability, not a document dump.

Use the [delivery and adoption plan](../templates/delivery-and-adoption-plan.md) and [customer enablement handoff](../templates/customer-enablement-handoff.md).

Control: `ADP-002`.

## Delivery exit gate

- [ ] Every requirement traces to domain, logic, effect, security, UX, verifier, telemetry, and owner.
- [ ] The deterministic/single-call/workflow baseline is recorded.
- [ ] The vertical slice exercises representative data and final control boundaries.
- [ ] Tools, policies, state, effects, and failure behavior are machine-readable and tested.
- [ ] Operators can inspect, correct, pause, reject, escalate, and resume work.
- [ ] Cross-resource versions form one compatible release candidate.
- [ ] Replay, shadow, safety, cost, and adoption evidence meet their separate thresholds.
- [ ] Adoption denominator, baseline, target, guardrail, window, source, and owner were fixed before pilot evidence was reviewed.
- [ ] Prototype debt has an owner and blocking disposition.
- [ ] Customer owners have exercised harness change, measurement, release, support, and incident paths.
- [ ] Production artifacts resolve to owned immutable versions or digests with upstream lineage and promotion paths.

## Delivery anti-patterns

- Architecture built around the model API instead of the operational decision
- Retrieval index presented as a full domain and action model
- Multi-agent topology before a serial baseline
- Code tested independently from data, policy, tools, UX, and evaluators
- Chat-only professional review
- Pilot velocity used as proof of maintainability or value
- Adoption measured from registered users or runs without a declared eligible denominator
- Unfavorable adoption hidden by changing the window, exclusions, or event source in place
- Late security, operations, adoption, or handoff workstream

[R26-40]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-40
[R26-41]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-41
[R26-42]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-42
[R26-43]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-43
[R26-44]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-44
[R26-54]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-54
[R26-56]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-56
