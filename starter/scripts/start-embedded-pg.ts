import EmbeddedPostgres from "embedded-postgres"
import { mkdirSync } from "node:fs"
import { join } from "node:path"

const databaseDir = join(process.cwd(), ".data", "embedded-pg")
mkdirSync(databaseDir, { recursive: true })

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "controlroom",
  password: "controlroom",
  port: 5438,
  persistent: true,
  onLog: (message) => process.stdout.write(`[pg] ${message}`),
  onError: (message) => process.stderr.write(`[pg-err] ${message}`),
})

async function main() {
  try {
    await pg.initialise()
  } catch (error) {
    const text = String(error)
    if (!text.includes("already") && !text.includes("exists")) {
      // Re-init after crash: initialise is idempotent enough for persistent dirs
      console.warn("initialise note:", text.slice(0, 200))
    }
  }
  await pg.start()
  try {
    await pg.createDatabase("controlroom")
  } catch (error) {
    const text = String(error)
    if (!/already exists/i.test(text)) throw error
    console.log("database controlroom already exists")
  }
  console.log("EMBEDDED_PG_READY port=5438")
  // Keep alive
  await new Promise(() => {})
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
