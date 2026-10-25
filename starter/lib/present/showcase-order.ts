import type { ShowcaseHint } from "@/lib/pitch"

export type ShowcaseCandidate = {
  orderId: string
  reference: string
  headline: string
  vehicleLabel?: string | null
  qualifiesOnRoad?: boolean
  agentStatus?: string | null
}

export type ShowcaseResolution = {
  orderId: string | null
  href: string
  label: string
  hint: string
}

function matchesHint(candidate: ShowcaseCandidate, hint: ShowcaseHint): boolean {
  const hay = `${candidate.headline} ${candidate.vehicleLabel ?? ""} ${candidate.reference}`.toLowerCase()
  return hint.vehicleSubstrings.some((part) => hay.includes(part.toLowerCase()))
}

function score(candidate: ShowcaseCandidate, hint: ShowcaseHint): number {
  let value = 0
  if (matchesHint(candidate, hint)) value += 100
  if (hint.preferOnRoad && candidate.qualifiesOnRoad) value += 40
  const status = candidate.agentStatus
  if (status && status !== "none") value += 20
  if (status === "awaiting_review") value += 15
  return value
}

/** Pick a showcase order from exception-queue items (deterministic: highest score, then reference). */
export function resolveShowcaseFromExceptions(
  items: ShowcaseCandidate[],
  hint: ShowcaseHint,
): ShowcaseResolution {
  if (!items.length) {
    return {
      orderId: null,
      href: "/",
      label: "Pick any exception card",
      hint: "No exceptions in this snapshot — open Needs a person after seed.",
    }
  }

  const ranked = [...items].sort((a, b) => {
    const diff = score(b, hint) - score(a, hint)
    if (diff) return diff
    return a.reference.localeCompare(b.reference)
  })
  const pick = ranked[0]
  const title = pick.vehicleLabel || pick.headline
  return {
    orderId: pick.orderId,
    href: `/orders/${encodeURIComponent(pick.orderId)}`,
    label: `${title} · ${pick.reference}`,
    hint: pick.qualifiesOnRoad
      ? "On-road / exception showcase — provenance + Approve on the record"
      : "Exception showcase — reason, Decide, and timeline provenance",
  }
}
