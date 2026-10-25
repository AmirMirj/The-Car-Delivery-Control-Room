/** Short “what should the person do” cue for exception queue cards. */

export function decideCueForException(input: {
  agentStatus: string | null
  reasons: { kind: string; title: string }[]
  primaryReason: string
}): string {
  const status = input.agentStatus ?? ""
  if (status === "awaiting_review") return "Approve or reject the agent proposal"
  if (status === "running") return "Wait — agent is still gathering"

  const kinds = input.reasons.map((r) => r.kind.toLowerCase())
  if (kinds.some((k) => k.includes("conversation") || k.includes("message") || k.includes("thread"))) {
    return "Reply or close the open conversation"
  }
  if (kinds.some((k) => k.includes("alert") || k.includes("work") || k.includes("incident"))) {
    const trimmed = input.primaryReason.trim()
    const body = trimmed.length > 72 ? `${trimmed.slice(0, 69)}…` : trimmed
    return body ? `Decide: ${body}` : "Decide on the open alert or work"
  }

  return "Open the order and choose the next step"
}
