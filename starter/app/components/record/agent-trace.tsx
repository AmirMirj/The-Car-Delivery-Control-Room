"use client"

import { useMemo, useState } from "react"
import {
  buildAgentTrace, toGanttRows, type AgentSpan, type AgentTrace, type TraceMessage, type TraceProposal, type TraceRun,
} from "@/lib/agent/traces"
import { focusAreaLabel } from "@/lib/agent/focus-areas"

export function AgentTraceView({
  run,
  messages,
  proposal,
}: {
  run: TraceRun
  messages: TraceMessage[]
  proposal?: TraceProposal | null
}) {
  const trace = useMemo(
    () => buildAgentTrace({ run, messages, proposal }),
    [run, messages, proposal],
  )
  const rows = useMemo(() => toGanttRows(trace), [trace])
  const maxEnd = Math.max(...rows.map((r) => r.end), 1)
  const [selectedId, setSelectedId] = useState<string | null>(trace.rootSpanId)
  const selected: AgentSpan | undefined = trace.spans.find((s) => s.id === selectedId) ?? trace.spans[0]

  return (
    <div className="agent-trace" aria-label={`${focusAreaLabel(trace.focusArea)} agent trace`}>
      <header className="agent-trace-head">
        <h3>{focusAreaLabel(trace.focusArea)} · trace</h3>
        <span className={`agent-trace-status status-${trace.status}`}>{trace.status.replaceAll("_", " ")}</span>
      </header>

      <div className="agent-trace-grid">
        <div className="agent-trace-tree" role="tree">
          {trace.spans.map((span) => {
            const depth = rows.find((r) => r.id === span.id)?.depth ?? 0
            return (
              <button
                key={span.id}
                type="button"
                role="treeitem"
                className={`agent-trace-node cat-${span.category}${selectedId === span.id ? " selected" : ""}${span.status === "error" ? " is-error" : ""}`}
                style={{ paddingLeft: 8 + depth * 12 }}
                onClick={() => setSelectedId(span.id)}
              >
                <span className={`agent-trace-badge cat-${span.category}`}>{span.category}</span>
                <span className="agent-trace-name">{span.name}</span>
                {span.status === "error" && <span className="agent-trace-err">error</span>}
              </button>
            )
          })}
        </div>

        <div className="agent-trace-gantt" aria-label="Span timeline">
          {rows.map((row) => {
            const left = (row.start / maxEnd) * 100
            const width = Math.max(2, ((row.end - row.start) / maxEnd) * 100)
            return (
              <button
                key={row.id}
                type="button"
                className={`agent-gantt-row${selectedId === row.id ? " selected" : ""}`}
                onClick={() => setSelectedId(row.id)}
              >
                <span className="agent-gantt-label" style={{ paddingLeft: row.depth * 10 }}>{row.label}</span>
                <span className="agent-gantt-track">
                  <span
                    className={`agent-gantt-bar cat-${row.category}${row.milestone ? ` milestone-${row.milestone}` : ""}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  {row.milestone && (
                    <span
                      className={`agent-gantt-diamond milestone-${row.milestone}`}
                      style={{ left: `calc(${left}% + ${width}% - 4px)` }}
                      title={row.milestone}
                    />
                  )}
                </span>
              </button>
            )
          })}
          <div className="agent-gantt-now" title="Now" />
        </div>

        <aside className="agent-trace-detail">
          {selected ? (
            <>
              <h4>{selected.name}</h4>
              <p className="agent-trace-meta">
                <span className={`agent-trace-badge cat-${selected.category}`}>{selected.category}</span>
                {" · "}
                {selected.status}
                {selected.toolName ? ` · ${selected.toolName}` : ""}
              </p>
              {selected.detail && <p className="agent-trace-body">{selected.detail}</p>}
              {!selected.detail && <p className="agent-quiet">No detail on this span.</p>}
            </>
          ) : (
            <p className="agent-quiet">Select a span</p>
          )}
          {trace.decision && (
            <div className="agent-trace-decision">
              <h4>Decision package</h4>
              <p>{trace.decision.summary}</p>
              {trace.decision.outcome && <p className="agent-hint">Outcome: {trace.decision.outcome}</p>}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export type { AgentTrace }
