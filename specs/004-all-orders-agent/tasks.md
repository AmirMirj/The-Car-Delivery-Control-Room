# Tasks: All-Orders Agent Coverage

**Input**: Design documents from `/specs/004-all-orders-agent/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — manual via quickstart.md

## Phase 1: Setup

- [x] T001 Verify on-road agent loop, qualify helpers, store, exceptions home, and overview/lanes touchpoints in `starter/lib/agent/`, `starter/app/page.tsx`, `starter/app/lanes/page.tsx`

---

## Phase 2: Foundational

- [x] T002 Extend `starter/scripts/ensure-agent-tables.ts` with `onroad_fleet_passes` (status `running|completed|failed`, counters) and `onroad_fleet_pass_outcomes` (result `ran|skipped_pending|failed|no_qualify`)
- [x] T003 Add fleet pass CRUD + single-flight lock helpers in `starter/lib/agent/store.ts`
- [x] T004 Implement fleet orchestration (scan qualify, skip pending proposal, sequential run, update counters) in `starter/lib/agent/fleet.ts`
- [x] T005 Add `GET`/`POST` `starter/app/api/agent/fleet/route.ts` (409 when busy; trigger `fleet_pass`)

**Checkpoint**: API can start/poll a fleet pass

---

## Phase 3: User Story 1 - Agent covers the full order set (Priority: P1) 🎯 MVP

**Goal**: Explicit “Run for all qualifying” walks all qualifying orders

**Independent Test**: POST fleet; every qualifying order ran/skipped/failed with a reason; quiet orders untouched

- [x] T006 [US1] Wire “Run for all qualifying” + full progress panel (poll ~2s) on `starter/app/page.tsx`
- [x] T007 [P] [US1] Style fleet progress chrome in `starter/app/globals.css`
- [x] T008 [US1] Ensure pending proposals are skipped and counted in pass progress via `starter/lib/agent/fleet.ts`

**Checkpoint**: Fleet pass works from exception home

---

## Phase 4: User Story 2 - See agent status on all-orders browse (Priority: P1)

**Goal**: Lanes summary + card cues for proposal waiting / working / failed

**Independent Test**: `/lanes` shows summary and ≥3 proposal-waiting cues without opening cards

- [x] T009 [US2] Attach `agentStatus` to overview cards in overview/board present path (`starter/lib/present/board.ts` and/or overview route)
- [x] T010 [US2] Render agent status cue on `starter/app/components/card.tsx`
- [x] T011 [US2] Show compact fleet pass summary banner on `starter/app/lanes/page.tsx` (no primary Run button)

**Checkpoint**: Browse shows agent state

---

## Phase 5: User Story 3 - Same rules, many orders (Priority: P1)

**Goal**: Approvals and failure isolation unchanged across fleet runs

**Independent Test**: Approve one / reject one after fleet; one failure does not stop pass

- [x] T012 [US3] Confirm fleet uses existing `runOnRoadAgent` + proposal review paths (no bypass) in `starter/lib/agent/fleet.ts`
- [x] T013 [US3] Continue pass after per-order failure; surface failed_count in UI on `starter/app/page.tsx`

**Checkpoint**: Safety rules hold at fleet scale

---

## Phase 6: Polish

- [x] T014 Run `specs/004-all-orders-agent/quickstart.md` (including 409 overlap)
- [x] T015 [P] Note fleet pass in `starter/README.md`

---

## Dependencies

- Foundational → US1 → US2 (cues need status data) → US3 verify → Polish
- MVP = Phase 1–3 (T001–T008)

## Parallel

```bash
T007 with T006 styling
T009 || T011 after API exists
```

## Notes

- Skip pending proposals; block overlapping passes; exception home stays default
