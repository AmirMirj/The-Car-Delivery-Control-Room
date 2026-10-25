import "server-only"
import { buildBoardCard } from "@/lib/present/board"
import { loadBoardBundles, loadOrder } from "@/lib/present/load"
import { buildRecordView } from "@/lib/present/record"
import { qualifiesCard } from "./qualify"
import { runOnRoadAgent } from "./loop"
import {
  findRunningFleetPass,
  finishFleetPass,
  getFleetPass,
  hasPendingProposal,
  insertFleetOutcome,
  tryInsertFleetPass,
  updateFleetPassCounters,
  type FleetPassRow,
} from "./store"

export function serializeFleetPass(pass: FleetPassRow) {
  return {
    id: pass.id,
    status: pass.status,
    startedAt: pass.started_at.toISOString(),
    finishedAt: pass.finished_at ? pass.finished_at.toISOString() : null,
    qualifyingCount: pass.qualifying_count,
    ranCount: pass.ran_count,
    skippedPendingCount: pass.skipped_pending_count,
    skippedOtherCount: pass.skipped_other_count,
    failedCount: pass.failed_count,
    proposalCount: pass.proposal_count,
    error: pass.error,
  }
}

/** Create a running pass or return null if one is already active. */
export async function startFleetPass(): Promise<{ ok: true; pass: FleetPassRow } | { ok: false; pass: FleetPassRow }> {
  const created = await tryInsertFleetPass()
  if (!created) {
    const running = await findRunningFleetPass()
    return { ok: false, pass: running! }
  }
  return { ok: true, pass: created }
}

/** Sequential fleet orchestration — call without awaiting from the route (fire-and-forget). */
export async function executeFleetPass(passId: string): Promise<void> {
  let ran = 0
  let skippedPending = 0
  let failed = 0
  let proposals = 0
  try {
    const { bundles } = await loadBoardBundles()
    const cards = bundles.map(buildBoardCard)
    const qualifying = cards.filter(qualifiesCard)
    await updateFleetPassCounters({ passId, qualifyingCount: qualifying.length })

    for (const card of qualifying) {
      const still = await getFleetPass(passId)
      if (!still || still.status !== "running") return

      if (await hasPendingProposal(card.id)) {
        skippedPending += 1
        await insertFleetOutcome({ passId, orderId: card.id, result: "skipped_pending" })
        await updateFleetPassCounters({ passId, skippedPendingCount: skippedPending })
        continue
      }

      try {
        const loaded = await loadOrder(card.id)
        if (!loaded) {
          failed += 1
          await insertFleetOutcome({ passId, orderId: card.id, result: "failed", error: "Order not found" })
          await updateFleetPassCounters({ passId, failedCount: failed })
          continue
        }
        const view = buildRecordView(loaded.bundle)
        const result = await runOnRoadAgent({
          orderId: card.id,
          trigger: "fleet_pass",
          ctx: {
            orderId: card.id,
            reference: view.header.reference,
            vehicle: view.header.vehicle?.title ?? "vehicle",
            customer: view.header.customer.name,
            lane: loaded.order.displayLane,
            attentionSummary: view.attention.map((item) => item.short).join("; "),
            route: `${view.header.from.city} → ${view.header.to.city}`,
          },
        })
        if (result.status === "failed") {
          failed += 1
          await insertFleetOutcome({ passId, orderId: card.id, result: "failed", runId: result.runId, error: "Agent run failed" })
          await updateFleetPassCounters({ passId, failedCount: failed })
        } else {
          ran += 1
          if (result.proposalId) proposals += 1
          await insertFleetOutcome({ passId, orderId: card.id, result: "ran", runId: result.runId })
          await updateFleetPassCounters({ passId, ranCount: ran, proposalCount: proposals })
        }
      } catch (error) {
        failed += 1
        const message = error instanceof Error ? error.message : "Fleet order failed"
        await insertFleetOutcome({ passId, orderId: card.id, result: "failed", error: message })
        await updateFleetPassCounters({ passId, failedCount: failed })
      }
    }

    await finishFleetPass({ passId, status: "completed" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fleet pass failed"
    await finishFleetPass({ passId, status: "failed", error: message })
  }
}
