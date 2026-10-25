# Contract: On-road Agent Panel UI (concise)

## Surface

Order detail: `AgentPanel` below Timeline (existing mount). Birch/ops styling.

## Default layout (pending proposal)

1. **Header** — Title + one muted policy line + Run again + compact status chip  
2. **Findings** — “Found” with ≤5 bullets; link/button “Show full handoff”  
3. **Approval card** — Title · awaiting your yes; **one** decision paragraph; Approve / Reject; one-line demo hint  
4. **Chat** — Compact turns (truncated); composer  

MUST NOT show a separate “Proposed decision” block that duplicates the approval card.  
MUST NOT show the full handoff again as the default visible chat bubble.

## Settled / no pending

- Findings if handover exists  
- Last ≤2 settled proposals as compact one-liners (or collapsed `<details>`)  
- Applied overlay stays short list  

## Actions (unchanged APIs)

| Control | Behavior |
|---------|----------|
| Run / Run again | POST agent/run |
| Approve / Reject | POST proposals/…/review |
| Send chat | POST agent |

## Non-goals

No new endpoints; no Critical Issues band; no Call Dealer fake buttons; no dark ASCII skin.
