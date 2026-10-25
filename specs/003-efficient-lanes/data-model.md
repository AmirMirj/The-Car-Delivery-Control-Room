# Data Model: Efficient By-Lane Board

Presentation-only. No new DB tables.

## Entities (view)

### LaneColumn

| Field | Source |
|-------|--------|
| laneId | `LANES` key |
| label | `LANE_LABELS` |
| tone | CSS class / pill colour |
| count | cards in column (after filters) |
| cards | `OverviewCard[]` filtered |

### BoardCardView

| Field | Source |
|-------|--------|
| orderId, routeLine, workLine | existing Card |
| ownerPill | first attention owner or “—” |
| progressPct | derived from decisive vs snapshot (nullable) |
| needsAttention | `attention.length > 0` |

### BoardFilter

| Id | Rule |
|----|------|
| `all` | show all |
| `needs_attention` | attention non-empty |
| `has_owner` | any attention owner set (optional) |

Filters are client state (query string optional: `?filter=needs_attention`).
