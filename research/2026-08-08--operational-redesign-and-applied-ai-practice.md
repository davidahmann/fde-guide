# Operational Redesign and Applied-AI Practice Note

**Reviewed:** 2026-08-08
**Use:** Qualitative context for discovery, productization, and adoption. This note does not create controls, universal ROI targets, or release criteria.

## Material reviewed

| Source | Evidence type | What is usable | Boundary |
| --- | --- | --- | --- |
| Annelies Gamble, *The Agent Is Not the Product* | Full text supplied; also indexed as [S15](../library/05-source-index.md#s15) | Process engineering before mechanism selection; distinguish rules, contextual judgment, and human accountability; abstract deployment patterns without copying customer data | Practitioner synthesis and quoted company perspectives, not an independent study |
| Varick, *How to Transform a Company With AI* | Full text supplied; also indexed as [S22](../library/05-source-index.md#s22) | Observe real work, separate context layers, redesign incrementally, and use shadow/supervised operation | Vendor self-description; outcome, efficiency, and accuracy figures are not validated here |
| Aaron Levie, applied-AI layer post | Full text supplied; also indexed as [S23](../library/05-source-index.md#s23) | Workflow-specific context capture, tools, review surfaces, model routing, and change expertise are product concerns | Executive viewpoint; not a technical specification or market proof |
| Mike Fishbein, context-extraction post | Full text supplied; indexed as [S13](../library/05-source-index.md#s13) | FDE spans consulting, product, and engineering; context extraction precedes implementation | Market and fundraising claims are excluded from the guide's recommendations |
| OpenExO, *The Organizational Singularity* | [Direct external reference](https://openexo.com/organizational-singularity) | Human-readable operational narrative plus machine-readable schemas; governed feedback loops; data and workflow architecture as first-class transformation concerns | Prescriptive organizational framework containing forecasts and broad claims; use only the bounded document-design and governance observations |

## Portable synthesis

1. **Start with an observed operational decision.** Model the current trigger, evidence, judgment, action, exception, owner, and verifier before selecting intelligence. This is consistent with the official OpenAI and Palantir use-case guidance recorded in [R26-37](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-37), [R26-39](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-39), and [R26-41](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-41).
2. **Validate context before encoding it.** Treat interviews, recordings, tickets, and documents as evidence candidates. Classify each item as governed fact, policy/rule, professional judgment, workaround, exception, or untrusted content. Owner validation and provenance determine whether it belongs in a source contract, rule, human-review path, evaluation, or nowhere in the system.
3. **Use the smallest sufficient mechanism per decision.** Keep deterministic rules, optimization, ML, retrieval, foundation-model calls, bounded agents, and human review separately observable and replaceable. Existing official guidance supports incremental architecture and high-signal context rather than complexity by default. [R26-40](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-40) [R26-56](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-56)
4. **Treat the workflow-native surface as part of the system.** A useful operational product makes evidence, uncertainty, state, alternatives, and permitted actions inspectable. It does not stop at generated text or a dashboard.
5. **Separate customer context from reusable practice.** Customer data, policies, thresholds, and local workarounds remain with their owner. Reusable interfaces, delivery methods, evaluation mechanics, and failure classes must be sanitized, recurrence-tested, and released through normal product controls. [R26-45](2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-45)
6. **Modernize operationally before migrating by default.** Build around governed systems of record where feasible; make broken data ownership, identity, authorization, auditability, or support capacity explicit remediation work rather than hiding them under an AI layer.
7. **Measure two forms of value.** An operating sponsor needs a measurable outcome and economic case. Operators need a better, controllable workday. Neither proxy proves the other; both require evidence before expansion.

## What this note does not support

- A generic ROI multiple, time-to-value promise, or efficiency target
- Claims that every enterprise needs an agent or platform replacement
- Treating a transcript of tribal knowledge as a safe policy, memory, or training corpus
- Broad predictions about the future structure of firms or the durability of competitive moats
- Replacing ordinary production-software disciplines with an organizational framework

## Repository impact

The synthesis is implemented in the [FDE and applied AI engineering guide](../library/10-fde-and-production-agent-synthesis.md), [field engagement and reframing playbook](../playbooks/00-field-engagement-and-reframing.md), [discovery and value playbook](../playbooks/01-discovery-and-value.md), [solution design and delivery playbook](../playbooks/02-solution-and-delivery.md), [FDE discovery pack](../templates/fde-discovery-pack.md), and [delivery and adoption plan](../templates/delivery-and-adoption-plan.md). The canonical controls are `FDE-001` through `FDE-005`, `ARC-004`, `ARC-005`, `ADP-001`, `CTX-001`, and `CTX-002`.
