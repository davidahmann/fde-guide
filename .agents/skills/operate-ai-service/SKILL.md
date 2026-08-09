---
name: operate-ai-service
description: Establish or run the operating model for a production AI-enabled service. Use for telemetry, SLOs, behavior monitoring, incident response, cost control, change management, service review, kill switches, regression learning, scaling, or retirement.
---

# Operate an AI Service

Operate the accepted business outcome, not only the model endpoint. Keep value, adoption, reliability, safety, cost, ownership, and change visible together.

## Read first

1. Read [Operate and Scale](../../../playbooks/03-operate-and-scale.md) and the [operations map](../../../operations/README.md).
2. Use the [production service review](../../../templates/production-service-review.md), [SLO scorecard](../../../operations/slo-scorecard.md), [telemetry contract](../../../operations/telemetry-contract.md), [behavior monitoring](../../../operations/behavior-monitoring.md), [incident runbook](../../../operations/incident-runbook.md), and [change management](../../../operations/change-management.md).
3. Apply `OPS-001` through `OPS-007`, `REL-002` through `REL-004`, `ADP-002`, `CST-001`, and `CST-002` from the [control catalog](../../../controls/control-catalog.json).

## Workflow

1. Confirm the service owner, technical owner, risk owner, support path, release authority, and business metric owner.
2. Define SLOs for accepted outcomes, prohibited and duplicate effects, cycle time, cost, dependency health, recovery, and adoption. Set alert routes and error-budget actions.
3. Trace identity, context, decisions, tools, policy, approvals, state, effects, readback, cost, and stop reason with privacy-safe identifiers.
4. Exercise kill switches for new work, writes, workload identities, egress, and capability bundles. Rehearse severe failure detection, containment, readback, recovery, and communication.
5. Review behavior clusters, incidents, user corrections, adoption barriers, and cost per accepted outcome. Turn diagnosed failures into replayable regressions.
6. Version and evaluate changes, canary them by route or segment, monitor rollback triggers, and preserve compatible release evidence.
7. At each service review, decide continue, constrain, improve, expand, or retire.

## Output contract

Return the current service decision, scorecard, evidence links, breached objectives, incident and change actions, owners and deadlines, value and cost trend, capability gaps, and retirement conditions.

Do not hide outcome failures behind uptime, average away prohibited effects, or expand autonomy while support, evaluation, or customer operating capability is unproven.
