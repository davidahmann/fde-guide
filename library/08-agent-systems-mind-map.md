# Agent Systems Mind Map

Use this map to understand the dependency structure of a production agent. The central insight is that capability appears only when value, context, control, evidence, and operations work together.

```mermaid
flowchart TD
    A["Production-ready agent"]

    A --> B["1. Valuable workflow"]
    B --> B1["Outcome and owner"]
    B --> B2["Deterministic vs agentic vs human work"]
    B --> B3["Verifier and autonomy level"]

    A --> C["2. Context and knowledge"]
    C --> C1["Sources of truth and freshness"]
    C --> C2["Scope, permissions, provenance"]
    C --> C3["Retrieval portfolio"]
    C --> C4["Sufficiency check and uncertainty"]

    A --> D["3. Harness and action surfaces"]
    D --> D1["Task-scoped typed tools"]
    D --> D2["Progressive capability discovery"]
    D --> D3["Sandbox, egress, and budgets"]
    D --> D4["Explicit workflow state"]

    A --> E["4. Identity and governance"]
    E --> E1["Dedicated agent identity"]
    E --> E2["Caller authorization propagation"]
    E --> E3["Gateway-held secrets"]
    E --> E4["Staged writes and approval"]

    A --> F["5. Evidence loop"]
    F --> F1["Postconditions and readback"]
    F --> F2["Bounded retry and error classes"]
    F --> F3["Human escalation"]
    F --> F4["Rollback or compensation"]

    A --> G["6. Evaluation"]
    G --> G1["Contract and component tests"]
    G --> G2["Trajectory and artifact evaluation"]
    G --> G3["Safety and adversarial tests"]
    G --> G4["Evaluator integrity"]

    A --> H["7. Operations"]
    H --> H1["Trace, version, and provenance"]
    H --> H2["Behavior clusters and drift"]
    H --> H3["Cost per accepted outcome"]
    H --> H4["Pause, recovery, incident runbook"]

    A --> I["8. Scale and orchestration"]
    I --> I1["Bounded fan-out"]
    I --> I2["Idempotency, cancellation, merge"]
    I --> I3["Durable execution and replay"]
    I --> I4["Machine-scale quotas and rate limits"]

    C --> F
    D --> E
    E --> F
    F --> G
    G --> H
    H --> B
    I --> D
```

## Navigation

| Mind-map branch | Practical resource |
| --- | --- |
| System delivery contract | [Agent-system Schema](../schemas/agent-system.schema.json) |
| Operational ontology | [Ontology Schema](../schemas/operational-ontology.schema.json) |
| Architecture topology | [Reference blueprints](../blueprints/README.md) |
| Mandatory controls | [Production control catalog](../controls/control-catalog.json) |
| Valuable workflow | [Product, Process, and Human Collaboration](01-product-process-and-ux.md) |
| Context and knowledge | [Context and Knowledge Systems](02-context-and-knowledge-systems.md) |
| Harness, state, tools, and orchestration | [Agent System Architecture](03-agent-system-architecture.md) |
| Evaluation, governance, safety, and economics | [Production, Evaluation, and Governance](04-production-evaluation-and-governance.md) |
| Design choices and failure modes | [Patterns and Anti-Patterns](06-patterns-and-anti-patterns.md) |
| Implementation sequence | [Production Implementation Playbook](07-production-implementation-playbook.md) |
| Release and rollback | [Production release gates](../operations/release-gates.md) |
| Dated primary evidence | [2026-02-07 to 2026-08-07 Source Ledger](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md) |

## How to use the map in a design review

Start at the center and move clockwise. A branch with no concrete artifact is a design gap:

- No owner or verifier means the workflow is not ready for autonomy.
- No source-of-truth or provenance means context cannot support a consequential decision.
- No scoped identity or staged write means tool use is unsafe by default.
- No postcondition or rollback means the loop cannot prove success or recover.
- No replay suite means apparent performance cannot be trusted.
- No trace or runbook means the agent is not operable.
- No concurrency semantics means parallelism is an uncontrolled source of duplicated work and cost.
