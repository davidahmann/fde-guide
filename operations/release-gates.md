# Production Release Gates

## Gate state machine

```text
draft -> design_approved -> sandbox_verified -> shadow_verified
      -> canary_verified -> bounded_production -> expanded_segment

any state -> paused -> rolled_back | remediated -> previous_verified_state
```

## Gate 0 — Design

| Required artifact | Pass condition |
| --- | --- |
| Workflow charter | Accepted outcome, baseline, target, owner, verifier |
| Operational ontology | Entities, actions, policies, invariants, evidence lineage |
| Agent-system record | Valid against `agent-system.schema.json` |
| Tool contracts | Valid against `tool-contract.schema.json` |
| Threat model | Every high/critical threat has prevention, detection, recovery, and test |
| Economics | Cost/run and cost/accepted-outcome budgets |

Controls: `ARC-001`, `ARC-002`, `CTX-001`, `TOL-001`, `IAM-001`, `SEC-004`.

## Gate 1 — Sandbox

| Verification | Pass condition |
| --- | --- |
| Contract tests | 100% valid/invalid fixtures behave as declared |
| Authorization | Deny-by-default; caller-agent intersection enforced |
| Secrets | No secret material in model, sandbox, tool output, or telemetry |
| Egress | Denied except explicit destination/protocol/method rules |
| Idempotency | Duplicate delivery produces one business effect |
| Evaluator boundary | Agent cannot mutate fixtures, graders, or pass signal |
| Budget controls | Steps, time, retries, parallelism, and spend terminate safely |

Controls: `IAM-002`, `IAM-003`, `SEC-001`, `SEC-002`, `SEC-003`, `REL-001`, `REL-002`, `EVA-002`, `CST-002`.

## Gate 2 — Shadow

| Metric | Pass condition |
| --- | --- |
| Accepted outcome | Meets segment threshold with confidence interval |
| Prohibited effects | `0` |
| High-severity slice | Meets independent threshold |
| Trace completeness | `100%` required span/event fields |
| Retrieval/context | Freshness and provenance SLOs pass |
| Human review | Evidence packets judged sufficient by named reviewers |
| Cost | P95 cost/accepted-outcome within budget |

Controls: `EVA-001`, `EVA-003`, `EVA-005`, `HUM-001`, `OPS-001`, `CST-001`.

## Gate 3 — Canary

| Requirement | Pass condition |
| --- | --- |
| Segment | Named tenant/workflow/risk slice only |
| Duration/sample | Declared before start; statistically adequate |
| Writes | Staged or independently reversible |
| Readback | Deterministic postcondition on every effect |
| On-call | Named owner, alert routes, tested kill switch |
| Rollback | Trigger and restoration procedure exercised |
| Compatibility | Model, prompt, tool, policy, schema, runtime versions recorded |

Controls: `REL-003`, `HUM-002`, `OPS-002`, `OPS-003`, `OPS-004`.

## Gate 4 — Autonomy promotion

| Requirement | Pass condition |
| --- | --- |
| Scope | One named behavior segment and effect class |
| Holdout | Independent replay suite passes |
| Incidents | No open high/critical control failure |
| Error budget | Within SLO window |
| Reviewer load | Capacity and escalation latency within SLO |
| Reversibility | Promotion can be disabled without data loss |
| Approval | Technical, operational, and risk owners sign exact artifact versions |

Promotion unit:

```json
{
  "system_version": "1.2.0",
  "segment": "named-workflow-segment",
  "from_level": "recommend",
  "to_level": "execute_reversible",
  "artifact_digests": {},
  "evaluation_report": "report-uri",
  "expires_at": "ISO-8601",
  "approvers": ["technical-owner", "operational-owner", "risk-owner"]
}
```

## Automatic rollback triggers

- Any unauthorized, cross-tenant, duplicate, or prohibited effect
- Any evaluator-integrity failure
- Postcondition mismatch above zero-tolerance threshold
- Source freshness breach on a decision-bearing object
- Error-budget burn rate above declared threshold
- Trace completeness below forensic minimum
- Cost/run or parallel-worker circuit breaker
- Kill-switch, identity-revocation, or egress-control failure
