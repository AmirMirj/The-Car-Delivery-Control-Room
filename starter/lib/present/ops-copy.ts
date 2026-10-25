/** Plain-language labels for ops surfaces (no snake_case in the UI). */

const AGENT_STATUS: Record<string, string> = {
  none: "",
  starting: "Starting",
  running: "Working",
  awaiting_review: "Waiting for your decision",
  succeeded: "Finished",
  completed: "Finished",
  failed: "Could not finish",
  cancelled: "Stopped",
}

export function humanizeAgentStatus(status: string | null | undefined): string | null {
  if (!status || status === "none") return null
  const known = AGENT_STATUS[status]
  if (known !== undefined) return known || null
  return status
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function opsLoadError(fallback = "Something went wrong loading this view"): string {
  return `${fallback}. Try again in a moment, or refresh the page.`
}
