# Discovery, Value Engineering, and Frugal Architecture

The FDE's first deliverable is not code. It is a shared, evidence-backed definition of the work, the decision that matters, the value at stake, and the smallest intervention worth testing.

Palantir's use-case guidance starts with a time-bounded operational outcome rather than a source integration, dashboard, or model technique. OpenAI describes FDE ownership across discovery, design, rollout, adoption, and measurable workflow impact. The portable synthesis is an outcome-backward engagement with continuous operator contact. [R26-37] [R26-41]

## Joint delivery team

One person may hold several ownership or delivery roles during a small pilot, but each decision right remains explicit. Approval roles required by a selected release gate use independent principals; one person cannot approve the same change in multiple required roles.

| Role | Accountable for | Cannot delegate away |
| --- | --- | --- |
| Executive sponsor | Strategic priority, organizational blockers, funding | Whether the outcome still matters |
| Operational owner | Workflow result, process policy, service acceptance | Definition of accepted work |
| Domain expert/operator | Real cases, exceptions, review quality, usability | Validation of observed work |
| FDE/delivery lead | Discovery, solution coherence, execution, evidence | Connecting field facts to design decisions |
| Technical owner | Architecture, integration, release, maintainability | Production engineering acceptance |
| Data/tool owner | Source quality, interfaces, permissions, change notices | Source and capability contracts |
| Risk/security owner | Threats, policy, prohibited effects, release constraints | Risk acceptance |
| Service owner | SLOs, support, incident response, maintenance | Production health after launch |

Controls: `FDE-001`, `FDE-002`, `ADP-002`.

## 1. Qualify before discovery

Apply hard gates before a weighted score. A candidate does not proceed when any of these conditions is true:

- No accountable operational owner or affected user population
- No decision, action, or work product that can be bounded
- No measurable outcome or credible plan to establish a baseline
- No affordable verifier or accountable reviewer
- Necessary context cannot be accessed lawfully or kept current
- The first useful release requires an irreversible high-stakes effect
- No plausible path for operators to adopt the changed workflow
- No team can own support, incident response, and change after the pilot

Candidates that pass can be ranked by business impact, eligible volume, time saved, avoided loss, verification coverage, context and integration readiness, adoption probability, risk, implementation effort, and time to evidence. Impact-versus-effort is a useful prioritization view, but it does not cancel a missing owner, verifier, or safety boundary. [R26-39]

Control: `VAL-003`.

## 2. Frame the operational requirement

Use this minimum sentence:

```text
[user or role] uses [working surface] to make [decision]
from [decision inputs], then performs [permitted action]
so that [accepted outcome] changes [owned metric].
```

Record the trigger, frequency, eligible segment, current cycle, downstream dependencies, source systems, current owner, and evidence of completion. The sentence must describe the customer's work even if no agent is built. [R26-41]

Bad scopes:

- Add an agent to finance
- Connect the CRM to an LLM
- Build an executive dashboard
- Automate the support organization

Useful scope:

- A named reviewer resolves policy-covered invoice exceptions from a persistent review queue, using current invoice and approval-policy evidence, and stages a resolution that is accepted only after ledger readback.

Control: `FDE-001`.

## 3. Observe the work

Interview descriptions are hypotheses. Observe representative normal cases, hard cases, recent failures, policy exceptions, and handoffs. Use screen recordings, event history, example inputs and outputs, audit trails, queue data, and paired walkthroughs when permitted. Minimize and redact captured evidence.

For each step, record:

- Actor, trigger, input, system, decision, output, and next owner
- Evidence inspected and how freshness or authority is judged
- Rule, professional judgment, and accountability boundary
- Workaround, duplicate entry, hidden spreadsheet, side channel, or waiting state
- Failure, exception, escalation, and recovery path
- Definition of done and how another person verifies it
- Frequency, duration, queue time, rework, and consequence

Do not automate every observed behavior. Classify each as preserve, repair, remove, or escalate. A workaround caused by poor data or broken authorization is not automatically domain expertise.

Control: `FDE-002`.

## 4. Establish the baseline

Separate four kinds of evidence:

| Evidence | Example | Decision it supports |
| --- | --- | --- |
| Current-state baseline | Eligible volume, cycle time, error or rework rate, review effort | Is the problem material? |
| Technical evidence | Contract, task, trajectory, and effect results | Can the system perform safely? |
| Adoption evidence | Eligible use, completion, override, abandonment, and reviewer load | Does the workflow work for people? |
| Business evidence | Accepted-outcome change, avoided loss, throughput, revenue, risk | Is value being realized? |

An unmeasured baseline stays labeled `unmeasured`; an estimate stays labeled `estimated`. `illustrative_fixture` is reserved for the repository's canonical structural example and is not an engagement evidence status. A pilot result must not be relabeled as annual realized value.

Control: `VAL-001`.

## 5. Build a falsifiable value case

Use the [value-case template](../templates/value-case.md). A transparent planning model is:

```text
annual_realized_value =
  eligible_volume
  × measured_adoption_rate
  × accepted_outcome_uplift
  × value_per_accepted_outcome
  + measured_avoided_loss
  - annual_variable_cost
  - annual_fixed_operating_cost

annual_variable_cost =
  eligible_runs
  × (model + tool + compute + storage + retry + wait + human_review + recovery cost)
```

Use ranges when inputs are uncertain. Declare the attribution method: comparison group, before/after with controls, time-series intervention, reconciliation, or owner-approved proxy. Report confidence and sensitivity rather than hiding them inside a single ROI number.

Control: `VAL-002`.

## 6. Make the cost and architecture decision explicit

Record the full cost per accepted outcome before selecting an expensive model route or adding autonomy. Include model, retrieval, tools, compute, storage, waiting, retries, human review, recovery, support, and allocated delivery cost. Cost is a non-functional requirement, not a post-launch optimization. [R26-63] [R26-64]

For each consequential decision, compare deterministic logic, optimization, classical ML, retrieval, foundation-model interpretation, bounded agency, and human review when relevant. Select the smallest sufficient mechanism and name its fallback. Use the [intelligence-selection record](../templates/intelligence-selection-record.md).

Control: `ARC-005`.

## 7. Assess readiness

Score each dimension from `0` to `4`, and attach evidence:

| Score | Meaning |
| ---: | --- |
| 0 | Unknown or absent |
| 1 | Hypothesis with an owner |
| 2 | Partially observed or prototyped |
| 3 | Representative evidence exists |
| 4 | Measured in the target operating environment |

Assess workflow clarity, context ownership/freshness, verifier quality, integration contracts, user adoption, risk controls, and production operations. A total score is not a release gate. A zero in verifier quality is blocking; missing authenticated authority, accountable operational/service ownership, or a lawful data path is a hard-gate failure outside the score.

## 8. Charter or stop

Complete the machine-readable [workflow charter](../templates/workflow-charter.json). The charter records:

- Problem and users
- Scope, initial segment, maximum effect, and autonomy ceiling
- Accepted event, verifier, metric baseline, target, and guardrails
- Value assumptions and attribution method
- Readiness evidence and blocking constraints
- Decision, rationale, approvers, and open assumptions

Permitted decisions are discover, pilot, defer, do not build, promote, pause, or retire. “Build an impressive demo” is not a disposition.

## Discovery exit gate

- [ ] Representative work and exceptions were observed.
- [ ] Operator and operational owner validated the current-state map.
- [ ] The workflow requirement names user, interface, decision, inputs, action, and outcome.
- [ ] The baseline is measured or explicitly unmeasured with a measurement plan.
- [ ] The verifier and maximum acceptable failure are named.
- [ ] Context, integration, adoption, security, and operations readiness are evidenced.
- [ ] Value assumptions are falsifiable and have owners.
- [ ] Pilot segment, stop conditions, and post-pilot owner are explicit.
- [ ] The workflow charter is approved for the next stage.

## Discovery anti-patterns

- Executive-only requirements with no operator observation
- Technology, data source, or interface named as the business problem
- Demo success treated as adoption, value, or production readiness
- Average handling time used without eligible volume, quality, or downstream impact
- Automation of a workaround that should be removed
- Weighted opportunity score used to override a missing gate
- FDE retained as the implicit operational owner

[R26-37]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-37
[R26-39]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-39
[R26-41]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-41
[R26-63]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-63
[R26-64]: ../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-64
