# Feature Specification: On-road Agent Panel — Concise UI

**Feature Branch**: `007-agent-panel-ui`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "it is too much text! how to make it modern and optimized?" — referring to the On-road agent panel (walls of repeated paragraphs: findings, proposed decision, next step, and chat echo).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan the handoff in seconds (Priority: P1)

An ops person opens an order with a pending on-road proposal and understands what the agent found and what it wants approved **without reading the same paragraph three times**.

**Why this priority**: Constitution I / V — decide in a few seconds; current panel dumps long prose and duplicates the decision.

**Independent Test**: On a pending proposal order, the person can state the situation gist and the ask in under 20 seconds using only the agent panel; decision text appears once in the approval block.

**Acceptance Scenarios**:

1. **Given** a completed agent run with handover + pending proposal, **When** viewing the panel, **Then** findings are shown as short labeled facts (or compact bullets), not one unbroken essay.
2. **Given** the same state, **When** viewing the panel, **Then** the proposed decision / next step text appears **once** (in the approval card)—not again as a duplicate “Proposed decision” block and not again as a full chat echo of the same handoff.

---

### User Story 2 - One clear approval card (Priority: P1)

When a proposal awaits review, the panel surfaces a single modern approval card: short title, one decision summary, Approve / Reject, and a one-line demo caveat—nothing else competing for the same ask.

**Why this priority**: Human approval gate must stay obvious (constitution III) without text noise.

**Independent Test**: Pending state shows exactly one Approve/Reject control group; settled proposals are compact or folded.

**Acceptance Scenarios**:

1. **Given** a pending proposal, **When** viewing the panel, **Then** Approve and Reject are on one card with a single decision summary.
2. **Given** recent approved/rejected proposals, **When** viewing the panel, **Then** they do not dominate the viewport (collapsed list or last-1 summary).

---

### User Story 3 - Compact talk-to-agent (Priority: P2)

Chat stays available but does not re-paste the full handoff as a giant agent bubble by default; recent short turns only, with optional expand for long messages.

**Why this priority**: Chat is useful; duplicating the handoff in chat is waste.

**Independent Test**: After a run, chat list does not show a multi-paragraph duplicate of “What the agent found” as the primary visible message unless the user expands it.

**Acceptance Scenarios**:

1. **Given** long assistant messages in history, **When** viewing chat, **Then** each long message is truncated with “Show more” (or similar), defaulting to a short preview.
2. **Given** the composer, **When** visible, **Then** it remains a single compact input + Send without restating policy paragraphs above it.

---

### Edge Cases

- No run yet: short quiet state + Run control; no empty section headers.
- Run error: one error line; no duplicated error copy.
- No pending proposal but has findings: show compact findings only; no empty approval card.
- Very long handover: findings capped to a few bullets with “Show full handoff” expand.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The On-road agent panel MUST reduce default visible prose: no triple repeat of the same decision/handoff text across findings, proposal, and chat.
- **FR-002**: Findings MUST present as a compact structure (labeled lines or ≤5 bullets) derived from handover/summary; full text available via expand.
- **FR-003**: Pending approval MUST be a single card with title, one decision summary, Approve / Reject, and one short synthetic-demo hint.
- **FR-004**: Header policy copy MUST be one short line (or tooltip/note)—not a multi-sentence block competing with the handoff.
- **FR-005**: Chat MUST show recent user/assistant turns in compact form; long assistant content truncated by default.
- **FR-006**: Behavior of Run / review / chat APIs MUST remain unchanged (presentation-only); approval gate and “no auto customer contact” unchanged.
- **FR-007**: Visual language MUST stay birch/ops (modern, calm)—not a dark terminal skin.

### Key Entities

- **FindingsView**: Compact display model from handover (facts bullets + optional full text).
- **ApprovalCard**: Pending proposal display (title, decision once, actions).
- **ChatTurnView**: Message with preview + expanded flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a pending-proposal order, the same decision paragraph does not appear more than **once** above the fold in the agent panel.
- **SC-002**: Default findings block fits in roughly **≤6 short lines** (or equivalent bullets) before any expand.
- **SC-003**: Tester can locate Approve/Reject in **under 5 seconds** after opening the order.
- **SC-004**: Run / Approve / Reject / chat still succeed as before (no API regression).

## Assumptions

- Presentation polish on `agent-panel.tsx` (+ CSS); no new agent tools required.
- Handover/decision strings may stay long from the model; UI compresses display.
- Timeline (005/006) remains separate; this feature is the Agent panel only.
