# Data Model: Timeline Polish

Extends 005 TrackingEntry (presentation only).

## StatusDisplay (derived)

| Value | When |
|-------|------|
| `action_required` | needsPerson && not awaiting_review agent proposal |
| `awaiting_review` | progress waiting_person + agent proposed / pending proposal |
| `completed` | progress completed |
| `failed` | progress failed |
| `in_progress` | other in_progress |
| `neutral` | calm history |

## StructuredBody (optional on entry or computed in UI)

| Field | Type | Notes |
|-------|------|--------|
| issue | string \| null | Primary problem line |
| impact | string \| null | Consequence |
| driver | string \| null | Driver safety / status |
| next | string \| null | Recommended next step |

Computed from `detail` / `title` / proposal summary when possible.

## RowActions (UI)

| Action | Enabled when |
|--------|----------------|
| Approve / Reject | local pending proposal + `onReview` provided |
| View agent steps | cheapSteps.length > 0 |
| Open conversation | category conversation |
| Show details | always (reveals tracking fields) |

No new persisted entities.
