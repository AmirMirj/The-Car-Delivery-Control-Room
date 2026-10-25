# Quickstart: All-Orders Agent Coverage

## Prerequisites

```sh
cd starter
npm run db:agent-tables   # includes fleet pass tables after implement
npm run dev
```

Open http://localhost:3000 (exception home).

## Validate

1. **Home is exceptions** — `/` is Needs a person; `/lanes` is browse.
2. **Start pass** — Click **Run for all qualifying**. Progress counters move (qualifying, ran, skipped, failed, proposals).
3. **Block overlap** — While running, button disabled; second `POST /api/agent/fleet` → 409.
4. **Skip pending** — After proposals exist, run again: those orders increment **skipped** (pending), proposals unchanged.
5. **Quiet orders** — Orders that never qualified still have no new proposals (`SC-002`).
6. **Lanes cues** — On `/lanes`, cards with pending proposals show a visible cue; banner/summary reflects pass status.
7. **Approvals** — Open two proposal-waiting orders; approve one, reject one; only approved synthetic apply; no autonomous customer contact.

## API smoke

```sh
curl -s http://localhost:3000/api/agent/fleet
curl -s -X POST http://localhost:3000/api/agent/fleet
# while running:
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/agent/fleet   # expect 409
```

See [contracts/fleet-pass-api.md](./contracts/fleet-pass-api.md) and [data-model.md](./data-model.md).
