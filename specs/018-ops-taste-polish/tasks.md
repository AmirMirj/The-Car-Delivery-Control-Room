# Tasks: Ops Taste Polish

**Input**: `/specs/018-ops-taste-polish/`

## Phase 1: Setup

- [X] T001 Point `.specify/feature.json` at `specs/018-ops-taste-polish`

## Phase 2: Foundational

- [X] T002 Add `humanizeAgentStatus` + `opsLoadError` in `starter/lib/present/ops-copy.ts`

## Phase 3: User Story 1 - Glanceable daily queue (P1) 🎯 MVP

**Independent Test**: Non-engineer reads top cards’ reason + decide + agent line

- [X] T003 [US1] Use plain agent labels + ops errors + run button copy in `starter/app/page.tsx`
- [X] T004 [US1] Sticky `.board-head` on queue page in `starter/app/globals.css`
- [X] T005 [US1] Collapse idle fleet progress into `<details>` in `starter/app/page.tsx`

## Phase 4: User Story 2 - Empty/loading (P1)

- [X] T006 [P] [US2] Loading/empty copy in `starter/app/lanes/page.tsx`
- [X] T007 [P] [US2] Loading copy in `starter/app/orders/[id]/page.tsx`
- [X] T008 [P] [US2] Loading/empty copy in `starter/app/inbox/page.tsx`
- [X] T009 [P] [US2] Loading/empty copy in `starter/app/components/entity-page.tsx`
- [X] T010 [US2] Use `opsLoadError` on lanes errors in `starter/app/lanes/page.tsx`

## Phase 5: User Story 3 - Quiet chrome (P2)

- [X] T011 [US3] Ensure fleet/details styling stays secondary in `starter/app/globals.css`

## Phase 6: Polish

- [X] T012 [P] `npm run typecheck` in `starter/`

## MVP

T002–T005

## Dependencies

Foundational → US1 → US2 (parallel pages) → US3 → polish
