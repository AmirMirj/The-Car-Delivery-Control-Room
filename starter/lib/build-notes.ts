/** Curated build judgement for hackathon reviewers. Static — not LLM-generated at runtime. */

export type JudgementOutcome = "kept" | "changed" | "rejected"

export type JudgementEntry = {
  title: string
  detail: string
  outcome?: JudgementOutcome
}

export type JudgementSection = {
  id: "asked" | "checked" | "threw-away" | "first-answer"
  title: string
  lead: string
  entries: JudgementEntry[]
}

export type BuildNotesDoc = {
  title: string
  intro: string
  sections: JudgementSection[]
}

export const buildNotes: BuildNotesDoc = {
  title: "Build notes",
  intro:
    "How coding agents helped on this control room — and where we overruled them. Judgement matters more than how many tools we opened.",
  sections: [
    {
      id: "asked",
      title: "What we asked for",
      lead: "Agents were pointed at product outcomes, not “make a dashboard.”",
      entries: [
        {
          title: "Exception-first room + one deep on-road agent",
          detail:
            "Spec Kit flows (specify → plan → tasks → implement) for the constitution brief: home is “Needs a person,” lanes stay secondary, agent proposes with approval gates — never auto-booking a ferry, changing a delivery promise, or sending a customer message without Approve.",
          outcome: "kept",
        },
        {
          title: "Unified timeline that ops can actually scan",
          detail:
            "Asked for one tracker per order with provenance, cheap agent steps, and Approve/Reject on the decision surface — not a second CRM of forms.",
          outcome: "kept",
        },
        {
          title: "Four judging questions as a product check",
          detail:
            "Asked the agent to plan/implement decide cues, visible provenance, cheap-work handoff, and an explicit “what happens next” after a person decides.",
          outcome: "kept",
        },
        {
          title: "A short demo video of one order",
          detail:
            "Asked for a ~90s recording against a live order to show requirements satisfied end-to-end.",
          outcome: "changed",
        },
      ],
    },
    {
      id: "checked",
      title: "What we checked",
      lead: "First agent output was never the finish line — we verified against the brief and the running UI.",
      entries: [
        {
          title: "Constitution gates on every Spec Kit plan",
          detail:
            "Exception-first, cheap-first agent, human approval before consequential change, synthetic world, ops taste — plans that drifted were rewritten before tasks.",
        },
        {
          title: "Typecheck after UI slices",
          detail:
            "After timeline, agent panel, and decide-cue work: `npm run typecheck` in starter before calling a feature done.",
        },
        {
          title: "Live UI against the four questions",
          detail:
            "Opened the exception queue and an on-road order to confirm reason + decide cue, source→destination, View agent steps / handoff, and Next: after Approve/Reject.",
        },
        {
          title: "Wrong feature directory from setup scripts",
          detail:
            "setup-plan/tasks often followed an old git branch (e.g. 012) while feature.json said otherwise — we forced FEATURE_DIR / feature.json before generating artifacts.",
          outcome: "changed",
        },
      ],
    },
    {
      id: "threw-away",
      title: "What we threw away",
      lead: "Noise that looked helpful in a first pass but failed ops taste or the decide loop.",
      entries: [
        {
          title: "“Open in Conversations” / “Open in Prior agent work”",
          detail:
            "Jump CTAs that scrolled to folds without helping the decision. Spec’d and removed (014, 015); reappearance was deleted again in 016.",
          outcome: "rejected",
        },
        {
          title: "Bloated multi-line event paragraphs",
          detail:
            "First coding-agent pass on order event logs returned dense multi-line paragraphs that drowned critical metadata. We threw that formatting away — it failed the at-a-glance test — and kept scannable blocks (status, impact, next step).",
          outcome: "rejected",
        },
        {
          title: "Search/sort toolbar on the timeline",
          detail:
            "Added in an earlier slice, then removed — pills + urgency already carried the scan; the bar competed with the situation.",
          outcome: "rejected",
        },
        {
          title: "OpenSearch / Power BI–style embeds for “traces”",
          detail:
            "Research named them as inspiration; we kept a light Gantt/trace in-product instead of bolting on foreign analytics chrome.",
          outcome: "rejected",
        },
        {
          title: "Embedded-Postgres demo recorder in the agent sandbox",
          detail:
            "Tried to record without Docker; TCP connected but auth hung in the sandbox. Threw away the fake “it works here” path and required a real Docker compose on the host.",
          outcome: "rejected",
        },
      ],
    },
    {
      id: "first-answer",
      title: "Where we did not take the first answer",
      lead: "Agents draft quickly. These are the places a human steered.",
      entries: [
        {
          title: "“All four live agents at once” vs situation match",
          detail:
            "Clarify pass: we did not ship four always-on panels. Coexistence is all areas available, with automatic match to the current situation (and explicit rules for ambiguity).",
          outcome: "changed",
        },
        {
          title: "More UI chrome vs quieter decide surface",
          detail:
            "First timeline passes added links and toolbars; we cut back to reason, provenance, cheap steps, and Approve/Reject so the page answers the brief in seconds.",
          outcome: "changed",
        },
        {
          title: "Dense log walls vs typographic field blocks",
          detail:
            "When agents first formatted situation text as prose walls, we refused that answer and rebuilt impact / status / next into crisp field rows operators can scan under pressure.",
          outcome: "rejected",
        },
        {
          title: "Agent-only “pass” without a human next step",
          detail:
            "Approve/Reject that only flipped status was not enough — we required applied/not-applied copy plus an explicit Next: line after the person decides.",
          outcome: "changed",
        },
        {
          title: "Cheap agent work hidden as plain “Activity”",
          detail:
            "The timeline listed dispatch-agent offers as anonymous activity. We reclassified agent-recorded events as agent cheap work and added read-only agent checks (proof files, receipts, alert context, handover) between events — derived only from recorded fields, no Approve needed, and “Needs a person” counts unchanged.",
          outcome: "changed",
        },
        {
          title: "Trusting setup scripts’ feature path",
          detail:
            "First plan/tasks runs wrote into the wrong spec folder. Stopped, reset feature.json / SPECIFY_FEATURE, and regenerated under the intended number.",
          outcome: "rejected",
        },
      ],
    },
  ],
}
