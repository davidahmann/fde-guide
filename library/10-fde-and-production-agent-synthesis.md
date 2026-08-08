# FDE and Production-Agent Synthesis

This page separates the most portable lessons from Palantir, OpenAI, Anthropic, and the AI Engineer practitioner corpus. It does not claim that any organization follows one universal method.

## Comparative view

| Source | Strongest contribution | Portable implementation |
| --- | --- | --- |
| Palantir | Outcome-led use cases, decision-centric operational model, action/writeback, compatible solution changes, operating ownership and enablement | Model the user's decision through data, logic, action, and security; deliver one operational loop; transfer capability to the customer |
| OpenAI | Specific-job scoping, end-to-end FDE ownership, production adoption and workflow impact, incremental agent architecture, eval feedback into product/model | One team owns discovery through rollout; measure accepted work and adoption; start with the simplest sufficient execution model |
| Anthropic | Eval validity, high-signal context, typed handoffs, separable session/harness/sandbox, containment, per-model behavioral rollout | Treat the harness and environment as part of the system; keep interfaces stable; test claims, trials, contamination, and route-specific change |
| AI Engineer talks | Detailed field reports on native artifacts, tool catalogs, durable state, full-trajectory evals, human interruption, and signal-to-PR improvement | Use talks as leads, preserve attribution, corroborate mechanisms, and validate locally before making a normative control |

## The combined FDE method

```text
important customer decision
  -> observed current work and exceptions
  -> measurable accepted outcome and verifier
  -> operational domain: data + logic + action + security
  -> smallest sufficient workflow/agent architecture
  -> persistent professional surface
  -> representative replay, shadow, and canary evidence
  -> customer-owned service and operating cadence
  -> production signal becomes regression, product learning, or retirement
```

## What belongs to the customer

- Business outcome, process policy, data, permissions, user decisions, risk acceptance, service ownership, and confidential operating context
- Workflow-specific domain entities, thresholds, integrations, value assumptions, evaluations, and support procedures

## What may compound into the platform or field guide

- Schemas, control patterns, delivery gates, generic tool interfaces, evaluation methods, incident methods, reusable UX patterns, and sanitized failure classes

The boundary matters. FDE learning should improve the platform without extracting customer data or turning one customer's accidental workaround into a universal product feature.

## Distinct proof gates

| Gate | Question |
| --- | --- |
| Technical | Can the system perform the task under representative conditions? |
| Operator | Can users inspect, correct, and complete work in the new surface? |
| Adoption | Do eligible users choose and finish the workflow without harmful workarounds? |
| Business | Does the accepted outcome improve the owned metric under a credible attribution method? |
| Economics | Does realized value exceed full delivery, run, review, support, and recovery cost? |
| Production | Can the team observe, contain, recover, change, support, and retire it? |

A pilot may pass one gate and fail another. Do not collapse them into a demo-success label.

## Architectural non-negotiables

- The model proposes; deterministic controls authorize and commit.
- The operational domain includes state, decisions, actions, security, feedback, and reconciliation—not only retrieved content.
- Interactive delegated and unattended agents use explicit, different actor-identity patterns.
- Read-only tools are assessed for disclosure and open-world capability, not only side effects.
- Egress is bound to operation and credential provenance, not host name alone.
- Workflow state and cross-context handoffs are typed and durable.
- Evaluation reports name the claim, full version/environment manifest, trials, uncertainty, and contamination controls.
- Behavioral configuration changes use per-model/route evaluation, canary, and rollback.
- Production monitoring covers data, workflow, policies, effects, people, outcomes, and cost.
- Customer operation and retirement are designed from the beginning.

## What not to infer

- Palantir's product architecture is not the only way to implement a decision-centric domain model.
- An OpenAI or Anthropic product workflow is not a provider-neutral contract unless its mechanism is separated from the product.
- A conference speaker's scale, quality, or speed metric is not a production threshold.
- Self-review, monitoring, guardrails, and human approval do not replace authorization or source-of-truth verification.
- A successful bootcamp, benchmark, or pilot is not production readiness or realized value.

Evidence: [R26-37 through R26-46](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#fde-delivery-and-operating-model-evidence), [R26-47 through R26-56](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-47), and the [AI Engineer video index](../research/2026-08-07--ai-engineer-production-agent-video-index.md).
