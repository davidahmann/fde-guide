# Production Implementation Playbook

This playbook turns the library into an execution sequence. Do not advance a phase because the demo looks good; advance when its exit criteria are met.

## Phase 0 — Charter the workflow

**Goal:** prove that the candidate work is worth automating and has a bounded accountability model.

| Define | Minimum artifact |
| --- | --- |
| Business outcome | Baseline, target, metric owner, measurement window |
| Workflow boundary | Trigger, inputs, sources of truth, output artifact, downstream actions |
| Work allocation | Which steps are deterministic, agentic, and human-owned |
| Verifier | Postcondition, reconciliation, policy test, or review rubric |
| Risk | Consequence of a bad recommendation, bad write, data leak, or delay |

**Exit gate:** one narrow workflow has a measurable accepted outcome and a verifier. If the team cannot explain how it will know the result is correct, deploy it as a research or copilot surface—not autonomous execution.

## Phase 1 — Make the environment agent-ready

**Goal:** ensure the systems around the agent can safely serve as tools and contextual resources.

Assess each dependency as both a **resource** (the agent reads it) and a **tool** (the agent changes it). The workflow is constrained by its least-ready dependency. [AWS's Agentic Readiness method](https://aws.amazon.com/blogs/migration-and-modernization/agentic-readiness/) provides a useful lens: interface quality, security posture, data handling, resilience, and observability are separate checks.

| Control | Implementation question |
| --- | --- |
| Source contract | Is the schema typed, documented, versioned, and freshness-aware? |
| Identity | Does the workload have a dedicated identity distinct from the user and service? |
| Authorization | Is every tool/action authorized by policy outside the model? |
| Secrets | Can the tool operate without exposing a credential to the model or sandbox? |
| Egress | Which domains, APIs, and methods are allowed? What proxy enforces this? |
| Write path | Is it read-only, staged, approval-gated, or compensable? |
| Resilience | Are timeouts, idempotency, rate limits, and degradation behavior defined? |
| Observability | Can the team trace request, action, outcome, and policy decision? |

**Exit gate:** every dependency is explicitly approved for the agent's intended role. Do not treat an existing human-facing API as automatically ready for agent-scale access.

## Phase 2 — Build the smallest useful harness

**Goal:** give the agent precise capabilities and no more.

1. Start with a task-scoped tool bundle, not the organization's whole MCP inventory.
2. Expose typed, narrow verbs; deterministic code executes the privileged operation.
3. Load tool documentation progressively when the job requires it.
4. Provide a sandboxed general escape hatch only after specialized tools cover the common path.
5. Build context from authorized sources and preserve citations, revisions, and trust labels.
6. Keep workflow state, approvals, and durable artifacts outside transport sessions.

Cloudflare's 2026 Code Mode is a strong implementation example: it replaces a very large always-loaded endpoint catalog with compact discovery and execution primitives, then runs generated code in a constrained isolate. The portable lesson is not “use JavaScript”; it is to make capability discovery incremental and execution containable. [R26-02](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-02)

**Exit gate:** a reviewer can list every accessible capability, its schema, authorization rule, source owner, and maximum blast radius.

## Phase 3 — Define the work loop and its evidence

**Goal:** create an evidence-based process, not an open-ended conversation.

```text
trigger -> scoped context -> plan -> permitted action -> readback/evidence
        -> verifier -> accept | repair (bounded) | escalate | stop
```

Specify for every loop:

- Measurable goal and evidence threshold
- Allowed actions and tool budget
- Maximum steps, time, model/tool cost, and parallel workers
- Error classes: retryable, optional, terminal, and escalation-required
- State updates allowed before and after verification
- Human question/approval event and resumption behavior
- Stop conditions and compensation/rollback path

Use adaptive retrieval only when the task actually needs it. For a multi-hop question, planning, fan-out, and a sufficiency check can improve evidence coverage. For a simple, stable lookup, a deterministic query is usually faster, safer, and cheaper. [R26-16](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-16)

**Exit gate:** the team can simulate success, a retry, a missing-evidence escalation, a downstream timeout, and a blocked write without improvising the system's response.

## Phase 4 — Build evaluation before autonomy

**Goal:** show that the full system works on realistic conditions and fails safely.

| Evaluation layer | Ask | Typical fixture |
| --- | --- | --- |
| Contract | Did the tool accept and produce valid structured data? | Schema, property, and API contract tests |
| Component | Did retrieval, memory, policy, or planning behave correctly? | Seeded input and expected intermediate state |
| Trajectory | Did the agent choose valid tools and recover correctly? | Full trace with expected actions and stop reason |
| Artifact/outcome | Is the completed work actually correct? | Source-of-truth readback, diff, reconciliation, or rubric |
| Safety | Did it refuse or contain malicious, unauthorized, and malformed inputs? | Prompt injection, tool poisoning, stale-cache, and credential tests |
| Operations | Does it stay within cost, latency, and intervention limits? | Load, failure, budget, and concurrency scenarios |

Prefer replayable world snapshots to live reruns. Datadog's SRE evaluation approach uses incidents as representative environments because live systems drift underneath the agent; AWS similarly emphasizes agent traces and full-system behaviors rather than final answers alone. [R26-01](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-01) [R26-07](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-07)

Also evaluate the evaluator. An agent should not share a mutable trust boundary with the tests or judge that certifies it. Benchmark integrity work in 2026 demonstrated that perfect benchmark scores can coexist with zero useful task completion when test infrastructure is exploitable. [R26-25](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-25)

**Exit gate:** the release suite contains realistic accepted, rejected, ambiguous, failure, and adversarial cases. A regression has a known owner and a reproducible trace.

## Phase 5 — Release in reversible autonomy levels

| Level | Agent behavior | Required controls |
| --- | --- | --- |
| 0. Observe | Collects evidence and drafts an artifact | No external write; trace and review only |
| 1. Recommend | Proposes a decision or staged action | Evidence packet; human approves every commit |
| 2. Execute low-risk | Performs reversible, bounded writes | Postcondition readback; sampled review; rollback |
| 3. Execute high-volume | Handles a narrow class automatically | Strong deterministic verifier; circuit breakers; continuous audit |
| 4. Coordinate | Delegates bounded work across agents/services | Caller authorization propagation; concurrency/merge semantics; per-stage gates |

Move one level at a time and only for a named task segment. An agent can be Level 3 for a reversible classification but Level 0 for an external message or a financial write.

**Exit gate:** the promotion is reversible, measurable, and attributable to an explicit configuration/model/tool version.

## Phase 6 — Operate and improve the system

### Instrument agent-native telemetry

Capture agent and workflow version, initiating identity, source revisions, retrieval, tool calls, tool outcomes, policy decisions, approvals, model routing, cache use, state transitions, cost, latency, final artifact, and postcondition. The 2026 OpenTelemetry updates reinforce that retrieval and tool execution need first-class spans; do not stop at a single model-call trace. [R26-19](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-19)

Balance observability against privacy and cost. High-cardinality or sensitive fields need deliberate sampling, redaction, access control, and retention rather than blanket capture.

### Turn production into an evaluation flywheel

1. Cluster observed behavior by task and tool trajectory.
2. Monitor success, escalation, latency, and cost per cluster.
3. Select new or degraded clusters for review.
4. Convert diagnosed failures into replayable tests.
5. Change one versioned component at a time where possible.
6. Validate offline, shadow, canary, and then promote.

This is more effective than manually reading random traces or tracking a single global score. [R26-17](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-17)

### Runbook for an unsafe or failing run

1. Freeze new writes and pause queued work.
2. Revoke or downscope the workload identity and egress paths if needed.
3. Preserve minimal forensic evidence: trace IDs, versions, policy decisions, source revisions, and affected artifacts.
4. Read back the source of truth; do not trust the agent's completion message.
5. Compensate or roll back only through a preapproved procedure.
6. Classify the failure: context, tool, authorization, loop, concurrency, evaluator, or UX.
7. Add the case to the release suite before re-enabling autonomy.

## Production release contract

- [Production release gates](../operations/release-gates.md)
- [Production control catalog](../controls/control-catalog.json)
- [Agent-system Schema](../schemas/agent-system.schema.json)
- [Tool-contract Schema](../schemas/tool-contract.schema.json)
- [Evaluation-case Schema](../schemas/evaluation-case.schema.json)
- [Threat-model Schema](../schemas/threat-model.schema.json)
