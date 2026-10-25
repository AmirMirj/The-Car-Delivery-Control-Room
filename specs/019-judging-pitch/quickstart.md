# Quickstart: Judging Pitch

## Prerequisites

- App running (`docker compose` + `npm run dev` in `starter/`) as in root README.

## Validate

1. Open `/pitch` from Review → **Pitch**.
2. Confirm three criteria with weights **40% / 30% / 30%** and the four-item checklist.
3. Click **Needs a person** → lands on `/`. Confirm exception cards show reason + Decide.
4. Click **Browse by lane** → `/lanes`. Confirm progress/route badges scan.
5. Click showcase order (if resolved) → order detail with provenance fold + agent decision when present.
6. Click **Build notes** → `/build`. Find event-formatting throw-away and approval-gate guardrail.
7. Confirm `/` is still the default home (wordmark / Needs a person).

## Expected

- Pitch is calm Review chrome, not the ops home.
- Zero LLM calls while browsing Pitch or Build notes.
