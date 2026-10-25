# Feature Specification: Decision-Ready Handoff

**Feature Branch**: `016-decision-ready-handoff`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Does it bring a person only the orders that need them, with just enough to decide? Can you see where every fact came from? Does the agent do the cheap work first, know when to stop, and hand over with what it found? When a person decides, is it clear what happens next?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Only orders that need a person, just enough to decide (Priority: P1)

An ops person lands on the exception queue and sees **only** orders that need them. Each row shows a plain-language reason and enough context to decide whether to open it—not a form dump. Quiet orders stay off this list (lanes remain for deliberate browse).

**Why this priority**: First judging question; exception-first is the control room’s core promise.

**Independent Test**: On the home queue, every visible card has a non-empty reason; opening three cards, the person can state the decision ask within a few seconds; a known quiet order is absent from home.

**Acceptance Scenarios**:

1. **Given** the synthetic snapshot, **When** the person opens home, **Then** the view is “Needs a person” and every item shows why a person is needed.
2. **Given** an exception item, **When** viewed in the list, **Then** it shows reason plus a short “decide” cue (what is waiting)—not the full record.
3. **Given** a quiet order with no attention signals, **When** on home, **Then** that order is absent unless reached via lanes/search.

---

### User Story 2 - See where every fact came from (Priority: P1)

On an open order, important claims (alerts, messages, bookings vs quotes, agent findings) show their **source** so the person can trust or challenge them without leaving the decision surface.

**Why this priority**: Second judging question; messy packet data makes silent “winning” facts unacceptable.

**Independent Test**: On a messy order, the person can point to source labels for the primary attention item, a message/thread claim, and an agent finding without opening unrelated admin screens.

**Acceptance Scenarios**:

1. **Given** a timeline or attention item, **When** the person views it, **Then** source → destination (or equivalent provenance) is visible.
2. **Given** an agent proposal body, **When** viewing findings, **Then** each key finding is attributable (tool/step or record), not an anonymous summary-only blob.
3. **Given** quote vs booking, **When** travel/cost facts appear, **Then** quotes remain labelled as not booked.

---

### User Story 3 - Cheap work first, stop, hand over findings (Priority: P1)

The on-road agent does cheap work (read/ask/lookup) before involving a person, stops when it cannot finish safely, and hands over **what it found** plus one clear decision—not a raw dump. Cheap steps are inspectable from the decision surface.

**Why this priority**: Third judging question; agents-do-the-legwork constitution principle.

**Independent Test**: On an order with an agent run awaiting review, open “View agent steps”, confirm cheap steps list, and see a handover summary / decision ask without applying changes.

**Acceptance Scenarios**:

1. **Given** a completed cheap-work loop, **When** the person views the agent entry, **Then** they can expand cheap steps with name + result.
2. **Given** the agent stopped for a person, **When** viewing the handoff, **Then** they see what was found and the decision ask before Approve/Reject.
3. **Given** consequential change proposals, **When** not yet approved, **Then** no booking/date/cost/customer message has been applied.

---

### User Story 4 - After a person decides, next step is clear (Priority: P1)

When the person Approves or Rejects, the UI immediately shows **what happens next** (applied change + next human/agent action, or rejection recorded + what remains open)—not a silent status flip.

**Why this priority**: Fourth judging question; closes the collaboration loop for demos and judges.

**Independent Test**: Approve one pending proposal and reject another (or re-run); after each action, a clear next-step line appears on the order/timeline without a full page hunt.

**Acceptance Scenarios**:

1. **Given** a pending proposal, **When** the person Approves, **Then** they see confirmation of what was applied (synthetic) and the next step.
2. **Given** a pending proposal, **When** the person Rejects, **Then** they see that the proposal was not applied and what is still waiting.
3. **Given** either outcome, **When** viewing the timeline entry, **Then** status reflects the decision and is distinguishable from “awaiting review”.

---

### Edge Cases

- No pending proposals: empty state still names what was checked; no fake Approve buttons.
- Agent still running: show in-progress, not a premature decision ask.
- Multiple attention items: primary reason on the queue; full list on the record without burying the decision ask.
- Leftover navigation noise (e.g. jump links that don’t aid decide): must not return on the decision surface.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Home MUST be the exception queue of orders that need a person; each item MUST show why.
- **FR-002**: Exception items MUST include a short decide cue (what is waiting on the person).
- **FR-003**: Quiet orders MUST NOT appear on home solely by existing in the catalog.
- **FR-004**: Decision-surface facts MUST expose provenance (source / routing / record attribution).
- **FR-005**: Agent cheap steps MUST be viewable from the pending/handed-over agent entry.
- **FR-006**: Agent handoff MUST show findings + decision ask before consequential apply.
- **FR-007**: Approve/Reject MUST surface an explicit “what happens next” outcome on the order UI.
- **FR-008**: Consequential changes MUST NOT apply without Approve (constitution).
- **FR-009**: Decision surface MUST NOT reintroduce removed noise CTAs (e.g. “Open in Prior agent work”, “Open in Conversations”) that do not aid the decide loop.

### Key Entities

- **ExceptionItem**: order needing a person; reason; decideCue; tone; href
- **ProvenanceLine**: source → destination or sourceLabel on a claim
- **CheapStep**: name; result; at (agent legwork)
- **DecisionOutcome**: approved|rejected; appliedSummary; nextStep; at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can answer “yes” to all four input questions using only the running UI in ≤90 seconds on one on-road order.
- **SC-002**: Home queue shows 0 quiet orders from the synthetic snapshot’s no-attention set.
- **SC-003**: After Approve or Reject, next-step copy is visible within the same viewport as the timeline actions without opening a separate admin page.
- **SC-004**: Pending agent entries expose ≥1 cheap step when the run recorded tools/messages.

## Assumptions

- Builds on existing exception queue, timeline, agent panel, and approve/reject APIs from features 001–015.
- Synthetic demo world only; no real purchases or customer contact.
- On-the-road remains the deep agent area.
- “Just enough to decide” means list + order header/timeline/agent strip—not removing deep folds entirely.
