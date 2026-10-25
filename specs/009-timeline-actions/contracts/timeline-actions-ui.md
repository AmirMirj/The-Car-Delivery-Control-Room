# Contract: Timeline Action Column UI

## Row layout (desktop)

```text
[ icon ] [ main ........................ ] [ meta/time ] [ actions ]
```

- **actions** column: min width enough for Approve + Reject stacked or side-by-side; right-aligned.
- **Approve**: class `timeline-btn approve` — solid green fill, light text.
- **Reject**: class `timeline-btn reject` — outlined / soft; not equal visual weight to Approve.
- Utility: `timeline-btn ghost` under main only.

## Conversation rows

Primary “Open conversation” MAY live in actions column; “Open in Conversations” stays ghost under main.

## Narrow

Actions column may wrap under main; Approve still solid, Reject outlined.

## APIs

Unchanged review endpoints.
