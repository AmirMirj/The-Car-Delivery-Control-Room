# Tasks: Efficient By-Lane Board

**Input**: Design documents from `/specs/003-efficient-lanes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — manual validation via quickstart.md only

**Organization**: Tasks grouped by user story for independent delivery

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3 from spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm touchpoints for the lanes board enhancement

- [x] T001 Verify existing lanes page, Card, overview API, and LANES labels in `starter/app/lanes/page.tsx`, `starter/app/components/card.tsx`, `starter/app/api/overview/`, and `starter/lib/present/labels.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared helpers and CSS tokens before story UI work

- [x] T002 [P] Add lane pill tone helpers / CSS classes for operational lanes in `starter/app/globals.css` (and extend `starter/lib/present/labels.ts` if needed)
- [x] T003 [P] Create board filter types (`all` | `needs_attention` | `has_owner`) in `starter/lib/present/board-filters.ts`
- [x] T004 [P] Create decisive-date progress helper (nullable pct; no fake %) in `starter/lib/present/board-progress.ts`

**Checkpoint**: Helpers ready — story UI can begin

---

## Phase 3: User Story 1 - Scan lanes with less noise (Priority: P1) 🎯 MVP

**Goal**: Coloured lane header pills + counts, owner pills on cards, filter pills that shrink the board client-side

**Independent Test**: On `/lanes`, headers use pill labels; cards show owner when attention names one; filter pills update cards/counts without navigation

### Implementation for User Story 1

- [x] T005 [US1] Refactor `starter/app/lanes/page.tsx` into a client board with filter pill toolbar (`All`, `Needs attention`, optional `Has owner`) and `aria-pressed`
- [x] T006 [US1] Render lane headers as coloured pills + live counts (after filter) in `starter/app/lanes/page.tsx`; keep operational lane names (FR-001)
- [x] T007 [US1] Show owner coloured pill on cards when attention has owner; no spam on quiet cards in `starter/app/components/card.tsx`
- [x] T008 [US1] Apply filter client-side over overview cards and update empty-lane copy in `starter/app/lanes/page.tsx`
- [x] T009 [P] [US1] Style filter pills, lane header pills, and denser card chrome in `starter/app/globals.css`

**Checkpoint**: US1 independently usable on `/lanes`

---

## Phase 4: User Story 2 - Progress toward the next step (Priority: P2)

**Goal**: Snapshot-relative progress/urgency bar from decisive dates; omit when no date

**Independent Test**: Moving order with promise/ETA shows progress; no decisive date → no invented %

### Implementation for User Story 2

- [x] T010 [US2] Wire `board-progress` into Card (pass snapshotAt / decisive) in `starter/app/components/card.tsx` and `starter/app/lanes/page.tsx`
- [x] T011 [US2] Render thin progress bar + accessible % when pct is non-null; mute/complete for delivered/cancelled when appropriate in `starter/app/components/card.tsx`
- [x] T012 [P] [US2] Style progress bar (grey track, fill) in `starter/app/globals.css`

**Checkpoint**: US1 + US2 both work

---

## Phase 5: User Story 3 - Keep exception-first product shape (Priority: P1)

**Goal**: Confirm home remains exception queue; lanes stay secondary browse

**Independent Test**: `/` is Needs a person; `/lanes` is browse

### Implementation for User Story 3

- [x] T013 [US3] Verify `starter/app/page.tsx` remains exception queue and AppFrame still links By lane secondary; do not make `/lanes` the default home
- [x] T014 [US3] Ensure lanes page title/copy stays browse-oriented (not “sprint board”) in `starter/app/lanes/page.tsx`

**Checkpoint**: Exception-first shape preserved

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate against quickstart and contracts

- [x] T015 Run `specs/003-efficient-lanes/quickstart.md` scenarios against local app
- [x] T016 [P] Optionally note `/lanes` board chrome in `starter/README.md` if lanes docs exist

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup → Foundational → US1 (MVP) → US2 → US3 verify → Polish
- US2 depends on Card from US1 for progress row placement
- US3 is verification; no blocking code for US1/US2

### User Story Dependencies

- **US1**: After Foundational
- **US2**: After US1 card surface (owner row exists)
- **US3**: Independent verify anytime after home/lanes routes exist

### Parallel Opportunities

- T002, T003, T004 in parallel
- T009 with T007/T008 once page shell exists
- T012 with T010/T011 styling

---

## Parallel Example: Foundational

```bash
Task: "Add lane pill tones in starter/app/globals.css"
Task: "Create board-filters.ts"
Task: "Create board-progress.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001–T004 foundation
2. T005–T009 filter pills + lane pills + owner pills
3. Validate SC-001 / SC-002 manually

### Incremental Delivery

1. US1 → denser scannable board
2. US2 → decisive progress
3. US3 → confirm exception home
4. Quickstart polish

## Notes

- No new APIs; reuse `/api/overview`
- Do not rename lanes to To-do / In Progress / Complete
- No fake progress percentages
