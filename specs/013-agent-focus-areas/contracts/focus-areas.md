# Contract: Focus areas & matching

## Catalog (read model)

`listFocusAreas(): AgentFocusArea[]` — always returns exactly the four areas with `name`, `jobLine`, `agentMay`, `humanMust`.

## Match

`matchFocusArea(view: RecordView): MatchResult`

- Prefer automatic signals (attention/incident → `on_the_road`; travel/journey gaps → `driver_travel`; pickup/docs → `pickup_readiness`; driver FAQ/thread → `driver_support`).
- If confidence unclear or ties → `{ ambiguous: candidates }`.
- Never start two agents for the same situation.

## Ambiguous picker (UI)

When `ambiguous`, agent panel / Timeline shows a one-shot chooser listing candidate (or all four) focus areas. After pick, that area runs; choice is visible on the order.

## Run start

Starting an agent run MUST attach `focusArea` to the run/trace. Proposal/handoff MUST carry the same focus area label.
