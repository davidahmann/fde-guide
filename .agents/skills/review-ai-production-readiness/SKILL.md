---
name: review-ai-production-readiness
description: Review a specific AI-system release for production readiness. Use for architecture review, launch gate, customer security review, audit evidence, autonomy expansion, canary approval, rollback decision, or a prioritized gap assessment against this guide's controls.
---

# Review AI Production Readiness

Review one declared release and its claimed autonomy. A green test suite is evidence for exercised behavior, not certification of production readiness.

## Read first

1. Read the [control catalog](../../../controls/control-catalog.json), [release gates](../../../operations/release-gates.md), and [solution-release contract](../../../schemas/solution-release.schema.json).
2. Resolve guide artifacts through [catalog.json](../../../catalog.json) and candidate-system artifacts through the release manifest.
3. Use the target workflow charter, value case, system design, behavior bundle, tools, capabilities, threat model, evaluation report, adoption plan, operations evidence, and rollback plan.

## Workflow

1. State the exact release, workflow segment, actor mode, authority ceiling, environment, and decision being reviewed.
2. Check value and ownership, architecture and state, context and data, identity and authorization, tool and capability boundaries, security, reliability, evaluation, human review, adoption, operations, cost, change, and retirement.
3. For each applicable control, record `met`, `gap`, or `not applicable`, the evidence, owner, and expiry or review date. Never infer evidence from intent or documentation alone.
4. Separate release blockers from time-bounded remediation, improvement, and accepted residual risk. Name the approving principal for every accepted risk.
5. Decide `accept`, `canary`, `hold`, or `reject`. Bind the decision to the exact artifact versions and digests.
6. Define rollout scope, stop triggers, rollback evidence, support ownership, and the evidence required for the next autonomy or segment expansion.

## Output contract

Return an answer-first decision, scope, control matrix, critical evidence gaps, owners and deadlines, residual risks, rollout limits, rollback triggers, and re-review conditions.

Do not call this guide an external standard or certification. Do not approve an undefined release, unevaluated artifact drift, missing service owner, or consequential effect without independent readback evidence.
