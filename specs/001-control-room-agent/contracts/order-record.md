# Contract: Order Record (extensions)

## `GET /api/orders/:id`

Existing starter payload remains source of truth for packet views. Extensions:

### Added fields (under `view` or top-level `agent`)

```json
{
  "agent": {
    "qualifiesOnRoad": true,
    "activeRun": { "id": "string", "status": "string", "handoverSummary": "string|null", "decisionText": "string|null" },
    "proposals": [
      {
        "id": "string",
        "status": "pending|approved|rejected|edited|failed",
        "title": "string",
        "summary": "string",
        "decision": "string",
        "ops": [],
        "reviewedAt": "ISO-8601|null"
      }
    ],
    "messages": [
      { "id": "string", "role": "user|assistant|tool|system", "content": "string", "createdAt": "ISO-8601" }
    ]
  }
}
```

### Provenance

Unchanged: packet distinctions (quote vs booking, alert vs diagnosis) stay visible in existing record sections.
