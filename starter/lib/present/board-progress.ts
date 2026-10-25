import type { KeyDate } from "./types"

const APPROACH_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Snapshot-relative progress toward the decisive date.
 * Returns null when there is no decisive date (never invent a %).
 */
export function boardProgressPct(
  snapshotAt: string | null | undefined,
  decisive: Pick<KeyDate, "start" | "end" | "key"> | null | undefined,
  displayLane?: string | null,
): number | null {
  if (!decisive) return null
  if (
    displayLane === "delivered"
    || displayLane === "cancelled"
    || decisive.key === "delivered"
    || decisive.key === "cancelled"
  ) {
    return 100
  }
  if (!snapshotAt) return null
  const snap = Date.parse(snapshotAt)
  const start = Date.parse(decisive.start)
  const end = Date.parse(decisive.end ?? decisive.start)
  if (Number.isNaN(snap) || Number.isNaN(start) || Number.isNaN(end)) return null

  // Slot / window: fraction elapsed through the window
  if (decisive.end && end > start) {
    if (snap <= start) return 0
    if (snap >= end) return 100
    return clampPct(Math.round((100 * (snap - start)) / (end - start)))
  }

  // Point-in-time: fill over the 7 days approaching the instant
  if (snap >= end) return 100
  const remaining = end - snap
  if (remaining >= APPROACH_MS) return 0
  return clampPct(Math.round(100 * (1 - remaining / APPROACH_MS)))
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, n))
}

/** Stable pastel tone index for an owner name (0–5). */
export function ownerToneIndex(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return h % 6
}
