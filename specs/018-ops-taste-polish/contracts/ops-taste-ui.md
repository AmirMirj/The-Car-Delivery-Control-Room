# Contract: Ops taste UI

## Home (`/`)

- Agent line: `On-road agent · {plainLabel}` via `humanizeAgentStatus`.
- Error: no “database” / “seeded” wording.
- Run control label: plain language (e.g. “Run on-road agent for all that need it”).
- Idle fleet summary: in a collapsed `<details>` unless `fleet.active`.
- `.board-head` sticky while `.exception-queue` scrolls.

## Other surfaces

- Loading copy is a full sentence (see data-model SurfaceCopy).
- Empty/error states remain calm and actionable.
