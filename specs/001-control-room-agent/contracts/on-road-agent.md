# Contract: On-Road Agent

## `POST /api/orders/:id/agent/run`

Starts or resumes auto/manual run for a qualifying order.

### Body

```json
{ "trigger": "auto_exception|user_rerun" }
```

### Response 200

```json
{
  "runId": "string",
  "status": "running|awaiting_review|failed|completed",
  "proposalId": "string|null",
  "handoverSummary": "string|null",
  "decisionText": "string|null"
}
```

### Errors

- `404` unknown order
- `409` run already active (return existing)
- `422` order does not qualify for on-road auto (unless `user_rerun` / chat path explicitly allowed for demo orders)

## `POST /api/orders/:id/agent`

Chat continue.

### Body

```json
{ "message": "string" }
```

### Response 200

Same shape as run completion plus `messages` append acknowledgement.

### Policy

- Tools that contact paying customers MUST fail closed with a clear assistant explanation.
- Lookups/questions do not create LocalProposal mutations until a decision is proposed.

## `POST /api/orders/:id/agent/proposals/:proposalId/review`

### Body

```json
{
  "decision": "approve|reject|edit",
  "note": "string|null",
  "editedOps": []
}
```

### Response 200

```json
{
  "proposalId": "string",
  "status": "approved|rejected|edited|failed",
  "applied": [{ "op": {}, "appliedAt": "ISO-8601" }],
  "orderId": "string"
}
```

### Rules

- `approve` / `edit` applies allowlisted ops to synthetic state and writes `AppliedMutation`.
- Never performs real purchase or live booking.
- `reject` applies nothing.
