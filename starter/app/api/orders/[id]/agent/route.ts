import { NextResponse } from "next/server"
import { loadOrder } from "@/lib/present/load"
import { buildRecordView } from "@/lib/present/record"
import { runOnRoadAgent } from "@/lib/agent/loop"

export const runtime = "nodejs"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await request.json().catch(() => ({})) as { message?: string }
  const message = body.message?.trim()
  if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 })

  const loaded = await loadOrder(id)
  if (!loaded) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  const view = buildRecordView(loaded.bundle)

  const result = await runOnRoadAgent({
    orderId: id,
    trigger: "user_chat",
    userMessage: message,
    ctx: {
      orderId: id,
      reference: view.header.reference,
      vehicle: view.header.vehicle?.title ?? "vehicle",
      customer: view.header.customer.name,
      lane: loaded.order.displayLane,
      attentionSummary: view.attention.map((item) => item.short).join("; "),
      route: `${view.header.from.city} → ${view.header.to.city}`,
    },
  })

  return NextResponse.json(result)
}
