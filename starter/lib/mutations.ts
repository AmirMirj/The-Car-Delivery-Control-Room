import { assertAllowlistedOps, type MutationOp } from "@/lib/agent/policy"
import {
  completeRun, getOverlay, getProposal, insertApplied, setProposalReview, upsertOverlay,
} from "@/lib/agent/store"

export async function reviewProposal(input: {
  orderId: string
  proposalId: string
  decision: "approve" | "reject" | "edit"
  note?: string | null
  editedOps?: unknown[] | null
}) {
  const proposal = await getProposal(input.proposalId)
  if (!proposal || proposal.order_id !== input.orderId) return { error: "Proposal not found", status: 404 as const }
  if (proposal.status !== "pending") return { error: "Proposal is not pending", status: 409 as const }

  if (input.decision === "reject") {
    await setProposalReview({ proposalId: proposal.id, status: "rejected", note: input.note })
    await completeRun(proposal.run_id)
    return { proposalId: proposal.id, status: "rejected", applied: [] as { op: MutationOp; appliedAt: string }[], orderId: input.orderId }
  }

  const ops = assertAllowlistedOps(
    input.decision === "edit" && input.editedOps ? input.editedOps : proposal.ops,
  )

  const applied: { op: MutationOp; appliedAt: string }[] = []
  for (const op of ops) {
    await applyOp(input.orderId, op)
    await insertApplied({ proposalId: proposal.id, orderId: input.orderId, op })
    applied.push({ op, appliedAt: new Date().toISOString() })
  }

  const status = input.decision === "edit" ? "edited" : "approved"
  await setProposalReview({ proposalId: proposal.id, status, note: input.note, ops })
  await completeRun(proposal.run_id)

  return { proposalId: proposal.id, status, applied, orderId: input.orderId }
}

async function applyOp(orderId: string, op: MutationOp) {
  const existing = await getOverlay(orderId)
  const notes = existing?.notes ? [...existing.notes] : []
  const details = { ...(existing?.details ?? {}) } as Record<string, unknown>

  switch (op.type) {
    case "add_order_note":
      notes.push(op.text)
      break
    case "set_internal_flag":
      details[op.key] = op.value
      break
    case "adjust_promise_window":
      details.promiseWindow = { start: op.start, end: op.end, timezone: op.timezone }
      break
    case "draft_customer_message":
      details.customerMessageDraft = { body: op.body, status: "draft_not_sent" }
      break
    case "record_driver_contact":
      details.lastDriverContact = { channel: op.channel, summary: op.summary, at: new Date().toISOString() }
      break
  }

  await upsertOverlay(orderId, notes, details)
}
