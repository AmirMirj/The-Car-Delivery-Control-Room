# Data Model: On-road Agent Panel Concise UI

No new persisted entities. Display models only.

## FindingsView

| Field | Type | Notes |
|-------|------|--------|
| bullets | string[] | ≤5 short lines from handoverSummary |
| fullText | string \| null | Original handover for expand |
| expanded | boolean | UI state |

## ApprovalCardView

| Field | Type | Notes |
|-------|------|--------|
| proposalId | string | Pending proposal |
| title | string | Short title |
| decision | string | Shown once |
| status | pending | |

When pending exists, do **not** also render a separate Proposed decision section from `activeRun.decisionText`.

## ChatTurnView

| Field | Type | Notes |
|-------|------|--------|
| id, role, content | from AgentState.messages | user \| assistant only in list |
| preview | string | Truncated content |
| expandable | boolean | content length > threshold |

## State transitions (UI)

- pending → approved/rejected: approval card disappears; optional compact “last decision” line.
- No pending + has handover: findings only.
