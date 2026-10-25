# Data Model: Agent Focus Areas + Trace Timeline

## FocusAreaId

`"pickup_readiness" | "driver_travel" | "on_the_road" | "driver_support"`

## AgentFocusArea (catalog)

| Field | Type | Constraints |
|-------|------|-------------|
| id | FocusAreaId | exactly one of the four |
| name | string | plain ops label (e.g. “On the road”) |
| jobLine | string | one-line job for Timeline/agent panel |
| agentMay | string[] | allowed unsupervised work (research, call driver/pickup, lookup, prepare options) |
| humanMust | string[] | purchase, booking/date/cost change, customer message, final choice |
| exampleSituations | string[] | matcher hints |

## MatchResult

| Variant | Fields |
|---------|--------|
| matched | `focusArea: FocusAreaId` |
| ambiguous | `candidates: FocusAreaId[]` (length ≥ 2 or empty→all four for picker) |

## AgentTrace (presentation; one focus-area invocation)

| Field | Type | Notes |
|-------|------|-------|
| id | string | often run id |
| orderId | string | |
| focusArea | FocusAreaId | producing agent |
| status | `running` \| `awaiting_person` \| `completed` \| `failed` \| `rejected` | |
| startedAt / endedAt | string \| null | ISO |
| rootSpanId | string | |
| spans | AgentSpan[] | parent-child hierarchy |
| decision | HumanDecision \| null | handoff package when awaiting/decided |

## AgentSpan

| Field | Type | Constraints |
|-------|------|-------------|
| id | string | unique within trace |
| parentId | string \| null | null = root |
| name | string | ops-readable (≤ ~40 chars in graph label) |
| category | `agent` \| `llm` \| `tool` \| `handoff` \| `other` | color/icon key (OpenSearch-inspired) |
| status | `ok` \| `error` \| `unset` | |
| startedAt / endedAt | string \| null | drives Gantt bar |
| detail | string \| null | span detail panel body |
| toolName | string \| null | for `tool` spans |
| tokensIn / tokensOut | number \| null | optional; show if present |

## HumanDecision

| Field | Type |
|-------|------|
| kind | `approve` \| `reject` \| `choose_option` |
| options | `{ id: string; label: string }[]` \| null |
| summary | string |
| recordedAt | string \| null |
| outcome | string \| null |

## GanttRow (UI projection)

| Field | Type | Notes |
|-------|------|-------|
| id | string | span or rollup id |
| depth | number | indentation (PowerGraph hierarchy) |
| label | string | |
| focusArea | FocusAreaId \| null | rollup / agent row |
| start / end | number | ms relative to trace start |
| milestone | `handoff` \| `decision` \| null | diamond markers |
| category | AgentSpan.category \| `summary` | |

## Relationships

- Order → many AgentTraces (over time); **at most one running** matched focus agent for the current situation.
- AgentTrace → many AgentSpans (tree).
- AgentTrace → zero or one pending HumanDecision.
- Timeline entries may **link** `traceId` / `spanId` when category is agent work.

## State transitions (trace)

`running` → `awaiting_person` (handoff span) → `completed` | `rejected`  
`running` → `failed` (error span / run failure)

## Validation

- Exactly one of four FocusAreaIds in catalog.
- Span `parentId` must reference another span in the same trace or be null.
- `endedAt` ≥ `startedAt` when both set.
- Handoff/decision milestones only on `handoff` category or decision recording.
