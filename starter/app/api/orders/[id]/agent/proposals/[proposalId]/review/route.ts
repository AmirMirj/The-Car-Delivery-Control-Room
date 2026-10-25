import { NextResponse } from "next/server"
import { reviewProposal } from "@/lib/mutations"

export const runtime = "nodejs"

export async function POST(request: Request, context: { params: Promise<{ id: string; proposalId: string }> }) {
  const { id, proposalId } = await context.params
  const body = await request.json().catch(() => ({})) as {
    decision?: "approve" | "reject" | "edit"
    note?: string | null
    editedOps?: unknown[]
  }
  if (!body.decision || !["approve", "reject", "edit"].includes(body.decision)) {
    return NextResponse.json({ error: "decision must be approve, reject, or edit" }, { status: 400 })
  }

  const result = await reviewProposal({
    orderId: id,
    proposalId,
    decision: body.decision,
    note: body.note,
    editedOps: body.editedOps,
  })
  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result)
}
