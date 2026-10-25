import "server-only"
import { randomUUID } from "crypto"
import postgres from "postgres"
import type { MutationOp } from "./policy"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is required")
// prepare:false keeps us compatible with pooled hosted Postgres (Neon/Supabase) on Vercel.
const sql = postgres(url, { max: 5, prepare: false })

export type RunRow = {
  id: string
  order_id: string
  trigger: string
  status: string
  started_at: Date
  finished_at: Date | null
  error: string | null
  handover_summary: string | null
  decision_text: string | null
}

export type ProposalRow = {
  id: string
  order_id: string
  run_id: string
  status: string
  title: string
  summary: string
  decision: string
  ops: MutationOp[]
  review_note: string | null
  reviewed_at: Date | null
  created_at: Date
}

export type MessageRow = {
  id: string
  run_id: string
  order_id: string
  role: string
  content: string
  tool_name: string | null
  tool_payload: Record<string, unknown> | null
  created_at: Date
}

export async function findActiveRun(orderId: string): Promise<RunRow | null> {
  const rows = await sql<RunRow[]>`
    select * from onroad_runs
    where order_id = ${orderId} and status in ('running', 'awaiting_review')
    order by started_at desc limit 1`
  return rows[0] ?? null
}

export async function latestProposalForRun(runId: string): Promise<ProposalRow | null> {
  const rows = await sql<ProposalRow[]>`
    select * from onroad_proposals where run_id = ${runId} order by created_at desc limit 1`
  return rows[0] ?? null
}

export async function insertRun(input: {
  orderId: string
  trigger: string
}): Promise<string> {
  const id = randomUUID()
  await sql`
    insert into onroad_runs (id, order_id, trigger, status, started_at, finished_at, error, handover_summary, decision_text)
    values (${id}, ${input.orderId}, ${input.trigger}, 'running', now(), null, null, null, null)`
  return id
}

export async function insertMessage(input: {
  runId: string
  orderId: string
  role: string
  content: string
  toolName?: string | null
  toolPayload?: Record<string, unknown> | null
}) {
  await sql`
    insert into onroad_messages (id, run_id, order_id, role, content, tool_name, tool_payload, created_at)
    values (${randomUUID()}, ${input.runId}, ${input.orderId}, ${input.role}, ${input.content}, ${input.toolName ?? null}, ${input.toolPayload ? sql.json(input.toolPayload as never) : null}, now())`
}

export async function finishRun(input: {
  runId: string
  status: string
  handoverSummary?: string | null
  decisionText?: string | null
  error?: string | null
}) {
  await sql`
    update onroad_runs set
      status = ${input.status},
      finished_at = now(),
      handover_summary = ${input.handoverSummary ?? null},
      decision_text = ${input.decisionText ?? null},
      error = ${input.error ?? null}
    where id = ${input.runId}`
}

export async function insertProposal(input: {
  orderId: string
  runId: string
  title: string
  summary: string
  decision: string
  ops: MutationOp[]
}): Promise<string> {
  const id = randomUUID()
  await sql`
    insert into onroad_proposals (id, order_id, run_id, status, title, summary, decision, ops, review_note, reviewed_at, created_at)
    values (${id}, ${input.orderId}, ${input.runId}, 'pending', ${input.title}, ${input.summary}, ${input.decision}, ${sql.json(input.ops as never)}, null, null, now())`
  return id
}

export async function listRuns(orderId: string): Promise<RunRow[]> {
  return sql<RunRow[]>`select * from onroad_runs where order_id = ${orderId} order by started_at desc limit 5`
}

export async function listProposals(orderId: string): Promise<ProposalRow[]> {
  return sql<ProposalRow[]>`select * from onroad_proposals where order_id = ${orderId} order by created_at desc limit 20`
}

export async function listMessages(runId: string): Promise<MessageRow[]> {
  return sql<MessageRow[]>`select * from onroad_messages where run_id = ${runId} order by created_at asc`
}

export async function listApplied(orderId: string) {
  return sql<{ id: string; op: Record<string, unknown>; applied_at: Date; applied_by: string }[]>`
    select id, op, applied_at, applied_by from onroad_applied where order_id = ${orderId} order by applied_at desc limit 20`
}

export async function getOverlay(orderId: string) {
  const rows = await sql<{ notes: string[]; details: Record<string, unknown>; updated_at: Date }[]>`
    select notes, details, updated_at from onroad_overlays where order_id = ${orderId} limit 1`
  return rows[0] ?? null
}

export async function getProposal(proposalId: string): Promise<ProposalRow | null> {
  const rows = await sql<ProposalRow[]>`select * from onroad_proposals where id = ${proposalId} limit 1`
  return rows[0] ?? null
}

export async function setProposalReview(input: {
  proposalId: string
  status: string
  note?: string | null
  ops?: MutationOp[]
}) {
  if (input.ops) {
    await sql`
      update onroad_proposals set status = ${input.status}, review_note = ${input.note ?? null}, reviewed_at = now(), ops = ${sql.json(input.ops as never)}
      where id = ${input.proposalId}`
  } else {
    await sql`
      update onroad_proposals set status = ${input.status}, review_note = ${input.note ?? null}, reviewed_at = now()
      where id = ${input.proposalId}`
  }
}

export async function insertApplied(input: { proposalId: string; orderId: string; op: MutationOp }) {
  await sql`
    insert into onroad_applied (id, proposal_id, order_id, op, applied_at, applied_by)
    values (${randomUUID()}, ${input.proposalId}, ${input.orderId}, ${sql.json(input.op as never)}, now(), 'ops')`
}

export async function upsertOverlay(orderId: string, notes: string[], details: Record<string, unknown>) {
  await sql`
    insert into onroad_overlays (order_id, notes, details, updated_at)
    values (${orderId}, ${sql.json(notes as never)}, ${sql.json(details as never)}, now())
    on conflict (order_id) do update set notes = excluded.notes, details = excluded.details, updated_at = now()`
}

export async function completeRun(runId: string) {
  await sql`update onroad_runs set status = 'completed', finished_at = now() where id = ${runId}`
}

export async function runsForOrders(orderIds: string[]) {
  if (!orderIds.length) return [] as RunRow[]
  return sql<RunRow[]>`select * from onroad_runs where order_id in ${sql(orderIds)}`
}

export type FleetPassRow = {
  id: string
  status: string
  started_at: Date
  finished_at: Date | null
  qualifying_count: number
  ran_count: number
  skipped_pending_count: number
  skipped_other_count: number
  failed_count: number
  proposal_count: number
  error: string | null
}

export async function findRunningFleetPass(): Promise<FleetPassRow | null> {
  const rows = await sql<FleetPassRow[]>`
    select * from onroad_fleet_passes where status = 'running' order by started_at desc limit 1`
  return rows[0] ?? null
}

export async function latestFleetPass(): Promise<FleetPassRow | null> {
  const rows = await sql<FleetPassRow[]>`
    select * from onroad_fleet_passes order by started_at desc limit 1`
  return rows[0] ?? null
}

export async function getFleetPass(id: string): Promise<FleetPassRow | null> {
  const rows = await sql<FleetPassRow[]>`select * from onroad_fleet_passes where id = ${id} limit 1`
  return rows[0] ?? null
}

/** Insert a running pass only if none is running. Returns null if blocked. */
export async function tryInsertFleetPass(): Promise<FleetPassRow | null> {
  const existing = await findRunningFleetPass()
  if (existing) return null
  const id = randomUUID()
  try {
    await sql`
      insert into onroad_fleet_passes (
        id, status, started_at, finished_at,
        qualifying_count, ran_count, skipped_pending_count, skipped_other_count, failed_count, proposal_count, error
      ) values (${id}, 'running', now(), null, 0, 0, 0, 0, 0, 0, null)`
  } catch (error) {
    // Unique partial index on status='running' — concurrent start lost the race
    const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : ""
    if (code === "23505") return null
    throw error
  }
  return (await getFleetPass(id))!
}

export async function updateFleetPassCounters(input: {
  passId: string
  qualifyingCount?: number
  ranCount?: number
  skippedPendingCount?: number
  skippedOtherCount?: number
  failedCount?: number
  proposalCount?: number
}) {
  const pass = await getFleetPass(input.passId)
  if (!pass) return
  await sql`
    update onroad_fleet_passes set
      qualifying_count = ${input.qualifyingCount ?? pass.qualifying_count},
      ran_count = ${input.ranCount ?? pass.ran_count},
      skipped_pending_count = ${input.skippedPendingCount ?? pass.skipped_pending_count},
      skipped_other_count = ${input.skippedOtherCount ?? pass.skipped_other_count},
      failed_count = ${input.failedCount ?? pass.failed_count},
      proposal_count = ${input.proposalCount ?? pass.proposal_count}
    where id = ${input.passId}`
}

export async function finishFleetPass(input: {
  passId: string
  status: "completed" | "failed"
  error?: string | null
}) {
  await sql`
    update onroad_fleet_passes set status = ${input.status}, finished_at = now(), error = ${input.error ?? null}
    where id = ${input.passId}`
}

export async function insertFleetOutcome(input: {
  passId: string
  orderId: string
  result: "ran" | "skipped_pending" | "failed" | "no_qualify"
  runId?: string | null
  error?: string | null
}) {
  await sql`
    insert into onroad_fleet_pass_outcomes (id, pass_id, order_id, result, run_id, error, created_at)
    values (${randomUUID()}, ${input.passId}, ${input.orderId}, ${input.result}, ${input.runId ?? null}, ${input.error ?? null}, now())`
}

export async function hasPendingProposal(orderId: string): Promise<boolean> {
  const rows = await sql<{ id: string }[]>`
    select id from onroad_proposals where order_id = ${orderId} and status = 'pending' limit 1`
  return rows.length > 0
}

export async function pendingProposalsForOrders(orderIds: string[]): Promise<Set<string>> {
  if (!orderIds.length) return new Set()
  const rows = await sql<{ order_id: string }[]>`
    select distinct order_id from onroad_proposals
    where order_id in ${sql(orderIds)} and status = 'pending'`
  return new Set(rows.map((row) => row.order_id))
}

/** Map order id → UI cue: working | proposal_waiting | failed | none */
export async function agentStatusCuesForOrders(orderIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (!orderIds.length) return map
  const pending = await pendingProposalsForOrders(orderIds)
  for (const id of pending) map.set(id, "proposal_waiting")
  const runs = await runsForOrders(orderIds)
  // Prefer newest run per order
  const latest = new Map<string, RunRow>()
  for (const run of runs) {
    const prev = latest.get(run.order_id)
    if (!prev || run.started_at > prev.started_at) latest.set(run.order_id, run)
  }
  for (const [orderId, run] of latest) {
    if (map.get(orderId) === "proposal_waiting") continue
    if (run.status === "running") map.set(orderId, "working")
    else if (run.status === "awaiting_review") map.set(orderId, "proposal_waiting")
    else if (run.status === "failed") map.set(orderId, "failed")
    else map.set(orderId, map.get(orderId) ?? "none")
  }
  for (const id of orderIds) if (!map.has(id)) map.set(id, "none")
  return map
}
