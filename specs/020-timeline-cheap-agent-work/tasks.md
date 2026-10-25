# Tasks: Timeline Cheap Agent Work

**Input**: Design documents from `/specs/020-timeline-cheap-agent-work/`

**Prerequisites**: plan.md, spec.md

**Tests**: Not requested. Validation is `npm run typecheck` plus the manual check in Phase 6.

## Phase 1: Setup

- [X] T001 Point `.specify/feature.json` at `specs/020-timeline-cheap-agent-work`

## Phase 2: Foundational (blocks all stories)

- [X] T002 Add optional `actorKind`, `command`, and `agentCheck: { title; result } | null` to `HistoryEvent` in `starter/lib/present/types.ts`
- [X] T003 Return `actorKind` (resolved actor kind) and `command` from `describeEvent` in `starter/lib/present/events.ts`
- [X] T004 Add a shared `compareNewest` comparator (newest first; `agent-check:` entries just above their event on a tie) and use it in `buildTimeline` and `sortTimelineEntries` in `starter/lib/present/timeline.ts`

**Checkpoint**: Types compile; Timeline order unchanged for existing rows.

## Phase 3: User Story 1 — Agent-recorded events read as agent work (P1) 🎯 MVP

**Goal**: Events whose actor is an agent show under "Agent work" as cheap work.

**Independent Test**: On an order with a dispatch-agent "Driver offer published", the row shows a bot icon, "Dispatch agent → Order", and is counted in Agent work, not Activity.

- [X] T005 [US1] In `buildTimeline`, map `actorKind === "agent"` history events to `category: "agent"`, `icon: "bot"`, `activityType: "cheap"`, `agentInvolvement: "cheap_work"`, `result: "Done by agent"` in `starter/lib/present/timeline.ts`
- [X] T006 [US1] Keep non-agent events (driver, operator, customer, handoff contact, system) as `category: "activity"` unchanged in `starter/lib/present/timeline.ts`

## Phase 4: User Story 2 — Cheap agent checks between events (P1)

**Goal**: Read-only checks appear directly above proof, claim, alert and delivery events.

**Independent Test**: On `ord-00194`, each proof/claim/alert/delivery event has one "Agent …" row above it with the same time, and Needs a person is still 5.

- [X] T007 [US2] Implement `agentCheckFor(command, changes)` in `starter/lib/present/events.ts`. It covers proof.submitted (file_count), expense.submitted (receipt_count, kind), alert.raised (linked record ids), and vehicle.delivered (keys_received, receiver), and returns null when the required field is missing.
- [X] T008 [US2] Attach `agentCheck` to each `HistoryEvent` returned by `describeEvent` in `starter/lib/present/events.ts`
- [X] T009 [US2] In `buildTimeline`, push an `agent-check:<eventId>` entry (source "Ops agent", meta "Read-only check · no change to the order", `needsPerson: false`, `progress: "completed"`, no proposalId) for each event with an `agentCheck` in `starter/lib/present/timeline.ts`

## Phase 5: User Story 3 — Cheap work stays visually quiet (P2)

**Goal**: Cheap rows look calmer than decision rows and never carry urgency badges.

**Independent Test**: Cheap rows show the green "Agent · cheap" chip, no StatusPill, and smaller muted text. Needs a person shows no cheap rows.

- [X] T010 [US3] In `TimelineRow`, render an "Agent · cheap" `timeline-chip type-cheap` instead of `StatusPill`, an accent icon, and a `cheap-agent` class for `agentInvolvement === "cheap_work"` in `starter/app/components/record/timeline.tsx`
- [X] T011 [US3] Skip the Issue/Impact field grid for `activityType === "cheap"` rows in `StructuredBodyView` in `starter/app/components/record/timeline.tsx`
- [X] T012 [P] [US3] Add `.timeline-row.cheap-agent` quiet styles (tighter padding, weight 500 title, 12.5px muted routing/detail) in `starter/app/globals.css`

## Phase 6: Polish & Cross-Cutting

- [X] T013 [P] Add the "Cheap agent work hidden as plain Activity" judgement entry (outcome: changed) in `starter/lib/build-notes.ts`
- [X] T014 [P] Add the Criterion 1 talking point about "Agent · cheap" timeline rows in `starter/lib/pitch.ts`
- [X] T015 Run `npm run typecheck` in `starter/`
- [X] T016 Manual check on `http://localhost:3000/orders/ord-00194`: Everything 49, Agent work 12, Needs a person 5; cheap rows labelled "Agent · cheap"; the Activity provenance section still lists the original events only (`starter/app/components/record/sections.tsx` unchanged)

## Dependencies

- Phase 2 → Phases 3, 4, 5 (all need the HistoryEvent fields and comparator).
- US1 (T005–T006) and US2 (T007–T009) are independent of each other. Both touch `timeline.ts`, so run them one after the other.
- US3 depends on US1 or US2 producing `cheap_work` rows to style.
- Polish runs last. T013 and T014 can run in parallel.

## Parallel Examples

- T012 (CSS) runs alongside T010/T011 (component).
- T013 (build notes) runs alongside T014 (pitch).

## Implementation Strategy

MVP = Phase 2 + US1: agent-recorded events become visible agent work. Then add US2 checks, then US3 polish, then the narrative updates.
