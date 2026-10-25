# Contract: Timeline Badge UI

## Row chrome

```html
<span class="timeline-status status-{status} urgency-{critical|elevated|calm}">Label</span>
```

- No sibling “Needs a person” tag on the row.
- Filter tablist may still say Needs a person.

## Color

| Urgency | Treatment |
|---------|-----------|
| critical | Saturated red/orange bg + ink |
| elevated | Soft muted orange/canvas |
| calm | Gray/canvas or soft green for completed |

## Non-goals

No filter rename; no API change.
