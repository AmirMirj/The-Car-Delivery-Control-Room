# Data Model: Ops Taste Polish

No new persisted entities. Presentation maps only.

## AgentStatusLabel

| Internal | Plain label |
|----------|-------------|
| `none` | (omit from card) |
| `starting` | Starting |
| `running` | Working |
| `awaiting_review` | Waiting for your decision |
| `succeeded` / `completed` | Finished |
| `failed` | Could not finish |
| other snake_case | Title-case words |

## SurfaceCopy

| Surface | Loading | Empty |
|---------|---------|-------|
| Exceptions | “Loading orders that need a person…” | existing queue-empty + search mention |
| Lanes | “Loading orders by lane…” | existing |
| Order | “Loading this order…” | error with back link |
| Inbox | “Loading the inbox…” | “Choose a thread.” / no messages |
| Entity index | “Loading the list…” | no-match sentence |
