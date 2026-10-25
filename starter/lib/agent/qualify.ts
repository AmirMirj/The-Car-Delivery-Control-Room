import type { AttentionItem, BoardCard } from "@/lib/present/types"

const ON_ROAD_ALERT = /delay|breakdown|road|ferry|missed|stranded|warning|immobil|incident|towing|recovery|late/i

/** Pure predicate: should the on-road agent auto-run for this attention set / card? */
export function qualifiesOnRoad(attention: AttentionItem[], lane?: string | null): boolean {
  if (attention.some((item) => item.kind === "incident")) return true
  if (attention.some((item) => item.kind === "alert" || item.kind === "owned_alert")) {
    if (attention.some((item) => ON_ROAD_ALERT.test(`${item.title} ${item.short} ${item.detail ?? ""}`))) return true
  }
  if (lane === "moving" && attention.some((item) => item.tone === "danger" || item.tone === "warn")) return true
  if (attention.some((item) => item.kind === "waiting" && ON_ROAD_ALERT.test(`${item.title} ${item.detail ?? ""}`))) return true
  return false
}

export function qualifiesCard(card: BoardCard): boolean {
  return card.attention.length > 0 && qualifiesOnRoad(card.attention, card.displayLane)
}
