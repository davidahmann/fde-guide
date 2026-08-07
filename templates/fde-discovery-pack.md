# FDE Discovery Pack

## Engagement charter

| Field | Value |
| --- | --- |
| Workflow ID | |
| Operational owner | |
| Technical owner | |
| Risk owner | |
| Trigger | |
| Accepted outcome | |
| Baseline | |
| Target | |
| Measurement window | |
| Verifier | |
| Maximum acceptable failure | |

## Workflow event log

| Sequence | Actor | Event | Input | System | Decision | Evidence | Effect | Exception |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | | |

## Source-of-truth map

| Source ID | Objects | Owner | Read/write | Classification | Freshness SLO | Identity | API maturity | Failure mode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

## Decision decomposition

| Decision | Deterministic rule | Agent judgment | Human accountability | Required evidence | Postcondition |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Exception taxonomy

| Exception ID | Frequency | Severity | Detection | Current handling | Target handling | Escalation owner | Eval slice |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Operational ontology candidates

| Kind | ID | Source | Identity key | States/relations | Policy | Action | Invariant |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Entity | | | | | | | |

## Value-verifiability matrix

| Candidate | Annual volume | Minutes/case | Error cost | Integration cost | Verification coverage | Residual risk | Priority |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| | | | | | | | |

```text
priority = annual_volume × minutes_per_case × verifier_coverage × adoption_probability
           ---------------------------------------------------------------
           integration_cost × residual_risk_multiplier
```

## Readiness gates

| Gate | Required evidence | Owner | Status |
| --- | --- | --- | --- |
| Workflow | Accepted outcome, boundary, verifier | Operational | |
| Data | Owners, source-of-truth rules, freshness, classification | Data | |
| Tools | Typed contracts, identity, authorization, idempotency | Platform | |
| Security | Threat model, secrets, egress, tenant isolation | Security | |
| Evaluation | Replay cases, safety slices, isolated graders | Evaluation | |
| Operations | SLOs, alerts, runbooks, rollback, capacity | Operations | |

## Cutover plan

| Stage | Traffic | Write capability | Entry gate | Exit gate | Rollback trigger |
| --- | ---: | --- | --- | --- | --- |
| Offline | 0% | None | Replay fixtures ready | Thresholds pass | Any prohibited effect |
| Shadow | Mirrored | None | Observability complete | Stable slice metrics | Data or policy drift |
| Canary | 1–5% | Staged/reversible | Human review ready | SLO and review thresholds | Error-budget burn |
| Bounded production | Named segment | Policy-gated | Runbooks exercised | Continuous controls | Kill-switch threshold |
