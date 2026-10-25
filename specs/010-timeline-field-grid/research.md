# Research: Timeline Field Grid

## Decision: Field cells in a 2-column outer grid

**Rationale**: Each attribute is a small cell (label + value); outer `grid-template-columns: 1fr 1fr` places two cells per row → half the height of a 4-row stack.

**Alternatives considered**: Keep label|value single pair column (already had; doesn’t cut height enough); table markup (heavier).

## Decision: Muted `--subtle`/`--muted` labels; bold `--ink`/`--brown` values

**Rationale**: Eye lands on data; labels are orientation only.

**Alternatives considered**: Bold labels (competes with values); all-caps labels (noisy).
