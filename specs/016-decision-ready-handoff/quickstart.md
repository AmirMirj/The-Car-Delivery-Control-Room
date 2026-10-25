# Quickstart: Decision-Ready Handoff

## Prerequisites

App running (`starter/`: Postgres up, `npm run dev`), synthetic seed loaded.

## Validate the four questions

1. **Only orders that need them**  
   Open `/`. Confirm every card has a reason + decide cue. Spot-check a quiet order via `/lanes` — it must not be on home.

2. **Where every fact came from**  
   Open an exception order. On timeline rows, confirm `source → destination` (or equivalent). Expand agent cheap steps if present.

3. **Cheap work → stop → hand over**  
   On an awaiting-review agent entry: expand **View agent steps**; read handoff/findings in the agent panel; confirm Approve/Reject visible and nothing consequential applied yet.

4. **After decide, next step clear**  
   Approve (or Reject) a proposal. Confirm outcome copy appears with applied/not-applied summary and a **Next:** line. Status is no longer “awaiting review”.

## Typecheck

```sh
cd starter && npm run typecheck
```
