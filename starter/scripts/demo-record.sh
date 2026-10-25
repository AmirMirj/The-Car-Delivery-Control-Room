#!/usr/bin/env bash
# Single-process-tree demo: embedded PG → seed → Next → Playwright video (~90s)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PG_PORT=15438
APP_PORT=3000
PG_BIN="$ROOT/node_modules/@embedded-postgres/linux-x64/native/bin"
DATA="$ROOT/.data/demo-pg"
LOG="$ROOT/.data/demo-pg.log"
SOCK="/tmp/crd$PG_PORT"
OUT_DIR="$ROOT/../demos"
VIDEO_RAW="$OUT_DIR/playwright-raw"
export DATABASE_URL="postgres://controlroom:controlroom@127.0.0.1:${PG_PORT}/controlroom"
export S3_ENDPOINT="${S3_ENDPOINT:-http://127.0.0.1:9009}"
export S3_ACCESS_KEY_ID="${S3_ACCESS_KEY_ID:-controlroom}"
export S3_SECRET_ACCESS_KEY="${S3_SECRET_ACCESS_KEY:-controlroom-local-only}"
export S3_BUCKET="${S3_BUCKET:-controlroom-attachments}"

mkdir -p "$OUT_DIR" "$VIDEO_RAW" "$SOCK" "$ROOT/.data"
rm -rf "$DATA"
mkdir -p "$DATA"

echo "[demo] initdb…"
"$PG_BIN/initdb" -D "$DATA" -U controlroom --auth=trust --locale=C --encoding=UTF8 >/dev/null

echo "[demo] start postgres :$PG_PORT"
"$PG_BIN/pg_ctl" -D "$DATA" -l "$LOG" -o "-p $PG_PORT -h 127.0.0.1 -c unix_socket_directories=$SOCK" -w -t 30 start
export PG_PORT
export PG_SOCK="$SOCK"
# Prefer Unix socket — TCP to 127.0.0.1 often times out under agent sandbox netns
node --input-type=module <<'NODE'
import postgres from "postgres"
const port = Number(process.env.PG_PORT || 15438)
const sock = process.env.PG_SOCK || `/tmp/crd${port}`
const sql = postgres({
  host: sock,
  port,
  user: "controlroom",
  database: "postgres",
  max: 1,
  connect_timeout: 10,
})
const dbs = await sql`SELECT datname FROM pg_database`
if (!dbs.some((d) => d.datname === "controlroom")) {
  await sql.unsafe("CREATE DATABASE controlroom")
  console.log("[demo] created database controlroom")
}
await sql.end({ timeout: 1 })
console.log("[demo] Postgres ready")
NODE
# App still uses TCP URL; also export socket URL for tools that support it
export DATABASE_URL="postgres://controlroom@127.0.0.1:${PG_PORT}/controlroom"

# Pin Next env
cat > "$ROOT/.env.local" <<EOF
DATABASE_URL=$DATABASE_URL
S3_ENDPOINT=$S3_ENDPOINT
S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY
S3_BUCKET=$S3_BUCKET
EOF

echo "[demo] schema + seed…"
npx drizzle-kit push --force
npx tsx scripts/ensure-agent-tables.ts
npx tsx scripts/seed.ts

echo "[demo] start Next on :$APP_PORT"
npx next dev -H 127.0.0.1 -p "$APP_PORT" >"$ROOT/.data/next-demo.log" 2>&1 &
NEXT_PID=$!
cleanup() {
  kill "$NEXT_PID" 2>/dev/null || true
  "$PG_BIN/pg_ctl" -D "$DATA" -m fast stop >/dev/null 2>&1 || true
  rm -f "$ROOT/.env.local"
}
trap cleanup EXIT

echo "[demo] wait for app…"
for i in $(seq 1 120); do
  if curl -sf "http://127.0.0.1:${APP_PORT}/" >/dev/null; then
    echo "[demo] App up"
    break
  fi
  sleep 0.5
  if ! kill -0 "$NEXT_PID" 2>/dev/null; then
    echo "[demo] Next died:"; tail -40 "$ROOT/.data/next-demo.log"; exit 1
  fi
  if [[ "$i" -eq 120 ]]; then
    echo "[demo] App timeout"; tail -40 "$ROOT/.data/next-demo.log"; exit 1
  fi
done

# Pick on-road exception order
ORDER_ID="$(node --input-type=module <<NODE
const base = "http://127.0.0.1:${APP_PORT}"
const ex = await fetch(base + "/api/exceptions").then((r) => r.json())
const items = ex.items || []
const pick = items.find((o) => o.qualifiesOnRoad) || items[0]
if (!pick) throw new Error("no exception orders")
console.log(pick.orderId)
NODE
)"
echo "[demo] Picked order $ORDER_ID"
# Trigger agent (best-effort)
curl -sf -X POST "http://127.0.0.1:${APP_PORT}/api/orders/${ORDER_ID}/agent/run" >/dev/null || true
sleep 4
curl -sf -X POST "http://127.0.0.1:${APP_PORT}/api/agent/fleet" >/dev/null || true
sleep 6

echo "[demo] recording…"
node <<NODE
const { chromium } = require("playwright");
const orderId = ${JSON.stringify("$ORDER_ID")};
const base = "http://127.0.0.1:${APP_PORT}";
const videoDir = ${JSON.stringify("$VIDEO_RAW")};
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  const pause = (ms) => page.waitForTimeout(ms);

  // Home: exception queue
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await pause(2800);
  const runAll = page.getByRole("button", { name: /run for all/i });
  if (await runAll.count()) { await runAll.first().scrollIntoViewIfNeeded(); await pause(1600); }
  await page.mouse.wheel(0, 420);
  await pause(2000);

  // Order record
  await page.goto(base + "/orders/" + orderId, { waitUntil: "networkidle" });
  await pause(3200);
  const needs = page.getByText(/Needs a person/i).first();
  if (await needs.count()) { await needs.scrollIntoViewIfNeeded(); await pause(1600); }
  for (const label of ["Alerts", "Messages", "Agent", "Events"]) {
    const pill = page.getByRole("button", { name: new RegExp("^" + label, "i") }).first();
    if (await pill.count()) { await pill.click().catch(() => {}); await pause(700); }
  }
  const allPill = page.getByRole("button", { name: /^All\\b/i }).first();
  if (await allPill.count()) await allPill.click().catch(() => {});
  await pause(1000);

  await page.mouse.wheel(0, 520);
  await pause(1500);
  const viewSteps = page.getByRole("button", { name: /View agent steps/i }).first();
  if (await viewSteps.count()) {
    await viewSteps.scrollIntoViewIfNeeded();
    await viewSteps.click();
    await pause(3200);
    const hide = page.getByRole("button", { name: /Hide agent steps/i }).first();
    if (await hide.count()) await hide.click().catch(() => {});
  }
  const approve = page.getByRole("button", { name: /^Approve$/i }).first();
  if (await approve.count()) { await approve.scrollIntoViewIfNeeded(); await pause(2200); }
  await pause(1500);

  // Lanes secondary
  await page.goto(base + "/lanes", { waitUntil: "networkidle" });
  await pause(2600);
  await page.mouse.wheel(0, 320);
  await pause(2000);
  await page.goto(base + "/orders/" + orderId, { waitUntil: "networkidle" });
  await pause(3000);

  await context.close();
  await browser.close();
  console.log("[demo] RECORD_DONE");
})().catch((e) => { console.error(e); process.exit(1); });
NODE

WEBM="$(ls -t "$VIDEO_RAW"/*.webm 2>/dev/null | head -1 || true)"
if [[ -z "${WEBM}" ]]; then echo "[demo] no webm"; exit 1; fi
cp "$WEBM" "$OUT_DIR/control-room-demo-90s.webm"
echo "$ORDER_ID" > "$OUT_DIR/demo-order.txt"
FFMPEG="$HOME/.cache/ms-playwright/ffmpeg-1011/ffmpeg-linux"
if [[ -x "$FFMPEG" ]]; then
  "$FFMPEG" -y -i "$OUT_DIR/control-room-demo-90s.webm" -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an "$OUT_DIR/control-room-demo-90s.mp4" </dev/null || true
fi
echo "[demo] DONE order=$ORDER_ID video=$OUT_DIR/control-room-demo-90s.webm"
ls -la "$OUT_DIR"/control-room-demo-90s.*
