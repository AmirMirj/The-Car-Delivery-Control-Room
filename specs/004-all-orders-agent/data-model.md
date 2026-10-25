# Data Model: All-Orders Agent Coverage

## Existing (reuse)

- **onroad_runs**, **onroad_messages**, **onroad_proposals**, **onroad_applied**, **onroad_overlays** — per-order agent work (unchanged semantics).
- **Qualifying order**: `qualifiesOnRoad(attention, displayLane)` / `qualifiesCard(card)` as today.

## New entities

### FleetPass (`onroad_fleet_passes`)

| Field | Type | Notes |
|-------|------|--------|
| id | text PK | |
| status | `running` \| `completed` \| `failed` | Single `running` at a time |
| started_at | timestamptz | |
| finished_at | timestamptz null | |
| qualifying_count | int | Orders that matched qualification at start |
| ran_count | int | Agent loop executed |
| skipped_pending_count | int | Skipped due to pending proposal |
| skipped_other_count | int | Optional (e.g. already completed this pass) |
| failed_count | int | Per-order run failures |
| proposal_count | int | New proposals created this pass |
| error | text null | Pass-level abort message |

**Validation**: Insert only if no row with `status = 'running'`; otherwise reject start.

### FleetPassOutcome (`onroad_fleet_pass_outcomes`) — optional but recommended

| Field | Type | Notes |
|-------|------|--------|
| pass_id | text FK | |
| order_id | text | |
| result | `ran` \| `skipped_pending` \| `failed` \| `no_qualify` | |
| run_id | text null | If ran |
| error | text null | |

## Derived view fields

### AgentStatusCue (on BoardCard / exception item)

| Value | Rule |
|-------|------|
| `none` | No recent run / no pending proposal |
| `working` | Active run `status` in progress |
| `proposal_waiting` | Latest proposal `pending` |
| `failed` | Latest run failed and no pending proposal |
| `applied` / `rejected` | Optional quieter cues after review |

## State transitions

```text
FleetPass:  (none) --POST start--> running --finish--> completed
                              \--fatal--> failed
running + POST start --> rejected (409)

Order in pass:
  qualify? no -> ignore (not counted as skipped_pending)
  pending proposal? -> skipped_pending
  else -> run agent -> ran | failed
```
