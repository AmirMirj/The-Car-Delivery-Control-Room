# Data Model: Decision-Ready Handoff

No new persisted tables. Presentation fields only.

## ExceptionItem (API `/api/exceptions` item)

| Field | Constraint | Notes |
|-------|------------|-------|
| orderId | required string | |
| reason | required non-empty string | why a person is needed |
| decideCue | required non-empty string | what the person should decide/do next |
| tone | enum danger\|warn\|accent\|neutral\|ok | |
| agentStatus | string \| null | none\|running\|awaiting_review\|… |
| qualifiesOnRoad | boolean | |
| href | required | `/orders/:id` |

## ProvenanceLine (UI)

| Field | Constraint |
|-------|------------|
| source | required string |
| destination | required string |

Shown as `source → destination` on timeline entries.

## CheapStep (UI)

| Field | Constraint |
|-------|------------|
| name | required |
| result | required |
| at | ISO string \| null |

## DecisionOutcome (client present after review)

| Field | Constraint |
|-------|------------|
| decision | enum `approved` \| `rejected` |
| appliedSummary | required string | what changed or “nothing applied” |
| nextStep | required string | what happens next |
| proposalId | required string |
| at | ISO string |

## Relationships

- ExceptionItem → Order record
- CheapStep list ⊂ agent TimelineEntry
- DecisionOutcome overlays the reviewed TimelineEntry / order banner
