# Quickstart: Drop “Open in Conversations”

## Prerequisites

- App running from `starter/` with an order that has Timeline conversation entries.

## Validate

1. Open order detail → Timeline → Conversations filter (or Everything).
2. Confirm no “Open in Conversations” link on conversation rows.
3. Confirm Open messages (or equivalent) still works if messages exist.
4. `npx tsc --noEmit` in `starter/` passes.
5. `rg "Open in Conversations" starter/app/components/record/timeline.tsx` returns no matches.
