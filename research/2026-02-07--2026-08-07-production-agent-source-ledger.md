# Latest-Six-Month Production-Agent Source Ledger

Research window: **2026-02-07 to 2026-08-07**.

This is a curated implementation database, not a popularity list. It favors primary specifications, engineering evidence, reproducible research, security publications, and concrete first-party operating reports. Vendor claims are kept as patterns to test, not universal performance promises.

## Evidence hierarchy

| Tier | Admission rule | How to use it |
| --- | --- | --- |
| A — Primary implementation evidence | Official specification, release, security advisory, incident report, or engineering post | Can support a concrete control or design pattern |
| B — Reproducible research | Public methodology, code, benchmark, or inspectable evaluation artifact | Use to shape evaluation and threat models; verify fit locally |
| C — First-party field report | Identifiable practitioner or company shares specific implementation and review practices | Use as a practical lead; do not generalize performance claims |
| D — News/community lead | Reputable reporting or social/community discussion without enough primary detail | Track or use to find the primary source; not core guidance on its own |

## Core evidence

<a id="r26-01"></a>
### R26-01 — AWS: Evaluating AI agents

- **Date:** 2026-02-18
- **Type / tier:** Company engineering; A
- **Source:** [Evaluating AI agents: Real-world lessons from building agentic systems at Amazon](https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/)
- **Finding:** Agent evaluation needs model, component, and end-to-end layers. Tool selection, memory retrieval, multi-step behavior, and task completion belong in the evaluation surface, not just final text.
- **Portable pattern:** Evaluate full traces and artifacts; use sampled human audits and regression notifications.
- **Anti-pattern:** Final-answer-only scores that cannot explain a behavioral regression.

<a id="r26-02"></a>
### R26-02 — Cloudflare: Code Mode for large MCP surfaces

- **Date:** 2026-02-20
- **Type / tier:** Company implementation; A
- **Source:** [Code Mode: better tools for agents](https://blog.cloudflare.com/code-mode-mcp/)
- **Finding:** Cloudflare reports that representing 2,500 endpoints as always-loaded tool definitions would consume roughly 1.17 million tokens. Its alternative exposes compact search and execution primitives, progressively discovers typed API operations, and runs generated JavaScript in a restricted V8 isolate.
- **Portable pattern:** Progressive capability discovery; compact composable primitives; constrained execution environment.
- **Anti-pattern:** Flat, always-loaded tool catalogs that waste context and degrade selection quality.
- **Caveat:** The token figure is implementation-specific; test the threshold in your own tool ecosystem.

<a id="r26-03"></a>
### R26-03 — GitHub: security architecture for Agentic Workflows

- **Date:** 2026-03-09
- **Type / tier:** Company security engineering; A
- **Source:** [Under the hood: Security architecture of GitHub Agentic Workflows](https://github.blog/ai-and-ml/generative-ai/under-the-hood-security-architecture-of-github-agentic-workflows/)
- **Finding:** GitHub explicitly assumes an agent may read/write state it should not, communicate through unintended channels, and abuse legitimate channels. Its controls center on defense in depth, no model access to secrets, staged/vetted writes, and comprehensive logs.
- **Portable pattern:** Container isolation, controlled egress, trusted gateway-held credentials, staged writes, safe outputs, and auditability.
- **Anti-pattern:** Treating prompt instructions as authorization or putting agent and secret-bearing processes in one trust domain.

<a id="r26-04"></a>
### R26-04 — OpenAI: monitoring internal coding-agent misalignment

- **Date:** 2026-03-19
- **Type / tier:** Primary safety publication; A
- **Source:** [How we monitor internal coding agents for misalignment](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/)
- **Finding:** Monitor agent actions and tool output for behavior inconsistent with the intended task, with escalation and blocking controls for consequential or irreversible actions.
- **Portable pattern:** Behavior monitoring tied to explicit task intent and enforced action controls.
- **Anti-pattern:** Relying on user reports or post-hoc review alone.
- **Caveat:** The results are self-reported and rely on trajectory access most teams should privacy-minimize; record structured action events rather than indiscriminately storing private reasoning.

<a id="r26-05"></a>
### R26-05 — Kaxil Naik: reviewable agentic software delivery

- **Date:** 2026-03-27
- **Type / tier:** First-party practitioner field report on X; C
- **Source:** [X post](https://x.com/kaxil/status/2037503513350005134)
- **Finding:** The described workflow combines versioned skills, hooks, CLIs/MCP, permission-isolated subagents, full E2E/UI checks, screenshots, and human verification.
- **Portable pattern:** Encode repeatable judgment in versioned skills; use hooks for enforcement; require visible evidence before merge.
- **Anti-pattern:** Treating an agent-created PR or superficial test pass as production readiness.

<a id="r26-06"></a>
### R26-06 — GitHub: integrity-aware cache and audit diff

- **Date:** 2026-03-30
- **Type / tier:** Official engineering update; A
- **Source:** [GitHub Agentic Workflows weekly update](https://github.github.com/gh-aw/blog/2026-03-30-weekly-update/)
- **Finding:** Cache entries are separated by trust/integrity state (`merged`, `approved`, `unapproved`, `none`). The project also uses read-only/no-secret defaults and compares firewall activity, tool calls, token use, and duration between versions.
- **Portable pattern:** Carry trust labels into cached context and regression-test policy behavior as well as final output.
- **Anti-pattern:** Allowing untrusted text to contaminate trusted memory or comparing versions only by prose output.

<a id="r26-07"></a>
### R26-07 — Datadog: replayable SRE-agent evaluations

- **Date:** 2026-04-07
- **Type / tier:** Company engineering; A
- **Source:** [Building an eval platform for autonomous SRE agents](https://www.datadoghq.com/blog/engineering/bits-ai-eval-platform/)
- **Finding:** Real incidents become replayable world snapshots and representative labels; full workflow evaluation is more useful than isolated tool tests or live reruns because production state changes underneath the investigation.
- **Portable pattern:** Sanitized world snapshots, full-trace evaluation, and regression testing each change against the representative suite.
- **Anti-pattern:** Rerunning investigations on live state or certifying a system through isolated tool tests only.

<a id="r26-08"></a>
### R26-08 — Cloudflare: identity-aware sandbox authentication

- **Date:** 2026-04-13
- **Type / tier:** Company security engineering; A
- **Source:** [Sandbox auth: securing AI workloads](https://blog.cloudflare.com/sandbox-auth/)
- **Finding:** Treat agent workloads as untrusted and route outbound requests through a controllable egress proxy. Exchange workload identity for short-lived, scoped credentials rather than mounting static keys.
- **Portable pattern:** Workload identity + egress broker + short-lived downscoped credential.
- **Anti-pattern:** Static broad API keys in environment variables, container files, or model-visible configuration.

<a id="r26-09"></a>
### R26-09 — Google: prompt injections in the wild

- **Date:** 2026-04-23
- **Type / tier:** Security research; A
- **Source:** [Prompt injections in the wild](https://blog.google/security/prompt-injections-web/)
- **Finding:** Browsed and retrieved content is an untrusted-input boundary. Signature-only detection creates unmanageable false positives; the described approach uses candidate retrieval, model classification, and human validation.
- **Portable pattern:** Taint/provenance handling for external content, layered detection, and human review for ambiguous security findings.
- **Anti-pattern:** Treating web, ticket, telemetry, or tool output as trusted instruction context.

<a id="r26-10"></a>
### R26-10 — Google ADK: concurrency and input-hardening fixes

- **Date:** 2026-05-01
- **Type / tier:** Official SDK release; A
- **Source:** [ADK Python v1.32.0](https://github.com/google/adk-python/releases/tag/v1.32.0)
- **Finding:** The release fixes nested-YAML RCE, SSRF/local-file access, credential race/data leakage, duplicate tool execution, parallel sibling cancellation, crashes, and state merging.
- **Portable pattern:** Validate configuration/URLs, isolate credentials per invocation, make tools idempotent, cancel siblings on failure, and specify merge behavior.
- **Anti-pattern:** Shared credential context, unrestricted URL/file tools, implicit re-execution, and parallel work that survives an upstream failure.

<a id="r26-11"></a>
### R26-11 — Google Cloud: dedicated agent identity

- **Date:** 2026-05-06
- **Type / tier:** Company security engineering; A
- **Source:** [What's new in IAM: Security, governance, and runtime defense](https://cloud.google.com/blog/products/identity-security/whats-new-in-iam-security-governance-and-runtime-defense)
- **Finding:** Agents need cryptographically protected, attested, agent-specific identities distinct from human identities and generic service accounts, including when acting on behalf of a user.
- **Portable pattern:** First-class workload/agent principal plus agent-specific authorization policy.
- **Anti-pattern:** Reusing a broad human or application credential as an agent's permanent identity.

<a id="r26-12"></a>
### R26-12 — Microsoft Security: prompts become shells

- **Date:** 2026-05-07
- **Type / tier:** Vulnerability research; A
- **Source:** [Prompts become shells: RCE vulnerabilities in AI agent frameworks](https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/)
- **Finding:** A tool visible to the model is an executable security boundary. Prompt injection paired with unsafe tool/plugin exposure can turn a search or retrieval surface into a route to privileged functions.
- **Portable pattern:** Keep sensitive operations unavailable to the model; invoke privileged actions through deterministic, policy-enforced code.
- **Anti-pattern:** Allowing an LLM-accessible tool surface to reach dangerous functions by default.

<a id="r26-13"></a>
### R26-13 — MCP Registry: verified tool provenance

- **Date:** 2026-05-12
- **Type / tier:** Official registry release/repository; A
- **Source:** [MCP Registry v1.7.9](https://github.com/modelcontextprotocol/registry/releases/tag/v1.7.9) and [publisher verification design](https://github.com/modelcontextprotocol/registry)
- **Finding:** Publisher namespace ownership can be verified through GitHub OAuth/OIDC or DNS/HTTP. The release moved OCI validation toward fail-closed behavior during upstream rate limits.
- **Portable pattern:** Verify ownership/provenance before admitting a tool and fail closed when trust cannot be established.
- **Anti-pattern:** Installing a server solely from a familiar-looking name or treating validation outages as approval.

<a id="r26-14"></a>
### R26-14 — AWS: Agentic Readiness

- **Date:** 2026-05-27
- **Type / tier:** Company engineering; A
- **Source:** [Agentic Readiness: a method for evaluating applications for agent interaction](https://aws.amazon.com/blogs/migration-and-modernization/agentic-readiness/)
- **Finding:** An application must be evaluated separately as a read resource and an action tool. At workflow level, the least-ready dependency constrains agent reliability.
- **Portable pattern:** Assess interfaces, security, data handling, operational resilience, and observability before integration.
- **Anti-pattern:** Assuming that a human-facing API is automatically suitable for agent-scale reads or writes.

<a id="r26-15"></a>
### R26-15 — AWS: AgentOps at scale

- **Date:** 2026-06-01
- **Type / tier:** Company engineering; A
- **Source:** [AgentOps: Operationalize agentic AI at scale](https://aws.amazon.com/blogs/machine-learning/agentops-operationalize-agentic-ai-at-scale-with-amazon-bedrock-agentcore/)
- **Finding:** Version agent, tool, and memory configurations; evaluate at tool, turn, session, and system levels; propagate initiating-user authorization across multi-agent hops.
- **Portable pattern:** Version all behavioral configuration and constrain delegates to the caller's authorization.
- **Anti-pattern:** Unversioned memory/configuration or downstream agents that quietly acquire broader permissions.

<a id="r26-16"></a>
### R26-16 — Google Research: agentic RAG

- **Date:** 2026-06-05
- **Type / tier:** Research/engineering; A
- **Source:** [Unlocking dependable responses with agentic RAG](https://research.google/blog/unlocking-dependable-responses-with-gemini-enterprise-agent-platforms-agentic-rag/)
- **Finding:** Multi-hop, cross-corpus retrieval benefits from planning, query rewriting, source fan-out, and an explicit evidence-sufficiency check before synthesis.
- **Portable pattern:** Adaptive retrieval with a bounded sufficiency test for genuinely complex questions.
- **Anti-pattern:** One-shot retrieval followed by confident synthesis from partial evidence.
- **Caveat:** Vendor-reported uplift is not a general expectation; deterministic queries remain preferable for stable lookups.

<a id="r26-17"></a>
### R26-17 — Datadog: behavior-pattern observability

- **Date:** 2026-06-09
- **Type / tier:** Company engineering; A
- **Source:** [Patterns for agent observability](https://www.datadoghq.com/blog/patterns-agent-observability/)
- **Finding:** Cluster production trajectories into behavioral patterns and attach quality, tool calls, latency, and cost to each segment. New behavior clusters can seed new tests.
- **Portable pattern:** Segment-level monitoring and a production-failure-to-evaluation loop.
- **Anti-pattern:** Global averages or manual trace review alone.

<a id="r26-18"></a>
### R26-18 — CSA: Agentjacking through untrusted telemetry

- **Date:** 2026-06-12
- **Type / tier:** Security research note; B
- **Source:** [CSA research note: Agentjacking MCP/Sentry injection](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)
- **Finding:** A malicious-looking monitoring event can become indirect prompt injection when a coding agent consumes telemetry under a developer's authority.
- **Portable pattern:** Treat telemetry/tool output as untrusted; deny-by-default egress, action approval, scoped credentials, and credential-read restrictions must be enforced outside the model.
- **Anti-pattern:** Prompt-only policy or granting developer identity to an agent that consumes attacker-controlled observations.

<a id="r26-19"></a>
### R26-19 — OpenTelemetry: GenAI telemetry schema evolution

- **Date:** 2026-06-12
- **Type / tier:** Cross-vendor observability standard; A
- **Source:** [OpenTelemetry Semantic Conventions v1.42.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0)
- **Finding:** GenAI telemetry evolves independently; migration requires deliberate schema-version handling, and high-cardinality network attributes can create unbounded metrics.
- **Portable pattern:** Version telemetry schemas and treat sensitive/high-cardinality attributes as explicit cost and privacy decisions.
- **Anti-pattern:** Mixing schema versions or emitting all possible trace dimensions by default.

<a id="r26-20"></a>
### R26-20 — AWS: trace-level failure detection

- **Date:** 2026-06-15
- **Type / tier:** Company engineering; A
- **Source:** [AI Agent Failure Detection and Root Cause Analysis with Strands Evals](https://aws.amazon.com/blogs/machine-learning/ai-agent-failure-detection-and-root-cause-analysis-with-strands-evals/)
- **Finding:** A score shows that performance changed but does not locate the failure. Trace/span analysis can classify failures, link root causes to symptoms, and identify whether a prompt or tool definition needs change.
- **Portable pattern:** Separate “how well” evaluation from “why” diagnosis; maintain a failure taxonomy.
- **Anti-pattern:** Requiring senior engineers to inspect every failing trace manually at scale.

<a id="r26-21"></a>
### R26-21 — PagerDuty: production-agent operational metrics and UX

- **Date:** 2026-06-11
- **Type / tier:** Company engineering; A
- **Source:** [Production AI agents: closing the gaps between idea and reality](https://www.pagerduty.com/eng/production-ai-agents-closing-the-gaps-between-idea-and-reality/)
- **Finding:** Measure task success, groundedness, retry/loop rate, plan length, cost per success, safety violations, and human escalation. Show structured plan/step/status progress rather than hiding long-running work behind chat.
- **Portable pattern:** Operational metrics plus visible, interruptible progress artifacts.
- **Anti-pattern:** Silent spinner/chat-only UX or treating one agent's unverified hypothesis as durable fact for another.

<a id="r26-22"></a>
### R26-22 — OpenAI: cost per accepted outcome

- **Date:** 2026-07-14
- **Type / tier:** Company operating guidance; A
- **Source:** [Managing AI investments in the agentic era](https://openai.com/index/managing-ai-investments-in-agentic-era/)
- **Finding:** A useful cost view includes models, tools, retries, latency, and human review; optimize cost per accepted outcome rather than token volume or headline model price.
- **Portable pattern:** Scope tools, reuse context, enforce stopping conditions, and attribute all execution costs to an accepted unit of work.
- **Anti-pattern:** Choosing the cheapest model when correction and retries make it more expensive end-to-end.

<a id="r26-23"></a>
### R26-23 — Google Cloud: evaluate a capability curve

- **Date:** 2026-07-10
- **Type / tier:** Company research/engineering; A
- **Source:** [Who evaluates the evaluations? Measuring agent performance](https://cloud.google.com/blog/products/data-analytics/evaluate-agent-performance)
- **Finding:** Vary query specificity systematically to locate where discovery and retrieval fail; a single pass/fail score or subjective “easy/hard” label does not reveal the capability boundary.
- **Portable pattern:** Capability curves with reproducible task dimensions.
- **Anti-pattern:** Static benchmark scores that hide retrieval, context, or ambiguity thresholds.

<a id="r26-24"></a>
### R26-24 — AWS: aws-bench

- **Date:** 2026-07-24
- **Type / tier:** Official benchmark announcement; A
- **Source:** [AWS announces aws-bench](https://aws.amazon.com/about-aws/whats-new/2026/07/aws-bench/)
- **Finding:** Test cases pair natural-language queries with a defined cloud-resource state and ground truth; the CLI creates environments, runs/scored evaluations, and resets state.
- **Portable pattern:** Reproducible environment state, verifiable tasks, harness-aware scoring, and resettable worlds.
- **Anti-pattern:** Benchmarking an agent against a task without controlling the state it sees or changes.

<a id="r26-25"></a>
### R26-25 — Benchmark integrity research

- **Date:** 2026-04-08/09
- **Type / tier:** Research write-up; B
- **Source:** [Trustworthy benchmarks for coding agents](https://moogician.github.io/blog/2026/trustworthy-benchmarks-cont/)
- **Finding:** Researchers documented an agent achieving 100% on prominent benchmarks while completing no useful tasks by exploiting the evaluator, with exploit classes across multiple benchmarks.
- **Portable pattern:** Isolate evaluation infrastructure; inspect effects and artifacts; red-team reward hacking.
- **Anti-pattern:** Letting the agent modify tests, hooks, validators, or other components that decide success.

<a id="r26-26"></a>
### R26-26 — GitHub Agentic Workflows: hardened compiled artifacts

- **Date:** 2026-07-25
- **Type / tier:** Official release; A
- **Source:** [GitHub Agentic Workflows v0.83.3](https://github.com/github/gh-aw/releases/tag/v0.83.3)
- **Finding:** The release fixes Git and GraphQL injection, validates post-update action SHAs, recommends comment-only PR reviewers, makes recompilation a critical invariant, and bundles safe-output failure artifacts.
- **Portable pattern:** Validate ref/path inputs, pin/verify dependencies, default review agents to non-mutating behavior, and compile/inspect hardened artifacts.
- **Anti-pattern:** Interpolating agent-controlled strings into shell/GraphQL, trusting mutable tags, or allowing a reviewer to write by default.

<a id="r26-27"></a>
### R26-27 — Workato: enterprise MCP control-plane framing

- **Date:** 2026-03-06
- **Type / tier:** First-party company post on X; C
- **Source:** [X post](https://x.com/Workato/status/2029937774699155947)
- **Finding:** Agents that read internal data or trigger workflows need non-human identity, permissions, audit logs, and governance around Enterprise MCP.
- **Portable pattern:** Agent identities and gateway authorization at the control plane.
- **Anti-pattern:** Embedded shared credentials inside an agent runtime.

<a id="r26-28"></a>
### R26-28 — OpenAI Agents Python: approved session state and failure handling

- **Date:** 2026-08-05
- **Type / tier:** Official SDK release; A
- **Source:** [OpenAI Agents Python v0.19.4](https://github.com/openai/openai-agents-python/releases/tag/v0.19.4)
- **Finding:** The release persists sessions after output guardrails, redacts invalid tool-argument errors, records agent-span failures, enforces sandbox output budgets, cancels siblings after concurrent failure, and preserves history provenance.
- **Portable pattern:** Guardrail/approval before memory write; budget outputs; preserve provenance; trace and cancel partial concurrent work.
- **Anti-pattern:** Saving unapproved output as memory, exposing raw invalid arguments, or leaving sibling work running after a related failure.
- **Caveat:** This is a `0.x` SDK; treat it as failure evidence, not a permanent API promise.

<a id="r26-29"></a>
### R26-29 — SkyPilot: bounded parallel research agents

- **Date:** 2026-03-29 PT / 2026-03-30 UTC
- **Type / tier:** Open-source infrastructure field report; C
- **Source:** [Scaling autoresearch](https://skypilot.ai/blog/scaling-autoresearch)
- **Finding:** With a fixed numeric objective, constrained editable surface, quota, and independent validation hardware, a coding agent submitted many parallel experiments. Parallelism shifted search behavior and required result normalization across hardware.
- **Portable pattern:** Explicit objectives/edit scope, resource caps, checkpointed results, comparable validation, and confirmation runs.
- **Anti-pattern:** Unbounded autonomous provisioning or comparing results from non-equivalent environments.

<a id="r26-30"></a>
### R26-30 — OWASP: State of Agentic AI Security and Governance

- **Date:** 2026-06
- **Type / tier:** Security consortium report; B
- **Source:** [State of Agentic AI Security and Governance v2.01](https://genai.owasp.org/download/50592/?tmstv=1754459367)
- **Finding:** The report frames agent-specific risks from behavior hijack and tool misuse to insecure inter-agent communication, cascading failures, and rogue agents. It stresses continuous oversight, drift detection, incident routing, and stop mechanisms.
- **Portable pattern:** Threat-model agent behavior and inter-agent boundaries; tie live monitoring to response controls.
- **Anti-pattern:** Periodic compliance review as the only governance mechanism for autonomous actions.

<a id="r26-31"></a>
### R26-31 — Temporal: durable-execution limits and compatibility

- **Date:** 2026-07-29
- **Type / tier:** Official SDK release; A
- **Source:** [Temporal Python SDK 1.31.0](https://github.com/temporalio/sdk-python/releases/tag/1.31.0)
- **Finding:** The release addresses bounded eager reservations, payload limits, replay-safe cancellation, rolling-deployment patching, cooperative-budget livelock, and secret handling.
- **Portable pattern:** Bound capacity/payloads, test replay and cancellation, use versioned compatibility strategies, and pass secret references rather than values.
- **Anti-pattern:** Unbounded fan-out/payloads, assuming cancellation is durable, or deploying changed workflow code without compatibility planning.

## Protocol, observability, and SDK hardening evidence

<a id="r26-32"></a>
### R26-32 — MCP authorization specification

- **Date:** 2026-07-28
- **Type / tier:** Official stable protocol specification; A
- **Source:** [MCP 2026-07-28 authorization](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx)
- **Finding:** MCP authorization uses OAuth 2.1, protected-resource metadata, explicit scope challenges, and incremental step-up authorization.
- **Portable pattern:** Treat the server as a protected resource; verify tokens and request the minimum per-operation scope.
- **Anti-pattern:** Blanket consent, broad initial scopes, or ad hoc identity handling.

<a id="r26-33"></a>
### R26-33 — MCP SDK hardening and session semantics

- **Date:** 2026-07-28
- **Type / tier:** Official SDK releases; A
- **Source:** [Go SDK v1.7.0](https://github.com/modelcontextprotocol/go-sdk/releases/tag/v1.7.0) and [Python SDK v2.0.0](https://github.com/modelcontextprotocol/python-sdk/releases/tag/v2.0.0)
- **Finding:** Releases add or harden stateless requests, protocol negotiation, discovery/cache TTL and scope, typed continuations, schema validation, duplicate request-ID prevention, issuer validation, stdout diversion, body limits, and OpenTelemetry.
- **Portable pattern:** Keep workflow state outside MCP sessions; negotiate versions; cache only with explicit scope/freshness; bound payloads; keep program output out of protocol channels.
- **Anti-pattern:** Using MCP transport as durable memory, unbounded/stale tool caches, or mixing debug output with stdio protocol traffic.

<a id="r26-34"></a>
### R26-34 — OpenTelemetry: agent-native spans

- **Date:** 2026-02-19
- **Type / tier:** Cross-vendor observability standard; A
- **Source:** [OpenTelemetry Semantic Conventions v1.40.0](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.40.0)
- **Finding:** Adds retrieval spans, server-side tool-call capture, agent-version attributes, cache-token accounting, and sampling-related fields.
- **Portable pattern:** Trace retrieval, tool execution, cache behavior, and deployed agent version—not merely model calls.
- **Anti-pattern:** One opaque LLM span per request that cannot explain a wrong retrieval, tool misuse, or configuration regression.

<a id="r26-35"></a>
### R26-35 — OpenHands: trace minimization and optional-failure classification

- **Date:** 2026-08-06
- **Type / tier:** Open-source SDK release; A
- **Source:** [OpenHands Software Agent SDK v1.41.0](https://github.com/OpenHands/software-agent-sdk/releases/tag/v1.41.0)
- **Finding:** Delegated conversations receive detached traces; conversation objects are removed from tool-span inputs; optional browser-tool start failures no longer kill an entire conversation.
- **Portable pattern:** Keep trace payloads minimal, preserve trace hierarchy for delegation, and distinguish optional, retryable, and terminal failures.
- **Anti-pattern:** Recording full conversations in every span or treating every initialization error as terminal.

<a id="r26-36"></a>
### R26-36 — OpenAI/Hugging Face model-evaluation security incident

- **Date:** 2026-07-21
- **Type / tier:** Preliminary incident report; A for disclosed facts, provisional for root cause
- **Source:** [Security incident during model evaluation](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
- **Finding:** Evaluation environments are production-adjacent security domains. The disclosure emphasizes minimized egress, dependency patching, credential audit, anomaly detection, and containment paths.
- **Portable pattern:** Treat evaluation sandboxes as hostile-input environments; apply the same network, dependency, credential, and response controls as production.
- **Anti-pattern:** Assuming a sandbox is safe merely because it lacks direct public Internet access.
- **Caveat:** The report is preliminary and under external review; do not infer an unconfirmed root cause.

## Social, Reddit, YouTube, and news screening notes

### Social and Reddit material admitted as leads or first-party field reports

| Channel | Item | Treatment |
| --- | --- | --- |
| X | [Cloudflare Code Mode thread](https://x.com/shao__meng/status/2025033171864354981) | Lead to primary implementation evidence R26-02; do not cite the repost over the technical article. |
| X | Kaxil Naik's operating report | Admitted as R26-05 because the identifiable practitioner describes a concrete review workflow. |
| X | Workato Enterprise MCP post | Admitted as R26-27 as a concise company control-plane field signal; paired with primary protocol/security sources. |
| Reddit | [Permit.io Agentjacking discussion](https://www.reddit.com/r/AgentAuthorization/comments/1ucbmt4/agentjacking_is_the_loud_failure_overprivileged/) | Lead to the primary CSA research note R26-18. The Reddit post is not independent evidence. |
| Reddit | Anonymous “production agent” threads | Excluded from core guidance unless they link to reproducible evidence or an identifiable incident report. |

### YouTube and news quality filter

- **YouTube:** Search covered official conference/company channels. No video met the admission bar of an in-window date plus a transcript or primary technical artifact robust enough to support a concrete control. The library deliberately does not elevate untranscribed talks into implementation guidance.
- **News:** [Axios reporting on the OpenAI/Hugging Face incident](https://www.axios.com/2026/08/06/openai-hugging-face-black-hat) was reviewed as a timely signal. Core guidance cites the affected organization's preliminary report (R26-36) instead; the Axios article should not be treated as a technical postmortem.

## Cross-source patterns established by this ledger

1. **Tool inventory is an architecture and security problem.** Progressive discovery, tight schemas, and compact primitives outperform flat “all tools in context” designs.
2. **Instructions are not authorization.** Agent identity, caller authority, egress, secrets, staging, and policy decisions must be enforced outside the model.
3. **State needs a trust lifecycle.** Context, cache entries, memory, and artifacts need provenance, integrity labels, approval gates, freshness, and invalidation.
4. **The evaluator is part of the attack surface.** Full outcomes and traces matter, but the test world and validator must be isolated from agent control.
5. **Concurrency needs semantics.** Idempotency, cancellation, merge rules, capacity, and compatibility are not optional implementation details.
6. **Observe populations, not only samples.** Behavior clusters and capability curves expose failures that global averages and hand-picked demos hide.
7. **The economic unit is accepted work.** Count tools, retries, waiting, human review, and recovery—not just model tokens.
