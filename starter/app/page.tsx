"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { humanizeAgentStatus, opsLoadError } from "@/lib/present/ops-copy"
import { AppFrame } from "./components/app-frame"
import { Icon } from "./components/icons"

type ExceptionItem = {
  orderId: string
  reference: string
  headline: string
  reason: string
  decideCue: string
  reasons: { kind: string; tone: string; title: string }[]
  tone: string
  keyDateLabel: string | null
  keyDate: string | null
  vehicleLabel: string | null
  routeLabel: string | null
  customer: string
  qualifiesOnRoad: boolean
  agentStatus: string | null
  href: string
  work: { text: string; tone: string }[]
}

type ExceptionsResponse = {
  snapshotAt: string | null
  totalExceptions: number
  items: ExceptionItem[]
  query: string
}

type FleetPass = {
  id: string
  status: string
  startedAt: string
  finishedAt: string | null
  qualifyingCount: number
  ranCount: number
  skippedPendingCount: number
  skippedOtherCount: number
  failedCount: number
  proposalCount: number
  error: string | null
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<ExceptionsResponse | null>(null)
  const [error, setError] = useState("")
  const [running, setRunning] = useState<Record<string, string>>({})
  const [fleet, setFleet] = useState<{ active: boolean; pass: FleetPass | null }>({ active: false, pass: null })
  const [fleetBusy, setFleetBusy] = useState(false)
  const [fleetMessage, setFleetMessage] = useState("")
  const kicked = useRef(new Set<string>())

  const refreshFleet = useCallback(() => {
    fetch("/api/agent/fleet")
      .then((response) => response.json() as Promise<{ active: boolean; pass: FleetPass | null }>)
      .then((body) => setFleet({ active: !!body.active, pass: body.pass ?? null }))
      .catch(() => { /* ignore */ })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/exceptions?q=${encodeURIComponent(search)}`, { signal: controller.signal })
        .then((response) => { if (!response.ok) throw new Error("Could not load exceptions"); return response.json() as Promise<ExceptionsResponse> })
        .then((body) => { setData(body); setError("") })
        .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load exceptions") })
    }, search ? 180 : 0)
    return () => { clearTimeout(timer); controller.abort() }
  }, [search])

  useEffect(() => {
    refreshFleet()
    const id = setInterval(refreshFleet, 2000)
    return () => clearInterval(id)
  }, [refreshFleet])

  useEffect(() => {
    if (!data) return
    const targets = data.items.filter((item) => item.qualifiesOnRoad && (!item.agentStatus || item.agentStatus === "none"))
    for (const item of targets.slice(0, 5)) {
      if (kicked.current.has(item.orderId)) continue
      kicked.current.add(item.orderId)
      setRunning((prev) => ({ ...prev, [item.orderId]: "starting" }))
      fetch(`/api/orders/${encodeURIComponent(item.orderId)}/agent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: "auto_exception" }),
      })
        .then(async (response) => {
          const body = await response.json().catch(() => ({})) as { status?: string }
          setRunning((prev) => ({ ...prev, [item.orderId]: body.status ?? (response.ok ? "awaiting_review" : "failed") }))
        })
        .catch(() => setRunning((prev) => ({ ...prev, [item.orderId]: "failed" })))
    }
  }, [data])

  async function startFleetPass() {
    setFleetBusy(true)
    setFleetMessage("")
    try {
      const response = await fetch("/api/agent/fleet", { method: "POST" })
      const body = await response.json().catch(() => ({})) as { pass?: FleetPass; error?: string }
      if (response.status === 409) {
        setFleetMessage("A pass is already running.")
        if (body.pass) setFleet({ active: true, pass: body.pass })
        return
      }
      if (!response.ok) {
        setFleetMessage(body.error || "Could not start the pass.")
        return
      }
      if (body.pass) setFleet({ active: true, pass: body.pass })
      refreshFleet()
    } finally {
      setFleetBusy(false)
    }
  }

  const pass = fleet.pass
  const runDisabled = fleet.active || fleetBusy

  return <AppFrame section="exceptions" snapshotAt={data?.snapshotAt ?? null}><main className="queue-page">
    <div className="board-head">
      <div className="board-title">
        <h1>Needs a person</h1>
        <p className="board-sub">{data
          ? <><b>{data.totalExceptions}</b> orders waiting · quiet work stays off this list · <Link href="/lanes">Browse by lane</Link></>
          : "Loading orders that need a person…"}</p>
      </div>
      <div className="board-tools">
        <label className="search">
          <span className="sr-only">Search exceptions</span>
          <Icon name="search" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, car, plate, customer or city" />
          {search && <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="arrow" size={14} style={{ transform: "rotate(45deg)" }} /></button>}
        </label>
        <button
          type="button"
          className="fleet-run"
          disabled={runDisabled}
          aria-busy={fleet.active}
          onClick={() => void startFleetPass()}
        >
          {fleet.active ? "On-road agent is working…" : "Run on-road agent for all that need it"}
        </button>
      </div>
    </div>
    {(pass || fleetMessage) && (
      fleet.active
        ? <div className="fleet-progress is-active" role="status">
            <div className="fleet-progress-title">
              On-road agent · working through orders that qualify
              {fleetMessage && <span className="fleet-progress-note">{fleetMessage}</span>}
            </div>
            {pass && <FleetStats pass={pass} />}
            {pass?.error && <p className="fleet-progress-error">{pass.error}</p>}
          </div>
        : <details className="fleet-progress fleet-progress-idle">
            <summary>
              Latest on-road agent pass
              {pass ? <span className="fleet-progress-note">{pass.proposalCount} proposals · {pass.ranCount} ran</span> : null}
              {fleetMessage && <span className="fleet-progress-note">{fleetMessage}</span>}
            </summary>
            {pass && <FleetStats pass={pass} />}
            {pass?.error && <p className="fleet-progress-error">{pass.error}</p>}
          </details>
    )}
    {error && <p className="board-error" role="alert">{opsLoadError("Could not load orders that need a person")}</p>}
    <section className="exception-queue" aria-label="Orders that need a person">
      {!data && !error && <ul className="exception-list" aria-busy="true">{[0, 1, 2, 3].map((index) => <li className="exception-card skeleton" key={index} />)}</ul>}
      {data && data.items.length === 0 && <div className="queue-empty">
        <h2>Nothing waiting on a person</h2>
        <p>
          {search
            ? <>No orders match “{search}”. Clear search or <Link href="/lanes">browse by lane</Link>.</>
            : <>No open alerts, work, conversations, or proposals need you right now. <Link href="/lanes">Browse all orders by lane</Link>.</>}
        </p>
      </div>}
      {data && data.items.length > 0 && <ul className="exception-list">
        {data.items.map((item) => {
          const agent = humanizeAgentStatus(running[item.orderId] ?? item.agentStatus)
          return <li key={item.orderId}>
            <Link className={`exception-card tone-border-${item.tone}`} href={item.href}>
              <div className="exception-top">
                <span className="exception-vehicle">{item.headline}</span>
                <span className="exception-ref">{item.reference}</span>
              </div>
              <p className={`exception-reason tone-${item.tone}`}>{item.reason}</p>
              <p className="exception-decide"><span className="exception-decide-label">Decide</span> {item.decideCue}</p>
              {item.reasons.length > 1 && <p className="exception-more">{item.reasons.length - 1} more reason{item.reasons.length > 2 ? "s" : ""}</p>}
              <div className="exception-meta">
                <span>{item.customer}</span>
                <span>{item.routeLabel}</span>
                {item.keyDateLabel && item.keyDate && <span>{item.keyDateLabel}</span>}
              </div>
              {agent && <div className="exception-agent">On-road agent · {agent}</div>}
            </Link>
          </li>
        })}
      </ul>}
    </section>
  </main></AppFrame>
}

function FleetStats({ pass }: { pass: FleetPass }) {
  return <dl className="fleet-progress-grid">
    <div><dt>That qualify</dt><dd className="num">{pass.qualifyingCount}</dd></div>
    <div><dt>Ran</dt><dd className="num">{pass.ranCount}</dd></div>
    <div><dt>Skipped (pending)</dt><dd className="num">{pass.skippedPendingCount}</dd></div>
    <div><dt>Could not finish</dt><dd className="num">{pass.failedCount}</dd></div>
    <div><dt>Proposals</dt><dd className="num">{pass.proposalCount}</dd></div>
  </dl>
}
