# Tasks: Combined Order Timeline

**Input**: Design documents from `/specs/002-combined-timeline/`

## Phase 1: Setup

- [x] T001 Add timeline types and builder module path `starter/lib/present/timeline.ts`

## Phase 2: Foundational

- [x] T002 Implement `buildTimeline(view)` producing entries + counts per data-model.md in `starter/lib/present/timeline.ts`

## Phase 3: User Story 1 — Combined list (P1)

**Goal**: Timeline section with rows matching screenshot structure.

**Independent Test**: Order page shows Timeline with rows.

- [x] T003 [US1] Create `Timeline` component in `starter/app/components/record/timeline.tsx`
- [x] T004 [US1] Style timeline header, rows, chips in `starter/app/globals.css`
- [x] T005 [US1] Mount Timeline in `starter/app/components/order-detail.tsx` after hero; remove redundant AttentionPanel if Timeline covers needs-attention

## Phase 4: User Story 2 — Filter pills (P1)

**Goal**: Everything / Needs attention / Conversations / Agent work / Activity pills.

**Independent Test**: Each pill filters list; active pill filled.

- [x] T006 [US2] Wire pill tablist + client filter state in `starter/app/components/record/timeline.tsx`
- [x] T007 [US2] Default selected filter per FR-003; empty-state copy in same file

## Phase 5: User Story 3 — Details below (P2)

**Goal**: Keep depth sections.

**Independent Test**: Conversations/Decisions/Activity still below.

- [x] T008 [US3] Verify order-detail still renders ConversationsSection, DecisionsSection, ActivitySection after Timeline in `starter/app/components/order-detail.tsx`

## Phase 6: Polish

- [x] T009 [P] Optionally fold local agent proposals from order `agent` prop into agent category in timeline builder / Timeline props
- [x] T010 Manual quickstart.md check on a live order

## Dependencies

Setup → Foundational → US1 → US2 → US3 → Polish

## MVP

T001–T007
