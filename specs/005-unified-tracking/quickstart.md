# Quickstart: Unified Order Tracking

## Prerequisites

- App running (`starter/`: `npm run dev`; DB/seed as in root README).
- Feature branch `005-unified-tracking`.

## Validate

1. Open an order with open exception + pending agent proposal (e.g. seed ord with roadside/ferry case).
2. Confirm **Timeline** is the top activity stream; header shows `Timeline · showing N`.
3. Confirm filter pills include **Needs a person**; default lands there when attention/pending rows exist.
4. On a Needs a person row, verify chips: time, activity type, progress, agent involvement, from→to, result.
5. Expand a conversation Timeline row → messages inline without leaving the page.
6. Expand an agent Timeline row → cheap steps nested; Review/Apply still on consequential proposal.
7. Confirm Conversations / Prior agent work / Activity folds start **collapsed**; opening them still shows full provenance.
8. Switch filters (Everything, Conversations, Agent, Activity) → counts match visible rows; no second competing feed above Timeline.

## Expected

- One primary trackable stream with retained tracking fields (see [contracts/timeline-ui.md](./contracts/timeline-ui.md)).
- Agent work one row per run/proposal; cheap work not lost, only folded.
- No new API routes required for pass.
