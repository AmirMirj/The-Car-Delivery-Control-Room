# Contract: Exception Queue

## `GET /api/exceptions?q=`

Returns orders that need a person, ranked for ops triage.

### Query

| Param | Meaning |
|-------|---------|
| `q` | Optional search (reference, plate, customer, vehicle, city) — filters within exceptions unless empty |

### Response 200

```json
{
  "snapshotAt": "ISO-8601",
  "totalExceptions": 0,
  "items": [
    {
      "orderId": "string",
      "reference": "string",
      "headline": "string",
      "reason": "string",
      "reasons": [{ "kind": "string", "tone": "danger|warn|accent|neutral|ok", "title": "string" }],
      "tone": "danger|warn|accent|neutral|ok",
      "keyDateLabel": "string|null",
      "keyDate": "ISO-8601|null",
      "vehicleLabel": "string|null",
      "routeLabel": "string|null",
      "agentStatus": "none|running|awaiting_review|completed|failed|null",
      "href": "/orders/{id}"
    }
  ]
}
```

### Rules

- Home UI MUST consume this (or equivalent overview mode) as default landing data.
- Every item MUST include non-empty `reason` (primary attention title/short).
- Quiet orders MUST NOT appear unless search is used against a secondary lanes API/page.
