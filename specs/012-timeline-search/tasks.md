# Tasks: Timeline Counters & Search

**Input**: Design documents from `/specs/012-timeline-search/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup

- [x] T001 Confirm feature docs exist under `specs/012-timeline-search/` (spec, plan, research, data-model, contracts, quickstart)

## Phase 2: Foundational

- [x] T002 Add `TimelineSearchContext` + `filterTimelineEntries` / `sortTimelineEntries` helpers in `starter/lib/present/timeline.ts` (case-insensitive match on entry fields + vehicle make/model/title + driverNames; sort `newest` | `urgency`)

## Phase 3: User Story 1 — Always-visible counts (P1)

**Goal**: Pills always show numeric counts including zeros.  
**Independent Test**: All five pills show `(N)` without selecting them.

- [x] T003 [US1] Ensure Timeline pills always render `model.counts[countKey]` including `0` in `starter/app/components/record/timeline.tsx` (never omit count)

## Phase 4: User Story 2 — Search/sort bar (P1)

**Goal**: Filter line under pills for model/driver/ops text + sort.  
**Independent Test**: Type BMW / driver / category; clear restores; sort changes order; counts unchanged.

- [x] T004 [US2] Build search context from `RecordView` (vehicle + driver names) in `starter/app/components/record/timeline.tsx`
- [x] T005 [US2] Add search input + sort select below pills; wire query/sort state; apply filter after pill filter; keep pill counts from full model
- [x] T006 [US2] Update “Showing N” and empty state for filtered results in `starter/app/components/record/timeline.tsx`
- [x] T007 [P] [US2] Style search/sort bar in `starter/app/globals.css` (birch/ops)

## Phase 5: Polish

- [x] T008 Run `npx tsc --noEmit` in `starter/` and fix type errors
- [x] T009 Mark completed tasks in `specs/012-timeline-search/tasks.md`

## Dependencies

- T001 → T002 → T003 / T004 → T005 → T006 → T007 → T008 → T009
- US1 (T003) and US2 (T004+) can proceed after T002; T003 is quick harden

## Parallel

- T007 can start once T005 markup exists

## MVP

- T002–T006 (counts + search)

## Implementation strategy

Harden counts, add present helpers, then UI bar and CSS.
