# Implementation Plan: Agent Focus Areas (Timeline Trace Redesign)

**Branch**: `013-agent-focus-areas` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-agent-focus-areas/spec.md` plus redesign direction: adapt [OKVIZ / PowerGraph Gantt Timeline](https://okviz.com/index/timeline-powergraph/) patterns and [OpenSearch Agent Traces](https://docs.opensearch.org/latest/observing-your-data/agent-traces/agent-tracing/) interaction model into the control-room Timeline / agent panel (no Power BI / OpenSearch dependency).

## Summary

Ship **four live focus-area agents** (Pickup readiness, Driver travel, On the road, Driver support) under one shared prep→human-decision contract. Automatically match **one** agent to the current order situation (ops picks once if ambiguous). Redesign the order **Timeline / agent panel** as an ops-facing **agent-trace workspace**: hierarchical Gantt-style duration bars (PowerGraph-inspired) plus synchronized trace tree / span detail (OpenSearch Agent Traces–inspired), so prep trails and handoffs are scannable by focus area—not a generic chat dump.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js App Router (existing `starter/`)  
**Primary Dependencies**: Existing agent loop (`starter/lib/agent/*`), Timeline presenters (`starter/lib/present/timeline.ts`), order `RecordView`; CSS in `globals.css` (birch/ops). Optional lightweight SVG/CSS for Gantt bars—no Power BI visual, no OpenSearch cluster.  
**Storage**: Existing Postgres agent tables (`onroad_runs`, `onroad_messages`, `onroad_proposals`); extend presentation model for traces/spans; mock phone/travel/support tools as needed.  
**Testing**: Manual quickstart scenarios + `npx tsc --noEmit`  
**Target Platform**: Ops control room browser  
**Project Type**: Web app (`starter/`)  
**Performance Goals**: Timeline/trace view interactive for a typical order (< ~200 spans) without lag  
**Constraints**: Human approval before purchase/booking/cost/customer contact; synthetic world only; birch/ops taste (not observability IDE chrome); situation-matched single agent; names on Timeline/agent panel  
**Scale/Scope**: Four focus areas; redesign primary Timeline + agent panel; matcher + ambiguous picker; per-area demo stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / gate | Status | Notes |
|------------------|--------|-------|
| I. Exception-first | Pass | Trace UI surfaces decisions and prep; quiet noise stays out |
| II. Agents do the legwork | Pass | Prep spans + handoff decision package |
| III. Human approval before change | Pass | FR-005; purchase/booking stop before human |
| IV. Real agent, synthetic world | Pass | Real LLM loop; mocked phone/travel/support |
| V. Operations taste | Pass | Adapt PowerGraph/OpenSearch **patterns**, not their product chrome; birch/ops |
| Challenge: one agent / one area | **Violation (justified)** | Clarifications chose **all four live**; see Complexity Tracking |
| Presenter boundary | Pass | Trace/Gantt models in `lib/present` or `lib/agent` presenters |

**Gate**: PASS with justified constitution divergence (breadth of four live agents).

### Constitution Check (post-design)

Unchanged: redesign stays presentation + agent instrumentation; approval gates intact; no real payments; Complexity Tracking still required for four-agent breadth.

## Project Structure

### Documentation (this feature)

```text
specs/013-agent-focus-areas/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── focus-areas.md
│   └── timeline-trace-ui.md
└── tasks.md              # (/speckit-tasks — not this command)
```

### Source Code

```text
starter/lib/agent/focus-areas.ts       # catalog, goals, agent-vs-human bounds
starter/lib/agent/match-focus.ts       # automatic situation → focus area (+ ambiguous)
starter/lib/agent/traces.ts            # build AgentTrace / AgentSpan from runs+messages
starter/lib/agent/areas/               # per-area tools/prompts stubs (pickup, travel, onroad, support)
starter/lib/present/timeline.ts        # integrate focus labels + trace-linked entries
starter/app/components/record/timeline.tsx
starter/app/components/agent-panel.tsx # four-area identity + ambiguous picker
starter/app/components/record/agent-trace.tsx  # Gantt + tree + span detail (new)
starter/app/globals.css
starter/app/api/orders/[id]/agent/...  # extend as needed for multi-area runs
```

**Structure Decision**: Single Next.js `starter/` app; extend existing agent + Timeline surfaces. Visual redesign is first-party React/CSS inspired by the two references—not embedding OKVIZ or OpenSearch Dashboards.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Four live agents vs constitution “one real agent for one area” | Clarification session (2026-10-25) explicitly chose live agents for all four areas | Catalog-only for unused areas rejected by product owner |
| Trace/Gantt dual view vs flat Timeline list | Spec requires scannable prep trails (FR-007) and area-shaped work; OpenSearch/PowerGraph patterns make hierarchy + duration readable | Flat list alone hides concurrent cheap steps and bottlenecks |

## Redesign intent (references)

1. **[PowerGraph Gantt Timeline](https://okviz.com/index/timeline-powergraph/)** → category hierarchy (focus area → run → spans), horizontal duration bars, milestones (handoff / human decision), today/“now” marker, rollup of parent rows—adapted as a compact ops Timeline strip, not a project-portfolio BI visual.
2. **[OpenSearch Agent Traces](https://docs.opensearch.org/latest/observing-your-data/agent-traces/agent-tracing/)** → Trace = one focus-area invocation; Spans = Agent / LLM / Tool / Other; synchronized **tree + Gantt timeline + span detail panel**; color by span category; ERROR badge on failed tools—adapted into birch/ops styling inside the order record.
