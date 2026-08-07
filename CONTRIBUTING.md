# Contributing

Contributions that improve the technical accuracy, executable examples, controls, schemas, evaluations, or source quality are welcome.

## Before opening a change

1. Read [`AGENTS.md`](AGENTS.md) and follow its required artifact order.
2. Search existing [issues](https://github.com/davidahmann/production-agent-engineering/issues) and pull requests.
3. For a new control, schema, or blueprint, open a design proposal before a large implementation.
4. For a security issue, follow [`SECURITY.md`](SECURITY.md) instead of opening a public issue.

## Local verification

Requires Node.js 22 or later.

```bash
npm ci
npm test
git diff --check
```

Pull requests must keep the repository validator green and include regression coverage for corrected failures.

## Contribution contract

- Production requirements use `MUST`, `SHOULD`, or `MAY` and cite control IDs.
- Runtime contracts use JSON Schema 2020-12; new or changed safety constraints include positive and negative tests.
- Blueprints define components, trust boundaries, state transitions, failure behavior, telemetry, and release tests.
- Examples include a design record, ontology, tool contracts, eval cases, threat model, and executable verification when feasible.
- Changeable platform claims cite a dated primary source in `research/`.
- Vendor metrics remain attributed; experimental findings remain labeled.
- Model output never authorizes effects, exposes secrets, changes its evaluator, or proves task completion.

## Evidence changes

Source corrections should identify the affected claim, stable source URL, publication date, source type, and proposed impact on controls or patterns. Prefer specifications, release notes, incident reports, reproducible research, and first-party engineering reports over summaries.

## Agent-assisted changes

Agent-assisted contributions are welcome. The human submitter remains responsible for scope, provenance, licensing, secret removal, test evidence, and the final diff. Include the commands and material evidence used to validate the change; do not submit hidden reasoning or credentials.

## Pull requests

Keep each pull request reviewable and scoped to one outcome. Explain:

- the production problem or evidence correction;
- the controls and artifacts affected;
- the tests or replay cases added;
- the operational or compatibility risk;
- the rollback path when behavior changes.

By contributing, you agree that your contribution is licensed under the repository's [Apache License 2.0](LICENSE). Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
