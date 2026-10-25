import { AppFrame } from "../components/app-frame"
import { buildNotes, type JudgementOutcome } from "@/lib/build-notes"

const OUTCOME_LABEL: Record<JudgementOutcome, string> = {
  kept: "Kept",
  changed: "Changed",
  rejected: "Rejected",
}

export default function BuildNotesPage() {
  const doc = buildNotes
  return (
    <AppFrame section="build">
      <main className="build-page">
        <header className="build-head">
          <h1>{doc.title}</h1>
          <p className="build-intro">{doc.intro}</p>
        </header>
        {doc.sections.map((section) => (
          <section className="build-section" key={section.id} aria-labelledby={`build-${section.id}`}>
            <h2 id={`build-${section.id}`}>{section.title}</h2>
            <p className="build-lead">{section.lead}</p>
            <ul className="build-list">
              {section.entries.map((entry) => (
                <li className="build-entry" key={entry.title}>
                  <div className="build-entry-top">
                    <h3>{entry.title}</h3>
                    {entry.outcome && (
                      <span className={`build-outcome outcome-${entry.outcome}`}>
                        {OUTCOME_LABEL[entry.outcome]}
                      </span>
                    )}
                  </div>
                  <p>{entry.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </AppFrame>
  )
}
