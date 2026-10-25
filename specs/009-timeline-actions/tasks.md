# Tasks: Timeline Action Column

**Input**: `/specs/009-timeline-actions/`

## Phase 1: Setup

- [x] T001 Confirm row markup in `starter/app/components/record/timeline.tsx` and `.timeline-row` / `.timeline-btn` in `starter/app/globals.css`

## Phase 2: Foundational

- [x] T002 Define row grid columns icon | main | meta | actions in `starter/app/globals.css` (narrow stacks)

## Phase 3: User Story 1 - Far-right action column (P1) 🎯 MVP

**Goal**: Approve/Reject in far-right column; utilities under main.

**Independent Test**: Pending rows show actions right-aligned in a column.

- [x] T003 [US1] Move Approve/Reject into `timeline-aside` / action column; keep View steps under main in `starter/app/components/record/timeline.tsx`
- [x] T004 [US1] Place time in meta column above/with aside in `starter/app/components/record/timeline.tsx`

## Phase 4: User Story 2 - Color-coded actions (P1)

**Goal**: Approve solid green; Reject outlined.

- [x] T005 [US2] Apply `timeline-btn approve` and `timeline-btn reject` classes in `starter/app/components/record/timeline.tsx`
- [x] T006 [P] [US2] Style approve/reject in `starter/app/globals.css` using green tokens; keep labels text-visible

## Phase 5: User Story 3 - Conversation primary in column (P2)

- [x] T007 [US3] Put Open conversation in action column; Open in Conversations stays ghost under main in `starter/app/components/record/timeline.tsx`

## Phase 6: Polish

- [x] T008 Run quickstart.md; verify Approve/Reject still wire; mark done

## MVP

T001–T006
