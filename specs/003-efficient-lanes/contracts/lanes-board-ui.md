# Contract: `/lanes` board UI

## Page

- Route: `GET /lanes` (existing).
- Data: existing `GET /api/overview` → group by `lane`.
- Home `/` remains exception queue (unchanged).

## Chrome

1. **Filter pills** above the board (or in toolbar): at least `All` and `Needs attention`. Active pill visually distinct.
2. **Lane headers**: coloured pill with lane label + count (not plain text only).
3. **Cards**:
   - Title / route line (existing)
   - Owner row: pill with owner name when present
   - Progress: thin bar + % when `decisive` allows derivation; otherwise omit bar
4. Do **not** rename lanes to sprint statuses.
5. Do **not** add “+” create footers in this feature.

## Accessibility

- Filter pills are buttons with `aria-pressed`.
- Progress bar has accessible text (percentage or “no date”).
