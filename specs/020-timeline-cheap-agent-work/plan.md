# Implementation Plan: Timeline Cheap Agent Work

**Branch**: `020-timeline-cheap-agent-work` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-timeline-cheap-agent-work/spec.md`

## Summary

Make agent legwork visible inside the order Timeline. History events whose recorded actor is an agent become **agent cheap work** rows. Read-only **agent checks** are added beside proof, cost-claim, alert and delivery events. Each check is computed only from the event's own recorded fields. It is presentation-only: no new storage, no new agent runtime, no change to approval flows.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (App Router)

**Primary Dependencies**: Existing presenter pipeline (`lib/present/events.ts` → `record.ts` history → `timeline.ts` entries → `components/record/timeline.tsx`)

**Storage**: None. Checks are derived at read time from `operational_events.changes`

**Testing**: `npm run typecheck`; manual check on `ord-00194` (Agent work 12, Everything 49, Needs a person 5)

**Target Platform**: Local hackathon demo (browser)

**Project Type**: Web application (control-room starter)

**Performance Goals**: No extra queries; O(events) work per order

**Constraints**: Constitution II/III. Cheap checks are read-only and never offer Approve/Reject. "Needs a person" counts are unchanged.

**Scale/Scope**: 4 check kinds (proof.submitted, expense.submitted, alert.raised, vehicle.delivered) + agent-actor reclassification (~86 dispatch-agent offers)

## Constitution Check

| Gate | Status |
|------|--------|
| I. Exception-first | PASS — cheap rows never count toward Needs a person; urgency stays calm |
| II. Agents do legwork | PASS — this feature makes the legwork visible where it happens |
| III. Human approval before change | PASS — checks state "no change to the order"; no actions offered |
| IV. Real agent, synthetic world | PASS — results come only from synthetic recorded fields, never invented |
| V. Operations taste | PASS — quieter row style, one-line results, green "Agent · cheap" chip |

## Design

- **HistoryEvent** gains `actorKind`, `command`, and `agentCheck { title, result } | null`.
- **`agentCheckFor(command, changes)`** in `events.ts` returns null when the needed field is missing.
- **Timeline**: actorKind `agent` → `category: "agent"`, `activityType: "cheap"`, `agentInvolvement: "cheap_work"`, bot icon. Each agentCheck → an extra `agent-check:<eventId>` entry.
- **Sort**: a shared `compareNewest` puts an agent check directly above its event when timestamps tie.
- **UI**: `cheap_work` rows show an "Agent · cheap" chip instead of StatusPill, plain detail (no Issue/Impact grid), and the `.cheap-agent` quiet styles.
- **Activity provenance section** stays untouched: it reads `view.history`, which has no synthetic rows.

## Project Structure

```text
specs/020-timeline-cheap-agent-work/
├── spec.md
├── plan.md
├── checklists/requirements.md
└── tasks.md

starter/
├── lib/present/types.ts            # HistoryEvent fields
├── lib/present/events.ts           # agentCheckFor + actorKind/command
├── lib/present/timeline.ts         # reclassify + inject checks + compareNewest
├── app/components/record/timeline.tsx  # chip + quiet body
├── app/globals.css                 # .timeline-row.cheap-agent
├── lib/build-notes.ts              # judgement entry
└── lib/pitch.ts                    # Criterion 1 talking point
```

## Complexity Tracking

N/A. This is additive presentation logic in existing modules.
