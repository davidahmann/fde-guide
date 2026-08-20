# Field Reframe: Invoice Exception Resolution

This synthetic case demonstrates the field work between inheriting a sold brief and starting solution design.

## Inherited story

The commercial brief promises an AI service that automatically resolves and posts eligible invoice exceptions. The sponsor wants cycle-time reduction and assumes the existing workflow already supports automatic posting.

## What the FDE found

Following a recent price-variance exception identifies the accounts-payable exception lead as the process knower. The observed reviewer:

1. inspected the invoice and purchase-order evidence;
2. selected the correction;
3. approved the correction under an authenticated identity;
4. posted it through a separate system state;
5. retained a manual recovery path.

The current policy requires reviewer approval, and a test of the current system build confirms that staging and approval are separate events. The observation proves that the reviewed path occurred; the policy defines permitted behavior; the system test defines current technical behavior. None alone grants the FDE authority to change the boundary.

## Consequential conflict

| Source | Claim | Evidence class |
| --- | --- | --- |
| Sold brief | The service automatically posts eligible corrections | `sold` |
| Observed case | A reviewer inspected, corrected, approved, and posted | `observed` |
| Controls policy | A designated reviewer must approve before posting | `policy_authorized` |
| Current-build test | The system stages a correction before a separate approval event | `system_enforced` |

The conflict affects human authority, workflow scope, evaluation design, risk, and customer acceptance. It therefore requires a scoped disposition rather than an architectural assumption.

## Reframe and disposition

The delivery team proposes:

> Classify the exception, assemble cited evidence, and stage a correction while a reviewer retains approval and posting authority.

The accounts-payable service owner accepts `bounded_kickoff` for domestic price-variance exceptions. The workflow charter is superseded, the evaluation plan requires review, and the unchanged data-context manifest remains current. Prior evidence and revisions remain in chronology.

The governed record is [`engagement-reframe.json`](engagement-reframe.json).

## Other disposition paths

- **Rejected reframe:** keep the current workflow and downstream artifacts unchanged; preserve the proposal and rationale; identify whether the sold outcome is still feasible inside the control boundary.
- **Deferred reframe:** preserve the proposal and current brief; use the manual fallback; name the missing evidence, authority, and reconsideration condition.
- **Continue discovery:** observe another representative case or locate missing process ownership before proposing a new boundary.
- **Stop:** close the candidate when the accepted outcome cannot be achieved within authority, evidence, economics, or risk constraints.

These paths govern the engagement boundary. They are not production release, customer acceptance, or target-system authorization.
