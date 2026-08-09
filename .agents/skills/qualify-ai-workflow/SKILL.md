---
name: qualify-ai-workflow
description: Qualify a candidate AI-enabled workflow before value modeling or solution design. Use for field discovery, workflow observation, boundary and readiness assessment, value-modeling eligibility, or a charter decision that needs an owner, baseline, accepted outcome, verifier, adoption path, and risk ceiling.
---

# Qualify an AI Workflow

Turn a proposed use case into an evidence-backed workflow decision. Do not select a model, framework, or agent topology during this skill.

## Read first

1. Read the [12 Factors of AI Value Engineering](../../../library/14-twelve-factors-ai-value-engineering.md) and the [Discovery and Value playbook](../../../playbooks/01-discovery-and-value.md).
2. Use the [field-observation log](../../../templates/field-observation-log.md), [discovery pack](../../../templates/fde-discovery-pack.md), and [workflow-charter template](../../../templates/workflow-charter.json).
3. Only after observing and bounding the target work, compare it with the [business-flow index](../../../solutions/business-flows/README.md). Read only one matching pattern, or record `none`; treat it as a hypothesis rather than field evidence or design approval.
4. Apply `FDE-001` through `FDE-003`, `VAL-001`, `VAL-003`, and `CTX-001` from the [control catalog](../../../controls/control-catalog.json).

## Workflow

1. Name the user, working interface, trigger, operational decision, inputs, permitted action, accepted outcome, owner, and verifier.
2. Inspect representative work, including normal cases, exceptions, workarounds, handoffs, source artifacts, and failure recovery. Treat interviews as hypotheses until operators or source owners validate them.
3. Record the baseline as measured or explicitly unmeasured. Define the eligible population, measurement window, target, attribution method, and guardrails.
4. Identify source systems, access constraints, data classification, freshness, adoption work, service ownership, and the maximum tolerable effect.
5. Assess factors 1–6 and the preliminary hard-gate blockers. Record the closest business-flow pattern or `none` without importing its objects, policies, or measures as observations.
6. Separate technical feasibility, operator acceptance, adoption, business value, economics, and production readiness. Give each gate an owner and stop condition.
7. Decide `discover`, `defer`, or `do_not_build`. State whether the bounded workflow is ready for value modeling, plus the evidence required to change the decision.

## Output contract

Return:

- a completed discovery summary and workflow-charter draft;
- the functional-requirement tuple and workflow boundary;
- baseline, target, verifier, guardrails, and adoption hypothesis;
- preliminary factor gates, readiness blockers, risk ceiling, owners, selected pattern or `none`, and next evidence;
- one explicit decision with rationale.

Do not invent observations, measurements, approvals, or source access. Stop before solution design when the outcome, verifier, owner, accessible context, adoption path, or risk ceiling remains materially unresolved.
