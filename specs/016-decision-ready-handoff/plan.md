# Implementation Plan: Decision-Ready Handoff

**Branch**: `016-decision-ready-handoff` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-decision-ready-handoff/spec.md`

## Summary

Close the four judging questions in the live UI: exception-only queue with decide cues; visible provenance on the decision surface; inspectable cheap steps + handoff findings; explicit “what happens next” after Approve/Reject. Prefer small present/UI changes over new services—reuse exceptions API, timeline, and agent review endpoints.

## Technical Context

**Language/Version**: TypeScript 5.x / Node 24, React 19, Next.js 16

**Primary Dependencies**: Existing starter (`drizzle-orm`, `postgres`, Next App Router)

**Storage**: Postgres (orders + agent run/proposal tables already present)

**Testing**: Manual quickstart + `npm run typecheck` (no new TDD suite requested)

**Target Platform**: Local web demo (localhost)

**Project Type**: Web application (Next.js starter under `starter/`)

**Performance Goals**: Exception list and order open remain interactive on ~100-order snapshot

**Constraints**: Constitution gates (exception-first, cheap-first agent, human approval, ops taste); no reintroducing removed jump CTAs

**Scale/Scope**: UI/present-layer polish across home queue + order timeline/agent strip

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status |
|-----------|--------|
| I. Exception-First | PASS — home queue + decide cues; quiet orders stay out |
| II. Agents Do the Legwork | PASS — cheap steps + handoff findings before person |
| III. Human Approval Before Change | PASS — Approve/Reject gate; next-step after decision |
| IV. Real Agent, Synthetic World | PASS — no new live integrations |
| V. Operations Taste | PASS — remove noise CTAs; clear next-step copy |

Post-design: unchanged — contracts stay presentation-level.

## Project Structure

### Documentation (this feature)

```text
specs/016-decision-ready-handoff/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── exception-decide-cue.md
│   └── decision-outcome-ui.md
└── tasks.md
```

### Source Code

```text
starter/
├── app/
│   ├── page.tsx                          # exception queue cards
│   ├── api/exceptions/route.ts           # decideCue field
│   └── components/
│       ├── record/timeline.tsx           # provenance, cheap steps, next-step, no noise CTAs
│       ├── agent-panel.tsx               # handoff findings emphasis
│       └── order-detail.tsx              # wire review → outcome banner
└── lib/
    ├── present/attention.ts              # decide cue helpers (if needed)
    └── agent/                            # review response already returns status
```

## Complexity Tracking

No unjustified complexity. Single feature slice; no new services or DB tables unless review payload already lacks next-step text (then derive in present layer).
