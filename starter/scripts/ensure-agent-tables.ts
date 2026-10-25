import "dotenv/config"
import postgres from "postgres"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL required")
  const sql = postgres(url, { max: 1 })
  await sql.unsafe(`
CREATE TABLE IF NOT EXISTS onroad_runs (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id),
  trigger text NOT NULL,
  status text NOT NULL,
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  error text,
  handover_summary text,
  decision_text text
);
CREATE INDEX IF NOT EXISTS onroad_runs_order_idx ON onroad_runs(order_id, started_at);
CREATE TABLE IF NOT EXISTS onroad_messages (
  id text PRIMARY KEY,
  run_id text NOT NULL REFERENCES onroad_runs(id),
  order_id text NOT NULL REFERENCES orders(id),
  role text NOT NULL,
  content text NOT NULL,
  tool_name text,
  tool_payload jsonb,
  created_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS onroad_messages_run_idx ON onroad_messages(run_id, created_at);
CREATE TABLE IF NOT EXISTS onroad_proposals (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id),
  run_id text NOT NULL REFERENCES onroad_runs(id),
  status text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  decision text NOT NULL,
  ops jsonb NOT NULL,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS onroad_proposals_order_idx ON onroad_proposals(order_id, created_at);
CREATE TABLE IF NOT EXISTS onroad_applied (
  id text PRIMARY KEY,
  proposal_id text NOT NULL REFERENCES onroad_proposals(id),
  order_id text NOT NULL REFERENCES orders(id),
  op jsonb NOT NULL,
  applied_at timestamptz NOT NULL,
  applied_by text NOT NULL
);
CREATE INDEX IF NOT EXISTS onroad_applied_order_idx ON onroad_applied(order_id, applied_at);
CREATE TABLE IF NOT EXISTS onroad_overlays (
  order_id text PRIMARY KEY REFERENCES orders(id),
  notes jsonb NOT NULL,
  details jsonb NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS onroad_fleet_passes (
  id text PRIMARY KEY,
  status text NOT NULL,
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  qualifying_count int NOT NULL DEFAULT 0,
  ran_count int NOT NULL DEFAULT 0,
  skipped_pending_count int NOT NULL DEFAULT 0,
  skipped_other_count int NOT NULL DEFAULT 0,
  failed_count int NOT NULL DEFAULT 0,
  proposal_count int NOT NULL DEFAULT 0,
  error text
);
CREATE INDEX IF NOT EXISTS onroad_fleet_passes_status_idx ON onroad_fleet_passes(status, started_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS onroad_fleet_passes_one_running_idx ON onroad_fleet_passes ((status)) WHERE status = 'running';
CREATE TABLE IF NOT EXISTS onroad_fleet_pass_outcomes (
  id text PRIMARY KEY,
  pass_id text NOT NULL REFERENCES onroad_fleet_passes(id) ON DELETE CASCADE,
  order_id text NOT NULL REFERENCES orders(id),
  result text NOT NULL,
  run_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS onroad_fleet_outcomes_pass_idx ON onroad_fleet_pass_outcomes(pass_id, created_at);
`)
  console.log("onroad tables ready (including fleet passes)")
  await sql.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
