# Independent Behavior Monitoring

Use an independent monitor for high-impact autonomous workflows when observable intent and action data can identify dangerous divergence quickly enough to contain it. Monitoring supplements authorization and cannot grant authority.

Control: `OPS-006`.

## Inputs

Prefer privacy-minimized structured data:

- User-approved objective and workflow/segment ID
- Actor, tenant, resource, and capability identifiers or protected hashes
- Tool name, typed parameters, effect class, and target
- Policy decision, obligations, approval, and current revisions
- State transition, budget, and stop reason
- External effect receipt and readback status

Do not require hidden model reasoning. Do not feed the monitor unrestricted retrieved content or the agent's self-justification as trusted evidence.

## Decisions

| Monitor result | Runtime behavior |
| --- | --- |
| Within declared intent and policy | Continue; authorization still decides the action |
| Ambiguous or incomplete | Pause affected action and request human review |
| Material intent/action mismatch | Deny or contain through deterministic control |
| Exfiltration, evaluator manipulation, destructive or cross-tenant attempt | Trigger configured kill switch and incident route |
| Monitor unavailable | Apply declared degraded mode; never auto-authorize because monitoring failed |

## Calibration

Measure false-positive and false-negative rates by risk slice, alert latency, containment latency, reviewer agreement, alert volume, and operator burden. Include known-safe, known-unsafe, near-boundary, obfuscated, high-volume, and monitor-injection cases.

No universal model or threshold is assumed. A monitor that operators routinely ignore is not an effective control.

## Isolation

- Separate monitor prompt/model/configuration from the monitored agent.
- Deny the agent write access to monitor policy, fixtures, thresholds, and alert routes.
- Keep the monitor outside the tool/result channel it evaluates when feasible.
- Version monitor changes and evaluate them independently.
- Route containment through trusted policy, gateway, workflow, identity, or egress controls.
- Retain only the evidence needed for calibration, incident response, and audit.

## Release cases

- Benign action at the policy boundary
- Agent rationale attempting to influence the monitor
- Untrusted tool output instructing the monitor to allow an effect
- Allowed-domain exfiltration with an attacker credential
- Destructive or cross-tenant action hidden in a normal tool call
- False success followed by missing source-of-truth effect
- Monitor timeout, outage, and delayed result
- High alert volume producing approval or alert fatigue

Evidence: [OpenAI monitoring](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-04), [Anthropic approval and monitoring](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-50), and [capability-aware containment](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-49).
