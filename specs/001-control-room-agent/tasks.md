# Tasks: Control Room + On-Road Agent

**Input**: Design documents from `/specs/001-control-room-agent/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested — smoke extensions only in polish.

**Organization**: By user story (US1–US5) after shared foundation.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [x] T001 Create agent module directories `starter/lib/agent/` and `starter/app/lanes/` per plan.md structure
- [x] T002 Add optional AI deps (`ai`, `@ai-sdk/openai`) and env keys to `starter/package.json` and `starter/.env.example` (`OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`)

---

## Phase 2: Foundational

- [x] T003 Extend Drizzle schema in `starter/lib/schema.ts` with `agent_runs`, `agent_messages`, `local_proposals`, `applied_mutations` per data-model.md (status enums as text checks documented in comments)
- [x] T004 [P] Implement qualify + policy helpers in `starter/lib/agent/qualify.ts` and `starter/lib/agent/policy.ts` (on-road qualify; deny customer contact; allowlisted MutationOp types)
- [x] T005 [P] Implement mock tools in `starter/lib/agent/mocks.ts` and tool registry in `starter/lib/agent/tools.ts` (order lookup, ask_driver, request_evidence, map_lookup; blocked contact_customer)
- [x] T006 Implement agent loop + mock-LLM fallback in `starter/lib/agent/loop.ts`
- [x] T007 Implement synthetic apply in `starter/lib/mutations.ts` writing `applied_mutations` and order notes / related local state
- [x] T008 Run `npm run db:push` against local Compose DB after schema change

**Checkpoint**: Foundation ready

---

## Phase 3: User Story 1 — Exception queue home (P1) 🎯 MVP

**Goal**: `/` is exception queue with reasons; lanes secondary.

**Independent Test**: Open `/` — exception list only; `/lanes` shows old board.

- [x] T009 [US1] Add `GET` handler in `starter/app/api/exceptions/route.ts` per `contracts/exception-queue.md` reusing attention from `starter/lib/present/`
- [x] T010 [US1] Rebuild home UI as exception queue in `starter/app/page.tsx` with calm empty state and search
- [x] T011 [US1] Move lane board UI to `starter/app/lanes/page.tsx` and link from `starter/app/components/app-frame.tsx`
- [x] T012 [US1] Add queue styles in `starter/app/globals.css` (ops-facing, not developer chrome)

**Checkpoint**: US1 demoable

---

## Phase 4: User Story 2 — Provenance (P1)

**Goal**: Messy facts remain source-visible on order page.

**Independent Test**: Open messy order — conflicts and quote≠booking still labelled.

- [x] T013 [P] [US2] Audit order detail sections in `starter/app/components/order-detail.tsx` / `starter/app/components/record/` — ensure quote vs booking and dual claims stay visible; fix any regression from queue work
- [x] T014 [US2] Surface attention reasons list near headline on order page when multiple reasons exist (`starter/app/components/record/header.tsx` or sections)

**Checkpoint**: US2 holds with US1

---

## Phase 5: User Story 3 — Auto agent + approve (P1)

**Goal**: Auto-run on qualify; proposal; approve applies synthetic ops.

**Independent Test**: Qualifying order gets proposal; approve mutates local state; reject does not.

- [x] T015 [US3] Implement `POST` `starter/app/api/orders/[id]/agent/run/route.ts` per `contracts/on-road-agent.md`
- [x] T016 [US3] Implement review `POST` `starter/app/api/orders/[id]/agent/proposals/[proposalId]/review/route.ts`
- [x] T017 [US3] Extend `GET` `starter/app/api/orders/[id]/route.ts` with `agent` payload per `contracts/order-record.md`
- [x] T018 [US3] Add proposal review panel UI in `starter/app/components/agent-panel.tsx` and wire into `starter/app/components/order-detail.tsx`
- [x] T019 [US3] Trigger auto-run from exception queue and/or order page when `qualifiesOnRoad` and no active run (`starter/app/page.tsx` and/or order detail)

**Checkpoint**: US3 demo path works

---

## Phase 6: User Story 4 — Talk to agent (P2)

**Goal**: Chat continues the real/mock loop with tools.

**Independent Test**: Ask safety question; see assistant + tool trail; customer contact refused.

- [x] T020 [US4] Implement `POST` `starter/app/api/orders/[id]/agent/route.ts` for chat messages
- [x] T021 [US4] Add chat UI to `starter/app/components/agent-panel.tsx` with message list + composer

**Checkpoint**: US4 works on same order page

---

## Phase 7: User Story 5 — Collaboration / failure paths (P3)

**Goal**: Show handovers, failures, ownership.

**Independent Test**: Failed/dismissed proposal and handover visible on timeline/panel.

- [x] T022 [US5] Show run status, failures, and actor labels (agent vs ops) in `starter/app/components/agent-panel.tsx`
- [x] T023 [US5] Append lightweight activity lines for run/review into order history presentation via `starter/lib/present/events.ts` or agent panel history subsection

**Checkpoint**: US5 visible in demo

---

## Phase 8: Polish

- [x] T024 [P] Extend `starter/scripts/smoke.ts` for `/api/exceptions` and approve happy-path against mock-LLM
- [x] T025 [P] Update root or `starter/README.md` with exception home + agent env notes
- [x] T026 Run typecheck/build and quickstart.md manual checklist

---

## Dependencies & Execution Order

- Setup → Foundational (blocks all stories) → US1 → US2 → US3 → US4 → US5 → Polish
- US1 is MVP; US3 is the agent core; US4/US5 deepen demo

## Parallel opportunities

- T004/T005 after T003 schema sketched
- T013 parallel with early US3 API once order page stable
- T024/T025 in polish

## MVP scope

T001–T012 (exception home) then T015–T019 (agent approve) for a minimal judging demo.
