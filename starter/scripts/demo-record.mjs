#!/usr/bin/env node
/**
 * Start embedded Postgres (if needed), ensure schema/seed, run Next, record ~90s demo video.
 */
import { spawn, execSync } from "node:child_process"
import { createWriteStream, mkdirSync, existsSync, rmSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as sleep } from "node:timers/promises"
import EmbeddedPostgres from "embedded-postgres"
import postgres from "postgres"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const outDir = join(root, "..", "demos")
const videoDir = join(outDir, "playwright-raw")
mkdirSync(outDir, { recursive: true })
mkdirSync(videoDir, { recursive: true })

const PG_PORT = Number(process.env.DEMO_PG_PORT || 15438)
const APP_URL = process.env.DEMO_APP_URL || "http://127.0.0.1:3000"
const log = (...a) => console.log(`[demo]`, ...a)

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: ["ignore", "pipe", "pipe"], ...opts })
    let out = ""
    child.stdout.on("data", (d) => {
      out += d
      process.stdout.write(d)
    })
    child.stderr.on("data", (d) => {
      out += d
      process.stderr.write(d)
    })
    child.on("exit", (code) => (code === 0 ? resolve(out) : reject(new Error(`${cmd} ${args.join(" ")} => ${code}\n${out.slice(-2000)}`))))
  })
}

async function waitFor(url, ms = 120000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 404) return
    } catch {}
    await sleep(500)
  }
  throw new Error(`Timeout waiting for ${url}`)
}

async function ensurePg() {
  const databaseDir = join(root, ".data", `embedded-pg-demo-${PG_PORT}`)
  // Fresh cluster avoids leftover postmaster.pid / init conflicts across sandboxes
  if (existsSync(databaseDir)) {
    try {
      rmSync(databaseDir, { recursive: true, force: true })
    } catch {}
  }
  mkdirSync(databaseDir, { recursive: true })
  // Socket path max is 107 bytes — keep under /tmp
  const socketDir = `/tmp/crd-pg-${PG_PORT}`
  mkdirSync(socketDir, { recursive: true })
  try {
    rmSync(`${socketDir}/.s.PGSQL.${PG_PORT}`, { force: true })
    rmSync(`${socketDir}/.s.PGSQL.${PG_PORT}.lock`, { force: true })
  } catch {}

  const pg = new EmbeddedPostgres({
    databaseDir,
    user: "controlroom",
    password: "controlroom",
    port: PG_PORT,
    persistent: true,
    postgresFlags: [`-c`, `unix_socket_directories=${socketDir}`],
    onLog: (m) => process.stdout.write(`[pg] ${m}`),
    onError: (m) => process.stderr.write(`[pg-err] ${m}`),
  })
  log("Initialising Postgres cluster…")
  await pg.initialise()
  log("Starting embedded Postgres on", PG_PORT)
  await pg.start()
  try {
    await pg.createDatabase("controlroom")
  } catch (e) {
    if (!/already exists/i.test(String(e))) throw e
  }
  // Verify TCP
  const probe = postgres({
    host: "127.0.0.1",
    port: PG_PORT,
    user: "controlroom",
    password: "controlroom",
    database: "controlroom",
    max: 1,
    connect_timeout: 10,
  })
  await probe`SELECT 1`
  await probe.end({ timeout: 1 })
  log("Postgres ready")
  return pg
}

async function ensureSeeded() {
  const sql = postgres({
    host: "127.0.0.1",
    port: PG_PORT,
    user: "controlroom",
    password: "controlroom",
    database: "controlroom",
    max: 1,
    connect_timeout: 10,
  })
  try {
    const [{ n }] = await sql`SELECT count(*)::int AS n FROM orders`
    log(`orders in DB: ${n}`)
    if (n > 50) {
      await sql.end({ timeout: 1 })
      return
    }
  } catch {
    log("schema missing — pushing")
  }
  await sql.end({ timeout: 1 }).catch(() => {})

  await run("npx", ["drizzle-kit", "push", "--force"])
  await run("npx", ["tsx", "scripts/ensure-agent-tables.ts"])
  await run("npx", ["tsx", "scripts/seed.ts"])
}

async function pickOrder(base) {
  // Prefer on-road qualifying exception, then any exception item
  const ex = await fetch(`${base}/api/exceptions`).then((r) => r.json()).catch(() => null)
  const items = ex?.items || []
  if (items.length) {
    const onRoad = items.find((o) => o.qualifiesOnRoad)
    const awaiting = items.find((o) => o.agentStatus === "awaiting_review" || o.agentStatus === "running")
    const pick = awaiting || onRoad || items[0]
    return pick.orderId
  }
  const ov = await fetch(`${base}/api/overview`).then((r) => r.json())
  const cards = ov.cards || []
  const needy = cards.filter((c) => c.attention?.length)
  const pick = needy[0] || cards[0]
  return pick.id
}

async function recordDemo(orderId) {
  // Use playwright from cache via npx
  const script = `
const { chromium } = require('playwright');
(async () => {
  const orderId = ${JSON.stringify(orderId)};
  const base = ${JSON.stringify(APP_URL)};
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: ${JSON.stringify(videoDir)}, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  const pause = (ms) => page.waitForTimeout(ms);

  // 0–12s: Exception queue home
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await pause(2500);
  // Highlight run-for-all if present
  const runAll = page.getByRole('button', { name: /run for all/i });
  if (await runAll.count()) {
    await runAll.first().scrollIntoViewIfNeeded();
    await pause(1500);
  }
  // Scroll exception list
  await page.mouse.wheel(0, 400);
  await pause(2000);

  // 12–35s: Open chosen order — situation, timeline pills, urgency
  await page.goto(base + '/orders/' + orderId, { waitUntil: 'networkidle' });
  await pause(3000);
  // Timeline / Needs a person
  const needs = page.getByText(/Needs a person/i).first();
  if (await needs.count()) {
    await needs.scrollIntoViewIfNeeded();
    await pause(1500);
  }
  // Click timeline filter pills if present
  for (const label of ['Alerts', 'Messages', 'Agent', 'Events']) {
    const pill = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
    if (await pill.count()) {
      await pill.click().catch(()=>{});
      await pause(800);
    }
  }
  // Reset to All if present
  const allPill = page.getByRole('button', { name: /^All\\b/i }).first();
  if (await allPill.count()) await allPill.click().catch(()=>{});
  await pause(1000);

  // 35–55s: Agent panel / steps / approve controls
  await page.mouse.wheel(0, 500);
  await pause(1500);
  const viewSteps = page.getByRole('button', { name: /View agent steps/i }).first();
  if (await viewSteps.count()) {
    await viewSteps.scrollIntoViewIfNeeded();
    await viewSteps.click();
    await pause(3000);
    const hide = page.getByRole('button', { name: /Hide agent steps/i }).first();
    if (await hide.count()) await hide.click().catch(()=>{});
  }
  const approve = page.getByRole('button', { name: /^Approve$/i }).first();
  if (await approve.count()) {
    await approve.scrollIntoViewIfNeeded();
    await pause(2000);
    // Don't click approve — show the gate exists
  }
  // Confirm removed junk links are absent (camera linger)
  await pause(1500);

  // 55–75s: Focus areas / agent panel chat if present
  const focus = page.getByText(/On the road|Focus|agent/i).first();
  if (await focus.count()) {
    await focus.scrollIntoViewIfNeeded();
    await pause(2000);
  }
  const agentPanel = page.locator('[data-testid="agent-panel"], .agent-panel, aside').first();
  if (await agentPanel.count()) {
    await agentPanel.scrollIntoViewIfNeeded().catch(()=>{});
    await pause(2000);
  }

  // 75–90s: Lanes secondary browse then back
  await page.goto(base + '/lanes', { waitUntil: 'networkidle' });
  await pause(2500);
  await page.mouse.wheel(0, 300);
  await pause(2000);
  await page.goto(base + '/orders/' + orderId, { waitUntil: 'networkidle' });
  await pause(3000);

  await context.close();
  await browser.close();
  console.log('RECORD_DONE');
})().catch((e) => { console.error(e); process.exit(1); });
`
  const tmp = join(root, ".data", "record-demo-tmp.cjs")
  writeFileSync(tmp, script)
  await run("npx", ["--yes", "playwright", "install", "chromium"]).catch(() => {})
  await run("node", [tmp])
}

async function finalizeVideo() {
  // Playwright writes webm; copy newest to demos/
  const files = execSync(`ls -t ${JSON.stringify(videoDir)}/*.webm 2>/dev/null | head -1`, { encoding: "utf8" }).trim()
  if (!files) throw new Error("No webm produced")
  const dest = join(outDir, "control-room-demo-90s.webm")
  execSync(`cp ${JSON.stringify(files)} ${JSON.stringify(dest)}`)
  // Also try ffmpeg to mp4 for wider playback
  const mp4 = join(outDir, "control-room-demo-90s.mp4")
  try {
    execSync(
      `ffmpeg -y -i ${JSON.stringify(dest)} -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an ${JSON.stringify(mp4)}`,
      { stdio: "inherit" },
    )
    log("Wrote", mp4)
  } catch {
    log("ffmpeg mp4 skipped; webm at", dest)
  }
  log("Wrote", dest)
  return dest
}

async function main() {
  process.chdir(root)
  const dbUrl = `postgres://controlroom:controlroom@127.0.0.1:${PG_PORT}/controlroom`
  process.env.DATABASE_URL = dbUrl
  // Soften S3 for demo — attachments may 500; UI still works
  process.env.S3_ENDPOINT ||= "http://127.0.0.1:9009"
  process.env.S3_ACCESS_KEY_ID ||= "controlroom"
  process.env.S3_SECRET_ACCESS_KEY ||= "controlroom-local-only"
  process.env.S3_BUCKET ||= "controlroom-attachments"

  // Next.js loads .env.local over .env — pin demo DB without touching committed .env
  const envLocal = join(root, ".env.local")
  writeFileSync(
    envLocal,
    [
      `DATABASE_URL=${dbUrl}`,
      `S3_ENDPOINT=${process.env.S3_ENDPOINT}`,
      `S3_ACCESS_KEY_ID=${process.env.S3_ACCESS_KEY_ID}`,
      `S3_SECRET_ACCESS_KEY=${process.env.S3_SECRET_ACCESS_KEY}`,
      `S3_BUCKET=${process.env.S3_BUCKET}`,
      "",
    ].join("\n"),
  )

  const pg = await ensurePg()
  await ensureSeeded()

  // Free 3000 if a prior next is bound in this netns
  const appPort = Number(new URL(APP_URL).port || 3000)
  log("Starting Next.js on", appPort)
  const next = spawn("npx", ["next", "dev", "-H", "127.0.0.1", "-p", String(appPort)], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: ["ignore", "pipe", "pipe"],
  })
  next.stdout.on("data", (d) => process.stdout.write(d))
  next.stderr.on("data", (d) => process.stderr.write(d))

  try {
    await waitFor(APP_URL)
    log("App up")
    const orderId = await pickOrder(APP_URL)
    log("Picked order", orderId)
    try {
      await fetch(`${APP_URL}/api/orders/${orderId}/agent/run`, { method: "POST" })
      await sleep(5000)
    } catch {}
    try {
      await fetch(`${APP_URL}/api/agent/fleet`, { method: "POST" })
      await sleep(8000)
    } catch {}

    await recordDemo(orderId)
    const path = await finalizeVideo()
    writeFileSync(join(outDir, "demo-order.txt"), String(orderId))
    log("DONE", path, "order=", orderId)
  } finally {
    next.kill("SIGTERM")
    if (pg) await pg.stop().catch(() => {})
    try {
      rmSync(envLocal, { force: true })
    } catch {}
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
