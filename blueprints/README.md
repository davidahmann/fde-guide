# Reference Blueprints

## Selection matrix

| Condition | Default |
| --- | --- |
| Fixed steps, enumerated branches, deterministic rules | Deterministic workflow |
| Variable evidence path, read-only outcome, reliable sufficiency test | [Bounded retrieval agent](bounded-retrieval-agent.md) |
| External mutation, policy constraints, approval or rollback | [Transactional write agent](transactional-write-agent.md) |
| External trigger, long duration, retries, pause/resume | [Event-driven investigation agent](event-driven-investigation-agent.md) |
| Distinct tools, data scopes, permissions, or specialist contexts | [Multi-agent coordinator](multi-agent-coordinator.md) |
| Several production workflows need shared governance and reusable services | [Enterprise agent platform](enterprise-agent-platform.md) |
| Iterative analysis needs governed semantics, query/code execution, and claim-level evidence | [Governed data analysis agent](data-analysis-agent.md) |
| Production signals should create isolated, reviewable improvement candidates | [Controlled improvement agent](controlled-improvement-agent.md) |

## Mandatory design packet

| Artifact | Contract |
| --- | --- |
| Workflow discovery | [`templates/fde-discovery-pack.md`](../templates/fde-discovery-pack.md) |
| Workflow and value decision | [`schemas/workflow-charter.schema.json`](../schemas/workflow-charter.schema.json) |
| Operational ontology | [`schemas/operational-ontology.schema.json`](../schemas/operational-ontology.schema.json) |
| Agent design | [`schemas/agent-system.schema.json`](../schemas/agent-system.schema.json) |
| Versioned behavior configuration | [`schemas/behavior-bundle.schema.json`](../schemas/behavior-bundle.schema.json) |
| Tool contract | [`schemas/tool-contract.schema.json`](../schemas/tool-contract.schema.json) |
| Capability provenance for each admitted build | [`schemas/capability-manifest.schema.json`](../schemas/capability-manifest.schema.json) |
| Delegation handoff when a worker, agent, or context reset is used | [`schemas/handoff-envelope.schema.json`](../schemas/handoff-envelope.schema.json) |
| Evaluation cases | [`schemas/evaluation-case.schema.json`](../schemas/evaluation-case.schema.json) |
| Evaluation report | [`schemas/evaluation-report.schema.json`](../schemas/evaluation-report.schema.json) |
| Threat model | [`schemas/threat-model.schema.json`](../schemas/threat-model.schema.json) |
| Controls | [`controls/control-catalog.json`](../controls/control-catalog.json) |
| Release gate | [`operations/release-gates.md`](../operations/release-gates.md) |
| Compatible release | [`schemas/solution-release.schema.json`](../schemas/solution-release.schema.json) |
| Adoption and handoff | [`templates/delivery-and-adoption-plan.md`](../templates/delivery-and-adoption-plan.md) and [`templates/customer-enablement-handoff.md`](../templates/customer-enablement-handoff.md) |
| Field learning and lifecycle | [`templates/field-learning-register.md`](../templates/field-learning-register.md) and [`templates/production-service-review.md`](../templates/production-service-review.md) |

Build the behavior bundle after the agent design establishes its authority ceiling. Every admitted tool build then needs a tool contract and capability manifest, membership in the bundle, evaluation under that exact bundle, and inclusion in the solution-release digest.

## Architecture escalation rule

```text
workflow
  -> bounded single agent when path variance requires model judgment
  -> durable execution when time/failure boundaries exceed one request
  -> multiple agents only when context, permission, latency, or ownership boundaries are distinct
```
