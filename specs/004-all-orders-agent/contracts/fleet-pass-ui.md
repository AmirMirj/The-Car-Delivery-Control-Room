# Contract: Fleet pass UI

## Exception home (`/`)

- Button **Run for all qualifying** (ops wording; not “fleet/batch job”).
- Disabled when `GET /api/agent/fleet` reports `active: true`; show calm “Already running…”.
- Full progress: qualifying / ran / skipped (pending) / failed / proposals; updates while running (poll ~2s).
- Per-order auto-run for exception items may continue independently (existing behavior).

## All-orders browse (`/lanes`)

- No primary Run button (or only a link “Manage on Needs a person” — optional).
- Compact banner/summary when a pass is active or a recent pass exists (same counters, denser).
- Board cards show agent status cue when not `none` (at least **proposal waiting**; prefer working/failed too).

## Home default

- `/` remains exception queue; `/lanes` remains secondary browse.
