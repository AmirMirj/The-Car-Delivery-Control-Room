# Tasks: Drop Residual Timeline Details Bar

**Input**: `/specs/008-drop-details-bar/`

## Phase 1: Setup

- [x] T001 Confirm `DetailsPanel` / Show details live in `starter/app/components/record/timeline.tsx` and `.timeline-details` in `starter/app/globals.css`

## Phase 2: Foundational

- [x] T002 No shared schema changes; present TrackingEntry fields stay in `starter/lib/present/timeline.ts` (display strip only removed)

## Phase 3: User Story 1 - No duplicate chip strip (P1) 🎯 MVP

**Goal**: Remove Show/Hide details and beige chip bar everywhere on Timeline.

**Independent Test**: No details bar; status pill + routing + actions remain.

- [x] T003 [US1] Remove `DetailsPanel`, `detailsOpen` state, and Show/Hide details buttons from rows and threads in `starter/app/components/record/timeline.tsx`
- [x] T004 [P] [US1] Remove unused imports (`activityTypeLabel`, `progressLabel`, `agentInvolvementLabel` if unused) in `starter/app/components/record/timeline.tsx`
- [x] T005 [P] [US1] Remove `.timeline-details` (and orphaned chip-only styles if unused) from `starter/app/globals.css`

## Phase 4: Polish

- [x] T006 Spot-check Timeline filters still show status, routing, Approve/steps/conversation controls in `starter/app/components/record/timeline.tsx`

## Dependencies

T001 → T002 → T003 → T004/T005 → T006

## MVP

T001–T005
