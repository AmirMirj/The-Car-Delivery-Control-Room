"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { pitchDoc } from "@/lib/pitch"
import { resolveShowcaseFromExceptions, type ShowcaseResolution } from "@/lib/present/showcase-order"
import { AppFrame } from "../components/app-frame"

type ExceptionItem = {
  orderId: string
  reference: string
  headline: string
  vehicleLabel: string | null
  qualifiesOnRoad: boolean
  agentStatus: string | null
}

export default function PitchPage() {
  const doc = pitchDoc
  const [showcase, setShowcase] = useState<ShowcaseResolution | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/exceptions", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((body: { items?: ExceptionItem[] }) => {
        const items = (body.items ?? []).map((item) => ({
          orderId: item.orderId,
          reference: item.reference,
          headline: item.headline,
          vehicleLabel: item.vehicleLabel,
          qualifiesOnRoad: item.qualifiesOnRoad,
          agentStatus: item.agentStatus,
        }))
        setShowcase(resolveShowcaseFromExceptions(items, doc.showcaseHint))
      })
      .catch(() => {
        setShowcase(resolveShowcaseFromExceptions([], doc.showcaseHint))
      })
    return () => controller.abort()
  }, [doc.showcaseHint])

  return (
    <AppFrame section="pitch">
      <main className="pitch-page">
        <header className="pitch-head">
          <h1>{doc.title}</h1>
          <p className="pitch-intro">{doc.intro}</p>
        </header>

        <section className="pitch-checklist" aria-labelledby="pitch-checklist-title">
          <h2 id="pitch-checklist-title">Pitch checklist</h2>
          <ol className="pitch-check-list">
            {doc.checklist.map((item) => (
              <li key={item.id}>
                <span className="pitch-check-label">{item.label}</span>
                <span className="pitch-check-detail">{item.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {doc.criteria.map((criterion) => (
          <section className="pitch-criterion" key={criterion.id} aria-labelledby={`pitch-${criterion.id}`}>
            <div className="pitch-criterion-top">
              <h2 id={`pitch-${criterion.id}`}>{criterion.title}</h2>
              <span className="pitch-weight">{criterion.weight}%</span>
            </div>
            <ul className="pitch-points">
              {criterion.talkingPoints.map((point) => (
                <li key={point.slice(0, 48)}>{point}</li>
              ))}
            </ul>
            <div className="pitch-links">
              {criterion.liveLinks.map((link) => {
                const isShowcase = criterion.id === "control-room" && link.label === "Showcase order"
                const href = isShowcase && showcase ? showcase.href : link.href
                const label = isShowcase && showcase ? showcase.label : link.label
                const hint = isShowcase && showcase ? showcase.hint : link.hint
                return (
                  <Link key={`${criterion.id}-${link.label}`} className="pitch-link" href={href}>
                    <span className="pitch-link-label">{label}</span>
                    {hint && <span className="pitch-link-hint">{hint}</span>}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </main>
    </AppFrame>
  )
}
