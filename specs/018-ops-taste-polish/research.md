# Research: Ops Taste Polish

## Decision: Centralize ops-facing labels in `ops-copy.ts`

**Rationale**: Agent statuses and error strings appear in multiple places; one map prevents snake_case leaks.

**Alternatives considered**: Inline replaceAll everywhere (already failed taste).

## Decision: Sticky exception `board-head` only (not whole sidebar)

**Rationale**: With hundreds of needing-person cards, tools/search must stay reachable without covering the sidebar nav.

**Alternatives considered**: Virtualized list (overkill for ~100 snapshot).

## Decision: Collapse idle fleet pass into `<details>` 

**Rationale**: Completed pass stats are useful sometimes but shout over the queue when always open.

**Alternatives considered**: Remove fleet UI (loses demo affordance).
