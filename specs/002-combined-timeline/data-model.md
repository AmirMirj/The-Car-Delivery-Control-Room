# Data Model: Combined Order Timeline

## TimelineEntry (derived)

| Field | Rules |
|-------|--------|
| id | Stable string key (prefix + source id) |
| category | `attention` \| `conversation` \| `agent` \| `activity` |
| icon | Presenter icon name compatible with `Icon` |
| title | Required headline |
| detail | Nullable body |
| meta | Nullable owner/status line (e.g. “No owner · proposed”) |
| at | Nullable ISO instant |
| atLabel | Nullable (proposed, acknowledged, …) |
| tone | `danger` \| `warn` \| `accent` \| `neutral` \| `ok` |
| needsAttention | boolean — drives “Needs attention” chip |

## TimelineModel

| Field | Rules |
|-------|--------|
| entries | TimelineEntry[] |
| counts | `{ everything, attention, conversations, agent, activity }` non-negative ints |

## Mapping

- **attention** ← `view.attention` (`needsAttention: true`)
- **conversation** ← open `view.threads` (and optionally waiting)
- **agent** ← `view.proposals` (+ optional local agent proposals if passed in)
- **activity** ← flattened `view.history[].events`

No persisted tables.
