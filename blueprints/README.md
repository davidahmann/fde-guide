# Reference Blueprints

## Selection matrix

| Condition | Default |
| --- | --- |
| Fixed steps, enumerated branches, deterministic rules | Deterministic workflow |
| One workflow needs deliberate routing between rules, optimization, ML, retrieval, foundation models, and human review | [Hybrid intelligence system](hybrid-intelligence-system.md) |
| Variable evidence path, read-only outcome, reliable sufficiency test | [Bounded retrieval agent](bounded-retrieval-agent.md) |
| External mutation, policy constraints, approval or rollback | [Transactional write agent](transactional-write-agent.md) |
| External trigger, long duration, retries, pause/resume | [Event-driven investigation agent](event-driven-investigation-agent.md) |
| Distinct tools, data scopes, permissions, or specialist contexts | [Multi-agent coordinator](multi-agent-coordinator.md) |
| Several production workflows need shared governance and reusable services | [Enterprise agent platform](enterprise-agent-platform.md) |
| Complex or changing systems need navigable software and operational dependency views | [Evidence graph and change intelligence](evidence-graph-and-change-intelligence.md) |
| Iterative analysis needs governed semantics, query/code execution, and claim-level evidence | [Governed data analysis agent](data-analysis-agent.md) |
| Production signals should create isolated, reviewable improvement candidates | [Controlled improvement agent](controlled-improvement-agent.md) |

For recurring enterprise combinations—tenant and identity foundations, integration runtimes, secure AI workloads, or deployment and operations—use the [reference-solution accelerators](../solutions/README.md) after selecting the primary system boundary. They compose these blueprints and canonical templates; they do not replace workflow qualification or release evidence.

## Mandatory design packet

| Artifact | Contract |
| --- | --- |
| Workflow discovery | [`templates/fde-discovery-pack.md`](../templates/fde-discovery-pack.md) |
| Workflow and value decision | [`schemas/workflow-charter.schema.json`](../schemas/workflow-charter.schema.json) |
| Intelligence selection | [`templates/intelligence-selection-record.md`](../templates/intelligence-selection-record.md) |
| System-boundary decision | [`templates/architecture-decision-record.md`](../templates/architecture-decision-record.md) |
| Operational ontology | [`schemas/operational-ontology.schema.json`](../schemas/operational-ontology.schema.json) |
| System map and material-change impact review when justified by complexity | [`schemas/system-map-manifest.schema.json`](../schemas/system-map-manifest.schema.json) and [`schemas/change-impact-assessment.schema.json`](../schemas/change-impact-assessment.schema.json) |
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
  -> deterministic, optimization, ML, retrieval, or human path when sufficient
  -> bounded single agent when path variance requires model judgment
  -> durable execution when time/failure boundaries exceed one request
  -> multiple agents only when context, permission, latency, or ownership boundaries are distinct
```
