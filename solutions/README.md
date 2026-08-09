# Reference Solution Accelerators

These four design accelerators turn a qualified workflow into a bounded starter architecture, a smallest useful slice, and an acceptance contract. Together they cover twelve common FDE implementation projects without pretending that each concern is an isolated application.

## Maturity and use

| Maturity | What it means |
| --- | --- |
| **Design accelerator** | A reusable architecture, trust-boundary map, delivery slice, acceptance contract, operating measures, and starter packet. It contains no deployable product. |
| **Executable reference** | A local teaching implementation and tests that prove only their named invariants. See the [invoice exception](../examples/invoice-exception/README.md) and [shipment-risk triage](../examples/shipment-risk-triage/README.md) systems. |
| **Deployment profile** | An environment-specific implementation with owned infrastructure, integrations, policies, evidence, support, and release history. It belongs in the delivery repository, not this guide. |

Every accelerator in this folder is a **design accelerator**. Copy the linked canonical templates into the delivery repository, replace assumptions with observed evidence, and implement one vertical slice. Do not describe the result as production-ready, compliant, certified, or customer-proven until the target release has its own evidence.

## Twelve-project coverage

| Project ID | Common project | Primary accelerator | Why it belongs there |
| --- | --- | --- | --- |
| P01 | Multi-tenant SaaS platform | [Enterprise foundation](enterprise-foundation.md) | Tenant identity, isolation, entitlements, usage, and lifecycle are one control surface. |
| P02 | Enterprise SSO integration | [Enterprise foundation](enterprise-foundation.md) | Authentication, provisioning, request-time authorization, and deprovisioning must remain coherent. |
| P03 | Customer connector pack | [Integration runtime](integration-runtime.md) | Connectors need shared credential, tenancy, delivery, recovery, and versioning services. |
| P04 | Secure customer RAG system | [Secure AI workload](secure-ai-workload.md) | Permission-aware retrieval, evidence, data minimization, and evaluation form one decision path. |
| P05 | Customer health dashboard | [Deployment and operations](deployment-and-operations.md) | Adoption, value, reliability, cost, and support signals belong in one operating view. |
| P06 | Webhook integration engine | [Integration runtime](integration-runtime.md) | Signature checks, durable receipt, duplicate safety, retries, and replay are runtime primitives. |
| P07 | One-click customer deployment | [Deployment and operations](deployment-and-operations.md) | Provisioning is a controlled release pipeline with admission, verification, rollback, and ownership. |
| P08 | PII redaction middleware | [Secure AI workload](secure-ai-workload.md) | Classification and minimization must span ingestion, retrieval, model context, output, and telemetry. |
| P09 | Incident response system | [Deployment and operations](deployment-and-operations.md) | Detection, containment, readback, recovery, communication, and regression are one service capability. |
| P10 | Usage metering and billing | [Enterprise foundation](enterprise-foundation.md) | Tenant entitlements, stable usage events, aggregation, rating, and reconciliation must agree. |
| P11 | Customer onboarding automation | [Enterprise foundation](enterprise-foundation.md) | Identity setup, configuration, activation, and time-to-first-value share the tenant lifecycle. |
| P12 | Public deployment case study | [Deployment and operations](deployment-and-operations.md) | A publishable case is a redacted evidence product derived from operated results, not marketing added at the end. |

## Use sequence

1. Qualify the workflow and value case through [Discovery and Value](../playbooks/01-discovery-and-value.md).
2. Choose the accelerator that contains the primary failure boundary. Do not combine all four by default.
3. Use its smallest useful slice as the first delivery milestone.
4. Copy and complete the linked canonical templates; the accelerator itself is not release evidence.
5. Implement deterministic controls first, then add ML, retrieval, a foundation model, or an agent only where the [intelligence-selection record](../templates/intelligence-selection-record.md) justifies it. `ARC-004`, `ARC-005`.
6. Evaluate the exact release candidate, transfer it to a named service owner, and keep the case study limited to independently accepted outcomes.

## Selection guide

| Start here when the dominant problem is | Accelerator |
| --- | --- |
| Enterprise access, tenant isolation, monetization, or activation | [Enterprise foundation](enterprise-foundation.md) |
| Third-party systems, webhooks, connector reliability, or credential boundaries | [Integration runtime](integration-runtime.md) |
| Sensitive knowledge, permission-aware retrieval, citations, or data minimization | [Secure AI workload](secure-ai-workload.md) |
| Repeatable deployment, adoption and SLO evidence, incident recovery, or public proof | [Deployment and operations](deployment-and-operations.md) |

These projects demonstrate design and verification skill; they do not guarantee employment or substitute for customer-specific security, privacy, legal, finance, or compliance review.
