"use client"

import { useState } from "react"
import { previewText, splitHandoverBullets } from "@/lib/present/agent-panel"

export type AgentState = {
  qualifiesOnRoad: boolean
  activeRun: {
    id: string
    status: string
    trigger: string
    handoverSummary: string | null
    decisionText: string | null
    error: string | null
    startedAt: string
    finishedAt: string | null
  } | null
  proposals: {
    id: string
    status: string
    title: string
    summary: string
    decision: string
    ops: Record<string, unknown>[]
    reviewNote: string | null
    reviewedAt: string | null
    createdAt: string
  }[]
  messages: { id: string; role: string; content: string; toolName: string | null; createdAt: string }[]
  applied: { id: string; op: Record<string, unknown>; appliedAt: string; appliedBy: string }[]
  overlay: { notes: string[]; details: Record<string, unknown>; updatedAt: string } | null
}

export function AgentPanel({ orderId, agent, onChanged }: { orderId: string; agent: AgentState; onChanged: () => void }) {
  const [chat, setChat] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [fullHandoff, setFullHandoff] = useState(false)
  const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(() => new Set())
  const pending = agent.proposals.find((p) => p.status === "pending")
  const settled = agent.proposals.filter((p) => p.status !== "pending").slice(0, 3)
  const bullets = splitHandoverBullets(agent.activeRun?.handoverSummary, 5)
  const chatTurns = agent.messages.filter((m) => m.role === "user" || m.role === "assistant").slice(-8)

  async function runAgent(trigger: "auto_exception" | "user_rerun") {
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/agent/run`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trigger }),
      })
      if (!response.ok) throw new Error((await response.json().catch(() => ({})) as { error?: string }).error ?? "Could not run agent")
      onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not run agent")
    } finally { setBusy(false) }
  }

  async function review(decision: "approve" | "reject") {
    if (!pending) return
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/agent/proposals/${encodeURIComponent(pending.id)}/review`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }),
      })
      if (!response.ok) throw new Error((await response.json().catch(() => ({})) as { error?: string }).error ?? "Review failed")
      onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Review failed")
    } finally { setBusy(false) }
  }

  async function sendChat(event: React.FormEvent) {
    event.preventDefault()
    if (!chat.trim()) return
    setBusy(true); setError("")
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/agent`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: chat.trim() }),
      })
      if (!response.ok) throw new Error((await response.json().catch(() => ({})) as { error?: string }).error ?? "Chat failed")
      setChat("")
      onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Chat failed")
    } finally { setBusy(false) }
  }

  function toggleMsg(id: string) {
    setExpandedMsgs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return <section className="agent-panel" aria-label="On-road agent">
    <header className="agent-head">
      <div className="agent-head-row">
        <h2>On-road agent</h2>
        <div className="agent-actions tight">
          <button type="button" className="toggle" disabled={busy} onClick={() => runAgent(agent.activeRun ? "user_rerun" : "auto_exception")}>
            {agent.activeRun ? "Run again" : "Run on-road agent"}
          </button>
          {agent.activeRun && (
            <span className="agent-status-chip">
              {agent.activeRun.status.replaceAll("_", " ")} · {agent.activeRun.trigger.replaceAll("_", " ")}
            </span>
          )}
        </div>
      </div>
      <p className="agent-policy">Asks before consequential change · never contacts the paying customer</p>
    </header>

    {!agent.qualifiesOnRoad && !agent.activeRun && (
      <p className="agent-quiet">Not flagged as on-road. You can still ask the agent to look.</p>
    )}

    {agent.activeRun?.error && <p className="board-error" role="alert">{agent.activeRun.error}</p>}
    {error && <p className="board-error" role="alert">{error}</p>}

    {agent.activeRun?.handoverSummary && (
      <div className="agent-findings">
        <h3>What the agent found</h3>
        {!fullHandoff && (
          <ul className="agent-bullets">
            {bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
          </ul>
        )}
        {fullHandoff && <p className="agent-full-handoff">{agent.activeRun.handoverSummary}</p>}
        <button type="button" className="agent-link" onClick={() => setFullHandoff((v) => !v)}>
          {fullHandoff ? "Show compact" : "Show full handoff"}
        </button>
        {!pending && agent.activeRun.decisionText && (
          <p className="agent-decision-once"><b>Suggested:</b> {agent.activeRun.decisionText}</p>
        )}
      </div>
    )}

    {pending && (
      <div className="agent-approval">
        <div className="agent-approval-head">
          <h3>{pending.title}</h3>
          <span className="agent-awaiting">Awaiting your yes</span>
        </div>
        <p className="agent-approval-decision">{pending.decision}</p>
        <div className="agent-actions">
          <button type="button" className="toggle primary" disabled={busy} onClick={() => review("approve")}>Approve (demo)</button>
          <button type="button" className="toggle" disabled={busy} onClick={() => review("reject")}>Reject</button>
        </div>
        <p className="agent-hint">Synthetic only · customer drafts stay unsent</p>
      </div>
    )}

    {settled.length > 0 && (
      <details className="agent-settled">
        <summary>Earlier decisions ({settled.length})</summary>
        <ul>
          {settled.map((p) => (
            <li key={p.id}>
              <b>{p.title}</b> · {p.status}
              {p.reviewNote ? ` — ${p.reviewNote}` : ""}
            </li>
          ))}
        </ul>
      </details>
    )}

    {agent.overlay && (agent.overlay.notes.length > 0 || Boolean(agent.overlay.details.customerMessageDraft)) && (
      <div className="agent-overlay">
        <h3>Applied in demo</h3>
        <ul>{agent.overlay.notes.map((note, index) => <li key={index}>{note}</li>)}</ul>
        {Boolean(agent.overlay.details.customerMessageDraft) && <p className="agent-hint">Customer draft stored (not sent).</p>}
      </div>
    )}

    <div className="agent-chat">
      <h3>Talk to the agent</h3>
      <ul className="agent-messages">
        {chatTurns.map((m) => {
          const { preview, truncated } = previewText(m.content, 180)
          const open = expandedMsgs.has(m.id)
          return (
            <li key={m.id} className={`agent-msg role-${m.role}`}>
              <span>{m.role === "user" ? "You" : "Agent"}</span>
              <p>{open || !truncated ? m.content : preview}</p>
              {truncated && (
                <button type="button" className="agent-link" onClick={() => toggleMsg(m.id)}>
                  {open ? "Show less" : "Show more"}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <form onSubmit={sendChat} className="agent-composer">
        <input value={chat} onChange={(event) => setChat(event.target.value)} placeholder="Ask about safety, location, next step…" disabled={busy} />
        <button type="submit" className="toggle" disabled={busy || !chat.trim()}>Send</button>
      </form>
    </div>
  </section>
}
