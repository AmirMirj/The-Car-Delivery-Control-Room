import type { BoardCard } from "./types"

export type BoardFilterId = "all" | "needs_attention" | "has_owner"

export const BOARD_FILTERS: { id: BoardFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_attention", label: "Needs attention" },
  { id: "has_owner", label: "Has owner" },
]

export function parseBoardFilter(value: string | null | undefined): BoardFilterId {
  if (value === "needs_attention" || value === "has_owner" || value === "all") return value
  return "all"
}

export function cardHasOwner(card: BoardCard): boolean {
  return card.attention.some((item) => !!item.owner && item.owner !== "owner not recorded" && item.owner !== "no one recorded")
}

export function filterBoardCards(cards: BoardCard[], filter: BoardFilterId): BoardCard[] {
  switch (filter) {
    case "needs_attention":
      return cards.filter((card) => card.attention.length > 0)
    case "has_owner":
      return cards.filter(cardHasOwner)
    default:
      return cards
  }
}

/** First named attention owner for a card pill, or null. */
export function cardOwnerName(card: BoardCard): string | null {
  for (const item of card.attention) {
    if (item.owner && item.owner !== "owner not recorded" && item.owner !== "no one recorded") {
      return item.owner
    }
  }
  return null
}
