import type { FocusAreaId } from "./focus-areas"
import { focusAreaLabel } from "./focus-areas"

export type SpanCategory = "agent" | "llm" | "tool" | "handoff" | "other"
export type SpanStatus = "ok" | "error" | "unset"

export type HumanDecision = {
  kind: "approve" | "reject" | "choose_option"
  options: { id: string; label: string }[] | null
  summary: string
  recordedAt: string | null
  outcome: string | null
}

export type AgentSpan = {
  id: string
  parentId: string | null
  name: string
  category: SpanCategory
  status: SpanStatus
  startedAt: string | null
  endedAt: string | null
  detail: string | null
  toolName: string | null
  tokensIn: number | null
  tokensOut: number | null
}

export type AgentTrace = {
  id: string
  orderId: string
  focusArea: FocusAreaId
  status: "running" | "awaiting_person" | "completed" | "failed" | "rejected"
  startedAt: string | null
  endedAt: string | null
  rootSpanId: string
  spans: AgentSpan[]
  decision: HumanDecision | null
}

export type GanttRow = {
  id: string
  depth: number
  label: string
  focusArea: FocusAreaId | null
  start: number
  end: number
  milestone: "handoff" | "decision" | null
  category: SpanCategory | "summary"
}

export type TraceMessage = {
  id: string
  role: string
  content: string
  toolName: string | null
  createdAt: string
}

export type TraceProposal = {
  id: string
  status: string
  title: string
  summary: string
  decision: string
  reviewNote: string | null
  reviewedAt: string | null
  createdAt: string
}

export type TraceRun = {
  id: string
  orderId: string
  status: string
  startedAt: string
  finishedAt: string | null
  error: string | null
  handoverSummary: string | null
  decisionText: string | null
  focusArea?: FocusAreaId | null
}

const FOCUS_MARKER = "__focus_area__"

export function focusAreaFromMessages(messages: TraceMessage[], fallback: FocusAreaId = "on_the_road"): FocusAreaId {
  const hit = messages.find((m) => m.toolName === FOCUS_MARKER || m.content.startsWith("focus_area:"))
  if (hit?.toolName === FOCUS_MARKER) {
    const id = hit.content.trim() as FocusAreaId
    if (isFocusAreaId(id)) return id
  }
  if (hit?.content.startsWith("focus_area:")) {
    const id = hit.content.slice("focus_area:".length).trim() as FocusAreaId
    if (isFocusAreaId(id)) return id
  }
  return fallback
}

function isFocusAreaId(value: string): value is FocusAreaId {
  return value === "pickup_readiness" || value === "driver_travel" || value === "on_the_road" || value === "driver_support"
}

export function buildAgentTrace(input: {
  run: TraceRun
  messages: TraceMessage[]
  proposal?: TraceProposal | null
}): AgentTrace {
  const focusArea = input.run.focusArea ?? focusAreaFromMessages(input.messages)
  const rootId = `span:root:${input.run.id}`
  const spans: AgentSpan[] = [{
    id: rootId,
    parentId: null,
    name: `${focusAreaLabel(focusArea)} run`,
    category: "agent",
    status: input.run.error ? "error" : "ok",
    startedAt: input.run.startedAt,
    endedAt: input.run.finishedAt,
    detail: input.run.handoverSummary,
    toolName: null,
    tokensIn: null,
    tokensOut: null,
  }]

  let lastParent = rootId
  for (const message of input.messages) {
    if (message.toolName === FOCUS_MARKER) continue
    const spanId = `span:msg:${message.id}`
    let category: SpanCategory = "other"
    if (message.role === "tool") category = "tool"
    else if (message.role === "assistant") category = "llm"
    else if (message.role === "system") category = "agent"
    else if (message.role === "user") category = "other"

    const errored = /failed|blocked|error/i.test(message.content)
    spans.push({
      id: spanId,
      parentId: lastParent,
      name: message.toolName ?? (message.role === "assistant" ? "Model turn" : message.role),
      category,
      status: errored ? "error" : "ok",
      startedAt: message.createdAt,
      endedAt: message.createdAt,
      detail: message.content,
      toolName: message.toolName,
      tokensIn: null,
      tokensOut: null,
    })
    if (message.role === "tool" || message.role === "assistant") lastParent = rootId
  }

  const proposal = input.proposal
  if (proposal || input.run.status === "awaiting_review") {
    spans.push({
      id: `span:handoff:${input.run.id}`,
      parentId: rootId,
      name: "Handoff to ops",
      category: "handoff",
      status: "unset",
      startedAt: proposal?.createdAt ?? input.run.finishedAt ?? input.run.startedAt,
      endedAt: proposal?.reviewedAt ?? null,
      detail: proposal?.decision ?? input.run.decisionText,
      toolName: null,
      tokensIn: null,
      tokensOut: null,
    })
  }

  if (proposal?.reviewedAt) {
    spans.push({
      id: `span:decision:${proposal.id}`,
      parentId: rootId,
      name: `Decision: ${proposal.status}`,
      category: "handoff",
      status: proposal.status === "rejected" || proposal.status.includes("reject") ? "error" : "ok",
      startedAt: proposal.reviewedAt,
      endedAt: proposal.reviewedAt,
      detail: proposal.reviewNote ?? proposal.decision,
      toolName: null,
      tokensIn: null,
      tokensOut: null,
    })
  }

  let status: AgentTrace["status"] = "running"
  if (input.run.status === "awaiting_review") status = "awaiting_person"
  else if (input.run.status === "failed") status = "failed"
  else if (input.run.status === "completed") {
    status = proposal?.status === "rejected" ? "rejected" : "completed"
  } else if (proposal?.status === "pending") status = "awaiting_person"

  const decision: HumanDecision | null = proposal
    ? {
        kind: proposal.status === "pending" ? "approve" : proposal.status.includes("reject") ? "reject" : "approve",
        options: proposal.status === "pending"
          ? [{ id: "approve", label: "Approve" }, { id: "reject", label: "Reject" }]
          : null,
        summary: proposal.decision || proposal.summary,
        recordedAt: proposal.reviewedAt,
        outcome: proposal.status === "pending" ? null : `${proposal.status}${proposal.reviewNote ? ` — ${proposal.reviewNote}` : ""}`,
      }
    : null

  return {
    id: input.run.id,
    orderId: input.run.orderId,
    focusArea,
    status,
    startedAt: input.run.startedAt,
    endedAt: input.run.finishedAt,
    rootSpanId: rootId,
    spans,
    decision,
  }
}

export function toGanttRows(trace: AgentTrace): GanttRow[] {
  const t0 = trace.startedAt ? Date.parse(trace.startedAt) : Date.now()
  const byId = new Map(trace.spans.map((s) => [s.id, s]))
  const depthOf = (span: AgentSpan): number => {
    let depth = 0
    let cur: AgentSpan | undefined = span
    while (cur?.parentId) {
      depth += 1
      cur = byId.get(cur.parentId)
      if (depth > 8) break
    }
    return depth
  }

  return trace.spans.map((span) => {
    const startMs = span.startedAt ? Date.parse(span.startedAt) : t0
    const endMs = span.endedAt ? Date.parse(span.endedAt) : Math.max(startMs + 1000, Date.now())
    let milestone: GanttRow["milestone"] = null
    if (span.category === "handoff" && span.name.toLowerCase().includes("handoff")) milestone = "handoff"
    if (span.name.toLowerCase().startsWith("decision")) milestone = "decision"
    return {
      id: span.id,
      depth: depthOf(span),
      label: span.name.slice(0, 40),
      focusArea: span.parentId === null ? trace.focusArea : null,
      start: Math.max(0, startMs - t0),
      end: Math.max(Math.max(0, startMs - t0) + 500, endMs - t0),
      milestone,
      category: span.parentId === null ? "summary" : span.category,
    }
  })
}

export { FOCUS_MARKER }
