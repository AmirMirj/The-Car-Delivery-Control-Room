# Data Model: Unified Order Tracking

Presentation-only over `RecordView` (+ local agent proposals/runs).

## TrackingEntry (extends TimelineEntry)

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| id | string | yes | Stable key |
| category | attention \| conversation \| agent \| activity | yes | Filter mapping |
| title | string | yes | Headline |
| at | ISO string \| null | yes* | Timestamp (*null only if source lacks time; prefer always set) |
| activityType | `cheap` \| `consequential` \| `na` | yes | Cheap work vs gated vs not applicable |
| progress | string enum | yes | e.g. `open` \| `in_progress` \| `waiting_person` \| `waiting_counterparty` \| `completed` \| `failed` |
| agentInvolvement | string enum | yes | `none` \| `cheap_work` \| `proposed` \| `reviewed` \| `applied` |
| source | string | yes | From party/role (“Driver Camille…”, “System”) |
| destination | string | yes | To party/role (“Support desk”, “Ops”, “Order”) |
| result | string | yes | Outcome label (“Awaiting review”, “Still open”, …) |
| needsPerson | boolean | yes | Drives Needs a person filter + tag (rename from needsAttention) |
| detail | string \| null | optional | Extra prose |
| cheapSteps | `{ name, result, at? }[]` | optional | Nested under agent rows only |
| threadId / proposalId / runId | string \| null | optional | Expand / deep-link |

## Filter

| Id | Includes |
|----|----------|
| everything | all |
| attention | needsPerson **or** category attention; label **Needs a person** |
| conversations | category conversation |
| agent | category agent |
| activity | category activity |

Pending agent proposals MUST set `needsPerson=true` so they appear under Needs a person.

## Progress vs result

- **Progress**: lifecycle state of the entry.
- **Result**: outcome string (may equal progress label when settled).

## State (UI only)

- `expandedEntryIds: Set<string>` for inline conversation / agent step expand.
- Provenance fold open state: default `false` for Conversations, Prior agent work, Activity.
