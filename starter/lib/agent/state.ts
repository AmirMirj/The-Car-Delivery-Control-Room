import { qualifiesOnRoad } from "./qualify"
import { getOverlay, listApplied, listMessages, listProposals, listRuns } from "./store"
import type { AttentionItem } from "@/lib/present/types"

export async function loadAgentState(orderId: string, attention: AttentionItem[], lane: string | null) {
  const runs = await listRuns(orderId)
  const activeRun = runs.find((run) => run.status === "running" || run.status === "awaiting_review") ?? runs[0] ?? null
  const proposals = await listProposals(orderId)
  const messages = activeRun ? await listMessages(activeRun.id) : []
  const mutations = await listApplied(orderId)
  const overlay = await getOverlay(orderId)

  return {
    qualifiesOnRoad: qualifiesOnRoad(attention, lane),
    activeRun: activeRun ? {
      id: activeRun.id,
      status: activeRun.status,
      trigger: activeRun.trigger,
      handoverSummary: activeRun.handover_summary,
      decisionText: activeRun.decision_text,
      error: activeRun.error,
      startedAt: activeRun.started_at.toISOString(),
      finishedAt: activeRun.finished_at?.toISOString() ?? null,
    } : null,
    proposals: proposals.map((p) => ({
      id: p.id,
      status: p.status,
      title: p.title,
      summary: p.summary,
      decision: p.decision,
      ops: p.ops,
      reviewNote: p.review_note,
      reviewedAt: p.reviewed_at?.toISOString() ?? null,
      createdAt: p.created_at.toISOString(),
    })),
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      toolName: m.tool_name,
      createdAt: m.created_at.toISOString(),
    })),
    applied: mutations.map((m) => ({
      id: m.id,
      op: m.op,
      appliedAt: m.applied_at.toISOString(),
      appliedBy: m.applied_by,
    })),
    overlay: overlay ? {
      notes: overlay.notes,
      details: overlay.details,
      updatedAt: overlay.updated_at.toISOString(),
    } : null,
  }
}
