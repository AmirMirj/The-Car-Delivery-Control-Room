# Feature Specification: Efficient By-Lane Board

**Feature Branch**: `003-efficient-lanes`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "How can I adapt an organized sprint board (To-do / In Progress / Complete with assignee pills and progress) to make the by-lane board more efficient?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan lanes with less noise (Priority: P1)

An ops person opens **By lane** and sees clearer column headers (status-coloured pills + counts), denser cards that surface owner and next-step progress, and global filter pills so they can shrink the board without leaving the page.

**Why this priority**: Lane browse is secondary to the exception queue but still used for deliberate lookup; density and filters cut time-to-find.

**Independent Test**: On `/lanes`, headers use pill labels; cards show owner/attention signal and a progress cue; filter pills change visible cards without a full navigation.

**Acceptance Scenarios**:

1. **Given** the lane board loads, **When** viewing column headers, **Then** each lane shows a coloured pill label and order count (sprint-board style), not only plain text.
2. **Given** orders that need a person, **When** viewing cards, **Then** attention/owner is visible without opening the order.
3. **Given** filter pills (e.g. Needs attention, Has owner / Unowned, or similar), **When** a pill is selected, **Then** cards and lane counts update client-side.

---

### User Story 2 - Progress toward the next step (Priority: P2)

Cards show progress toward the decisive date (pickup slot / delivery promise / ETA), adapted from sprint % bars—but as ops urgency, not arbitrary completion.

**Why this priority**: Progress bars in the reference map poorly to delivery lanes unless grounded in packet dates.

**Independent Test**: A moving order with a promise/ETA shows a progress/urgency cue; delivered/cancelled show complete or muted state.

**Acceptance Scenarios**:

1. **Given** an order with a decisive window relative to snapshot time, **When** viewing its card, **Then** a progress or urgency indicator reflects time toward that window.
2. **Given** no decisive date, **When** viewing the card, **Then** no fake percentage is invented.

---

### User Story 3 - Keep exception-first product shape (Priority: P1)

Efficiency changes stay on `/lanes`; home remains the exception queue. Lane board must not become the default landing again.

**Why this priority**: Constitution I / prior clarify.

**Independent Test**: `/` is still Needs a person; `/lanes` is browse.

---

### Edge Cases

- Empty lane after filter: calm empty copy in that column.
- Quiet orders: no owner pill spam; show “No owner” only when attention exists.
- Hundreds of cards: filters + sticky tools; do not auto-load infinite detail.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `/lanes` MUST keep operational lane columns (intake → cancelled), not rename them to sprint To-do / In Progress / Complete.
- **FR-002**: Lane headers MUST use coloured status pills + counts inspired by the sprint board.
- **FR-003**: Cards MUST surface assignee/owner when attention names an owner, using a compact coloured pill.
- **FR-004**: Cards SHOULD show a decisive-date progress/urgency cue when a decisive date exists (snapshot-relative).
- **FR-005**: Board MUST offer filter pills above the columns (at least Needs attention; optionally owner presence).
- **FR-006**: Home MUST remain the exception queue; lanes remain secondary.

### Key Entities

- **Lane column**: operational stage with pill tone + count.
- **Lane card**: order summary + optional owner pill + optional progress.
- **Board filter**: client filter over overview cards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ops tester finds a named owner’s attention order on `/lanes` in under 30 seconds using pills/filters without search.
- **SC-002**: With “Needs attention” filter on, quiet orders are hidden in 100% of visible cards.
- **SC-003**: `/` still lands on exception queue after this change.

## Assumptions

- Adapt patterns (pills, progress, denser cards, filters)—do not copy software-sprint taxonomy.
- Owner comes from existing attention/work fields already on board cards where available; do not invent CRM assignees.
- Progress is derived from decisive dates already on `BoardCard`, not a new stored %.
