# Research: Timeline Badge Urgency

## Decision: Single StatusPill; never dual “Needs a person” tag

**Rationale**: Awaiting review / Action required already mean a person is needed; second tag is redundant (user).

**Alternatives considered**: Keep both for filter alignment (rejected—noise).

## Decision: urgency tier critical | elevated | calm from category+tone+status

**Rationale**: Attention danger/warn + failed → critical (bright). Awaiting review → elevated (muted orange). Completed/neutral/in_progress → calm (gray/soft).

**Alternatives considered**: Color only by statusDisplay (awaiting_review was as hot as alerts); color only by tone (misses failed).
