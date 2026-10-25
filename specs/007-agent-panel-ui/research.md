# Research: On-road Agent Panel Concise UI

## Decision: Presentation-only compression (no API / prompt change in this feature)

**Rationale**: User pain is duplicate long UI text; model may still emit long handoffs. Compress in the panel first for immediate win and SC-004 safety.

**Alternatives considered**: Shorten agent prompts now (good follow-up, out of scope); remove chat entirely (loses useful loop).

## Decision: Findings as ≤5 bullets + “Show full handoff”

**Rationale**: Split handover on sentences/newlines; take first substantive lines as bullets; rest behind expand. Avoid inventing facts.

**Alternatives considered**: Keep full paragraph (fails SC-002); AI summarizer call (extra latency/cost).

## Decision: Decision text only on the approval card

**Rationale**: Today `decisionText` and `pending.decision` and chat assistant message all show the same ask. Show once on pending card; omit separate “Proposed decision” block when pending exists; do not auto-surface full handoff as chat preview.

**Alternatives considered**: Keep all three for “clarity” (causes the screenshot problem).

## Decision: Truncate long chat messages (~160–220 chars) with Show more

**Rationale**: Prevents handoff-sized bubbles from dominating; FR-005.

**Alternatives considered**: Hide assistant messages from the last run (too aggressive).

## Decision: One-line header policy

**Rationale**: FR-004; “Asks before consequential change · never contacts the customer” as a single muted line.

**Alternatives considered**: Remove policy (hurts trust/constitution messaging).
