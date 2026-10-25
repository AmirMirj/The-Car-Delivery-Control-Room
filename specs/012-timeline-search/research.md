# Research: Timeline Counters & Search

## Decision: Pill counts stay on full model

**Rationale**: Users need workload awareness in other queues while searching; narrowing counts would hide that signal.

**Alternatives considered**: Recalculate counts from search hits — rejected (conflicts with FR-002).

## Decision: Client-side substring filter with order context

**Rationale**: Timeline is already client-presented; vehicle make/model and driver names live on `RecordView` and should enrich the haystack so “BMW” works even when entry text omits the make.

**Alternatives considered**: Server search API — overkill for one order. Separate field dropdowns — slower for hackathon UX.

## Decision: Sort = Newest | Urgency

**Rationale**: Newest matches existing Chronological default; Urgency uses `statusUrgency` so Needs-a-person work surfaces first under search.

**Alternatives considered**: A–Z title sort — less useful for ops triage.
