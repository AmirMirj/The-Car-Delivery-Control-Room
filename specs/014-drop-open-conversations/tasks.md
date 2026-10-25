# Tasks: Drop “Open in Conversations” Link

**Input**: Design documents from `/specs/014-drop-open-conversations/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — omit automated test tasks.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Confirm “Open in Conversations” lives in `starter/app/components/record/timeline.tsx` (`TimelineThread`)

---

## Phase 2: Foundational

- [x] T002 Confirm no other required callers of `openProvenanceFold("conversations")` from Timeline conversation utils beyond the link to remove (document in task notes if any remain)

---

## Phase 3: User Story 1 — Remove link (Priority: P1) 🎯 MVP

**Goal**: Conversation Timeline rows no longer show “Open in Conversations”.  
**Independent Test**: String absent from Timeline UI; other conversation actions still work.

- [x] T003 [US1] Remove the “Open in Conversations” ghost button and its `openProvenanceFold("conversations")` handler from `TimelineThread` in `starter/app/components/record/timeline.tsx`
- [x] T004 [US1] Clean empty `timeline-utils` wrapper in that row if it becomes empty after removal in `starter/app/components/record/timeline.tsx`

**Checkpoint**: SC-001 satisfied

---

## Phase 4: Polish

- [x] T005 Run `npx tsc --noEmit` in `starter/`
- [x] T006 Verify `rg "Open in Conversations" starter/app/components/record/timeline.tsx` has no matches; mark tasks complete in `specs/014-drop-open-conversations/tasks.md`

---

## Dependencies

- T001 → T002 → T003 → T004 → T005 → T006

## MVP

- T003–T004

## Notes

- Out of scope: “Open in Prior agent work”
