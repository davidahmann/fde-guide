---
name: qualify-ai-workflow
description: Qualify an AI-enabled workflow before solution design. Use for discovery, use-case selection, workflow observation, pilot scoping, readiness assessment, or a go/defer/reject decision that needs an owner, baseline, accepted outcome, verifier, adoption path, and risk ceiling.
---

# Qualify an AI Workflow

Turn a proposed use case into an evidence-backed workflow decision. Do not select a model, framework, or agent topology during this skill.

## Read first

1. Read the [Discovery and Value playbook](../../../playbooks/01-discovery-and-value.md).
2. Use the [field-observation log](../../../templates/field-observation-log.md), [discovery pack](../../../templates/fde-discovery-pack.md), and [workflow-charter template](../../../templates/workflow-charter.json).
3. Apply `FDE-001` through `FDE-003`, `VAL-001`, `VAL-003`, and `CTX-001` from the [control catalog](../../../controls/control-catalog.json).

## Workflow

1. Name the user, working interface, trigger, operational decision, inputs, permitted action, accepted outcome, owner, and verifier.
2. Inspect representative work, including normal cases, exceptions, workarounds, handoffs, source artifacts, and failure recovery. Treat interviews as hypotheses until operators or source owners validate them.
3. Record the baseline as measured or explicitly unmeasured. Define the eligible population, measurement window, target, attribution method, and guardrails.
4. Identify source systems, access constraints, data classification, freshness, adoption work, service ownership, and the maximum tolerable effect.
5. Separate technical feasibility, operator acceptance, adoption, business value, economics, and production readiness. Give each gate an owner and stop condition.
6. Decide `qualify`, `defer`, `redesign`, or `reject`. State unresolved questions and the evidence required to change the decision.

## Output contract

Return:

- a completed discovery summary and workflow-charter draft;
- the functional-requirement tuple and workflow boundary;
- baseline, target, verifier, guardrails, and adoption hypothesis;
- readiness blockers, risk ceiling, owners, and next evidence;
- one explicit decision with rationale.

Do not invent observations, measurements, approvals, or source access. Stop before solution design when the outcome, verifier, owner, accessible context, adoption path, or risk ceiling remains materially unresolved.
