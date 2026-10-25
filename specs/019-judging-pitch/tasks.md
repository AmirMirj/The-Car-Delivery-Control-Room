# Tasks: Judging Pitch (Max Points)

**Input**: Design documents from `/specs/019-judging-pitch/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup

- [X] T001 Point `.specify/feature.json` at `specs/019-judging-pitch`

## Phase 2: Foundational

- [X] T002 Add `PitchDoc` types + curated pitch content (weights 40/30/30, checklist problem|solution|ai|demo, ShowcaseHint with vehicleSubstrings and preferOnRoad) in `starter/lib/pitch.ts`
- [X] T003 Add `resolveShowcaseFromExceptions` in `starter/lib/present/showcase-order.ts` (prefer vehicle substring match, then qualifiesOnRoad / agent, else first exception; fallback label when empty)

## Phase 3: User Story 1 - Three-criterion pitch path (P1) 🎯 MVP

**Goal**: Judges open Pitch with weighted criteria and live links

**Independent Test**: Nav → Pitch → one click to `/`, `/lanes`, `/build`

- [X] T004 [US1] Add `section: "pitch"` + Review nav link to `/pitch` in `starter/app/components/app-frame.tsx`
- [X] T005 [US1] Implement Pitch page (criteria, checklist, live links + showcase resolve) in `starter/app/pitch/page.tsx`
- [X] T006 [US1] Add `.pitch-*` styles (calm Review chrome) in `starter/app/globals.css`

## Phase 4: User Story 2 - Showcase order (P1)

**Goal**: Showcase link resolves to a real exception/on-road order when seeded

**Independent Test**: Showcase link opens `/orders/{id}` or calm fallback to `/`

- [X] T007 [US2] Wire showcase resolution into Pitch Criterion 1 links in `starter/app/pitch/page.tsx` using `starter/lib/present/showcase-order.ts` + `/api/exceptions`

## Phase 5: User Story 3 - Build notes narrative (P2)

**Goal**: Event-formatting throw-away + approval-gate guardrail on Build notes

**Independent Test**: `/build` shows both entries without tool dumps

- [X] T008 [P] [US3] Add bloated event-log throw-away / first-answer entry in `starter/lib/build-notes.ts`
- [X] T009 [P] [US3] Add approval-gate guardrail entry (ferry / promise / customer message) in `starter/lib/build-notes.ts`

## Phase 6: Polish

- [X] T010 [P] `npm run typecheck` in `starter/`

## Dependencies

Setup → Foundational → US1 → US2 (showcase wire) → US3 parallel content → polish

## MVP

T002–T006

## Parallel opportunities

T008 ∥ T009 after US1
