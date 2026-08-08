# FDE, Applied AI Engineering, and Production-System Synthesis

This page connects customer-facing FDE work with the internal applied-AI engineering, product, platform, and operations work that makes delivery repeatable. It separates portable lessons from Palantir, OpenAI, Anthropic, and the AI Engineer practitioner corpus; it does not claim that any organization follows one universal method.

The product is a measurable workflow improvement. A rule, optimizer, ML model, foundation-model call, agent, or human-review step is a mechanism selected for one decision—not the product itself.

## Two linked practices, one delivery system

| Practice | Primary responsibility | Durable output |
| --- | --- | --- |
| FDE or delivery | Discover the real work, align stakeholders, prove a narrow outcome, and transfer operating capability | A business-owned workflow with measured value, adoption, and service ownership |
| Applied AI / product engineering | Turn validated delivery needs into usable product surfaces, reusable architecture, and safe engineering defaults | Versioned product, platform, evaluation, release, and operating capabilities |
| Platform, data, and security engineering | Provide dependable source, identity, capability, observability, and release boundaries | Governed services that make safe delivery faster without broadening authority |
| Operations and domain ownership | Define accepted work, supply judgment, adopt the workflow, and own it after delivery | Reliable business operation, feedback, and accountable change decisions |

These roles can sit in one internal team or across a provider and customer boundary. The work stays the same: establish an outcome, redesign the workflow, select the smallest sufficient mechanism, prove it, and operate it. OpenAI's FDE role description spans leaders, operators, domain experts, and engineering teams from discovery through adoption and workflow impact; Palantir's lifecycle begins with the user's operational decision rather than a model or integration. [R26-37] [R26-41]

## Comparative view

| Source | Strongest contribution | Portable implementation |
| --- | --- | --- |
| Palantir | Outcome-led use cases, decision-centric operational model, action/writeback, compatible solution changes, operating ownership and enablement | Model the user's decision through data, logic, action, and security; deliver one operational loop; transfer capability to the customer |
| OpenAI | Specific-job scoping, end-to-end FDE ownership, production adoption and workflow impact, incremental agent architecture, eval feedback into product/model | One team owns discovery through rollout; measure accepted work and adoption; start with the simplest sufficient execution model |
| Anthropic | Eval validity, high-signal context, typed handoffs, separable session/harness/sandbox, containment, per-model behavioral rollout | Treat the harness and environment as part of the system; keep interfaces stable; test claims, trials, contamination, and route-specific change |
| AI Engineer talks | Detailed field reports on native artifacts, tool catalogs, durable state, full-trajectory evals, human interruption, and signal-to-PR improvement | Use talks as leads, preserve attribution, corroborate mechanisms, and validate locally before making a normative control |

## Redesign the work before selecting intelligence

An AI initiative begins by making work legible—not by attaching a model to an existing interface. Observe the path from trigger through decision, evidence, exception, handoff, action, and outcome. Then classify what was observed before encoding it:

| Observed item | Treat it as | Required disposition |
| --- | --- | --- |
| Current fact, record, or metric | Governed evidence | Record source, owner, scope, revision, freshness, and access path |
| Explicit policy or repeatable calculation | Deterministic rule | Validate it with its policy owner and enforce it below the model |
| Professional interpretation under incomplete context | Candidate judgment mechanism | Define evidence, authority ceiling, reviewer, fallback, and evaluation before selecting ML, model, or agent support |
| Workaround, duplicate entry, or side channel | Possible defect or local adaptation | Preserve, repair, remove, or escalate; do not encode it merely because it is common |
| Customer-specific configuration or process detail | Tenant-bound operating context | Keep it with the owning organization; do not promote it to a shared pattern without abstraction and approval |

This is context extraction as verification rather than transcription. Interviews and recordings generate hypotheses; accountable operators and source owners validate what becomes a rule, policy, evaluation case, or reusable pattern. A captured narrative never becomes model instruction or production authority on its own. [R26-39] [R26-41] [R26-56]

Modernize the work around systems of record before requiring a replacement platform. Connect to existing authoritative systems when their data, identity, and change boundaries are sound; treat broken data ownership, permissions, or auditability as readiness blockers rather than features to automate around. This preserves a practical path to value without pretending that brittle foundations are safe to build upon. `FDE-002`, `CTX-001`, `IAM-003`.

## Build the applied product in three connected layers

| Layer | What it contains | Design question |
| --- | --- | --- |
| Workflow and experience | Actors, decisions, evidence, exceptions, systems of record, review surfaces, and outcome feedback | Does this make the operator's real work safer, clearer, and faster? |
| Intelligence | Rules, optimization, ML, retrieval, foundation-model calls, bounded agents, and human review | Which smallest mechanism improves this decision inside its quality, risk, latency, and cost ceiling? |
| Control and evolution | Identity, tool boundaries, state, evaluation, release, telemetry, support, learning, and retirement | Can the team prove, contain, change, and eventually stop this workflow? |

The workflow-native surface is part of the product. A chat answer, score, or dashboard is insufficient when people need a case file, spreadsheet, document, ticket, review table, or operational application that shows evidence, uncertainty, alternatives, current state, and permitted actions. Internal engineering owns the reusable surface and control primitives; operations owns the meaning and use of the decision. `ADP-001`, `ARC-002`.

## The combined FDE method

```text
important customer or internal decision
  -> observed current work and exceptions
  -> measurable accepted outcome and verifier
  -> operational domain: data + logic + action + security
  -> smallest sufficient rules, optimization, ML, model, agent, and human architecture
  -> persistent professional surface
  -> representative replay, shadow, and canary evidence
  -> business-owned service and operating cadence
  -> production signal becomes regression, product learning, or retirement
```

## Separate customer-specific context from reusable practice

For an internal deployment, “customer” below means the business unit or operating team. The boundary is the same.

| Stays with the workflow owner | May compound into product, platform, or this guide |
| --- | --- |
| Business outcome, process policy, data, permissions, user decisions, risk acceptance, service ownership, and confidential operating context | Schemas, control patterns, delivery gates, generic tool interfaces, evaluation methods, incident methods, reusable UX patterns, and sanitized failure classes |
| Workflow-specific domain entities, thresholds, integrations, value assumptions, evaluations, and support procedures | Abstracted decision archetypes, discovery questions, reusable contract shapes, generic evaluation slices, and product gaps validated across independent contexts |

The boundary matters. Field learning should improve the product without extracting customer data or turning one customer's accidental workaround into a universal feature. A candidate pattern becomes reusable only after it is sanitized, recurrence is evidenced without cross-customer data transfer, an owner accepts it, and the normal design, evaluation, release, and rollback gates are satisfied. Use the [field-learning register](../templates/field-learning-register.md) to make that decision explicit. `FDE-004`.

## Make adoption valuable on both sides

Every production workflow has at least two value propositions:

- The executive or operational sponsor needs a measurable outcome, bounded risk, and accountable ownership.
- The operator needs a better work surface: less avoidable search and rework, clearer evidence, control over exceptions, and support when the system is wrong.

Neither is a proxy for the other. Adoption can fail when an executive value case ignores the changed workday; a pleasant interface can fail when it does not improve the owned outcome. Measure both through the separate operator, adoption, business, economics, and production gates below. `FDE-003`, `ADP-001`, `VAL-002`.

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
- Each consequential decision uses the smallest sufficient mechanism—deterministic code, optimization, ML, retrieval, a foundation model, an agent, or human review—and retains the evidence, fallback, and cost rationale.
- Cost is a non-functional requirement; the economic unit is an accepted outcome, not token or tool volume. [R26-63] [R26-64]
- Customer operation and retirement are designed from the beginning.

## What not to infer

- Palantir's product architecture is not the only way to implement a decision-centric domain model.
- An OpenAI or Anthropic product workflow is not a provider-neutral contract unless its mechanism is separated from the product.
- A conference speaker's scale, quality, or speed metric is not a production threshold.
- Self-review, monitoring, guardrails, and human approval do not replace authorization or source-of-truth verification.
- A successful bootcamp, benchmark, or pilot is not production readiness or realized value.
- A practitioner's claimed ROI, efficiency gain, or organizational forecast is not a portfolio target or release criterion without local measurement.
- “AI-native” is not a reason to replace systems of record, remove accountable human judgment, or weaken ordinary software-engineering disciplines.

[R26-63]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-63
[R26-64]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-64

Evidence: [R26-37 through R26-46](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#fde-delivery-and-operating-model-evidence), [R26-47 through R26-56](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-47), [R26-62 through R26-64](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-62), the [AI Engineer video index](../research/2026-08-07--ai-engineer-production-agent-video-index.md), and the [operational-redesign research note](../research/2026-08-08--operational-redesign-and-applied-ai-practice.md).
