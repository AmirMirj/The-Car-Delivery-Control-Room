# Quickstart: Timeline Polish

## Prerequisites

- App running (`starter/`: `npm run dev`).
- Order with pending on-road agent proposal + attention (e.g. ferry/on-road seed).

## Validate

1. Open order → Timeline defaults to Needs a person when attention exists.
2. Collapsed agent row: **one** status (Awaiting review) + routing; no six-chip stack.
3. Click **Show details** → activity type, progress, agent involvement, result visible.
4. Structured Issue / Next (or detail fallback) readable without opening folds.
5. **Approve** or **Reject** on pending proposal row → status updates after reload.
6. **View agent steps** expands cheap steps; conversation **Open** / expand still works.
7. No Critical Issues band; Conversations / Prior agent work / Activity start collapsed.
8. No fake Call Dealer button.

## Expected

Matches [contracts/timeline-polish-ui.md](./contracts/timeline-polish-ui.md) and layout hierarchy from plan.
