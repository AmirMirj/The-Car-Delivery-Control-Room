# Tasks: Timeline Field Grid

**Input**: `/specs/010-timeline-field-grid/`

## Phase 1: Setup

- [x] T001 Confirm `StructuredBodyView` in `starter/app/components/record/timeline.tsx` and `.timeline-struct` in `starter/app/globals.css`

## Phase 2: Foundational

- [x] T002 No present-model changes; keep `structuredBodyFromEntry` in `starter/lib/present/timeline.ts`

## Phase 3: User Story 1 - Two-column field grid (P1) 🎯 MVP

**Goal**: Two field cells per row on desktop.

**Independent Test**: 4 fields → ~2 visual rows.

- [x] T003 [US1] Wrap each dt/dd pair in `.timeline-struct-field` in `starter/app/components/record/timeline.tsx`
- [x] T004 [US1] CSS outer 2-column grid + narrow 1-column for `.timeline-struct` in `starter/app/globals.css`

## Phase 4: User Story 2 - Muted labels / strong values (P1)

- [x] T005 [US2] Style `dt` muted and `dd` bold/dark in `starter/app/globals.css`

## Phase 5: Polish

- [x] T006 Spot-check quickstart; ensure single-field and no-struct fallback still OK

## MVP

T001–T005
