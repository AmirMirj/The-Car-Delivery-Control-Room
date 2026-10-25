# Data Model: Timeline Counters & Search

## Entities (presentation)

### TimelineSearchContext

| Field | Type | Notes |
|-------|------|-------|
| vehicleMake | string \| null | from `header.vehicle.make` |
| vehicleModel | string \| null | from `header.vehicle.model` |
| vehicleTitle | string \| null | from `header.vehicle.title` |
| driverNames | string[] | from assignment/driver display names on the order |

### TimelineFilterState (UI)

| Field | Type | Constraints |
|-------|------|-------------|
| query | string | trimmed; empty = no text filter |
| sort | `"newest"` \| `"urgency"` | default `newest` |

### Filter pipeline

1. Pill category filter (`model.byFilter[active]`)
2. Text search against entry haystack + context
3. Sort by selected mode
4. Pill `counts` always from `model.counts` (pre-search)

### Entry haystack fields

`title`, `detail`, `source`, `destination`, `result`, `category`, plus context make/model/title/drivers when query matches context (include entry if context matches).
