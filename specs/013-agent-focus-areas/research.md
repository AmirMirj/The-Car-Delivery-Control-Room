# Research: Agent Focus Areas + Timeline Trace Redesign

## Decision: Inspire UX from PowerGraph + OpenSearch Agent Traces; do not adopt their platforms

**Rationale**: Spec needs hierarchical prep trails and duration-aware agent work on the order. [OKVIZ PowerGraph Gantt](https://okviz.com/index/timeline-powergraph/) shows category rollups, bars, and milestones; [OpenSearch Agent Traces](https://docs.opensearch.org/latest/observing-your-data/agent-traces/agent-tracing/) defines Trace/Span, span categories (Agent/LLM/Tool), and synchronized tree + Gantt + detail panel. Embedding Power BI or OpenSearch would fight birch/ops taste and hackathon stack.

**Alternatives considered**: Keep flat Timeline list only; embed OpenSearch Dashboards iframe; use a heavy charting library for full Gantt. Rejected for taste, scope, and ops clarity.

## Decision: Trace = focus-area run; Span ≈ tool/LLM/message step

**Rationale**: Maps cleanly to existing `onroad_runs` / `onroad_messages` / proposals. OpenSearch’s `gen_ai.operation.name` categories become our span kinds: `agent`, `llm`, `tool`, `handoff`, `other`. Focus area name maps to `gen_ai.agent.name`-style label in UI.

**Alternatives considered**: One mega-trace for the whole order forever; span-per-Timeline-row only. Rejected—order Timeline still mixes conversations/activity; agent prep needs its own hierarchy.

## Decision: Automatic situation matcher with ops pause-on-ambiguous

**Rationale**: Clarifications: auto-match; if unclear, ask ops once. Implement as pure function over order signals (attention kinds, journey stage, open threads, keywords) returning `{ focusArea } | { ambiguous: FocusArea[] }`.

**Alternatives considered**: Always ops-pick; always default On the road. Rejected by clarify answers.

## Decision: Four live agents, shared handoff contract, uneven depth OK

**Rationale**: Product chose all four live. On the road can reuse existing loop deepest; Pickup / Travel / Support ship with mock tools + same proposal/handoff UI so SC-005 is demonstrable per area.

**Alternatives considered**: Catalog-only stubs; equal depth day-one. Catalog rejected; equal depth deferred as polish risk.

## Decision: Primary surface = order Timeline + agent panel

**Rationale**: FR-013 / clarify Q5. Agent-trace Gantt/tree lives inside/beside those surfaces; no dedicated “Agent areas” marketing page as primary.

**Alternatives considered**: Dedicated observability page. Rejected for ops taste and discoverability criteria.
