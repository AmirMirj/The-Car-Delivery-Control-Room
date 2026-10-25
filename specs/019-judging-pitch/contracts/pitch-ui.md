# Contract: Pitch UI

## Route

- `GET /pitch` — AppFrame `section="pitch"`, under Review next to Build notes.
- Home remains `/`.

## Content

- Renders `PitchDoc` from `starter/lib/pitch.ts` (static).
- Showcase: client or server resolve via exceptions/overview; fill Criterion 1 “Showcase order” link.
- No LLM fetch on this route.

## Criterion 1 links (required)

| Label | Target |
|-------|--------|
| Needs a person | `/` |
| Browse by lane | `/lanes` |
| Showcase order | `/orders/{id}` when resolved, else `/` with hint |

## Criterion 2

- Primary link: `/build` (Build notes).

## Criterion 3

- Links optional; may point at `/lanes` and a showcase order for density demo.
- Copy references sticky head, empty states, card typography — no new redesign.

## Build notes enrichment (same app)

- Must include throw-away / first-answer entry on bloated multi-line event formatting vs scannable blocks.
- Must include guardrail: ferry / promise / customer message never auto-commit without Approve.
