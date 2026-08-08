# Agent Systems Mind Map

Use this map to understand the dependency structure of a production agent. The central insight is that capability appears only when value, context, control, evidence, and operations work together.

```mermaid
flowchart TD
    A["Production-ready agent"]

    A --> B["1. Customer workflow and value"]
    B --> B1["Observed work, baseline, outcome"]
    B --> B2["Decision, action, and owner"]
    B --> B3["Verifier and value hypothesis"]

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
    D --> D5["Capability provenance and lifecycle"]

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

    A --> H["7. Adoption and operations"]
    H --> H1["Trace, version, and provenance"]
    H --> H2["Adoption, override, and review load"]
    H --> H3["Behavior, value, and full cost"]
    H --> H4["Customer owner, recovery, retirement"]
    H --> H5["Governed field-learning loop"]

    A --> I["8. Scale and orchestration"]
    I --> I1["Bounded fan-out"]
    I --> I2["Idempotency, cancellation, merge"]
    I --> I3["Durable execution and replay"]
    I --> I4["Machine-scale quotas and rate limits"]
    I --> I5["Typed, expiring handoffs"]

    A --> J["9. Release and lifecycle"]
    J --> J1["Compatible solution manifest"]
    J --> J2["Shadow, canary, and approval gates"]
    J --> J3["Rollback and kill switches"]
    J --> J4["Improve, expand, or retire"]

    C --> F
    D --> E
    E --> F
    F --> G
    G --> H
    H --> B
    I --> D
    J --> H
```

## Navigation

| Mind-map branch | Practical resource |
| --- | --- |
| FDE lifecycle | [Discovery, delivery, and operation playbooks](../playbooks/README.md) |
| Workflow and value charter | [Workflow-charter Schema](../schemas/workflow-charter.schema.json) |
| System delivery contract | [Agent-system Schema](../schemas/agent-system.schema.json) |
| Operational ontology | [Ontology Schema](../schemas/operational-ontology.schema.json) |
| Architecture topology | [Reference blueprints](../blueprints/README.md) |
| Mandatory controls | [Production control catalog](../controls/control-catalog.json) |
| Customer workflow and value | [Discovery and Value](../playbooks/01-discovery-and-value.md) |
| Context and knowledge | [Context and Knowledge Systems](02-context-and-knowledge-systems.md) |
| Harness, state, tools, and orchestration | [Agent System Architecture](03-agent-system-architecture.md) |
| Capability admission and lifecycle | [Capability supply chain](../operations/capability-supply-chain.md) and [capability-manifest Schema](../schemas/capability-manifest.schema.json) |
| Typed delegation | [Handoff-envelope Schema](../schemas/handoff-envelope.schema.json) and [multi-agent coordinator](../blueprints/multi-agent-coordinator.md) |
| Evaluation, governance, safety, and economics | [Production, Evaluation, and Governance](04-production-evaluation-and-governance.md) |
| Design choices and failure modes | [Patterns and Anti-Patterns](06-patterns-and-anti-patterns.md) |
| Implementation sequence | [Production Implementation Playbook](07-production-implementation-playbook.md) |
| Compatible release and rollback | [Solution-release Schema](../schemas/solution-release.schema.json) and [production release gates](../operations/release-gates.md) |
| Adoption, customer ownership, and field learning | [Operate and Scale](../playbooks/03-operate-and-scale.md) and [field-learning register](../templates/field-learning-register.md) |
| Dated primary evidence | [2026-02-07 to 2026-08-07 Source Ledger](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md) |

## How to use the map in a design review

Start at the center and move clockwise. A branch with no concrete artifact is a design gap:

- No observed workflow, baseline, owner, or verifier means the workflow is not ready for delivery.
- No source-of-truth or provenance means context cannot support a consequential decision.
- No scoped identity or staged write means tool use is unsafe by default.
- No postcondition or rollback means the loop cannot prove success or recover.
- No replay suite means apparent performance cannot be trusted.
- No trace or runbook means the agent is not operable.
- No adoption evidence or receiving service owner means the engagement is not ready for handoff.
- No concurrency semantics means parallelism is an uncontrolled source of duplicated work and cost.
- No capability provenance or lifecycle means the runtime cannot prove which admitted build held authority.
- No typed handoff means delegation can lose provenance, budgets, caller ceilings, and unresolved work.
- No compatible release manifest or rollback evidence means production change cannot be reviewed or reversed as one system.
- No governed field-learning record means production evidence cannot safely drive improvement or retirement.
