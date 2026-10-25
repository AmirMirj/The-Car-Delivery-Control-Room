# Tasks: Unified Order Tracking

**Input**: Design documents from `/specs/005-unified-tracking/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/timeline-ui.md, quickstart.md

**Tests**: Manual only (quickstart.md). No automated test tasks.

**Organization**: By user story (US1–US4) so each increment is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US4 maps to spec user stories
- Exact file paths in every task

## Path Conventions

Web app under `starter/` (present layer + order UI).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm touch points for the existing Combined Timeline (feature 002); no new packages.

- [x] T001 Confirm feature touch points exist: `starter/lib/present/timeline.ts`, `starter/app/components/record/timeline.tsx`, `starter/app/components/order-detail.tsx`, `starter/app/globals.css` (align with plan.md Source tree)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the present-layer Timeline model so all stories can populate and render tracking fields. MUST complete before US work.

**⚠️ CRITICAL**: No user story UI work until this phase is done

- [x] T002 Extend `TimelineEntry` toward TrackingEntry in `starter/lib/present/timeline.ts`: add required fields `activityType: "cheap" | "consequential" | "na"`, `progress: "open" | "in_progress" | "waiting_person" | "waiting_counterparty" | "completed" | "failed"`, `agentInvolvement: "none" | "cheap_work" | "proposed" | "reviewed" | "applied"`, `source: string`, `destination: string`, `result: string`; rename `needsAttention` → `needsPerson` (boolean, required); add optional `cheapSteps: { name: string; result: string; at?: string }[]`, `threadId`, `proposalId`, `runId`
- [x] T003 Update `buildTimeline`, `filterTimeline`, counts, and `defaultTimelineFilter` in `starter/lib/present/timeline.ts` to use `needsPerson` and treat attention filter as `needsPerson === true` OR `category === "attention"`; pending local/record proposals MUST set `needsPerson=true` when status is awaiting review
- [x] T004 Update all `TimelineEntry` / `needsAttention` call sites in `starter/app/components/record/timeline.tsx` (and any other starter imports) to compile against T002–T003 types

**Checkpoint**: Types build; Timeline still mounts (may show placeholders for new fields until US2)

---

## Phase 3: User Story 1 - One place to track the order story (Priority: P1) 🎯 MVP

**Goal**: Unified Timeline is clearly primary: **Needs a person** pill label, header `Timeline · showing N`, attention-first default, provenance folds collapsed below.

**Independent Test**: Open an order with attention + conversation + agent + activity; Timeline sits above deep folds; pills include Needs a person; cold open defaults there when attention/pending exists; header count matches visible rows; Conversations / Prior agent work / Activity start collapsed.

### Implementation for User Story 1

- [x] T005 [US1] Rename attention pill label from “Needs attention” to **Needs a person** and row tag copy to match in `starter/app/components/record/timeline.tsx` (filter id may stay `attention`)
- [x] T006 [US1] Change Timeline header to `Timeline · showing {visibleCount}` (not bare “Timeline N”) in `starter/app/components/record/timeline.tsx` per contracts/timeline-ui.md
- [x] T007 [US1] Ensure `defaultTimelineFilter` prefers Needs a person when `counts.attention > 0` (attention rows and/or pending proposals with `needsPerson`), else Everything — in `starter/lib/present/timeline.ts`; wire initial state in `starter/app/components/record/timeline.tsx`
- [x] T008 [US1] Collapse provenance by default: Conversations, Prior agent work (RecordsPanel / proposals fold), and Activity start closed in `starter/app/components/order-detail.tsx` and/or `starter/app/components/record/sections.tsx` / `starter/app/components/record/records.tsx` (FR-007); Timeline stays open as primary
- [x] T009 [P] [US1] Add calm empty-state copy per filter (including empty Needs a person) in `starter/app/components/record/timeline.tsx`

**Checkpoint**: US1 independently demoable (filters + default + collapsed folds + header)

---

## Phase 4: User Story 2 - Every entry keeps the tracking fields (Priority: P1)

**Goal**: Every Timeline row retains timestamp, activity type (cheap / consequential / na), progress, agent involvement, source→destination, result; agent work is **one row per run/proposal** with cheap steps nested.

**Independent Test**: Pick three rows (conversation, agent, activity); name all six tracking fields without opening a second primary panel; agent run shows one top-level row with cheap steps in summary/expand.

### Implementation for User Story 2

- [x] T010 [US2] Populate TrackingEntry fields for attention + conversation builders in `starter/lib/present/timeline.ts` (`activityType`, `progress`, `agentInvolvement`, `source`, `destination`, `result`, `at`; system fallback e.g. “System” → “Order” when parties missing)
- [x] T011 [US2] Populate agent entries as **one top-level row per run/proposal** in `starter/lib/present/timeline.ts`: set `activityType` consequential for gated proposal, nest tool/lookup steps in `cheapSteps` with `activityType` cheap; set `progress`/`result`/`agentInvolvement`/`needsPerson` from proposal status (awaiting review → waiting_person / “Awaiting review” / proposed)
- [x] T012 [P] [US2] Populate activity/history entries with tracking fields + System→Order fallback in `starter/lib/present/timeline.ts`
- [x] T013 [US2] Render row chips for time, activity type (Cheap / Consequential; omit if `na`), progress, agent involvement (hide if `none`), From → To, result, Needs a person tag in `starter/app/components/record/timeline.tsx` per contracts/timeline-ui.md
- [x] T014 [P] [US2] Style tracking chips / from-to / result in `starter/app/globals.css` (locale short date+time; no broken date concatenation)
- [x] T015 [US2] Expand agent row to show nested `cheapSteps` (name + result) under the parent run/proposal in `starter/app/components/record/timeline.tsx` without creating extra top-level rows

**Checkpoint**: SC-005 / SC-006 checkable on a demo order

---

## Phase 5: User Story 3 - Easy to see status and next step (Priority: P1)

**Goal**: Pending proposals and open conversations are visually distinct; conversation messages expand **inline** on the Timeline row; optional link to collapsed Conversations fold.

**Independent Test**: Pending agent proposal shows awaiting-review under Agent / Needs a person; open conversation shows needs-person cues; expand conversation → messages inline without leaving Timeline.

### Implementation for User Story 3

- [x] T016 [US3] Distinguish waiting-for-person / proposal vs settled agent history via progress, result, and tone in `starter/app/components/record/timeline.tsx` (Review/Apply remain on consequential pending rows if already wired)
- [x] T017 [US3] Add per-row expand state (`expandedEntryIds`) for conversation entries; render inline messages via existing ThreadMessages (or equivalent) under the row in `starter/app/components/record/timeline.tsx` (FR-017); pass thread payload/`threadId` from builder
- [x] T018 [P] [US3] Optional “Open in Conversations” control that scrolls/opens the collapsed Conversations provenance fold in `starter/app/components/record/timeline.tsx` + section anchor ids in `starter/app/components/record/sections.tsx`
- [x] T019 [P] [US3] Expand/collapse chrome styles for inline thread and cheap-steps panel in `starter/app/globals.css`

**Checkpoint**: Status scanning + inline conversation expand work without a second primary panel

---

## Phase 6: User Story 4 - Arrive from exceptions already oriented (Priority: P2)

**Goal**: Opening an order from the exception queue (“Needs a person” home) lands on Timeline with attention-first filter when attention exists.

**Independent Test**: From exception item → order; Timeline visible near top; default filter Needs a person when attention/pending exists; if none, Everything with calm empty Needs a person via pill.

### Implementation for User Story 4

- [x] T020 [US4] Verify Timeline remains above the fold / immediately under situation header when arriving from exceptions in `starter/app/components/order-detail.tsx` (and order page mount); no Conversations-only first paint
- [x] T021 [US4] Confirm cold-open default uses T007 `defaultTimelineFilter` on navigation from home exception list (no sticky unrelated filter); document any hash/query if needed in order page `starter/app/orders/[id]/page.tsx` only if required for remount

**Checkpoint**: Exception → order orientation matches SC-002 language

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and small consistency fixes

- [x] T022 [P] Sweep remaining “Needs attention” Timeline UI copy (pill/tag only on order Timeline) in `starter/app/components/record/timeline.tsx` — leave board filter labels in `starter/lib/present/board-filters.ts` unless they are the same control
- [x] T023 Run manual validation scenarios in `specs/005-unified-tracking/quickstart.md` on a messy seeded order; fix gaps found in timeline present/UI files
- [x] T024 [P] Spot-check all five pills: header visible count equals row count (SC-004) in `starter/app/components/record/timeline.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: After Foundational — MVP
- **US2 (Phase 4)**: After Foundational; best after US1 header/pills stable (shares `timeline.tsx`)
- **US3 (Phase 5)**: After US2 field population (needs `threadId` / `cheapSteps` on entries)
- **US4 (Phase 6)**: After US1 default filter (T007); light verification
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2–US4
- **US2 (P1)**: After Phase 2 — can start in parallel with US1 on `timeline.ts` vs UI label tasks; merge carefully on `timeline.tsx`
- **US3 (P1)**: Depends on US2 builder fields for expand payloads
- **US4 (P2)**: Depends on US1 default filter behavior

### Within Each User Story

- Present-model population before UI chips where the same story owns both
- Core row before expand/inline
- Story complete before next priority when staffing is sequential

### Parallel Opportunities

- T009 || T008 after T005–T007 (empty copy vs fold defaults; different files)
- T012 || T010 after T002–T003 (activity vs attention/conversation builders in same file — prefer sequential if one editor)
- T014 || T013 (CSS vs JSX)
- T018 || T019 after T017
- T022 || T024 during polish

---

## Parallel Example: User Story 1

```bash
# After T005–T007 (shared timeline.tsx), split:
Task: "T008 Collapse provenance folds in order-detail / sections / records"
Task: "T009 Empty-state copy in timeline.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T014 Style tracking chips in globals.css"
Task: "T013 Render chips in timeline.tsx"  # coordinate if same PR
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup (T001)
2. Phase 2 Foundational (T002–T004)
3. Phase 3 US1 (T005–T009)
4. **STOP**: Validate filters, default, header, collapsed folds
5. Demo MVP “one place to track”

### Incremental Delivery

1. Setup + Foundational
2. US1 → demo primary Timeline
3. US2 → tracking fields + agent grain
4. US3 → status cues + inline expand
5. US4 → exception arrival check
6. Polish + quickstart

### Parallel Team Strategy

1. Shared: T001–T004
2. Then: Dev A US1 UI labels/header/folds; Dev B US2 field population in `timeline.ts`
3. Merge; then US3 expand; then US4 + polish

---

## Notes

- No new HTTP endpoints (contracts/timeline-ui.md non-goals)
- Do not create one top-level Timeline row per cheap tool call (FR-010 / SC-006)
- Attention filter label is **Needs a person**; filter id may remain `attention`
- Commit after each task or logical group; stop at checkpoints to validate independently
`}
