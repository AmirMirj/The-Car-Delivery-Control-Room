# Tasks: AI Build Judgement

**Input**: Design documents from `/specs/017-ai-build-judgement/`

**Tests**: Not requested — manual quickstart only.

## Phase 1: Setup

- [x] T001 Point `.specify/feature.json` at `specs/017-ai-build-judgement`

## Phase 2: Foundational

- [x] T002 Add curated `BuildNotesDoc` module in `starter/lib/build-notes.ts` with four sections per data-model

## Phase 3: User Story 1 - Judges can read AI judgement (P1) 🎯 MVP

**Goal**: `/build` page with four sections, linked from nav

**Independent Test**: Open Build notes; identify ask/check/throw/reject examples in ≤60s

- [x] T003 [US1] Extend `Section` + sidebar Review group in `starter/app/components/app-frame.tsx`
- [x] T004 [US1] Create `starter/app/build/page.tsx` rendering build notes via AppFrame
- [x] T005 [US1] Add minimal styles for build notes in `starter/app/globals.css`

## Phase 4: User Story 2 - Ops taste (P2)

**Goal**: Calm presentation; outcome chips only where useful

- [x] T006 [US2] Render optional outcome chips without tool scoreboard chrome in `starter/app/build/page.tsx`

## Phase 5: Polish

- [x] T007 [P] Run `npm run typecheck` in `starter/`
- [x] T008 Confirm home remains `/` and content matches real build decisions

## Dependencies

Setup → Foundational → US1 → US2 → Polish

## MVP

T002–T005

## Parallel examples

After T004: T005 and content polish can proceed together.
