# Quickstart: Agent Focus Areas + Trace Timeline

## Prerequisites

- App from `starter/` running with DB + agent tables.
- Seeded orders covering (or mockable as): pickup readiness, travel planning, on-road incident, driver support.

## Validate focus areas & matching

1. Open an order → Timeline / agent panel.
2. Confirm all four areas appear with name + one-line job ([timeline-trace-ui.md](./contracts/timeline-trace-ui.md)).
3. Trigger / open a clear on-road incident → system selects **On the road** without a picker.
4. Force an ambiguous case (or mock matcher) → picker appears; choose once → that agent runs.

## Validate shared handoff

1. Let an agent finish prep → see decision package (not raw dump).
2. Approve or reject → outcome visible; no autonomous purchase/booking.

## Validate trace / Gantt redesign

1. Open an order with a completed or in-progress agent run.
2. Confirm **tree + Gantt + span detail** stay in sync when selecting a span ([OpenSearch-inspired views](https://docs.opensearch.org/latest/observing-your-data/agent-traces/agent-tracing/)).
3. Confirm hierarchy/duration bars/milestones are readable ([PowerGraph-inspired](https://okviz.com/index/timeline-powergraph/)) without Power BI chrome.
4. Confirm failed tool spans show an error cue; handoff milestone marks waiting-on-person.

## Per-area smoke (SC-005)

For each of Pickup readiness, Driver travel, On the road, Driver support: one short story — prep → handoff → human decision → next step visible.

## Typecheck

```bash
cd starter && npx tsc --noEmit
```

See [data-model.md](./data-model.md) and [contracts/](./contracts/) for shapes and UI rules.
