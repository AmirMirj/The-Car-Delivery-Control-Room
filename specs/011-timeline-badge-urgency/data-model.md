# Data Model: Badge Urgency

## StatusUrgency (derived)

| Value | When |
|-------|------|
| `critical` | failed; OR attention with tone danger/warn |
| `elevated` | awaiting_review; OR needsPerson without critical |
| `calm` | completed, neutral, in_progress (default) |

## Display rule

- Always show at most one `StatusPill`.
- Do not render separate “Needs a person” row tag (filter pill keeps the phrase).
