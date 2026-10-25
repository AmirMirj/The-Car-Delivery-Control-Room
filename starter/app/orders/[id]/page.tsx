"use client"

import Link from "next/link"
import { use, useCallback, useEffect, useState } from "react"
import { opsLoadError } from "@/lib/present/ops-copy"
import { AppFrame } from "../../components/app-frame"
import { OrderPane, type Detail } from "../../components/order-detail"

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState("")

  const load = useCallback(() => {
    const controller = new AbortController()
    fetch(`/api/orders/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(response.status === 404 ? "Order not found" : "Could not load order"); return response.json() as Promise<Detail> })
      .then((data) => { setDetail(data); setError("") })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load order") })
    return () => controller.abort()
  }, [id])

  useEffect(() => load(), [load])

  useEffect(() => {
    if (!detail?.agent?.qualifiesOnRoad) return
    if (detail.agent.activeRun) return
    fetch(`/api/orders/${encodeURIComponent(id)}/agent/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "auto_exception" }),
    }).then((response) => { if (response.ok) load() }).catch(() => undefined)
  }, [detail?.agent?.qualifiesOnRoad, detail?.agent?.activeRun, id, load])

  useEffect(() => {
    if (detail) document.title = `${detail.view.header.reference} · ${detail.view.header.vehicle?.title ?? "Order"} · Control Room`
  }, [detail])

  return <AppFrame section="exceptions" snapshotAt={detail?.view.snapshotAt ?? null}><main className="page">
    <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Needs a person</Link><span>/</span><span>{detail?.view.header.reference ?? "Record"}</span></nav>
    {error && <div className="record-state" role="alert"><h1>{error === "Order not found" ? "Order not found" : "Could not open this order"}</h1><p>{error === "Order not found" ? "It may have left the snapshot." : opsLoadError("Something went wrong")}<br /><Link href="/">Back to Needs a person</Link></p></div>}
    {!error && !detail && <div className="record-state" aria-busy="true"><div className="cover skeleton-cover" /><p>Loading this order…</p></div>}
    {detail && <OrderPane detail={detail} onReload={load} />}
  </main></AppFrame>
}
