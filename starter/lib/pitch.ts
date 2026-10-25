/** Curated judging pitch — static, no LLM at runtime. */

export type PitchCheckId = "problem" | "solution" | "ai" | "demo"

export type PitchCheckItem = {
  id: PitchCheckId
  label: string
  detail: string
}

export type PitchLink = {
  label: string
  href: string
  hint: string | null
}

export type PitchCriterionId = "control-room" | "ai" | "taste"

export type PitchCriterion = {
  id: PitchCriterionId
  weight: number
  title: string
  talkingPoints: string[]
  liveLinks: PitchLink[]
}

export type ShowcaseHint = {
  vehicleSubstrings: string[]
  preferOnRoad: boolean
}

export type PitchDoc = {
  title: string
  intro: string
  checklist: PitchCheckItem[]
  criteria: PitchCriterion[]
  showcaseHint: ShowcaseHint
}

export const pitchDoc: PitchDoc = {
  title: "Pitch",
  intro:
    "Operations teams drown in unstructured logistics noise and unvetted chat bots. This control room pairs cheap autonomous agent passes with clear human handoffs — only exceptions reach a person.",
  checklist: [
    {
      id: "problem",
      label: "Problem",
      detail: "Ops drowning in healthy-order noise and AI that acts without a decide surface.",
    },
    {
      id: "solution",
      label: "Solution",
      detail: "High-signal room: exception queue, provenance, cheap agent passes that stop and propose.",
    },
    {
      id: "ai",
      label: "AI journey",
      detail: "Coding agents used critically — what we asked, checked, threw away, and refused as a first answer.",
    },
    {
      id: "demo",
      label: "Live demo",
      detail: "Open Needs a person → showcase order → provenance + Approve; or Browse by lane for fleet health.",
    },
  ],
  showcaseHint: {
    vehicleSubstrings: ["M4", "BMW", "Tesla", "Porsche"],
    preferOnRoad: true,
  },
  criteria: [
    {
      id: "control-room",
      weight: 40,
      title: "The Control Room",
      talkingPoints: [
        "Triage: Needs a person surfaces only exceptions (e.g. site access unconfirmed, promise at risk) — operators do not dig through hundreds of healthy orders.",
        "Provenance: every situation card ties facts to a source; Primary tracker · full provenance folds below.",
        "Autonomous stop: cheap on-road passes run first (e.g. 1/11 ran, 10 skipped, proposals only when judgment is needed).",
        "Legwork in the timeline: “Agent · cheap” rows sit between events — proof files checked, receipts matched, alert context linked — read-only, no Approve, Needs a person count unchanged.",
      ],
      liveLinks: [
        { label: "Needs a person", href: "/", hint: "Exception queue — reason + Decide on each card" },
        { label: "Browse by lane", href: "/lanes", hint: "Kanban health scan — route, progress, badges" },
        { label: "Showcase order", href: "/", hint: "Resolved at runtime to a live exception / on-road order" },
      ],
    },
    {
      id: "ai",
      weight: 30,
      title: "How we worked with AI",
      talkingPoints: [
        "Judgement over tool counts: asked / checked / threw away / did not take the first answer.",
        "Guardrails: ferry booking, promise change, and customer messages never auto-commit — Approve is required.",
        "Architecture: Spec Kit + coding agents structured the model; humans kept the decide surface quiet.",
      ],
      liveLinks: [
        { label: "Build notes", href: "/build", hint: "Four judgement sections — concrete product decisions" },
      ],
    },
    {
      id: "taste",
      weight: 30,
      title: "Taste",
      talkingPoints: [
        "Information density: vehicle status, impact, and next steps as scannable blocks — not walls of text.",
        "Lane board: progress bars, Hamburg → Helsinki routing, color badges — assess 100+ orders in seconds.",
        "Polish: empty states, calm spacing, readable weights so non-engineers need zero tutorials.",
      ],
      liveLinks: [
        { label: "Browse by lane", href: "/lanes", hint: "Density + progress without leaving the product" },
        { label: "Needs a person", href: "/", hint: "Sticky head, decide cues, quiet idle fleet chrome" },
      ],
    },
  ],
}
