---
name: engineer-ai-value
description: Engineer the measurable value and full-cost case for an AI-enabled workflow. Use for ROI, outcome economics, cost ceilings, adoption-adjusted value, portfolio prioritization, pilot gates, or deciding whether a technically feasible system is worth building or continuing.
---

# Engineer AI Value

Make value an operating contract rather than a slide-deck estimate. Measure accepted outcomes, not model activity, token volume, or feature usage alone.

## Read first

1. Read [Value Engineering and Frugal Architecture](../../../library/11-value-engineering-and-frugal-architecture.md).
2. Use the [value-case template](../../../templates/value-case.md) and the authoritative [workflow-charter template](../../../templates/workflow-charter.json).
3. Apply `VAL-001` through `VAL-003`, `CST-001`, `CST-002`, and `FDE-003` from the [control catalog](../../../controls/control-catalog.json).

## Workflow

1. Define the accepted outcome, metric owner, eligible population, measurement window, baseline status, target, attribution method, and guardrails.
2. Estimate value from adopted eligible use and independently accepted outcomes. Include avoided loss or unit value only when its source and owner are explicit.
3. Calculate full delivery and operating cost: implementation, change and training, models, tools, compute, storage, retries, wait time, human review, support, recovery, and ongoing maintenance.
4. Set a maximum cost per accepted outcome and run-level resource budgets. Define the escalation or stop response when either is breached.
5. Test sensitivity to adoption, acceptance rate, unit value, incident cost, review load, and volume. Distinguish measured values from assumptions and show a downside case.
6. Compare `build`, `redesign`, `defer`, and `stop`. Preserve the value assumptions that would reverse the decision.

## Output contract

Return:

- an updated value case linked to its workflow charter;
- a formula with units, sources, owners, and measured-versus-assumed labels;
- base and downside economics, cost ceiling, and guardrails;
- pilot measurement plan and decision thresholds;
- a value decision and the next evidence needed.

Do not claim realized value from a pilot forecast, technical pass rate, generated output, or gross time saved. If adoption, acceptance, or attribution cannot be measured credibly, narrow the claim or keep it explicitly provisional.
