# UI Contract: Timeline / agent panel (trace + Gantt redesign)

Inspired by [OpenSearch Agent Traces](https://docs.opensearch.org/latest/observing-your-data/agent-traces/agent-tracing/) and [OKVIZ PowerGraph Gantt Timeline](https://okviz.com/index/timeline-powergraph/) — **patterns only**, birch/ops styling.

## Focus area identity (FR-012, FR-013)

- Order Timeline and/or agent panel MUST list all four focus areas by **name + one-line job**.
- Any agent prep/handoff MUST show which focus area produced it.
- Running agent: highlight the matching area; do not show four agents as simultaneously active on one situation.

## Agent-trace workspace (when a trace exists)

Provide synchronized views (selecting a span highlights it everywhere):

1. **Trace tree** — expandable parent/child spans; category color; duration; optional token counts.
2. **Gantt timeline** — horizontal bars by duration; indentation = hierarchy; overlapping bars = concurrency; milestone markers for handoff / human decision; optional “now” line.
3. **Span detail** — selected span’s name, category, status, timing, detail/tool payload (readable, not raw JSON wall).

## Span categories (visual)

| Category | Meaning |
|----------|---------|
| agent | invoke / orchestrate |
| llm | model turn |
| tool | tool/function call (phone, lookup, booking prep, …) |
| handoff | waiting on person / decision package |
| other | uncategorized |

Failed spans show a clear error cue (OpenSearch-style ERROR affordance, ops-calm).

## Handoff

When status is `awaiting_person`, decision package (summary + approve/reject/options) remains one glance away—Gantt milestone + panel actions. No purchase completion without recorded human decision.

## Empty / ambiguous

- No traces yet: calm empty; still show four area names/jobs.
- Ambiguous match: picker before any Gantt; after pick, start that area’s run.
