---
name: build-ai-evaluation
description: Build or repair evaluations for a production AI-enabled system. Use for realistic evaluation cases, adversarial scenarios, graders, trial design, behavioral traces, cost and latency budgets, contamination controls, acceptance thresholds, or a reproducible evaluation report.
---

# Build an AI Evaluation

Evaluate the product claim in its real environment, not an isolated model answer. Keep candidate code away from fixtures, graders, thresholds, and pass signals.

## Read first

1. Read [Evaluation Corpus and Review Loops](../../../library/09-evaluation-corpus-and-review-loops.md) and the [release gates](../../../operations/release-gates.md).
2. Use the [evaluation-case](../../../templates/evaluation-case.json) and [evaluation-report](../../../templates/evaluation-report.json) contracts.
3. Inspect the target system, threat model, workflow charter, behavior bundle, tools, operating budgets, and real failure history.
4. Apply `EVA-001` through `EVA-006`, `SEC-004`, `REL-002`, `OPS-004`, and `CST-002` from the [control catalog](../../../controls/control-catalog.json).

## Workflow

1. State the tested claim, target workflow slice, eligible population, environment, component versions, and release decision the evidence may support.
2. Build representative success, exception, denial, recovery, drift, and adversarial cases from observed work and incidents. Preserve provenance and sensitive-data controls.
3. Combine deterministic contract and effect checks with calibrated semantic review and behavioral trajectory checks where appropriate.
4. Give high-risk slices and prohibited effects independent thresholds that aggregate performance cannot hide.
5. Run repeated isolated trials with explicit model, prompt, tool, policy, runtime, data/world, budget, and evaluator versions. Track uncertainty and contamination.
6. Validate outputs, external effects, readback, stop reasons, latency, cost, and resource use—not only final text.
7. Produce an evaluation report whose decision is `accept`, `inconclusive`, or `reject`, with limitations and required follow-up.

## Output contract

Return the cases, fixture and grader responsibilities, execution manifest, slice-level results, uncertainty, failure taxonomy, contamination statement, release decision, and regression links.

Do not present self-review as independent proof, tune thresholds to pass a candidate, accept leaked answer keys, or infer production readiness from a benchmark alone.
