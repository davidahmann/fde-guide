# Customer Enablement and Production Handoff

Open this record at pilot entry. Handoff is complete only when the receiving team demonstrates the operating capability; documentation delivery alone is insufficient.

## Ownership

| Responsibility | Primary | Backup | Escalation | Evidence exercised |
| --- | --- | --- | --- | --- |
| Business outcome and scope | — | — | — | — |
| Product/workflow roadmap | — | — | — | — |
| Service and on-call | — | — | — | — |
| Architecture and release | — | — | — | — |
| Agent harness and behavior configuration | — | — | — | — |
| Data and context quality | — | — | — | — |
| Tools and integrations | — | — | — | — |
| Identity, policy, and risk | — | — | — | — |
| Evaluation and model behavior | — | — | — | — |
| Adoption instrumentation and value measurement | — | — | — | — |
| User support and training | — | — | — | — |

## Pilot transfer plan

| Capability | FDE leads | Paired operation | Receiving team leads | Exit evidence | Gap owner / due |
| --- | --- | --- | --- | --- | --- |
| Harness, model route, prompt, context policy, and guardrails | — | — | — | — | — |
| Tool, identity, authorization, egress, and effect controls | — | — | — | — | — |
| Evaluation cases, graders, fixtures, and reports | — | — | — | — | — |
| Adoption event, denominator query, guardrails, and rebaseline | — | — | — | — | — |
| Release, canary, rollback, and dependency lifecycle | — | — | — | — | — |
| Alerts, incidents, reconciliation, and support | — | — | — | — | — |

## Capability evidence

| Capability | Demonstration | Pass evidence | Date | Approver |
| --- | --- | --- | --- | --- |
| Explain scope, limits, and architecture | Design review led by receiving team | Questions and risks resolved | — | — |
| Add a representative evaluation case | Case authored and run independently | Valid fixture, grader, and expected result | — | — |
| Change the harness safely | Version one behavior component and run affected-route tests | Compatible manifest, evaluation, canary, and rollback evidence | — | — |
| Reproduce adoption measurement | Run numerator and eligible-denominator queries from declared sources | Result matches dashboard and exclusions are explained | — | — |
| Release a compatible change | Branch, review, promotion, and canary | Release evidence and healthy soak | — | — |
| Roll back behavior | Trigger simulated rollback | Prior version restored and verified | — | — |
| Respond to an alert | Game day from detection to containment | Alert, owner, kill switch, and readback work | — | — |
| Reconcile an external effect | Source-of-truth comparison | Affected state identified and corrected | — | — |
| Manage access and policy | Joiner/mover/leaver and policy change | Least privilege and audit verified | — | — |
| Support an operator | Ticket triage and feedback loop | Resolution and backlog classification | — | — |
| Review value and adoption | Monthly service review led by owner | Decision and follow-up actions recorded | — | — |
| Retire the workflow | Tabletop decommission | Identity, tools, state, audit, and users covered | — | — |

## Knowledge and assets

- [ ] Workflow charter, value case, current-state map, and decision log
- [ ] Architecture, domain model, tool and policy contracts, and data lineage
- [ ] Threat model, evaluation suites, reference worlds, and known limitations
- [ ] Release manifest, environments, dependency lifecycle, and rollback procedure
- [ ] Dashboards, alerts, SLOs, runbooks, kill switches, and reconciliation queries
- [ ] User guide, training material, support intake, and escalation routes
- [ ] Backlog classified as customer configuration, reusable pattern, platform gap, model limitation, operating problem, or retirement candidate

## Artifact ownership and lineage

| Artifact/release role | Authoritative URI | Version or digest | Upstream lineage | Current change owner | Receiving owner | Promotion path | Access/retention | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Workflow charter and value/adoption contract | — | — | — | — | — | — | — | — |
| Data, domain, and context contracts | — | — | — | — | — | — | — | — |
| Harness and behavior bundle | — | — | — | — | — | — | — | — |
| Tool, identity, and policy contracts | — | — | — | — | — | — | — | — |
| Evaluation suite and release evidence | — | — | — | — | — | — | — | — |
| User surface, telemetry, runbooks, and support assets | — | — | — | — | — | — | — | — |

Every production row resolves to an immutable version or digest and names both the upstream inputs and the path used to promote a change.

## Acceptance decision

Record accepted, accepted with dated conditions, or not accepted. Include remaining gaps, temporary FDE support, final service owner, next service review, and rollback or retirement trigger.
