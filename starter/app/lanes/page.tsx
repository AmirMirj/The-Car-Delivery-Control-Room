"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { BOARD_FILTERS, filterBoardCards, parseBoardFilter, type BoardFilterId } from "@/lib/present/board-filters"
import { LANES } from "@/lib/present/labels"
import { opsLoadError } from "@/lib/present/ops-copy"
import type { Overview } from "@/lib/present/types"
import { AppFrame } from "../components/app-frame"
import { Card } from "../components/card"
import { Icon } from "../components/icons"

type FleetPassSummary = {
  status: string
  qualifyingCount: number
  ranCount: number
  skippedPendingCount: number
  failedCount: number
  proposalCount: number
}

/** Secondary browse: operational lane board. Home remains the exception queue. */
export default function LanesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<BoardFilterId>("all")
  const [filterReady, setFilterReady] = useState(false)
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState("")
  const [fleet, setFleet] = useState<{ active: boolean; pass: FleetPassSummary | null }>({ active: false, pass: null })

  useEffect(() => {
    setFilter(parseBoardFilter(new URLSearchParams(window.location.search).get("filter")))
    setFilterReady(true)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/overview?q=${encodeURIComponent(search)}`, { signal: controller.signal })
        .then((response) => { if (!response.ok) throw new Error("Could not load orders"); return response.json() as Promise<Overview> })
        .then((data) => { setOverview(data); setError("") })
        .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load orders") })
    }, search ? 180 : 0)
    return () => { clearTimeout(timer); controller.abort() }
  }, [search])

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch("/api/agent/fleet")
        .then((response) => response.json() as Promise<{ active: boolean; pass: FleetPassSummary | null }>)
        .then((body) => { if (!cancelled) setFleet({ active: !!body.active, pass: body.pass ?? null }) })
        .catch(() => { /* ignore */ })
    }
    load()
    const id = setInterval(load, 2000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  useEffect(() => {
    if (!filterReady) return
    const url = new URL(window.location.href)
    if (filter === "all") url.searchParams.delete("filter")
    else url.searchParams.set("filter", filter)
    window.history.replaceState(null, "", url.pathname + url.search)
  }, [filter, filterReady])

  const visible = useMemo(() => filterBoardCards(overview?.visible ?? [], filter), [overview, filter])
  const attentionTotal = overview ? Object.values(overview.attentionCounts).reduce((sum, count) => sum + count, 0) : 0
  const ownerTotal = useMemo(
    () => (overview?.visible ?? []).filter((card) => card.attention.some((a) => a.owner && a.owner !== "owner not recorded" && a.owner !== "no one recorded")).length,
    [overview],
  )
  const filtering = !!search || filter !== "all"
  const lanes = LANES.filter(([lane]) => !filtering || visible.some((card) => card.displayLane === lane))

  function filterCount(id: BoardFilterId): number | null {
    if (!overview) return null
    if (id === "all") return overview.total
    if (id === "needs_attention") return attentionTotal
    return ownerTotal
  }

  return <AppFrame section="lanes" board snapshotAt={overview?.snapshotAt ?? null}><main className="board-page">
    <div className="board-head">
      <div className="board-title">
        <h1>Browse by lane</h1>
        <p className="board-sub">{overview
          ? <><b>{overview.total}</b> orders · secondary view · <Link href="/">Back to exceptions</Link></>
          : "Loading orders by lane…"}</p>
      </div>
      <div className="board-tools">
        <label className="search">
          <span className="sr-only">Search orders</span>
          <Icon name="search" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, car, plate, customer or city" />
          {search && <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="arrow" size={14} style={{ transform: "rotate(45deg)" }} /></button>}
        </label>
      </div>
    </div>
    {fleet.pass && <div className={`fleet-banner${fleet.active ? " is-active" : ""}`} role="status">
      <span>{fleet.active ? "On-road agent is working" : "Latest on-road agent pass"}</span>
      <span className="num">
        {fleet.pass.ranCount}/{fleet.pass.qualifyingCount} ran · {fleet.pass.skippedPendingCount} skipped · {fleet.pass.proposalCount} proposals
        {fleet.pass.failedCount > 0 ? ` · ${fleet.pass.failedCount} could not finish` : ""}
      </span>
      <Link href="/">Manage on Needs a person</Link>
    </div>}
    <div className="board-filters" role="toolbar" aria-label="Board filters">
      {BOARD_FILTERS.map((item) => {
        const count = filterCount(item.id)
        const active = filter === item.id
        return <button
          key={item.id}
          type="button"
          className={`board-filter-pill${active ? " active" : ""}`}
          aria-pressed={active}
          onClick={() => setFilter(item.id)}
        >
          {item.label}{count != null && <span className="num">{count}</span>}
        </button>
      })}
    </div>
    {error && <p className="board-error" role="alert">{opsLoadError("Could not load the lane board")}</p>}
    <section className="board" aria-label="Order lanes">
      {lanes.map(([lane, label]) => {
        const cards = visible.filter((card) => card.displayLane === lane)
        const total = overview?.counts[lane] ?? 0
        const needing = overview?.attentionCounts[lane] ?? 0
        return <div className={`lane lane-${lane}`} key={lane}>
          <header className="lane-head">
            <span className={`lane-pill lane-pill-${lane}`}>{label}</span>
            <span className="lane-count num">{filtering ? `${cards.length} of ${total}` : total}</span>
            {needing > 0 && filter !== "needs_attention" && <span className="lane-attention num">{needing} need a person</span>}
          </header>
          <div className="lane-scroll">
            {!overview && !error && <ul className="lane-list" aria-busy="true">{[0, 1, 2].map((index) => <li className="skeleton" key={index} />)}</ul>}
            {overview && cards.length === 0 && <p className="lane-empty">{filtering ? "No matching orders in this lane." : "No orders in this lane right now."}</p>}
            {cards.length > 0 && <ul className="lane-list">{cards.map((card) => <li key={card.id}><Card card={card} snapshotAt={overview?.snapshotAt} /></li>)}</ul>}
          </div>
        </div>
      })}
      {overview && filtering && visible.length === 0 && <p className="board-empty">
        {search
          ? <>No orders match “{search}”{filter !== "all" ? " for this filter" : ""}. Try clearing search or another filter.</>
          : filter === "needs_attention"
            ? "No order on this board needs a person right now."
            : filter === "has_owner"
              ? "No order on this board has a named owner."
              : "No matching orders."}
      </p>}
    </section>
  </main></AppFrame>
}
