# Contract: Exception decide cue

**Endpoint**: `GET /api/exceptions`

Each `items[]` element MUST include:

```json
{
  "orderId": "…",
  "reason": "non-empty plain language",
  "decideCue": "non-empty short cue for what the person should do",
  "tone": "danger|warn|accent|neutral|ok",
  "agentStatus": "awaiting_review|running|none|…|null",
  "href": "/orders/…"
}
```

**decideCue rules** (first match wins):

1. `agentStatus === "awaiting_review"` → `Approve or reject the agent proposal`
2. `agentStatus === "running"` → `Wait — agent is still gathering`
3. Else if reasons include open conversation → `Reply or close the open conversation`
4. Else if reasons include alert/work → use primary reason prefixed with `Decide:` (truncated ≤ 80 chars)
5. Fallback → `Open the order and choose the next step`

Home UI MUST render `reason` and `decideCue` on each card.
