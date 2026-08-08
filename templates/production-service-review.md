# Production Agent Service Review

## Review identity

| Field | Value |
| --- | --- |
| Workflow/system and versions | — |
| Review period | — |
| Supported segment and autonomy | — |
| Operational, technical, risk, and service owners | — |
| Last release and incident | — |
| Decision required | Expand, continue, improve, constrain, pause, or retire |

## Outcome and value

| Metric | Baseline | Target | Current | Eligible denominator | Confidence | Owner |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Accepted outcome | — | — | — | — | — | — |
| Business value | — | — | — | — | — | — |
| Cost per accepted outcome | — | — | — | — | — | — |
| Guardrail metric | — | — | — | — | — | — |

Explain attribution, non-adoption, downstream rework, avoided-loss evidence, fixed cost, and any rebaseline.

## Declared adoption contract

Compare the current result with the pre-pilot contract; do not silently redefine the metric after observing performance.

| Metric revision | Eligible denominator and exclusions | Baseline value / as-of / status | Target | Guardrail and limit | Measurement window | Authoritative event/query source and revision | Owner | Contract drift |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | None / approved rebaseline / unapproved |

## Reliability, safety, and recovery

| SLI or event | Objective | Current | Budget/breach | Segment | Action |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

Include unauthorized, prohibited, duplicate, effect-unknown, and readback-mismatch events even when the count is zero.

## Adoption and human review

| Measure | Current | Trend | Slice | Capacity or risk decision |
| --- | ---: | --- | --- | --- |
| Eligible use | — | — | — | — |
| Completion | — | — | — | — |
| Override/edit/reject | — | — | — | — |
| Abandonment | — | — | — | — |
| Approval acceptance and unsafe sample | — | — | — | — |
| Reviewer wait and workload | — | — | — | — |
| Support contacts and training gaps | — | — | — | — |

## Evaluation and behavior

| Suite/claim | Version manifest | Trials/metric | Result and uncertainty | Saturation/contamination | Decision |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

List production behavior clusters, new regressions, evaluator calibration changes, and open gaps.

## Changes and dependencies

| Change/dependency | Version or lifecycle date | Evidence | Canary/soak | Rollback | Owner |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

## Customer operating capability

| Capability | Receiving owner | Last exercise/evidence | Open gap | Exit or remediation decision |
| --- | --- | --- | --- | --- |
| Support and escalation | — | — | — | — |
| Incident response and reconciliation | — | — | — | — |
| Evaluation and release | — | — | — | — |
| Policy, data, tool, and model change | — | — | — | — |
| Rollback and recovery | — | — | — | — |
| Cost, value, and capacity review | — | — | — | — |
| Retirement and state disposition | — | — | — | — |

Compare open gaps with the [customer enablement handoff](customer-enablement-handoff.md). A recurring gap needs an owner, exercise, and due date; delivery-team availability is not a substitute for customer operating capability.

## Incidents and reconciliation

| Incident/signal | First divergent state or invariant | Root cause/owner | Reconciliation | Regression | Product disposition |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

## Field learning

| Learning ID | Incident/signal | Recurrence | Evidence/regression | Confidentiality | Destination | Product owner | Disposition | Validation status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — |

Maintain detailed records in the [field-learning register](field-learning-register.md). Link the incident and reconciliation record instead of duplicating sensitive evidence here.

## Decisions and actions

| Decision/action | Evidence | Owner | Due | Verification |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

Record the final scope/autonomy decision, improve-or-retire disposition, conditions, dissent, next review, and automatic rollback triggers. A retire decision starts the [owned retirement sequence](../playbooks/03-operate-and-scale.md#10-run-the-improve-expand-or-retire-sequence) and is not complete until a new solution release carries verified `retirement_evidence` under the [solution-release contract](../schemas/solution-release.schema.json).
