# Research: Combined Order Timeline

## Decision: Derive entries from RecordView (no new API)

**Rationale**: Order GET already returns attention, threads, proposals, history. Keeps latency low and avoids schema churn.

**Alternatives considered**: New `/api/orders/:id/timeline` (useful later if server sorts/pages); rejected for MVP.

## Decision: Default filter = Needs attention when non-empty

**Rationale**: Constitution exception-first; matches screenshot’s active pill.

**Alternatives considered**: Always Everything (weaker triage signal).

## Decision: Keep AttentionPanel or replace with Timeline?

**Rationale**: Replace the redundant “Needs a person” panel with Timeline (which includes that filter) to avoid double lists; keep Conversations / Decisions / Activity sections below for depth.

**Alternatives considered**: Keep both (noisy); remove lower sections (breaks FR-005).

## Decision: Sort

**Rationale**: Within a filter, sort by timestamp descending when present; attention items without times keep tone rank then title. Everything uses the same comparator so pills feel consistent.

**Alternatives considered**: Strict attention-first always (confusing under Activity pill).
