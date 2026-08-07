# Start Here: Design a Production-Ready Agent

Use this page at the beginning of a design session. It routes you to the right material and prevents the common failure mode of starting with a model, framework, or multi-agent diagram before the work is understood.

## The eleven design questions

1. What outcome changes if this works, and how will it be measured?
2. What is the smallest workflow that creates that outcome?
3. Which steps are deterministic, agentic, or human-owned?
4. What evidence proves that the workflow completed correctly?
5. Which systems are sources of truth, and how fresh must they be?
6. Is the agent reading, recommending, drafting, or changing an external system?
7. What identity, permissions, approvals, and spending limits apply to each action?
8. What happens when a tool, retrieval, model, or downstream system fails?
9. What trace, artifact, and evidence will a reviewer see?
10. What exact condition lets you increase autonomy—or roll it back?
11. Which realistic, high-risk, and adversarial conditions must the release suite cover?

If any answer is missing, you are still in discovery. Start with [Product, Process, and Human Collaboration](01-product-process-and-ux.md), not implementation.

## Choose a starting path

| Situation | Start here | Do not skip |
| --- | --- | --- |
| You are choosing a workflow or validating ROI | [Product, Process, and Human Collaboration](01-product-process-and-ux.md) | A cheap verifier and named outcome owner |
| The agent needs company knowledge or data | [Context and Knowledge Systems](02-context-and-knowledge-systems.md) | Source ownership, freshness, scope, and evidence provenance |
| The agent will use tools, code, browser, or APIs | [Agent System Architecture](03-agent-system-architecture.md) | Identity, sandbox, structured contracts, idempotency, and budgets |
| The agent will write to production systems | [Production, Evaluation, and Governance](04-production-evaluation-and-governance.md) | Staged writes, approval gates, rollback, audit, and kill switch |
| You need to build or repair a release suite | [Evaluation Corpus and Review Loops](09-evaluation-corpus-and-review-loops.md) | Scenario contracts, slice coverage, evaluator isolation, and independent retests |
| You need a concrete design sequence | [Production Implementation Playbook](07-production-implementation-playbook.md) | Exit criteria for every phase |
| You are debugging a weak or unsafe system | [Patterns and Anti-Patterns](06-patterns-and-anti-patterns.md) | Fix the owning layer rather than blaming the model |
| You need the whole system in one view | [Agent Systems Mind Map](08-agent-systems-mind-map.md) | The dependencies between context, control, evidence, and operations |

## The minimum viable production agent

Do not begin with a general autonomous worker. Begin with one bounded workflow that has:

- One accountable owner and a measurable accepted outcome
- A defined input contract and a limited set of source systems
- A task-scoped tool bundle with typed parameters
- An explicit agent or workload identity with least privilege
- Isolated execution, controlled egress, and no model-visible secrets
- An externally enforced write policy: read-only, staged, or approval-gated
- A deterministic or human-reviewable postcondition
- A trace containing source evidence, tool calls, policy decisions, and final artifact
- A retry budget, timeout, escalation path, and rollback or compensation plan
- A replayable evaluation case before it reaches real users

This is intentionally narrower than most “agent platform” demos. Narrow scope is a feature: it makes failure visible, recovery tractable, and the evidence meaningful.

## Canonical artifact pack

| Artifact | Contract/template |
| --- | --- |
| Workflow discovery | [FDE discovery pack](../templates/fde-discovery-pack.md) |
| Operational domain | [Ontology template](../templates/operational-ontology.json) |
| System design | [Agent-system template](../templates/agent-system.json) |
| Tool boundary | [Tool-contract template](../templates/tool-contract.json) |
| Release case | [Evaluation-case template](../templates/evaluation-case.json) |
| Threat boundary | [Threat-model template](../templates/threat-model.json) |
| Design decision | [Architecture decision record](../templates/architecture-decision-record.md) |
| Production promotion | [Release gates](../operations/release-gates.md) |

## Production-ready means all four are true

| Dimension | Question | Evidence |
| --- | --- | --- |
| Valuable | Does it improve a business outcome? | Outcome metric and baseline |
| Reliable | Can it reach and prove the desired state? | Replay suite, postconditions, sampled review |
| Safe | Can it be contained when inputs or behavior are hostile? | Scoped identity, sandbox, egress, staged writes |
| Operable | Can a team diagnose, pause, recover, and improve it? | Traces, dashboards, runbook, rollback, ownership |

An agent that is only capable is a demo. An agent that is valuable, reliable, safe, and operable is a production system.
