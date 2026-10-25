# Feature Specification: Timeline Cheap Agent Work

**Feature Branch**: `020-timeline-cheap-agent-work`

**Created**: 2026-10-25

**Status**: Implemented

**Input**: User description: "In timeline, there are activities. Can we replace some 'cheap' ones with agent? Or can we add some cheap activity by agents in the middle of them? — specify the changes and reflect them into the document."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent-recorded routine events read as agent work (Priority: P1)

An operator opens an order and scans the Timeline. Events the record already attributes to an agent (for example, a driver offer the dispatch agent published) are shown as **agent cheap work**, not as anonymous system activity. The operator can see at a glance which routine steps the agent already took care of.

**Why this priority**: The record already says an agent did this work. Showing it as plain "Activity" hides the agents doing the legwork (Constitution II) and undersells the control room's main idea.

**Independent Test**: Open an order with a published driver offer. Confirm that the row appears under "Agent work", names the agent as source, carries an "Agent · cheap" label, and no longer appears under "Activity".

**Acceptance Scenarios**:

1. **Given** an order whose history contains an event recorded by an agent, **When** the operator views the Timeline under "Everything", **Then** that event shows an agent icon, the agent's name as source, and an "Agent · cheap" label instead of a status badge.
2. **Given** the same order, **When** the operator selects the "Agent work" filter, **Then** the agent-recorded event is included and the "Activity" count no longer includes it.
3. **Given** an event recorded by a driver, operator, customer, or system, **When** the operator views the Timeline, **Then** the event stays under "Activity" unchanged.

---

### User Story 2 - Cheap agent checks appear between the events they follow (Priority: P1)

When a driver submits proof photos, submits a cost claim, a vehicle is delivered, or an alert is raised, a short **read-only agent check** appears right above that event in the Timeline. It says in one line what the agent checked and what it found (for example: "4 files received · queued for operator approval", "1 receipt attached to the toll claim · ready for review", "Linked conversation to the alert", "keys received · receiver recorded").

**Why this priority**: This shows agents doing cheap work first (read, look up, gather evidence) before a person gets involved, right where it happens in the order's story. It does this without adding urgency or noise.

**Independent Test**: Open an order with proof, claim, delivery, or alert events. Confirm that each one has exactly one agent check row directly above it, with the same time, and that "Needs a person" does not change.

**Acceptance Scenarios**:

1. **Given** a proof submission with N files, **When** the Timeline renders, **Then** an "Agent checked <proof kind>" row shows "N files received · queued for operator approval", or "No files attached · flagged for the driver to resend" when N is 0.
2. **Given** a cost claim with N receipts, **When** the Timeline renders, **Then** an "Agent matched receipt to claim" row shows the receipt count and claim kind, or flags a missing receipt.
3. **Given** an alert raised with linked records, **When** the Timeline renders, **Then** an "Agent gathered alert context" row lists the kinds of linked records (tracking observation, conversation, driver report, proof, pickup window, prior assignment), or "No linked records found · left for the owner".
4. **Given** a delivery event with key or receiver information, **When** the Timeline renders, **Then** an "Agent checked handover record" row reports whether keys were received and whether a receiver was recorded.
5. **Given** any agent check row, **When** the operator reads it, **Then** it says "Read-only check · no change to the order" and never asks for Approve/Reject.

---

### User Story 3 - Cheap work stays visually quiet (Priority: P2)

Agent cheap-work rows look calmer than rows that need a decision: smaller text, tighter spacing, muted detail, and a green "Agent · cheap" label in place of the status badge. The operator's eye still lands first on items that need a person.

**Why this priority**: The brief asks for high signal and low noise. Adding rows must not compete with exceptions.

**Independent Test**: View an order with both a pending proposal or alert and several cheap agent rows. Confirm that the cheap rows are visibly quieter and that urgency badges appear only on rows that need a person or review.

**Acceptance Scenarios**:

1. **Given** a Timeline with cheap agent rows and a row needing a person, **When** the operator scans the list, **Then** only the latter shows an elevated or critical status badge.
2. **Given** the "Needs a person" filter, **When** selected, **Then** no cheap agent rows appear and the count is unchanged from before this feature.

---

### Edge Cases

- An event is missing the field a check depends on (no file count, no receipt count, no key/receiver info): no agent check row is added.
- Several events share the same timestamp: each agent check sorts directly above its own event, not grouped elsewhere.
- An order has no qualifying events: the Timeline looks the same as before. The "Agent work" empty state still reads "No agent work on this order yet."
- An event belongs to a shared bundle order: the agent-recorded label still applies and the shared-bundle note stays in the meta line.
- Sort by urgency: cheap agent rows rank as calm and fall below items needing attention.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Timeline MUST classify any history event whose recorded actor is an agent as agent cheap work. It MUST appear under "Agent work", not "Activity".
- **FR-002**: Agent-recorded events MUST show the agent's name as the source and the result "Done by agent".
- **FR-003**: The Timeline MUST add one read-only agent check row after each proof submission, cost claim submission, alert raised, and vehicle delivery event that carries the data the check needs.
- **FR-004**: Every agent check result MUST be derived only from fields already recorded on its source event. No values may be invented.
- **FR-005**: Agent check rows MUST state that they made no change to the order. They MUST NOT offer Approve/Reject or any other action.
- **FR-006**: Agent check rows MUST share their source event's time and sort directly above it in newest-first order.
- **FR-007**: Agent cheap-work rows MUST NOT count toward "Needs a person". They MUST NOT carry an elevated or critical urgency badge.
- **FR-008**: Agent cheap-work rows MUST show an "Agent · cheap" label instead of a status badge, an agent icon, and a quieter visual style than decision rows.
- **FR-009**: Events recorded by drivers, operators, customers, handoff contacts, or the system MUST stay under "Activity" with unchanged presentation.
- **FR-010**: Filter counts ("Everything", "Agent work", "Activity") MUST reflect the reclassified and added rows.
- **FR-011**: The Activity provenance section, which holds the full event history, MUST keep listing every original event unchanged. Agent checks belong to the Timeline only.

### Key Entities

- **History event**: A recorded operational event on an order, with who recorded it (driver, operator, agent, system, …), what kind of event it is, and when.
- **Agent check**: A read-only follow-up attached to one history event, with a short title ("Agent checked pickup photos") and a one-line result computed from that event's own fields.
- **Timeline entry**: One row in the order tracker. It now also marks agent cheap work, so it can be shown and filtered as such.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a busy order (for example, one with 10+ qualifying events), the operator can tell which steps the agent handled without opening any row. 100% of agent rows are labeled "Agent · cheap".
- **SC-002**: "Needs a person" counts are identical before and after this feature for every order.
- **SC-003**: Every agent check result can be traced to a field on its source event, verifiable for 100% of sampled rows.
- **SC-004**: Agent-recorded routine events (driver offers published by the dispatch agent, about 86 in the dataset) move from "Activity" to "Agent work".
- **SC-005**: In a reviewer walk-through, a non-engineer can explain the difference between cheap agent work and a decision that needs approval after viewing one order for under 30 seconds.

## Assumptions

- "Cheap" means read-only, reversible work that changes no booking, date, cost, or customer message, matching Constitution II/III. Only those checks are added.
- Agent checks are presentation-time readings of existing data. They are not stored as new events, so the source records stay authoritative.
- The generic agent name for checks is "Ops agent". Agent-recorded events use the agent name from the record (for example, "Dispatch agent").
- The qualifying event kinds (proof submitted, expense submitted, alert raised, vehicle delivered) cover the most frequent routine events in the dataset. Others may be added later under the same rules.
- No change to the agent approval flow, proposals, or the on-road agent loop.
