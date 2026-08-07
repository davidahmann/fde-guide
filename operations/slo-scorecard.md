# Agent SLO Scorecard

| SLI | Example objective | Error budget policy |
| --- | --- | --- |
| Accepted outcome rate | `>= 98.5% / 28d` | Pause promotion below objective |
| Unauthorized effect rate | `= 0` | Immediate kill switch |
| Cross-tenant effect rate | `= 0` | SEV-0 |
| Duplicate effect rate | `= 0` | Disable affected write tool |
| Postcondition failure rate | `<= 0.1% / 28d` | Freeze writes at fast burn |
| P95 cycle time | `<= 90 s` | Degrade or reduce concurrency |
| P95 cost/accepted outcome | `<= $0.40` | Route/stop policy review |
| Context freshness breach | `<= 0.5%` | Disable affected source segment |
| Human approval P95 wait | `<= 4 h` | Capacity/escalation routing |
| Recovery success rate | `>= 99.9%` | Block autonomy expansion |
| Trace completeness | `= 100%` for writes | Block write path |

## Burn-rate actions

| Window | Burn rate | Action |
| --- | ---: | --- |
| 5 m | `> 14.4×` | Automatic segment kill switch |
| 1 h | `> 6×` | Page on-call; freeze promotion |
| 6 h | `> 3×` | Reduce autonomy/concurrency |
| 3 d | `> 1×` | Corrective backlog and threshold review |

## Capacity constraints

```text
effective_concurrency = min(
  workflow_worker_limit,
  tool_rate_limit / calls_per_run,
  provider_token_limit / tokens_per_run,
  reviewer_capacity / approval_rate,
  cost_budget / p95_cost_per_run
)

queue_wait_p95 + run_time_p95 + approval_wait_p95 <= cycle_time_slo
```

## Recovery objectives

| State class | RPO | RTO | Restore verification |
| --- | --- | --- | --- |
| Ephemeral context | `0` required | New run | Rebuild from source revisions |
| Durable workflow checkpoint | Last verified transition | 15 min | Deterministic replay |
| Staged proposal | Last committed stage | 30 min | Digest and policy recheck |
| External effect receipt | `0` loss | 15 min | Source-of-truth reconciliation |
| Audit record | Policy-defined | 4 h | Hash chain / storage integrity |
