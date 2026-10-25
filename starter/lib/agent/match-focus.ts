import type { RecordView } from "@/lib/present/types"
import { listFocusAreas, type FocusAreaId } from "./focus-areas"
import { qualifiesOnRoad } from "./qualify"

export type MatchResult =
  | { kind: "matched"; focusArea: FocusAreaId }
  | { kind: "ambiguous"; candidates: FocusAreaId[] }

type Score = { id: FocusAreaId; score: number }

/** Automatic situation → focus area; ambiguous when tied or unclear. */
export function matchFocusArea(view: RecordView): MatchResult {
  const text = [
    view.story.headline,
    view.story.intro,
    ...view.attention.map((item) => `${item.title} ${item.detail ?? ""} ${item.short}`),
    ...view.threads.map((t) => `${t.categoryLabel} ${t.statusLabel} ${t.waitingOn ?? ""}`),
    view.header.routeKindLabel,
    view.header.from.city,
    view.header.to.city,
  ]
    .join(" ")
    .toLowerCase()

  const scores: Score[] = listFocusAreas().map((area) => {
    let score = 0
    for (const hint of area.exampleSituations) {
      if (text.includes(hint.toLowerCase())) score += 2
    }
    return { id: area.id, score }
  })

  if (qualifiesOnRoad(view.attention, null)) {
    const row = scores.find((s) => s.id === "on_the_road")
    if (row) row.score += 4
  }

  const openThread = view.threads.some((t) => t.status === "OPEN")
  if (openThread) {
    const support = scores.find((s) => s.id === "driver_support")
    if (support) support.score += 1
  }

  scores.sort((a, b) => b.score - a.score)
  const top = scores[0]
  const second = scores[1]
  if (!top || top.score <= 0) {
    return { kind: "ambiguous", candidates: listFocusAreas().map((a) => a.id) }
  }
  if (second && second.score === top.score) {
    return {
      kind: "ambiguous",
      candidates: scores.filter((s) => s.score === top.score).map((s) => s.id),
    }
  }
  return { kind: "matched", focusArea: top.id }
}
