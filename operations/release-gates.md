# Production Release Gates

## Gate progression

```text
design -> sandbox -> shadow -> canary -> autonomy -> operations
any active gate -> pause or rollback
operations -> improve, expand, constrain, or retire
```

These are review milestones, not values for `solution-release.release_status`. Record the exact release lifecycle with the closed machine contract:

| Gate decision | Solution-release representation |
| --- | --- |
| Design packet under construction | `release_status: draft` |
| Sandbox or shadow candidate under review | `release_status: review`, `rollout.strategy: shadow`, `traffic_percent: 0` |
| Approved candidate before deployment | `release_status: approved` with four digest-bound approvals |
| Running canary | `release_status: deployed`, `rollout.strategy: canary`, and deployment evidence |
| Bounded or expanded segment | `release_status: deployed`, `rollout.strategy: bounded_segment` or `full_segment` |
| Reverted release | `release_status: rolled_back` with rollback evidence |
| Verified shutdown | `release_status: retired` with retirement evidence |

`paused`, `remediated`, and `retirement_planned` are service-control states outside the release-status vocabulary. Preserve the last admitted manifest, record the operational decision, and issue a new digest-bound release or retirement record before resuming or changing deployment.

## Gate 0 — Design

| Required artifact | Pass condition |
| --- | --- |
| Field evidence | Representative normal, exception, failure, and handoff cases observed |
| Workflow charter | User, decision, action, accepted outcome, baseline, target, owner, verifier, risk ceiling, and disposition |
| Value case | Assumptions, attribution, full cost, guardrails, and stop threshold are falsifiable |
| Operational ontology | Entities, actions, policies, invariants, evidence lineage |
| Agent-system record | Valid against `agent-system.schema.json` |
| Tool contracts | Valid against `tool-contract.schema.json` |
| Threat model | Every high/critical threat has prevention, detection, recovery, and test |
| Evaluation plan | Claim, suite, environment, trial semantics, contamination controls, and decision owner |
| Adoption and ownership | Intended users, professional work surface, review path, receiving service owner, and enablement plan |
| Economics | Cost/run, cost/accepted-outcome, and realized-value measurement plans |

Controls: `ARC-001`, `ARC-002`, `ARC-003`, `ARC-004`, `ARC-005`, `FDE-001`, `FDE-002`, `FDE-003`, `VAL-001`, `VAL-003`, `CTX-001`, `CTX-004`, `CTX-005`, `TOL-001`, `TOL-003`, `TOL-005`, `TOL-006`, `IAM-001`, `SEC-004`, `REL-004`, `STA-001`, `STA-003`.

## Gate 1 — Sandbox

| Verification | Pass condition |
| --- | --- |
| Contract tests | 100% valid/invalid fixtures behave as declared |
| Authorization | Deny-by-default; caller-agent intersection enforced |
| Secrets | No secret material in model, sandbox, tool output, or telemetry |
| Egress | Denied except explicit operation, identity, data-class, destination, method, redirect, and credential rules |
| Idempotency | Duplicate delivery produces one business effect |
| Evaluator boundary | Agent cannot mutate fixtures, graders, or pass signal |
| Budget controls | Steps, time, retries, parallelism, and spend terminate safely |

Controls: `ARC-002`, `DEL-002`, `CTX-002`, `CTX-005`, `TOL-001`, `TOL-002`, `TOL-003`, `TOL-004`, `TOL-005`, `TOL-006`, `IAM-001`, `IAM-002`, `IAM-003`, `SEC-001`, `SEC-002`, `SEC-003`, `SEC-005`, `SEC-006`, `SEC-007`, `REL-001`, `REL-002`, `REL-005`, `STA-002`, `EVA-002`, `CST-002`.

## Gate 2 — Shadow

| Metric | Pass condition |
| --- | --- |
| Accepted outcome | Meets segment threshold with confidence interval |
| Prohibited effects | `0` |
| High-severity slice | Meets independent threshold |
| Trace completeness | `100%` required span/event fields |
| Retrieval/context | Freshness and provenance SLOs pass |
| Human review | Evidence packets judged sufficient by named reviewers |
| Adoption | Eligible use, completion, override, abandonment, and reviewer load meet predeclared thresholds |
| Cost | P95 cost/accepted-outcome within budget |

Controls: `ARC-005`, `FDE-003`, `VAL-001`, `ADP-001`, `DEL-001`, `DEL-002`, `CTX-001`, `CTX-002`, `CTX-003`, `CTX-005`, `TOL-002`, `TOL-004`, `TOL-005`, `IAM-002`, `IAM-003`, `SEC-004`, `SEC-005`, `REL-001`, `REL-002`, `REL-003`, `REL-004`, `REL-005`, `STA-001`, `EVA-001`, `EVA-002`, `EVA-003`, `EVA-005`, `EVA-006`, `HUM-001`, `HUM-002`, `HUM-003`, `OPS-001`, `OPS-005`, `OPS-007`, `CST-001`, `CST-002`.

## Gate 3 — Canary

| Requirement | Pass condition |
| --- | --- |
| Segment | Named tenant/workflow/risk slice only |
| Duration/sample | Declared before start; statistically adequate |
| Writes | Staged or independently reversible |
| Readback | Deterministic postcondition on every effect |
| On-call | Named owner, alert routes, tested kill switch |
| Customer ownership | Receiving service team has exercised support, incident, change, and rollback procedures |
| Rollback | Trigger and restoration procedure exercised |
| Compatibility | Model, prompt, tool, policy, schema, runtime versions recorded |
| Release manifest | Complete artifact bundle, digests, environment, migration, canary, rollback, and approvals validate against `solution-release.schema.json` |

Controls: `FDE-003`, `VAL-002`, `ADP-001`, `ADP-002`, `DEL-001`, `DEL-002`, `CTX-002`, `SEC-002`, `SEC-006`, `SEC-007`, `REL-003`, `REL-005`, `EVA-001`, `EVA-003`, `EVA-006`, `HUM-001`, `HUM-003`, `OPS-002`, `OPS-004`, `OPS-006`, `OPS-007`.

## Gate 4 — Autonomy promotion

| Requirement | Pass condition |
| --- | --- |
| Scope | One named behavior segment and effect class |
| Holdout | Independent replay suite passes |
| Incidents | No open high/critical control failure |
| Error budget | Within SLO window |
| Reviewer load | Capacity and escalation latency within SLO |
| Realized value | Accepted-outcome and value evidence meet the segment threshold after full operating cost |
| Reversibility | Promotion can be disabled without data loss |
| Approval | Technical, operational, risk, and receiving service owners sign the exact release digest |

Promotion unit:

```json
{
  "release_id": "workflow-agent-production",
  "version": "1.2.0",
  "target_segments": ["named-workflow-segment"],
  "autonomy_level": "execute_reversible",
  "release_digest": "sha256:...",
  "evaluation_report_uri": "reports/workflow-agent-1.2.0.json",
  "approvals": [
    { "role": "technical", "principal": "technical-owner", "bound_release_digest": "sha256:...", "approved_at": "ISO-8601" },
    { "role": "operational", "principal": "operational-owner", "bound_release_digest": "sha256:...", "approved_at": "ISO-8601" },
    { "role": "risk", "principal": "risk-owner", "bound_release_digest": "sha256:...", "approved_at": "ISO-8601" },
    { "role": "service", "principal": "receiving-service-owner", "bound_release_digest": "sha256:...", "approved_at": "ISO-8601" }
  ]
}
```

This is an excerpt, not a complete release artifact. Use the [solution-release template](../templates/solution-release.json) and [change management](change-management.md) for the full release bundle and rollback evidence. Production approval is invalidated when a bound behavioral dependency changes.

Controls: `ADP-002`, `DEL-001`, `CTX-004`, `IAM-002`, `IAM-003`, `SEC-005`, `REL-001`, `REL-003`, `REL-004`, `REL-005`, `STA-002`, `EVA-001`, `EVA-003`, `EVA-006`.

## Gate 5 — Improve, expand, or retire

| Decision | Pass condition |
| --- | --- |
| Field learning | Evidence, recurrence, confidentiality, owner, destination, disposition, and validation are recorded |
| Improvement | Compatible artifacts, affected segments, evaluation evidence, canary, rollback, and post-change outcome check are bound to a new release |
| Expansion | Value, adoption, SLO, safety, reviewer capacity, service ownership, and rollback evidence pass for the named segment and effect class |
| Retirement | Owner, affected users, admission freeze, authority and capability revocation, pending-effect reconciliation, state disposition, communications, and shutdown verification are complete |

Controls: `ARC-005`, `FDE-004`, `VAL-002`, `VAL-003`, `ADP-001`, `ADP-002`, `TOL-006`, `SEC-001`, `SEC-002`, `SEC-004`, `SEC-006`, `SEC-007`, `STA-003`, `EVA-004`, `EVA-005`, `EVA-006`, `HUM-002`, `HUM-003`, `OPS-001`, `OPS-002`, `OPS-003`, `OPS-004`, `OPS-005`, `OPS-006`, `OPS-007`, `CST-001`.

The control catalog is the source of truth for these sets. Repository validation compares every list above with each control's `release_gates` membership so documentation drift fails CI.

## Automatic rollback triggers

- Any unauthorized, cross-tenant, duplicate, or prohibited effect
- Any evaluator-integrity failure
- Postcondition mismatch above zero-tolerance threshold
- Source freshness breach on a decision-bearing object
- Error-budget burn rate above declared threshold
- Trace completeness below forensic minimum
- Cost/run or parallel-worker circuit breaker
- Kill-switch, identity-revocation, or egress-control failure
