"use client"

import { useMemo, useState, type Dispatch, type SetStateAction } from "react"
import {
  buildTimeline, defaultTimelineFilter, filterTimeline,
  statusDisplay, statusDisplayLabel, statusUrgency, structuredBodyFromEntry,
  type LocalAgentProposal, type TimelineEntry, type TimelineFilter,
} from "@/lib/present/timeline"
import type { RecordView, ThreadView } from "@/lib/present/types"
import { fmtDateTime, relativeTo } from "@/lib/present/time"
import { Icon } from "../icons"
import { ThreadMessages } from "./sections"

const PILLS: { id: TimelineFilter; label: string; countKey: "everything" | "attention" | "conversations" | "agent" | "activity" }[] = [
  { id: "everything", label: "Everything", countKey: "everything" },
  { id: "attention", label: "Needs a person", countKey: "attention" },
  { id: "conversations", label: "Conversations", countKey: "conversations" },
  { id: "agent", label: "Agent work", countKey: "agent" },
  { id: "activity", label: "Activity", countKey: "activity" },
]

const EMPTY_COPY: Record<TimelineFilter, string> = {
  everything: "Nothing recorded on this order’s timeline yet.",
  attention: "Nothing needs a person on this order right now.",
  conversations: "No conversations in this filter.",
  agent: "No agent work on this order yet.",
  activity: "No activity events in this filter.",
}

export type TimelineReviewHandler = (proposalId: string, decision: "approve" | "reject") => Promise<void>

export type DecisionOutcome = {
  proposalId: string
  decision: "approve" | "reject"
  appliedSummary: string
  nextStep: string
}

export function Timeline({
  view,
  localProposals = [],
  orderId,
  onReview,
  reviewBusy = false,
  decisionOutcome = null,
}: {
  view: RecordView
  localProposals?: LocalAgentProposal[]
  orderId?: string
  onReview?: TimelineReviewHandler
  reviewBusy?: boolean
  decisionOutcome?: DecisionOutcome | null
}) {
  const model = useMemo(() => buildTimeline(view, localProposals), [view, localProposals])
  const [filter, setFilter] = useState<TimelineFilter>(() => defaultTimelineFilter(model.counts))
  const visible = useMemo(() => filterTimeline(model.entries, filter), [model.entries, filter])
  const threadsById = useMemo(() => new Map(view.threads.map((thread) => [thread.id, thread])), [view.threads])
  const [stepsOpen, setStepsOpen] = useState<Set<string>>(() => new Set())
  const [threadOpen, setThreadOpen] = useState<Set<string>>(() => new Set())
  const emptyCopy = EMPTY_COPY[filter]

  function toggle(set: Dispatch<SetStateAction<Set<string>>>, id: string) {
    set((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return <section className="timeline" id="timeline" aria-label="Timeline">
    <header className="timeline-head">
      <h2>Timeline <span className="timeline-count">· showing <span className="num">{visible.length}</span></span></h2>
      <p className="timeline-note">Primary tracker · full provenance folds below</p>
    </header>

    <div className="timeline-pills" role="tablist" aria-label="Timeline filters">
      {PILLS.map((pill) => {
        const pressed = filter === pill.id
        const count = model.counts[pill.countKey] ?? 0
        return <button
          key={pill.id}
          type="button"
          role="tab"
          aria-selected={pressed}
          className={`timeline-pill${pressed ? " active" : ""}`}
          onClick={() => setFilter(pill.id)}
        >
          {pill.label} <span className="num" aria-label={`${count} in ${pill.label}`}>({count})</span>
        </button>
      })}
    </div>

    {visible.length === 0 && <p className="timeline-empty">{emptyCopy}</p>}

    {visible.length > 0 && <ol className="timeline-list">
      {visible.map((entry) => {
        if (entry.category === "conversation") {
          const threadId = entry.threadId ?? entry.id.replace(/^conversation:/, "")
          const thread = threadsById.get(threadId)
          if (thread) {
            return <li className="timeline-thread" key={entry.id}>
              <TimelineThread
                entry={entry}
                thread={thread}
                snapshotAt={view.snapshotAt}
                open={threadOpen.has(entry.id)}
                onToggleMessages={() => toggle(setThreadOpen, entry.id)}
              />
            </li>
          }
        }
        return <li key={entry.id} className="timeline-item">
          <TimelineRow
            entry={entry}
            snapshotAt={view.snapshotAt}
            steps={stepsOpen.has(entry.id)}
            onToggleSteps={() => toggle(setStepsOpen, entry.id)}
            orderId={orderId}
            onReview={onReview}
            reviewBusy={reviewBusy}
            decisionOutcome={
              decisionOutcome && entry.proposalId === decisionOutcome.proposalId
                ? decisionOutcome
                : null
            }
          />
        </li>
      })}
    </ol>}
  </section>
}

function StatusPill({ entry }: { entry: TimelineEntry }) {
  const status = statusDisplay(entry)
  const urgency = statusUrgency(entry)
  return <span className={`timeline-status status-${status} urgency-${urgency}`}>{statusDisplayLabel(status)}</span>
}

function RoutingLine({ entry }: { entry: TimelineEntry }) {
  return <div className="timeline-routing">{entry.source} → {entry.destination}</div>
}

function StructuredBodyView({ entry }: { entry: TimelineEntry }) {
  if (entry.category !== "attention" && entry.category !== "agent") {
    return entry.detail ? <div className="timeline-detail">{entry.detail}</div> : null
  }
  const body = structuredBodyFromEntry(entry)
  const fields: { label: string; value: string }[] = []
  if (body.issue) fields.push({ label: "Issue", value: body.issue })
  if (body.driver) fields.push({ label: "Driver", value: body.driver })
  if (body.impact) fields.push({ label: "Impact", value: body.impact })
  if (body.next) fields.push({ label: "Next", value: body.next })
  if (fields.length === 0) {
    return entry.detail ? <div className="timeline-detail">{entry.detail}</div> : null
  }
  return <dl className={`timeline-struct${fields.length === 1 ? " single" : ""}`}>
    {fields.map((field) => (
      <div className="timeline-struct-field" key={field.label}>
        <dt>{field.label}</dt>
        <dd>{field.value}</dd>
      </div>
    ))}
  </dl>
}

function TimelineRow({
  entry, snapshotAt, steps, onToggleSteps, orderId, onReview, reviewBusy, decisionOutcome,
}: {
  entry: TimelineEntry
  snapshotAt: string | null
  steps: boolean
  onToggleSteps: () => void
  orderId?: string
  onReview?: TimelineReviewHandler
  reviewBusy?: boolean
  decisionOutcome?: DecisionOutcome | null
}) {
  const relative = entry.at ? relativeTo(entry.at, snapshotAt) : null
  const hasSteps = Boolean(entry.cheapSteps?.length)
  const pendingLocal =
    entry.id.startsWith("local-agent:") &&
    entry.proposalId &&
    (entry.progress === "waiting_person" || entry.result === "Awaiting review") &&
    onReview &&
    orderId

  return <div className={`timeline-row${entry.needsPerson ? " needs-person" : ""}${pendingLocal ? " has-actions" : ""}`}>
    <Icon name={entry.icon} className={`tone-${entry.tone}`} />
    <div className="timeline-main">
      <div className="timeline-title-line">
        <span className={`timeline-title tone-${entry.tone}`}>{entry.title}</span>
        <StatusPill entry={entry} />
      </div>
      <RoutingLine entry={entry} />
      <StructuredBodyView entry={entry} />

      <div className="timeline-utils">
        {hasSteps && (
          <button type="button" className="timeline-btn ghost" onClick={onToggleSteps} aria-expanded={steps}>
            {steps ? "Hide agent steps" : `View agent steps (${entry.cheapSteps!.length})`}
          </button>
        )}
      </div>

      {steps && hasSteps && <ul className="timeline-cheap">
        {entry.cheapSteps!.map((step, index) => (
          <li key={`${entry.id}-step-${index}`}>
            <span className="timeline-chip type-cheap">Cheap</span>
            <b>{step.name}</b>
            <span>{step.result}</span>
            {step.at && <time dateTime={step.at}>{fmtDateTime(step.at, null, false)}</time>}
          </li>
        ))}
      </ul>}

      {decisionOutcome && (
        <div className={`decision-outcome tone-${decisionOutcome.decision === "approve" ? "ok" : "warn"}`} role="status">
          <p className="decision-outcome-summary">{decisionOutcome.appliedSummary}</p>
          <p className="decision-outcome-next"><b>Next:</b> {decisionOutcome.nextStep}</p>
        </div>
      )}
    </div>
    <div className="timeline-meta">
      {entry.at && <div className="timeline-time" title={fmtDateTime(entry.at)}>
        <span>{fmtDateTime(entry.at, null, false)}</span>
        {relative && <span className="timeline-rel">({relative.text})</span>}
      </div>}
    </div>
    {pendingLocal && (
      <div className="timeline-actions-col" role="group" aria-label="Review proposal">
        <button type="button" className="timeline-btn approve" disabled={reviewBusy} onClick={() => onReview!(entry.proposalId!, "approve")}>
          Approve
        </button>
        <button type="button" className="timeline-btn reject" disabled={reviewBusy} onClick={() => onReview!(entry.proposalId!, "reject")}>
          Reject
        </button>
      </div>
    )}
  </div>
}

function TimelineThread({
  entry, thread, snapshotAt, open, onToggleMessages,
}: {
  entry: TimelineEntry
  thread: ThreadView
  snapshotAt: string | null
  open: boolean
  onToggleMessages: () => void
}) {
  const count = thread.messages.length
  const last = thread.messages[thread.messages.length - 1]
  const relative = entry.at ? relativeTo(entry.at, snapshotAt) : null

  return <article className={`timeline-convo${entry.needsPerson ? " needs-person" : ""}`}>
    <div className="timeline-convo-grid">
      <div className="timeline-convo-body">
        <div className="timeline-convo-head">
          <div className="timeline-convo-title">
            <Icon name="message" className={`tone-${thread.tone}`} />
            <span className={`timeline-title tone-${entry.tone}`}>{entry.title}</span>
            <StatusPill entry={entry} />
          </div>
        </div>
        <RoutingLine entry={entry} />
        {!open && last && <div className="timeline-detail"><b>{last.author.name}:</b> {last.body}</div>}
        {open && count > 0 && <ThreadMessages thread={thread} />}
        {count === 0 && <p className="timeline-empty">No messages in this thread yet.</p>}
      </div>
      <div className="timeline-meta">
        {entry.at && <div className="timeline-time" title={fmtDateTime(entry.at)}>
          <span>{fmtDateTime(entry.at, null, false)}</span>
          {relative && <span className="timeline-rel">({relative.text})</span>}
        </div>}
      </div>
      {count > 0 && (
        <div className="timeline-actions-col" role="group" aria-label="Conversation actions">
          <button type="button" className="timeline-btn approve" onClick={onToggleMessages}>
            {open ? "Hide messages" : `Open (${count})`}
          </button>
        </div>
      )}
    </div>
  </article>
}
