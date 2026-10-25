# Quickstart: Efficient By-Lane Board

## Prerequisites

- Postgres + `npm run seed` (or existing seeded DB)
- `npm run dev` → http://localhost:3000

## Validate

1. Open `/` — still exception queue (not board).
2. Open `/lanes` — seven operational lanes with coloured header pills and counts.
3. Click **Needs attention** pill — only exception cards remain; counts update.
4. Click **All** — full board returns.
5. On a card with attention owner — coloured owner pill visible.
6. On a card with decisive date near snapshot — progress bar present; cards without decisive date omit the bar (or show no %).
7. Confirm lane names are still intake / market / … (not To-do / In Progress / Complete).

## Expected

Board is denser and scannable; exception home unchanged; no new APIs required.
