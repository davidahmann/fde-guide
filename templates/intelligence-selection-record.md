# Intelligence Selection Record

Use one record for each consequential decision step. This record does not require every mechanism to be used. It makes the smallest sufficient choice reviewable.

Controls: `ARC-004`, `ARC-005`, `VAL-001`, `VAL-002`, `CST-001`, `CST-002`.

## Decision context

| Field | Value |
| --- | --- |
| Record ID and date | — |
| Workflow-charter URI and version | — |
| Operational decision | — |
| Eligible population and segment | — |
| Accepted outcome and verifier | — |
| Decision owner and service owner | — |
| Risk, latency, quality, and cost ceilings | — |
| Source-of-truth inputs and freshness rules | — |

## Candidate mechanisms

| Mechanism | Candidate? | Evidence it is sufficient or insufficient | Quality/risk trade-off | Full cost impact | Fallback or escalation |
| --- | --- | --- | --- | --- | --- |
| Deterministic rule, query, calculation, or workflow | yes / no | — | — | — | — |
| Optimization or constraint solver | yes / no | — | — | — | — |
| Classical ML or statistical model | yes / no | — | — | — | — |
| Retrieval/search | yes / no | — | — | — | — |
| Foundation-model call | yes / no | — | — | — | — |
| Bounded agent workflow | yes / no | — | — | — | — |
| Human decision or review | yes / no | — | — | — | — |

## Selected design

| Field | Value |
| --- | --- |
| Selected mechanism and version | — |
| Why the simpler alternative was insufficient | — |
| Typed input and output contract | — |
| Deterministic validations and policy owner | — |
| Authority ceiling and permitted effect | — |
| Evaluation and representative evidence | — |
| Route monitor and drift signal | — |
| Full cost allocation and run budget | — |
| Human-review trigger and fallback | — |
| Rollback, retirement, or replacement trigger | — |

## Decision

Record the selected mechanism, approver, date, limitations, and next review. Link an [architecture decision record](architecture-decision-record.md) when the choice changes the system boundary, data contract, security posture, or release unit.
