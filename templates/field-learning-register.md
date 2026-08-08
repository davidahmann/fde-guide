# Field-Learning Register

Use one record per candidate learning. Store source evidence in its governed system; link only the minimum sanitized evidence needed for triage and validation.

## Register identity

| Field | Value |
| --- | --- |
| Register owner | — |
| Product/platform triage owner | — |
| Customer confidentiality approver | — |
| Review cadence | — |
| Evidence retention policy | — |

## Index

| Learning ID | Short claim | Class | Recurrence | Confidentiality | Destination | Product owner | Disposition | Validation status | Review due |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — | — |

## Learning record

### Identity and observation

| Field | Value |
| --- | --- |
| Learning ID and revision | — |
| First / last observed | — |
| Reporting workflow, release, segment, and environment | — |
| Operational decision or invariant affected | — |
| Sanitized candidate claim | — |
| Class | Customer configuration / reusable pattern / platform gap / model limitation / operating problem / non-viable use case |
| Reporter and triage owner | — |

### Recurrence and evidence

| Field | Value |
| --- | --- |
| Recurrence class | One case / repeated within segment / cross-segment / cross-workflow / cross-customer |
| Occurrence count and eligible denominator | — |
| Time window and query/source revision | — |
| Affected and unaffected slices | — |
| Supporting evidence links and digests | — |
| Counter-evidence and alternative explanations | — |
| First divergent state or violated invariant | — |
| Sanitized replay/regression case | — |
| Recurrence confidence and reviewer | — |

### Confidentiality and portability

| Field | Value |
| --- | --- |
| Source classification | Public / internal / confidential / restricted |
| Customer-specific data, policy, or workflow detail present | — |
| Sanitization or abstraction performed | — |
| Confidentiality approver and date | — |
| Permitted audience and destination | Customer only / product team / shared repository / public |
| Reuse constraints and prohibited transfer | — |
| Portable scope boundary | — |

Do not move raw customer data, proprietary policy, credentials, identifiers, or confidential workflow detail into a shared or public destination. A cross-customer recurrence label records independently reviewed evidence; it does not authorize evidence transfer between customers.

### Destination and disposition

| Field | Value |
| --- | --- |
| Destination | Customer configuration / customer backlog / product backlog / pattern / blueprint / template / tool contract / evaluation suite / model-routing policy / operating procedure / retirement record |
| Product owner | — |
| Disposition | Investigate / configure / fix / productize / standardize / defer / reject / retire |
| Decision, rationale, and approver | — |
| Target artifact, issue, or release | — |
| Required artifact owner and lineage update | — |
| Due date or reconsideration trigger | — |

### Validation and closure

| Field | Value |
| --- | --- |
| Validation hypothesis | — |
| Representative and negative cases | — |
| Independent holdout or comparison | — |
| Acceptance and guardrail thresholds | — |
| Affected-route evaluation and security regression | — |
| Pilot/canary segment, soak, and rollback trigger | — |
| Observed outcome and uncertainty | — |
| Validation owner / reviewer / date | — |
| Status | Proposed / triaged / validating / accepted / implemented / rejected / deferred / retired |
| Closure evidence and next recurrence query | — |

An accepted learning changes production only through its destination's normal review, compatible-release, evaluation, approval, and rollback gates. The learning record is evidence for a decision; it is not release authorization.

Evidence: [R26-37](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-37), [R26-45](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-45), and [R26-54](../research/2026-02-07--2026-08-07-production-agent-source-ledger.md#r26-54).
