# Tasks: Timeline Polish

**Input**: Design documents from `/specs/006-timeline-polish/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual (quickstart). No automated tests.

## Phase 1: Setup

- [x] T001 Confirm touch points: `starter/lib/present/timeline.ts`, `starter/app/components/record/timeline.tsx`, `starter/app/components/order-detail.tsx`, `starter/app/globals.css`

## Phase 2: Foundational

- [x] T002 Add `statusDisplay` helper + labels mapping progress/needsPerson/result → action_required | awaiting_review | completed | failed | in_progress | neutral in `starter/lib/present/timeline.ts`
- [x] T003 Add `structuredBodyFromEntry(entry)` heuristic returning `{ issue?, impact?, driver?, next? }` in `starter/lib/present/timeline.ts`

**Checkpoint**: Helpers exportable; no UI break yet

## Phase 3: User Story 1 - Scan without badge noise (P1) 🎯 MVP

**Goal**: Collapsed row shows one status + routing; full chips under Show details.

**Independent Test**: ≤2 primary chrome signals + optional Needs a person; Show details reveals 005 fields.

- [x] T004 [US1] Replace default `TrackingChips` stack with status pill + routing line in `starter/app/components/record/timeline.tsx`
- [x] T005 [US1] Add Show details expand revealing activity type, progress, agent involvement, source→destination, result in `starter/app/components/record/timeline.tsx`
- [x] T006 [P] [US1] Style status pill + routing + details panel in `starter/app/globals.css`

**Checkpoint**: US1 demoable

## Phase 4: User Story 2 - Structured body (P1)

**Goal**: Issue / Impact / Next / Driver labels on attention and agent rows when possible.

**Independent Test**: On-road proposal shows labeled Issue and Next (or calm detail fallback).

- [x] T007 [US2] Render StructuredBody labels in Timeline rows (attention + agent) via T003 in `starter/app/components/record/timeline.tsx`
- [x] T008 [P] [US2] Style structured body (`.timeline-struct`) in `starter/app/globals.css`

**Checkpoint**: US2 demoable

## Phase 5: User Story 3 - Real actions (P1)

**Goal**: Approve/Reject on pending local proposals; View agent steps; conversation open; no fake Call CTAs.

**Independent Test**: Review from Timeline updates proposal; steps expand; no Call Dealer.

- [x] T009 [US3] Pass `orderId` + `onReview` / busy from `starter/app/components/order-detail.tsx` into Timeline
- [x] T010 [US3] Render Approve / Reject on pending `local-agent:` rows; call review API; reload in `starter/app/components/record/timeline.tsx`
- [x] T011 [US3] Rename cheap-steps control to View agent steps (N); keep conversation expand + Open in Conversations; ensure no fake Call/Email buttons in `starter/app/components/record/timeline.tsx`

**Checkpoint**: US3 demoable

## Phase 6: User Story 4 - Layout hierarchy (P2)

**Goal**: Hero → Timeline → collapsed folds; no Critical Issues band.

**Independent Test**: Visual layout check; Needs a person remains filter only.

- [x] T012 [US4] Verify order-detail mount order and collapsed folds remain; do not add Critical Issues section in `starter/app/components/order-detail.tsx` / `sections.tsx`

**Checkpoint**: Layout matches plan

## Phase 7: Polish

- [x] T013 Run `specs/006-timeline-polish/quickstart.md` validation; fix gaps in timeline present/UI
- [x] T014 [P] Deduplicate conversation rows by threadId if double-listed in `starter/lib/present/timeline.ts` or Timeline render

## Dependencies

Setup → Foundational → US1 → US2 → US3 → US4 → Polish  
US2 can start after T004; US3 needs OrderPane wiring after US1 chrome stable.

## MVP

T001–T006 (tidy collapsed chrome + Show details)

## Parallel

T006 ∥ T005 after T004; T008 ∥ T007; T014 during polish
