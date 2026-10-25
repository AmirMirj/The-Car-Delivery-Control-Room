# Tasks: On-road Agent Panel — Concise UI

**Input**: Design documents from `/specs/007-agent-panel-ui/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual (quickstart). No automated tests.

## Phase 1: Setup

- [x] T001 Confirm touch points: `starter/app/components/agent-panel.tsx`, `starter/app/globals.css`; optional helper path `starter/lib/present/agent-panel.ts`

## Phase 2: Foundational

- [x] T002 Create `splitHandoverBullets(text, max=5)` and `previewText(text, maxChars≈180)` helpers in `starter/lib/present/agent-panel.ts` (FindingsView / ChatTurnView per data-model.md)

**Checkpoint**: Helpers ready for UI

## Phase 3: User Story 1 - Scan handoff in seconds (P1) 🎯 MVP

**Goal**: Compact findings bullets + expand; no duplicate Proposed decision when pending exists.

**Independent Test**: Decision appears once; findings ≤5 bullets before expand.

- [x] T003 [US1] Shorten header policy to one muted line in `starter/app/components/agent-panel.tsx`
- [x] T004 [US1] Render findings as ≤5 bullets from handoverSummary with “Show full handoff” expand in `starter/app/components/agent-panel.tsx` using T002
- [x] T005 [US1] When pending proposal exists, omit separate Proposed decision / decisionText block (decision only on approval card) in `starter/app/components/agent-panel.tsx`

**Checkpoint**: US1 demoable

## Phase 4: User Story 2 - One clear approval card (P1)

**Goal**: Single approval card; settled proposals compact/folded.

**Independent Test**: One Approve/Reject group; settled history does not dominate.

- [x] T006 [US2] Restyle pending block as single approval card (title, one decision, Approve/Reject, one-line demo hint) in `starter/app/components/agent-panel.tsx`
- [x] T007 [US2] Collapse settled proposals into `<details>` or last-1 compact summary in `starter/app/components/agent-panel.tsx`
- [x] T008 [P] [US2] Style approval card + findings list in `starter/app/globals.css`

**Checkpoint**: US2 demoable

## Phase 5: User Story 3 - Compact chat (P2)

**Goal**: Truncate long chat messages; compact composer.

**Independent Test**: Long assistant handoff not fully visible by default; Show more works.

- [x] T009 [US3] Truncate user/assistant messages with Show more using `previewText` in `starter/app/components/agent-panel.tsx`; keep last ~6–8 turns
- [x] T010 [P] [US3] Compact chat / composer styles in `starter/app/globals.css`

**Checkpoint**: US3 demoable

## Phase 6: Polish

- [x] T011 Run `specs/007-agent-panel-ui/quickstart.md` validation; fix gaps in agent-panel / CSS
- [x] T012 [P] Ensure quiet/error empty states stay one-line in `starter/app/components/agent-panel.tsx`

## Dependencies

Setup → Foundational → US1 → US2 → US3 → Polish  
US2 can share file with US1 (sequential on agent-panel.tsx).

## MVP

T001–T005

## Parallel

T008 ∥ after T006; T010 ∥ T009
