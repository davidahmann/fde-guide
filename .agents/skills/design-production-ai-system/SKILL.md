---
name: design-production-ai-system
description: Design a production AI-enabled system after its workflow, value, and intelligence choices are approved. Use for architecture, domain and state modeling, model behavior, context, tools, human review, security boundaries, delivery planning, or a complete design packet.
---

# Design a Production AI System

Translate an approved workflow into the smallest coherent software system. Preserve deterministic boundaries even when a model or agent is selected.

## Read first

1. Confirm the workflow charter, value case, and intelligence-selection record are complete enough to design.
2. Read [Solution Design and Delivery](../../../playbooks/02-solution-and-delivery.md), the [production implementation playbook](../../../library/07-production-implementation-playbook.md), and the [blueprint selector](../../../blueprints/README.md).
3. Follow the canonical artifact order in [AGENTS.md](../../../AGENTS.md).
4. Apply `ARC-001` through `ARC-005`, `DEL-001`, `CTX-001` through `CTX-005`, `STA-001` through `STA-003`, `HUM-001` through `HUM-003`, and the applicable identity, tool, security, reliability, operations, and cost controls.

## Workflow

1. Define the system boundary, trust boundaries, users, service owners, deployment topology, dependencies, and persistent user surface.
2. Model domain objects, lifecycle states, actions, policies, evidence, identity, and sources of truth in the operational ontology.
3. Map each decision to its selected mechanism. Define explicit state, retries, deadlines, cancellation, failure, escalation, rollback, and retirement behavior.
4. When model behavior is selected, bind its model route, prompt, harness, context policy, guardrails, runtime compatibility, tools, and capability manifests in one versioned behavior bundle.
5. Give every read or effect a narrow typed boundary. Separate read, stage, commit, administrative, and destructive operations.
6. Draft the threat model and evaluation cases together. Design persistent review surfaces and start adoption and handoff work during the pilot.
7. Define the compatible release unit and the evidence needed at each release gate.

## Output contract

Return the smallest complete packet applicable to the workflow: ADRs, ontology, system design, behavior bundle when needed, tool and capability contracts, handoff contract when delegated, threat model, evaluation plan, adoption plan, release plan, and operating ownership.

Do not begin with a framework or multi-agent topology. Do not hide unresolved authority, source-of-truth, verifier, or ownership questions inside prompts or future implementation work.
