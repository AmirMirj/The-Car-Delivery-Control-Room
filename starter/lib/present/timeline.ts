import type { RecordView, Tone } from "./types"

export type TimelineCategory = "attention" | "conversation" | "agent" | "activity"

export type ActivityType = "cheap" | "consequential" | "na"
export type TimelineProgress =
  | "open"
  | "in_progress"
  | "waiting_person"
  | "waiting_counterparty"
  | "completed"
  | "failed"
export type AgentInvolvement = "none" | "cheap_work" | "proposed" | "reviewed" | "applied"

export type CheapStep = { name: string; result: string; at?: string }

export type TimelineEntry = {
  id: string
  category: TimelineCategory
  icon: string
  title: string
  detail: string | null
  meta: string | null
  at: string | null
  atLabel: string | null
  tone: Tone
  needsPerson: boolean
  activityType: ActivityType
  progress: TimelineProgress
  agentInvolvement: AgentInvolvement
  source: string
  destination: string
  result: string
  cheapSteps?: CheapStep[]
  threadId?: string | null
  proposalId?: string | null
  runId?: string | null
}

export type TimelineCounts = {
  everything: number
  attention: number
  conversations: number
  agent: number
  activity: number
}

export type TimelineModel = { entries: TimelineEntry[]; counts: TimelineCounts }

const ATTENTION_ICON: Record<string, string> = {
  alert: "alert", owned_alert: "alert", work: "work", incident: "incident", waiting: "waiting", conversation: "message",
  proposal: "proposal", claim: "alert", custody: "key", check: "note", inbox: "inbox",
}

const TONE_RANK: Record<Tone, number> = { danger: 0, warn: 1, accent: 2, neutral: 3, ok: 4 }

export type LocalAgentProposal = {
  id: string
  status: string
  title: string
  summary: string
  decision: string
  createdAt: string
  cheapSteps?: CheapStep[]
  runId?: string | null
}

function needsPersonFlag(entry: TimelineEntry): boolean {
  return entry.category === "attention" || entry.needsPerson
}

/** Build a combined timeline from the order record view (+ optional local on-road proposals). */
export function buildTimeline(view: RecordView, localProposals: LocalAgentProposal[] = []): TimelineModel {
  const entries: TimelineEntry[] = []

  for (const item of view.attention) {
    entries.push({
      id: `attention:${item.kind}:${item.recordId}`,
      category: "attention",
      icon: ATTENTION_ICON[item.kind] ?? "note",
      title: item.title,
      detail: item.detail,
      meta: [item.owner ? `Owner: ${item.owner}` : "No owner", item.atLabel].filter(Boolean).join(" · "),
      at: item.at,
      atLabel: item.atLabel,
      tone: item.tone,
      needsPerson: true,
      activityType: item.kind === "proposal" ? "consequential" : "na",
      progress: "waiting_person",
      agentInvolvement: item.kind === "proposal" ? "proposed" : "none",
      source: item.owner ?? "System",
      destination: "Ops",
      result: "Needs a person",
    })
  }

  const seenThreads = new Set<string>()
  for (const thread of view.threads) {
    if (seenThreads.has(thread.id)) continue
    seenThreads.add(thread.id)
    const from = thread.counterparty?.name ?? thread.channelLabel
    const to = thread.owner ?? "Support desk"
    const open = thread.status === "OPEN"
    const waitingCounterparty = Boolean(thread.waitingOn && thread.waitingOn.toLowerCase() !== "ops" && thread.waitingOn.toLowerCase() !== "support")
    entries.push({
      id: `conversation:${thread.id}`,
      category: "conversation",
      icon: "message",
      title: `Open conversation: ${thread.categoryLabel.toLowerCase()}`,
      detail: thread.counterparty ? `${thread.channelLabel} with ${thread.counterparty.name}` : thread.channelLabel,
      meta: [thread.owner ? `Owner: ${thread.owner}` : null, thread.statusLabel, thread.waitingOn ? `waiting on ${thread.waitingOn}` : null].filter(Boolean).join(" · ") || null,
      at: thread.updatedAt ?? thread.startedAt,
      atLabel: "updated",
      tone: thread.tone,
      needsPerson: open,
      activityType: "na",
      progress: open
        ? (waitingCounterparty ? "waiting_counterparty" : "waiting_person")
        : "completed",
      agentInvolvement: "none",
      source: from,
      destination: to,
      result: open ? (thread.waitingOn ? `Waiting on ${thread.waitingOn}` : "Still open") : thread.statusLabel,
      threadId: thread.id,
    })
  }

  for (const proposal of view.proposals) {
    const awaiting =
      proposal.status === "PENDING_REVIEW" ||
      proposal.status === "FAILED" ||
      proposal.status === "APPROVED_AWAITING_EXECUTION"
    const failed = proposal.status === "FAILED"
    const applied = proposal.status === "EXECUTED" || proposal.execution?.status === "SUCCEEDED"
    const reviewed = Boolean(proposal.review)
    const cheapSteps: CheapStep[] = []
    if (proposal.rationale) cheapSteps.push({ name: "Gather rationale", result: proposal.rationale.slice(0, 160), at: proposal.createdAt })
    if (proposal.evidenceCount > 0) cheapSteps.push({ name: "Look up evidence", result: `${proposal.evidenceCount} evidence link${proposal.evidenceCount === 1 ? "" : "s"}`, at: proposal.createdAt })
    if (proposal.commandLabel) cheapSteps.push({ name: "Read command context", result: proposal.commandLabel, at: proposal.createdAt })

    let progress: TimelineProgress = "completed"
    let result = proposal.statusLabel
    let agentInvolvement: AgentInvolvement = "proposed"
    if (failed) {
      progress = "failed"
      result = proposal.execution?.error ?? "Failed"
      agentInvolvement = "proposed"
    } else if (proposal.status === "PENDING_REVIEW") {
      progress = "waiting_person"
      result = "Awaiting review"
      agentInvolvement = "proposed"
    } else if (proposal.status === "APPROVED_AWAITING_EXECUTION") {
      progress = "in_progress"
      result = "Approved · awaiting execution"
      agentInvolvement = "reviewed"
    } else if (applied) {
      progress = "completed"
      result = proposal.execution?.statusLabel ?? "Applied"
      agentInvolvement = "applied"
    } else if (reviewed) {
      progress = "completed"
      result = proposal.review?.decisionLabel ?? proposal.statusLabel
      agentInvolvement = "reviewed"
    }

    entries.push({
      id: `agent:${proposal.id}`,
      category: "agent",
      icon: "proposal",
      title: failed ? "Agent action failed" : proposal.status === "PENDING_REVIEW" ? "Agent proposal awaiting review" : proposal.summary,
      detail: failed ? (proposal.execution?.error ?? proposal.summary) : proposal.summary,
      meta: [proposal.agent.name, proposal.statusLabel, proposal.review ? `${proposal.review.decisionLabel} by ${proposal.review.reviewer.name}` : null].filter(Boolean).join(" · "),
      at: proposal.createdAt,
      atLabel: "proposed",
      tone: proposal.tone,
      needsPerson: awaiting && !applied,
      activityType: "consequential",
      progress,
      agentInvolvement,
      source: proposal.agent.name || "Agent",
      destination: "Ops",
      result,
      cheapSteps: cheapSteps.length ? cheapSteps : undefined,
      proposalId: proposal.id,
    })
  }

  for (const proposal of localProposals) {
    const pending = proposal.status === "pending"
    const failed = proposal.status === "failed"
    const approved = proposal.status === "approved" || proposal.status === "applied"
    entries.push({
      id: `local-agent:${proposal.id}`,
      category: "agent",
      icon: "proposal",
      title: pending ? "On-road agent proposal awaiting review" : proposal.title,
      detail: proposal.decision || proposal.summary,
      meta: `On-road agent · ${proposal.status}`,
      at: proposal.createdAt,
      atLabel: "proposed",
      tone: pending || failed ? "accent" : "neutral",
      needsPerson: pending || failed,
      activityType: "consequential",
      progress: failed ? "failed" : pending ? "waiting_person" : approved ? "completed" : "in_progress",
      agentInvolvement: approved ? "applied" : pending ? "proposed" : failed ? "proposed" : "reviewed",
      source: "On-road agent",
      destination: "Ops",
      result: failed ? "Failed" : pending ? "Awaiting review" : proposal.status,
      cheapSteps: proposal.cheapSteps,
      proposalId: proposal.id,
      runId: proposal.runId ?? null,
    })
  }

  for (const day of view.history) {
    for (const event of day.events) {
      entries.push({
        id: `activity:${event.id}`,
        category: "activity",
        icon: "waiting",
        title: event.text,
        detail: event.detail,
        meta: event.actor ? `Actor: ${event.actor}${event.shared ? " · shared bundle" : ""}` : (event.shared ? "Shared bundle" : null),
        at: event.at,
        atLabel: null,
        tone: "neutral",
        needsPerson: false,
        activityType: "na",
        progress: "completed",
        agentInvolvement: "none",
        source: event.actor ?? "System",
        destination: "Order",
        result: "Recorded",
      })
    }
  }

  entries.sort((a, b) => {
    if (a.at && b.at && a.at !== b.at) return b.at.localeCompare(a.at)
    if (a.at !== b.at) return a.at ? -1 : 1
    return TONE_RANK[a.tone] - TONE_RANK[b.tone] || a.title.localeCompare(b.title)
  })

  const counts: TimelineCounts = {
    everything: entries.length,
    attention: entries.filter(needsPersonFlag).length,
    conversations: entries.filter((e) => e.category === "conversation").length,
    agent: entries.filter((e) => e.category === "agent").length,
    activity: entries.filter((e) => e.category === "activity").length,
  }

  return { entries, counts }
}

export type TimelineFilter = "everything" | "attention" | "conversations" | "agent" | "activity"

export function filterTimeline(entries: TimelineEntry[], filter: TimelineFilter): TimelineEntry[] {
  switch (filter) {
    case "everything":
      return entries
    case "attention":
      return entries.filter(needsPersonFlag)
    case "conversations":
      return entries.filter((e) => e.category === "conversation")
    case "agent":
      return entries.filter((e) => e.category === "agent")
    case "activity":
      return entries.filter((e) => e.category === "activity")
  }
}

export function defaultTimelineFilter(counts: TimelineCounts): TimelineFilter {
  return counts.attention > 0 ? "attention" : "everything"
}

export function activityTypeLabel(type: ActivityType): string | null {
  if (type === "cheap") return "Cheap"
  if (type === "consequential") return "Consequential"
  return null
}

export function progressLabel(progress: TimelineProgress): string {
  switch (progress) {
    case "open": return "Open"
    case "in_progress": return "In progress"
    case "waiting_person": return "Waiting on person"
    case "waiting_counterparty": return "Waiting on counterparty"
    case "completed": return "Completed"
    case "failed": return "Failed"
  }
}

export function agentInvolvementLabel(value: AgentInvolvement): string | null {
  switch (value) {
    case "none": return null
    case "cheap_work": return "Agent cheap work"
    case "proposed": return "Agent proposed"
    case "reviewed": return "Reviewed"
    case "applied": return "Applied"
  }
}

export type StatusDisplay = "action_required" | "awaiting_review" | "completed" | "failed" | "in_progress" | "neutral"

export function statusDisplay(entry: TimelineEntry): StatusDisplay {
  if (entry.progress === "failed") return "failed"
  if (entry.progress === "completed") return "completed"
  if (
    entry.category === "agent" &&
    (entry.progress === "waiting_person" || entry.result.toLowerCase().includes("awaiting review"))
  ) {
    return "awaiting_review"
  }
  if (entry.needsPerson || entry.progress === "waiting_person" || entry.progress === "open") {
    return "action_required"
  }
  if (entry.progress === "in_progress" || entry.progress === "waiting_counterparty") return "in_progress"
  return "neutral"
}

export function statusDisplayLabel(value: StatusDisplay): string {
  switch (value) {
    case "action_required": return "Action required"
    case "awaiting_review": return "Awaiting review"
    case "completed": return "Completed"
    case "failed": return "Failed"
    case "in_progress": return "In progress"
    case "neutral": return "Recorded"
  }
}

/** Visual heat for the single status badge — critical reserved for real intervention. */
export type StatusUrgency = "critical" | "elevated" | "calm"

export function statusUrgency(entry: TimelineEntry): StatusUrgency {
  const status = statusDisplay(entry)
  if (status === "failed") return "critical"
  if (entry.category === "attention" && (entry.tone === "danger" || entry.tone === "warn")) return "critical"
  if (status === "awaiting_review") return "elevated"
  if (status === "action_required" || entry.needsPerson) return "elevated"
  return "calm"
}

export type StructuredBody = {
  issue: string | null
  impact: string | null
  driver: string | null
  next: string | null
}

/** Best-effort split of detail/title into labeled lines for scannable rows. */
export function structuredBodyFromEntry(entry: TimelineEntry): StructuredBody {
  const text = [entry.detail, entry.meta].filter(Boolean).join("\n")
  const empty: StructuredBody = { issue: null, impact: null, driver: null, next: null }
  if (!text.trim()) {
    return entry.category === "agent" || entry.category === "attention"
      ? { ...empty, issue: entry.title }
      : empty
  }

  const driverMatch = text.match(/\bdriver\s*(?:status)?\s*[:\-–]?\s*(safe|ok|injured|[^.!\n]+)/i)
  const impactMatch = text.match(/\b(?:impact|promise|window|will slip)[:\s]+([^.!\n]+[.!]?)/i)
  const nextMatch = text.match(/\b(?:next|recommend(?:ed)?|contact|approve|call)[:\s]+([^.!\n]+[.!]?)/i)
    ?? text.match(/\b(contact\s+[^.]+\.|approve\s+[^.]+\.)/i)

  let issue: string | null = entry.detail
  if (entry.category === "agent" || entry.category === "attention") {
    const first = (entry.detail ?? entry.title).split(/(?<=[.!?])\s+/)[0]?.trim() ?? entry.title
    issue = first
  }

  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
  const impact =
    impactMatch?.[1]?.trim()
    ?? sentences.find((s) => /\b(slip|unachievable|missed|ends today|window)\b/i.test(s))
    ?? null
  const next =
    nextMatch?.[1]?.trim()
    ?? nextMatch?.[0]?.trim()
    ?? sentences.find((s) => /\b(contact|approve|call|recommend)\b/i.test(s))
    ?? null

  return {
    issue,
    impact: impact && impact !== issue ? impact : null,
    driver: driverMatch ? (driverMatch[1]?.trim() || "Safe") : (/\bdriver safe\b/i.test(text) ? "Safe" : null),
    next: next && next !== issue ? next : null,
  }
}

export type TimelineSearchContext = {
  vehicleMake: string | null
  vehicleModel: string | null
  vehicleTitle: string | null
  driverNames: string[]
}

export type TimelineSort = "newest" | "urgency"

const URGENCY_RANK: Record<StatusUrgency, number> = { critical: 0, elevated: 1, calm: 2 }

/** Collect vehicle + driver names from the order record for Timeline search. */
export function timelineSearchContextFromView(view: RecordView): TimelineSearchContext {
  const vehicle = view.header.vehicle
  const names = new Set<string>()
  for (const assignment of view.assignments) {
    if (assignment.driver?.name) names.add(assignment.driver.name)
  }
  for (const group of view.journey.groups) {
    for (const leg of group.legs) {
      const name = leg.assignment?.driver?.name
      if (name) names.add(name)
    }
  }
  for (const confirmation of view.confirmations) {
    if (confirmation.driver?.name) names.add(confirmation.driver.name)
  }
  return {
    vehicleMake: vehicle?.make ?? null,
    vehicleModel: vehicle?.model ?? null,
    vehicleTitle: vehicle?.title ?? null,
    driverNames: [...names],
  }
}

function haystackForEntry(entry: TimelineEntry, context: TimelineSearchContext): string {
  return [
    entry.title,
    entry.detail,
    entry.meta,
    entry.source,
    entry.destination,
    entry.result,
    entry.category,
    context.vehicleMake,
    context.vehicleModel,
    context.vehicleTitle,
    ...context.driverNames,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

/** Case-insensitive substring filter; empty query returns entries unchanged. */
export function searchTimelineEntries(
  entries: TimelineEntry[],
  query: string,
  context: TimelineSearchContext,
): TimelineEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return entries
  return entries.filter((entry) => haystackForEntry(entry, context).includes(q))
}

export function sortTimelineEntries(entries: TimelineEntry[], sort: TimelineSort): TimelineEntry[] {
  if (sort === "newest") {
    return [...entries].sort((a, b) => {
      if (a.at && b.at && a.at !== b.at) return b.at.localeCompare(a.at)
      if (a.at !== b.at) return a.at ? -1 : 1
      return TONE_RANK[a.tone] - TONE_RANK[b.tone] || a.title.localeCompare(b.title)
    })
  }
  return [...entries].sort((a, b) => {
    const urg = URGENCY_RANK[statusUrgency(a)] - URGENCY_RANK[statusUrgency(b)]
    if (urg !== 0) return urg
    if (a.at && b.at && a.at !== b.at) return b.at.localeCompare(a.at)
    if (a.at !== b.at) return a.at ? -1 : 1
    return a.title.localeCompare(b.title)
  })
}
