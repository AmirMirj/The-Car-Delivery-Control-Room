# Tasks: Timeline Badge Urgency

**Input**: `/specs/011-timeline-badge-urgency/`

## Phase 1: Setup

- [x] T001 Confirm StatusPill + Needs a person tag in `starter/app/components/record/timeline.tsx`

## Phase 2: Foundational

- [x] T002 Add `statusUrgency(entry)` → critical \| elevated \| calm in `starter/lib/present/timeline.ts`

## Phase 3: User Story 1 - One badge (P1) 🎯 MVP

- [x] T003 [US1] Remove redundant Needs a person row tags from TimelineRow and TimelineThread in `starter/app/components/record/timeline.tsx`
- [x] T004 [US1] Wire StatusPill to include urgency class from T002 in `starter/app/components/record/timeline.tsx`

## Phase 4: User Story 2 - Color by urgency (P1)

- [x] T005 [US2] Style `.timeline-status.urgency-critical|elevated|calm` in `starter/app/globals.css` (bright only for critical)
- [x] T006 [P] [US2] Soften default awaiting_review / completed so urgency classes own the hierarchy in `starter/app/globals.css`

## Phase 5: Polish

- [x] T007 Quickstart spot-check; filter pill still Needs a person

## MVP

T001–T005
