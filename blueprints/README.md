# Reference Blueprints

## Selection matrix

| Condition | Default |
| --- | --- |
| Fixed steps, enumerated branches, deterministic rules | Deterministic workflow |
| Variable evidence path, read-only outcome, reliable sufficiency test | [Bounded retrieval agent](bounded-retrieval-agent.md) |
| External mutation, policy constraints, approval or rollback | [Transactional write agent](transactional-write-agent.md) |
| External trigger, long duration, retries, pause/resume | [Event-driven investigation agent](event-driven-investigation-agent.md) |
| Distinct tools, data scopes, permissions, or specialist contexts | [Multi-agent coordinator](multi-agent-coordinator.md) |

## Mandatory design packet

| Artifact | Contract |
| --- | --- |
| Workflow discovery | [`templates/fde-discovery-pack.md`](../templates/fde-discovery-pack.md) |
| Operational ontology | [`schemas/operational-ontology.schema.json`](../schemas/operational-ontology.schema.json) |
| Agent design | [`schemas/agent-system.schema.json`](../schemas/agent-system.schema.json) |
| Tool contract | [`schemas/tool-contract.schema.json`](../schemas/tool-contract.schema.json) |
| Evaluation cases | [`schemas/evaluation-case.schema.json`](../schemas/evaluation-case.schema.json) |
| Threat model | [`schemas/threat-model.schema.json`](../schemas/threat-model.schema.json) |
| Controls | [`controls/control-catalog.json`](../controls/control-catalog.json) |
| Release gate | [`operations/release-gates.md`](../operations/release-gates.md) |

## Architecture escalation rule

```text
workflow
  -> bounded single agent when path variance requires model judgment
  -> durable execution when time/failure boundaries exceed one request
  -> multiple agents only when context, permission, latency, or ownership boundaries are distinct
```
