# Quickstart Validation: Control Room + On-Road Agent

## Prerequisites

- Node.js 24+
- Docker (Postgres + attachments)
- From `starter/`: `.env` from `.env.example`, `npm ci`, `docker compose up -d --wait`, `npm run db:push`, `npm run db:seed`, `npm run attachments:seed`
- Optional: `OPENAI_API_KEY` (without it, mock-LLM path must still run tools)

## Run

```sh
cd starter
npm run dev
```

Open http://localhost:3000

## Validation scenarios

### 1. Exception home (US1)

1. Load `/` — expect **exception queue**, not lane columns as primary layout.
2. Each card shows a non-empty reason.
3. Open `/lanes` (or secondary browse) — lanes available without replacing home.
4. Search finds an order; quiet orders absent from home list.

### 2. Order provenance (US2)

1. Open a known messy order from the packet (conflicting address/message or travel quote).
2. Confirm both claims / quote-vs-booking labelling remain visible.

### 3. Auto agent + approve (US3)

1. Open a qualifying on-road exception order (or wait for auto-run on queue open).
2. Expect handover + pending proposal without approving yet — no booking/date/cost mutation.
3. Approve — synthetic state updates; proposal status approved; AppliedMutation visible or reflected in UI.
4. Reject path on another proposal — no mutation.

### 4. Chat (US4)

1. On order page, send “Are they safe?” to the agent.
2. Expect tool-backed / mock driver reply in thread; no customer message send.

### 5. Smoke

```sh
APP_URL=http://localhost:3000 npm run smoke
# plus any new smoke checks added for /api/exceptions and proposal review
```

## Expected outcomes

- Constitution rules held: no autonomous customer contact; approvals before consequential change; synthetic only.
- Demo path completable in one browser session under a few minutes.
