# Repository Instructions

## Required read order

1. `catalog.json`
2. `controls/control-catalog.json`
3. Relevant JSON Schema under `schemas/`
4. Relevant blueprint under `blueprints/`
5. Evidence links under `library/` and `research/`

## Artifact rules

- Production requirements use `MUST`, `SHOULD`, or `MAY` and reference control IDs.
- Runtime contracts are machine-readable JSON validated by JSON Schema 2020-12.
- New blueprints define components, trust boundaries, state transitions, failure behavior, telemetry, and release tests.
- New examples include a design record, ontology, tool contracts, eval cases, threat model, and executable verification when feasible.
- Model output never authorizes actions, exposes secrets, mutates evaluation infrastructure, or proves task completion.
- External effects require authorization at the tool boundary, idempotency, and source-of-truth readback.
- Recommendations based on changing platform behavior require a dated primary source in `research/`.
- Vendor metrics remain attributed; experimental patterns remain labeled.
- Contributions contain no employer-confidential material, private data, credentials, or machine-local paths.
- Public metadata uses the canonical `davidahmann/production-agent-engineering` repository URL.
- The Apache-2.0 license text is copied verbatim and is not modified.

## Validation

```bash
npm ci
npm test
git diff --check
```

## Change acceptance

- No broken local links or duplicate anchors.
- No empty tracked files, unresolved placeholders, or trailing whitespace.
- Every new catalog path resolves.
- Every JSON artifact validates against its declared local schema.
- Every new mandatory control includes evidence and a release gate.
- Every failure fix adds or updates a regression case.
- Public entry points, citation metadata, and repository configuration agree on the project name and version.
