# Contract: Decision outcome UI

## Timeline agent entry

- MUST show provenance routing (`source → destination`) when present.
- MUST offer **View agent steps** when `cheapSteps.length > 0`.
- MUST NOT show “Open in Prior agent work” or “Open in Conversations”.
- Pending local proposals MUST show **Approve** / **Reject**.

## After review succeeds

Show an outcome region (banner or inline under the entry) with:

| Field | Required |
|-------|----------|
| decision | approved \| rejected |
| appliedSummary | e.g. “Applied in the demo world: …” or “Nothing applied — proposal rejected.” |
| nextStep | e.g. “Next: confirm driver notified” / “Next: tell the agent what to try instead” |

Copy MUST be visible without navigating away from the order page.

## Agent panel handoff

When `handoverSummary` exists, panel MUST surface findings (bullets OK) above chat so “what it found” is obvious before approve.
