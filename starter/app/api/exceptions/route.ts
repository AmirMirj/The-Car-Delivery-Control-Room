import { NextRequest, NextResponse } from "next/server"
import { buildBoardCard } from "@/lib/present/board"
import { loadBoardBundles } from "@/lib/present/load"
import type { Tone } from "@/lib/present/types"
import { qualifiesCard } from "@/lib/agent/qualify"
import { runsForOrders } from "@/lib/agent/store"
import { decideCueForException } from "@/lib/present/decide-cue"

export const runtime = "nodejs"

const TONE_RANK: Record<Tone, number> = { danger: 0, warn: 1, accent: 2, neutral: 3, ok: 4 }

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? ""
  const { snapshotAt, bundles } = await loadBoardBundles()
  const cards = bundles.map(buildBoardCard).filter((card) => card.attention.length > 0)
  const matched = query
    ? cards.filter((card) => [card.reference, card.customer, card.vehicle, card.origin, card.destination, card.plate ?? ""]
      .some((field) => field.toLowerCase().includes(query)))
    : cards

  matched.sort((a, b) => {
    const tone = TONE_RANK[a.attentionTone] - TONE_RANK[b.attentionTone]
    if (tone) return tone
    const aDate = a.decisive?.start ?? ""
    const bDate = b.decisive?.start ?? ""
    if (aDate && bDate && aDate !== bDate) return aDate.localeCompare(bDate)
    return b.updatedAt.localeCompare(a.updatedAt)
  })

  const orderIds = matched.map((card) => card.id)
  const statusByOrder = new Map<string, string>()
  if (orderIds.length) {
    try {
      const runs = await runsForOrders(orderIds)
      for (const run of runs) {
        const prev = statusByOrder.get(run.order_id)
        if (!prev || run.status === "running" || run.status === "awaiting_review") statusByOrder.set(run.order_id, run.status)
        else if (!statusByOrder.has(run.order_id)) statusByOrder.set(run.order_id, run.status)
      }
    } catch {
      // Agent tables may not be migrated yet; queue still works.
    }
  }

  const items = matched.map((card) => {
    const primary = card.attention[0]
    const reason = primary?.short || primary?.title || "Needs a person"
    const reasons = card.attention.map((item) => ({ kind: item.kind, tone: item.tone, title: item.short || item.title }))
    const agentStatus = statusByOrder.get(card.id) ?? (qualifiesCard(card) ? "none" : null)
    return {
      orderId: card.id,
      reference: card.reference,
      headline: card.vehicle,
      reason,
      decideCue: decideCueForException({ agentStatus, reasons, primaryReason: reason }),
      reasons,
      tone: card.attentionTone,
      keyDateLabel: card.decisive?.label ?? null,
      keyDate: card.decisive?.start ?? null,
      vehicleLabel: card.vehicle,
      routeLabel: `${card.from.city} → ${card.to.city}`,
      customer: card.customer,
      qualifiesOnRoad: qualifiesCard(card),
      agentStatus,
      href: `/orders/${card.id}`,
      work: card.work.slice(0, 3),
    }
  })

  return NextResponse.json({ snapshotAt, totalExceptions: items.length, items, query })
}
