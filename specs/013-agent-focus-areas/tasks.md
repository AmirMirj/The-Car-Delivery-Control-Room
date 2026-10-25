# Tasks: Agent Focus Areas (Timeline Trace Redesign)

**Input**: Design documents from `/specs/013-agent-focus-areas/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification — omit automated test tasks.

**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete work)
- **[Story]**: US1–US4 map to spec.md user stories
- Include exact file paths in descriptions

## Path Conventions

Web app under `starter/` per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align feature docs and scaffold directories from the plan

- [x] T001 Confirm design artifacts exist under `specs/013-agent-focus-areas/` (spec, plan, research, data-model, contracts, quickstart)
- [x] T002 Create directories `starter/lib/agent/areas/` and ensure `starter/app/components/record/` is ready for `agent-trace.tsx` per `specs/013-agent-focus-areas/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared focus catalog, match result types, and AgentTrace/Span models — MUST complete before user stories

**⚠️ CRITICAL**: No user story work until this phase is complete

- [x] T003 [P] Define `FocusAreaId` as `"pickup_readiness" | "driver_travel" | "on_the_road" | "driver_support"` and `AgentFocusArea` fields (`id`, `name`, `jobLine`, `agentMay`, `humanMust`, `exampleSituations`) in `starter/lib/agent/focus-areas.ts`
- [x] T004 [P] Export `listFocusAreas()` returning exactly the four catalog entries with plain ops names and one-line jobs in `starter/lib/agent/focus-areas.ts` per `contracts/focus-areas.md`
- [x] T005 Define `MatchResult` as `matched: { focusArea }` | `ambiguous: { candidates: FocusAreaId[] }` and implement `matchFocusArea(view)` in `starter/lib/agent/match-focus.ts` (auto signals; ambiguous on ties/unclear; never two agents for one situation)
- [x] T006 [P] Define `AgentTrace`, `AgentSpan` (`category`: `agent` | `llm` | `tool` | `handoff` | `other`; `status`: `ok` | `error` | `unset`; optional `toolName`, `tokensIn`/`tokensOut`), and `HumanDecision` in `starter/lib/agent/traces.ts` per `data-model.md`
- [x] T007 Implement `buildAgentTrace(...)` mapping runs/messages/proposals → parent-child spans with `focusArea` on the trace in `starter/lib/agent/traces.ts`
- [x] T008 [P] Define `GanttRow` projection helper (`depth`, `label`, `start`/`end` ms relative to trace start, `milestone`: `handoff` | `decision` | null, `category`) in `starter/lib/agent/traces.ts` or `starter/lib/present/timeline.ts`

**Checkpoint**: Foundation ready — catalog, matcher, and trace models available

---

## Phase 3: User Story 1 — Shared handoff: agent prep, human decision (Priority: P1) 🎯 MVP

**Goal**: Ops sees prep trail + one clear decision/options; consequential actions stop for a person; decision outcome visible.

**Independent Test**: Open an order where prep finished; decision package present; approve/reject without re-research; no autonomous purchase.

### Implementation for User Story 1

- [x] T009 [US1] Ensure agent run completion creates/updates a handoff span (`category: "handoff"`) and `HumanDecision` summary/options on the trace in `starter/lib/agent/traces.ts` / existing proposal store (`starter/lib/agent/store.ts`)
- [x] T010 [US1] Wire Timeline/agent surfaces so awaiting-person state shows decision package (approve / reject / choose option) with focus-area label in `starter/app/components/record/timeline.tsx` and/or `starter/app/components/agent-panel.tsx`
- [x] T011 [US1] Enforce FR-005: no purchase/booking/date/cost/customer-message completion without recorded human decision in agent apply/review paths under `starter/lib/agent/` and `starter/app/api/orders/[id]/agent/`
- [x] T012 [US1] After human decision, show outcome and next step on the order Timeline entry / proposal row in `starter/app/components/record/timeline.tsx`

**Checkpoint**: US1 handoff loop works for at least one focus area (prefer On the road reuse)

---

## Phase 4: User Story 2 — All four live agents, clearly named (Priority: P1)

**Goal**: All four focus areas named + job lines on Timeline/agent panel; only matching agent runs; auto-match; ambiguous → ops pick once.

**Independent Test**: Name all four agents and jobs from Timeline/agent panel; clear situation auto-selects; ambiguous shows picker once.

### Implementation for User Story 2

- [x] T013 [P] [US2] Render four focus-area name + `jobLine` list on the order agent panel in `starter/app/components/agent-panel.tsx` (FR-013 primary surface)
- [x] T014 [P] [US2] Mirror four-area identity (name + job) in Timeline header/toolbar region in `starter/app/components/record/timeline.tsx`
- [x] T015 [US2] Call `matchFocusArea(view)` before starting a run; if `matched`, attach `focusArea` to run/trace in agent run API/route under `starter/app/api/orders/[id]/agent/`
- [x] T016 [US2] If `ambiguous`, show one-shot focus-area picker in `starter/app/components/agent-panel.tsx` and do not start an agent until pick (FR-003c)
- [x] T017 [US2] Highlight only the running/matched focus area; never present all four as simultaneously active on one situation in `starter/app/components/agent-panel.tsx`
- [x] T018 [US2] Label every agent prep/handoff UI row with producing `focusArea` name in `starter/app/components/record/timeline.tsx`

**Checkpoint**: US2 identity + matching + ambiguous picker verifiable without needing all four area tools deep

---

## Phase 5: User Story 3 — Four live areas with clear agent vs human boundaries (Priority: P2)

**Goal**: Each of the four agents can run area-shaped prep with documented agentMay vs humanMust; shared handoff pattern.

**Independent Test**: For each area, state goal and agent vs human; run a short prep→handoff path (mocks OK).

### Implementation for User Story 3

- [x] T019 [P] [US3] Add Pickup readiness area stub (mock phone/menu/callback tools; stop before consequential commitment) in `starter/lib/agent/areas/pickup-readiness.ts`
- [x] T020 [P] [US3] Add Driver travel area stub (mock multimodal/hotel compare; prepare bookings stopping before final payment) in `starter/lib/agent/areas/driver-travel.ts`
- [x] T021 [P] [US3] Adapt existing On the road loop to register as `on_the_road` focus area in `starter/lib/agent/areas/on-the-road.ts` (or thin wrapper around `starter/lib/agent/loop.ts`)
- [x] T022 [P] [US3] Add Driver support area stub (routine Q&A + escalate with summary; no booking invent) in `starter/lib/agent/areas/driver-support.ts`
- [x] T023 [US3] Route matched `focusArea` to the correct area module when starting a run in `starter/lib/agent/loop.ts` or a new `starter/lib/agent/dispatch.ts`
- [x] T024 [US3] Surface each area’s agentMay vs humanMust (short readable copy) beside the four-area list in `starter/app/components/agent-panel.tsx` from `listFocusAreas()`

**Checkpoint**: Each of four areas can produce a labeled prep→handoff (depth may be uneven)

---

## Phase 6: User Story 4 — Area-shaped work + trace/Gantt redesign (Priority: P2)

**Goal**: Agent activity looks like the area’s job; Timeline/agent panel offers OpenSearch-inspired tree + PowerGraph-inspired Gantt + span detail, synchronized.

**Independent Test**: Sample order per area shows area-shaped steps; selecting a span syncs tree/Gantt/detail; handoff milestone visible.

### Implementation for User Story 4

- [x] T025 [US4] Create `AgentTraceView` with synchronized **trace tree**, **Gantt timeline**, and **span detail** panel in `starter/app/components/record/agent-trace.tsx` per `contracts/timeline-trace-ui.md`
- [x] T026 [US4] Render Gantt bars from `GanttRow` (bar width = duration, indentation = depth, milestone diamonds for handoff/decision, optional now-line) in `starter/app/components/record/agent-trace.tsx`
- [x] T027 [US4] Color-code span categories (`agent` / `llm` / `tool` / `handoff` / `other`) and show error cue for `status: "error"` in `starter/app/components/record/agent-trace.tsx` + `starter/app/globals.css`
- [x] T028 [US4] Embed `AgentTraceView` into order Timeline / agent panel flow in `starter/app/components/record/timeline.tsx` and `starter/app/components/agent-panel.tsx` when a trace exists
- [x] T029 [US4] Link Timeline agent entries to `traceId`/`spanId` where applicable in `starter/lib/present/timeline.ts`
- [x] T030 [P] [US4] Style birch/ops trace/Gantt chrome (no purple novelty; not OpenSearch/Power BI lookalikes) in `starter/app/globals.css`

**Checkpoint**: Trace redesign usable for at least one full On the road run and stubs for other areas

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation and consistency across stories

- [x] T031 Run `npx tsc --noEmit` in `starter/` and fix type errors from focus/trace changes
- [x] T032 Walk `specs/013-agent-focus-areas/quickstart.md` scenarios (four names, auto-match, ambiguous picker, handoff, tree/Gantt sync, per-area smoke)
- [x] T033 [P] Update `starter/README.md` with a short note on four focus areas + Timeline trace views (ops-facing)
- [x] T034 Mark completed tasks in `specs/013-agent-focus-areas/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: after Setup — **blocks** all stories
- **US1 (Phase 3)**: after Foundational — MVP handoff
- **US2 (Phase 4)**: after Foundational; benefits from US1 handoff UI but identity/matcher can land in parallel with care on shared panel files
- **US3 (Phase 5)**: after Foundational + matcher (T015); area stubs parallelizable
- **US4 (Phase 6)**: after T006–T008 (trace model); best after US1 handoff spans exist
- **Polish**: after desired stories

### User Story Dependencies

- **US1 (P1)**: Foundational only — MVP
- **US2 (P1)**: Foundational; shares `agent-panel.tsx` / `timeline.tsx` with US1 (serialize file edits)
- **US3 (P2)**: Needs matcher + dispatch; area files [P] among themselves
- **US4 (P2)**: Needs trace builder; UI can proceed once T006–T008 done

### Parallel Opportunities

- T003 || T004 || T006 || T008 (after types settle)
- T013 || T014
- T019 || T020 || T021 || T022
- T030 || T033

### Parallel Example: User Story 3

```bash
Task: "Add Pickup readiness stub in starter/lib/agent/areas/pickup-readiness.ts"
Task: "Add Driver travel stub in starter/lib/agent/areas/driver-travel.ts"
Task: "Adapt On the road as on_the_road in starter/lib/agent/areas/on-the-road.ts"
Task: "Add Driver support stub in starter/lib/agent/areas/driver-support.ts"
```

### Parallel Example: User Story 2

```bash
Task: "Render four focus areas on agent-panel.tsx"
Task: "Mirror four-area identity on timeline.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1–2 foundation (catalog, match types, trace model)
2. Phase 3 US1 handoff on existing On the road path
3. **STOP and VALIDATE** quickstart handoff scenarios

### Incremental Delivery

1. US2 — four names + auto-match + ambiguous picker  
2. US3 — four area stubs + dispatch  
3. US4 — tree/Gantt/detail redesign  
4. Polish + quickstart

### Suggested MVP scope

**T001–T012** (Setup + Foundational + US1) — shared handoff with trace-ready model; then US2 for discoverability before deepening all four areas.

---

## Notes

- All tasks use checklist format with IDs and file paths
- No automated test tasks (not requested in spec)
- Constitution “one area” vs four live: follow clarifications; keep approval gates
- Format validation: every task has `- [ ]`, TaskID, optional `[P]`/`[USn]`, and a file path
