import { NextResponse } from "next/server"
import { loadOrder } from "@/lib/present/load"
import { buildRecordView } from "@/lib/present/record"
import { runOnRoadAgent } from "@/lib/agent/loop"
import { qualifiesOnRoad } from "@/lib/agent/qualify"

export const runtime = "nodejs"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await request.json().catch(() => ({})) as { trigger?: string }
  const trigger = body.trigger === "user_rerun" ? "user_rerun" : "auto_exception"

  const loaded = await loadOrder(id)
  if (!loaded) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  const view = buildRecordView(loaded.bundle)
  const qualifies = qualifiesOnRoad(view.attention, loaded.order.displayLane)
  if (!qualifies && trigger === "auto_exception") {
    return NextResponse.json({ error: "Order does not qualify for on-road auto-run" }, { status: 422 })
  }

  const result = await runOnRoadAgent({
    orderId: id,
    trigger,
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
