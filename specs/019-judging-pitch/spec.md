# Feature Specification: Judging Pitch (Max Points)

**Feature Branch**: `019-judging-pitch`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Criterion 1 Control Room 40% — triage Needs a person + lanes, provenance folds, cheap agent passes that stop and hand proposals. Criterion 2 AI 30% — prompt iteration narrative, guardrails, architectural judgement. Criterion 3 Taste 30% — information density, lane architecture, polish. Pitch checklist + live demo path (exception order / Kanban)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Judges follow a three-criterion pitch path (Priority: P1)

A hackathon judge opens an in-app **Pitch** page and sees the three scoring criteria (Control Room 40%, How you worked with AI 30%, Taste 30%) with short talking points and one-click links into the live product (Needs a person, Browse by lane, a showcase order, Build notes).

**Why this priority**: The brief is scored by these weights; without a guided path, demos waste time digging.

**Independent Test**: From Pitch, open each criterion’s primary live link and land on the matching surface within one click.

**Acceptance Scenarios**:

1. **Given** the running app, **When** a judge opens Pitch from nav, **Then** they see three criterion sections with weights and a short pitch checklist (Problem → Solution → AI journey → Live demo).
2. **Given** Criterion 1, **When** they follow the links, **Then** they can open Needs a person, Browse by lane, and a showcase order that demonstrates exception reason + decide cue.
3. **Given** Criterion 2, **When** they follow the link, **Then** they land on Build notes with the four judgement sections.
4. **Given** Criterion 3, **When** reading the section, **Then** it points at card/timeline density and empty/loading polish already in the product (not a second redesign).

---

### User Story 2 - Showcase order anchors the live demo (Priority: P1)

Pitch names a concrete showcase order (prefer an on-road / exception order with agent handoff) so the demo can open one record and show provenance, cheap steps, and Approve/Reject without hunting.

**Why this priority**: “Open the BMW M4 order” style demos fail if the link is missing or wrong.

**Independent Test**: Pitch’s showcase link opens an order detail that shows situation + provenance fold + agent decision surface when data exists.

**Acceptance Scenarios**:

1. **Given** seeded data, **When** Pitch resolves the showcase order, **Then** the href points at `/orders/{id}` for an order that appears on Needs a person or has on-road agent qualification when available.
2. **Given** the showcase order is missing, **When** Pitch loads, **Then** it still links to `/` and `/lanes` and explains how to pick any exception card.

---

### User Story 3 - Build notes carry the iteration example judges expect (Priority: P2)

Build notes include a concrete “threw away / first answer” story about bloated multi-line event formatting that failed the at-a-glance test, plus an explicit guardrail note that high-stakes actions (ferry booking, promise change, customer message) never auto-commit without approval.

**Why this priority**: Criterion 2 awards judgement narrative, not tool lists.

**Independent Test**: On Build notes, find the event-log throw-away and the approval-gate guardrail without scrolling a tool dump.

**Acceptance Scenarios**:

1. **Given** Build notes, **When** reading Threw away or Did not take the first answer, **Then** at least one entry describes rejecting dense/paragraph event formatting for scannable blocks.
2. **Given** Build notes Asked for or Checked, **When** reading entries, **Then** at least one entry states consequential ops (customer message, promise, booking) stay behind Approve.

---

## Edge Cases

- Showcase order id changes after reseed: Pitch uses a stable resolver (search by vehicle/reference hint) with fallback copy.
- Home remains `/` (Needs a person); Pitch must not become the default landing page.
- Pitch is for judges/demo — not day-to-day ops chrome weight; keep nav label short.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Pitch route reachable from primary nav.
- **FR-002**: Pitch MUST present Criterion 1 (40%), Criterion 2 (30%), Criterion 3 (30%) with weights visible.
- **FR-003**: Criterion 1 MUST link to `/`, `/lanes`, and a showcase order when resolvable; MUST mention triage, provenance, and cheap-pass stop/handoff.
- **FR-004**: Criterion 2 MUST link to `/build` and MUST NOT dump prompts or tool inventories on Pitch itself.
- **FR-005**: Criterion 3 MUST reference density, lanes health scan, and empty/loading polish (no new visual system).
- **FR-006**: Pitch MUST include a short pitch checklist: Problem, Solution, AI journey, Live demo.
- **FR-007**: Home MUST remain the exception queue.
- **FR-008**: Build notes content MUST be updated with the event-formatting throw-away and approval-gate guardrail entries (static curated data).
- **FR-009**: Showcase order resolution MUST be deterministic from seeded snapshot (hint config or first qualifying exception).

### Key Entities

- **PitchDoc**: title; intro; checklist[]; criteria[]
- **PitchCriterion**: id; weight; title; talkingPoints[]; liveLinks[]
- **PitchLink**: label; href; hint
- **ShowcaseHint**: optional vehicle/reference substrings used to resolve order id

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A judge can start the live demo from Pitch in ≤30 seconds (one click to queue, lanes, or showcase order).
- **SC-002**: All three criteria are named with correct weights on Pitch.
- **SC-003**: Build notes still answers the four AI-judgement prompts; Pitch does not replace Build notes.
- **SC-004**: Zero live LLM calls on Pitch or Build notes routes.

## Assumptions

- Audience is hackathon judges and teammates presenting the demo.
- Product surfaces for triage/provenance/agent already exist; Pitch is a guided narrative + links, not a rewrite of the control room.
- “BMW M4” may not exist in seed; showcase uses the best on-road/exception order available and labels it honestly.
