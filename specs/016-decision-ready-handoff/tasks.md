# Tasks: Decision-Ready Handoff

**Input**: Design documents from `/specs/016-decision-ready-handoff/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — manual quickstart only.

**Organization**: By user story (four judging questions).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

**Purpose**: Align feature pointer

- [x] T001 Confirm `.specify/feature.json` points at `specs/016-decision-ready-handoff`

---

## Phase 2: Foundational

**Purpose**: Shared decide-cue helper used by exceptions API

- [x] T002 Add `decideCueForException` helper in `starter/lib/present/decide-cue.ts` per `contracts/exception-decide-cue.md`

**Checkpoint**: Helper ready for US1

---

## Phase 3: User Story 1 - Only orders that need a person (P1) 🎯 MVP

**Goal**: Exception queue shows reason + decide cue; quiet orders stay off home

**Independent Test**: Home cards each show reason + decideCue; quiet order only via `/lanes`

- [x] T003 [US1] Add `decideCue` to each item in `starter/app/api/exceptions/route.ts`
- [x] T004 [US1] Render `decideCue` on exception cards in `starter/app/page.tsx`

---

## Phase 4: User Story 2 - Provenance visible (P1)

**Goal**: Facts show where they came from; no noise jump CTAs

**Independent Test**: Timeline shows source→destination; no “Open in Prior agent work”

- [x] T005 [P] [US2] Remove `openProvenanceFold` and “Open in Prior agent work” from `starter/app/components/record/timeline.tsx`
- [x] T006 [US2] Ensure routing/provenance line remains visible on agent and attention entries in `starter/app/components/record/timeline.tsx`

---

## Phase 5: User Story 3 - Cheap work, stop, hand over (P1)

**Goal**: Cheap steps + handoff findings obvious before Approve

**Independent Test**: View agent steps works; agent panel shows findings bullets

- [x] T007 [US3] Emphasize handoff findings heading in `starter/app/components/agent-panel.tsx` (“What the agent found”)
- [x] T008 [US3] Confirm cheap-step expand remains for agent entries in `starter/app/components/record/timeline.tsx` (fix if broken)

---

## Phase 6: User Story 4 - Clear next step after decide (P1)

**Goal**: After Approve/Reject, show applied/not-applied + Next: line

**Independent Test**: Review a proposal; outcome banner appears on order page

- [x] T009 [US4] Add DecisionOutcome state + banner in `starter/app/components/order-detail.tsx` after successful review
- [x] T010 [US4] Style outcome banner in `starter/app/globals.css` (or existing order CSS file)
- [x] T011 [US4] Mirror brief next-step line under the reviewed timeline entry actions in `starter/app/components/record/timeline.tsx` when outcome maps to that proposal

---

## Phase 7: Polish

- [x] T012 [P] Run `npm run typecheck` in `starter/`
- [x] T013 Walk `specs/016-decision-ready-handoff/quickstart.md` checklist mentally against UI

---

## Dependencies

- Setup → Foundational → US1 → US2/US3 (parallelizable after US1) → US4 → Polish
- US4 depends on existing review handler in order-detail

## Parallel examples

```text
# After T004:
T005 + T007 in parallel
```

## Implementation strategy

MVP = T002–T004 (decide cues on queue). Then provenance cleanup, handoff copy, decision outcome.

## MVP scope

User Story 1 only (T002–T004).
