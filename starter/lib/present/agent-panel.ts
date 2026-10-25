/** Split a long handover into ≤ max short bullets (sentence / line based). */
export function splitHandoverBullets(text: string | null | undefined, max = 5): string[] {
  if (!text?.trim()) return []
  const parts = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 12)
  const bullets: string[] = []
  for (const part of parts) {
    if (bullets.length >= max) break
    bullets.push(part.length > 140 ? `${part.slice(0, 137).trim()}…` : part)
  }
  return bullets.length ? bullets : [text.trim().slice(0, 140) + (text.trim().length > 140 ? "…" : "")]
}

/** Truncate for chat preview; returns null preview when short enough. */
export function previewText(text: string, maxChars = 180): { preview: string; truncated: boolean } {
  const trimmed = text.trim()
  if (trimmed.length <= maxChars) return { preview: trimmed, truncated: false }
  return { preview: `${trimmed.slice(0, maxChars - 1).trim()}…`, truncated: true }
}
