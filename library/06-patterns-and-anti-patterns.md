# Production Patterns and Anti-Patterns

Canonical machine-readable catalog: [`patterns/pattern-catalog.json`](../patterns/pattern-catalog.json).

This is the implementation pattern library. Each pattern is phrased as a decision, not a framework preference. The evidence links point to the six-month research ledger, which records source quality and caveats.

## High-leverage patterns

| Pattern | Use it when | Implementation move | Evidence |
| --- | --- | --- | --- |
| **Start from a verifier** | A workflow could change a record, notify a customer, deploy code, or make a decision | Define postconditions before prompting: tests, reconciliations, policy checks, evidence schema, or an approver | [R26-01](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-01), [R26-07](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-07) |
| **Replay representative worlds** | Live state changes quickly or failures are expensive to reproduce | Capture sanitized world snapshots, reset state, and evaluate the full trajectory and artifact | [R26-07](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-07), [R26-24](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-24) |
| **Progressive capability discovery** | The tool catalog is large or specialized | Expose a compact `search`/`describe`/`execute` surface; load only the schema and docs needed for this task | [R26-02](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-02) |
| **Treat retrieved and tool content as tainted** | The agent reads web pages, tickets, telemetry, code, or third-party APIs | Preserve provenance; filter or classify untrusted content; never elevate tool output to instructions or authority | [R26-09](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-09), [R26-18](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-18) |
| **Use explicit sufficiency checks for retrieval** | The task needs multi-hop or cross-corpus evidence | Plan, retrieve, inspect coverage, rewrite the query if needed, and stop only when the evidence threshold is met | [R26-16](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-16), [R26-23](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-23) |
| **Give every run an agent identity** | The agent invokes tools or delegates to other agents | Use a workload identity distinct from user and service identities; propagate the initiating user's authorization as a constraint | [R26-11](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-11), [R26-15](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-15), [R26-27](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-27) |
| **Stage and vet writes** | An output creates a commit, payment, ticket, message, or state change | Separate propose, validate, approve, and commit; default reviewers to non-mutating actions | [R26-03](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-03), [R26-26](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-26) |
| **Put secrets behind a gateway** | A tool needs a credential or privileged API access | Keep secrets in a trusted broker; exchange short-lived scoped credentials through a policy-controlled egress path | [R26-08](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-08), [R26-03](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-03) |
| **Commit only reviewed state** | A system stores memory, artifacts, or shared conclusions | Apply guardrails and approval before persistence; label evidence with provenance and trust level | [R26-28](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-28), [R26-06](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-06) |
| **Design concurrency as a protocol** | Work is delegated or parallelized | Bound fan-out, make effects idempotent, propagate cancellation, define merge rules, and confirm results in comparable environments | [R26-10](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-10), [R26-29](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-29), [R26-31](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-31) |
| **Observe behavior segments, not only runs** | Agents serve varied users or workflows | Cluster trajectories by intent and tool pattern; compare quality, latency, cost, and escalation rate per cluster; turn new clusters into test cases | [R26-17](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-17) |
| **Optimize cost per accepted outcome** | A system has retries, tools, human review, or multiple models | Attribute model, tool, compute, wait, and reviewer cost to accepted work; set a budget and stopping rule | [R26-22](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-22), [R26-21](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-21) |

## Anti-patterns to reject in design review

| Anti-pattern | Why it fails | Replace it with |
| --- | --- | --- |
| **“Give it every tool so it can handle anything.”** | Tool definitions consume context, create selection ambiguity, and widen the attack surface. | Progressive discovery, task-scoped bundles, compact primitives, and a sandboxed general escape hatch. |
| **“The prompt says not to do that.”** | Prompt injection, tool output, and model drift can bypass instructions. | Deterministic authorization, sandbox limits, egress policy, write staging, and approval gates. |
| **“The sandbox has no direct Internet, so it is safe.”** | Proxies, package registries, trusted sidecars, and permitted tools can become escape or exfiltration paths. | Threat-model every outbound path, broker credentials, log anomalous behavior, and test containment. |
| **“The benchmark pass rate proves readiness.”** | Benchmarks can be irrelevant to the workflow or gameable by agents that share the evaluator's trust boundary. | Artifact and trajectory evaluation, evaluator isolation, real-world replay cases, and sampled human review. |
| **“Store the result as memory; we will fix it later.”** | Unapproved or poisoned conclusions compound through future runs. | Guardrail and approval gates before state persistence; provenance and invalidation rules. |
| **“Parallel agents will make it better.”** | Fan-out changes search behavior, creates duplicated effects, burns budget, and makes cancellation/merge semantics critical. | Explicit concurrency caps, idempotency keys, cancellation propagation, and confirmation runs. |
| **“One global success rate is enough.”** | Aggregate metrics hide poor performance on new or rare but consequential workflow classes. | Behavioral clustering, per-segment metrics, and regression cases for newly discovered patterns. |
| **“MCP is our workflow state machine.”** | Transport sessions, caches, and request IDs are not durable business state or approval history. | Keep workflow state in an explicit durable layer; use MCP as a scoped tool protocol. |
| **“The agent can access the same secrets as the service.”** | A prompt-injected model can read environment variables, files, logs, or configuration and exfiltrate them. | No model-visible secrets, dedicated workload identity, gateway-held credentials, and short-lived tokens. |
| **“Retry until done.”** | It turns uncertainty into unbounded cost, repeated unsafe actions, and opaque degradation. | Evidence-based exits, bounded retries, error taxonomy, escalation, and circuit breakers. |
| **“Ship first; add audit later.”** | Missing traces and provenance make incidents irreproducible and prevent trustworthy improvement. | Agent-native telemetry from the first controlled deployment. |

## Fast failure diagnosis

| Symptom | Most likely owning layer | First check |
| --- | --- | --- |
| Agent selected an irrelevant tool | Context/tool design | Scope, descriptions, tool loading, and task classification |
| Agent did the right action with the wrong authorization | Identity/policy | Caller identity propagation, per-tool scope, gateway decision |
| Agent appears successful but the business state is wrong | Verification/evaluation | Postcondition, source-of-truth readback, artifact integrity |
| Costs or latency spike unpredictably | Loop/concurrency | Retry budget, fan-out, cache behavior, tool wait, model routing |
| A new user workflow fails despite a good global metric | Observability/evaluation | Behavior cluster, missing replay case, hidden assumption |
| A worker continues after another fails | Concurrency/durability | Cancellation propagation, idempotency, merge and rollback contract |
| Model output or telemetry becomes an instruction | Trust boundary | Taint handling, prompt injection control, content-to-action policy |

## The non-negotiable rule

**An LLM may propose an action; deterministic systems decide whether, with which identity, in which environment, and under what evidence it may execute.**
