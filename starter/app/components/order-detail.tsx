"use client"

import { useState } from "react"
import type { RecordView } from "@/lib/present/types"
import { AgentPanel, type AgentState } from "./agent-panel"
import { RecordHero, Tiles } from "./record/header"
import { RecordsPanel } from "./record/records"
import { Timeline, type DecisionOutcome } from "./record/timeline"
import { ActivitySection, ConversationsSection, DecisionsSection, EvidenceSection, RouteStrip } from "./record/sections"

export type Detail = { order: { id: string; reference: string }; view: RecordView; agent?: AgentState }

function outcomeFor(decision: "approve" | "reject", proposalId: string): DecisionOutcome {
  if (decision === "approve") {
    return {
      proposalId,
      decision,
      appliedSummary: "Applied in the demo world (synthetic only — no real purchase or customer send).",
      nextStep: "Confirm the next ops action on this order, or ask the agent to continue cheap work.",
    }
  }
  return {
    proposalId,
    decision,
    appliedSummary: "Nothing applied — proposal rejected.",
    nextStep: "Tell the agent what to try instead, or handle the open attention items yourself.",
  }
}

export function OrderPane({ detail, onReload }: { detail: Detail; onReload?: () => void }) {
  const { view } = detail
  const [reviewBusy, setReviewBusy] = useState(false)
  const [decisionOutcome, setDecisionOutcome] = useState<DecisionOutcome | null>(null)
  const cheapSteps = detail.agent?.messages
    .filter((m) => m.role === "tool" && m.toolName)
    .map((m) => ({ name: m.toolName!, result: m.content.slice(0, 200), at: m.createdAt })) ?? []
  const localProposals = detail.agent?.proposals.map((p) => ({
    id: p.id,
    status: p.status,
    title: p.title,
    summary: p.summary,
    decision: p.decision,
    createdAt: p.createdAt,
    cheapSteps: cheapSteps.length ? cheapSteps : undefined,
    runId: detail.agent?.activeRun?.id ?? null,
  })) ?? []

  async function reviewProposal(proposalId: string, decision: "approve" | "reject") {
    setReviewBusy(true)
    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(detail.order.id)}/agent/proposals/${encodeURIComponent(proposalId)}/review`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }) },
      )
      if (!response.ok) return
      setDecisionOutcome(outcomeFor(decision, proposalId))
      onReload?.()
    } finally {
      setReviewBusy(false)
    }
  }

  return <>
    <RecordHero view={view} />
    {decisionOutcome && (
      <div className={`decision-banner tone-${decisionOutcome.decision === "approve" ? "ok" : "warn"}`} role="status">
        <p className="decision-banner-summary">{decisionOutcome.appliedSummary}</p>
        <p className="decision-banner-next"><b>Next:</b> {decisionOutcome.nextStep}</p>
      </div>
    )}
    <Timeline
      key={detail.order.id}
      view={view}
      localProposals={localProposals}
      orderId={detail.order.id}
      onReview={detail.agent ? reviewProposal : undefined}
      reviewBusy={reviewBusy}
      decisionOutcome={decisionOutcome}
    />
    {detail.agent && <AgentPanel orderId={detail.order.id} agent={detail.agent} onChanged={() => onReload?.()} />}
    <Tiles tiles={view.tiles} />
    <RouteStrip view={view} />
    <ConversationsSection view={view} />
    <EvidenceSection view={view} />
    <DecisionsSection view={view} />
    <ActivitySection view={view} />
    <RecordsPanel view={view} orderId={detail.order.id} />
  </>
}
