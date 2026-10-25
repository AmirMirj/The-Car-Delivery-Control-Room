# Research: Judging Pitch

## Decision: In-app Pitch page (not README-only)

**Rationale**: Judges explore the running app; a Pitch route with live links shortens the demo path vs hunting markdown.

**Alternatives considered**: README section only (easy to miss); overlay tour (noise for ops); replace Build notes (loses the four AI prompts).

## Decision: Static PitchDoc + runtime showcase resolve

**Rationale**: Talking points are curated. Showcase order id can change after reseed, so resolve from exceptions API preferring on-road / agent-qualified cards matching optional vehicle hints.

**Alternatives considered**: Hard-coded UUID (breaks on reseed); always first exception (may lack agent story).

## Decision: Keep Build notes as Criterion 2 home

**Rationale**: Already implements Asked/Checked/Threw away/First answer. Pitch links there; we only add the event-formatting and approval-gate examples.

**Alternatives considered**: Duplicate AI narrative on Pitch (redundancy); generate AI story with LLM at request time (forbidden by SC-004).

## Decision: Honest showcase label (no fake “BMW M4” if absent)

**Rationale**: Seed may not include that model; label uses the real vehicle title from the resolved order.

**Alternatives considered**: Invent a BMW M4 card (violates synthetic-but-honest packet); skip showcase link (weakens live demo).
