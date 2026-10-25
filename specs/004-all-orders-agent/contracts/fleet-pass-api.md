# Contract: Fleet pass API

## `GET /api/agent/fleet`

Returns the latest fleet pass (or null) and whether a start is allowed.

```json
{
  "active": false,
  "pass": {
    "id": "…",
    "status": "running|completed|failed",
    "startedAt": "ISO",
    "finishedAt": "ISO|null",
    "qualifyingCount": 0,
    "ranCount": 0,
    "skippedPendingCount": 0,
    "failedCount": 0,
    "proposalCount": 0,
    "error": null
  }
}
```

- `active` is true iff `pass.status === "running"`.
- 200 always when DB available.

## `POST /api/agent/fleet`

Starts a fleet pass.

**Success 202** (or 200): `{ "pass": { … same shape, status: "running" } }`

**Conflict 409**: `{ "error": "A fleet pass is already running", "pass": { … } }`

**Behavior**:
1. Refuse if a pass is `running`.
2. Create pass row; scan snapshot for qualifying orders via existing qualify helpers.
3. For each qualifying order: if pending proposal → skip; else invoke existing on-road run path.
4. Update counters as work proceeds; mark `completed` or `failed` when done.
5. Does not contact customers; proposals still require human review.

## Unchanged

- `POST /api/orders/:id/agent/run` — per-order (exception auto-run may continue).
- Proposal review/apply routes — same approval gates.
