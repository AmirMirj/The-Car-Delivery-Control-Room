# Feature Specification: Control Room + On-Road Agent

**Feature Branch**: `001-control-room-agent`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "Specify the Bahn Car Delivery Control Room hackathon solution from the ratified constitution and participant brief: (1) an exception-first control room where people and agents collaborate on deliveries, and (2) one real agent for one area—defaulting to on-the-road incident handling—with approval gates, synthetic data only, and an operations-facing experience."

## Clarifications

### Session 2026-10-24

- Q: Which single agent area should this solution go deep on for the demo? → A: On the road (breakdowns, missed ships, delays; propose next step to a person)
- Q: How should the control room present work by default when an ops person first opens it? → A: Exception queue as home; lanes/browse secondary for deliberate lookup
- Q: After an ops person approves an on-road agent proposal, what should the product do in the demo? → A: Apply approved changes in the synthetic demo world (local state only; still no real purchases)
- Q: When should the on-road agent start working on an incident? → A: Automatically on qualifying on-road exceptions, then person reviews; person can also chat to continue (assumed recommended default when advancing to plan)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Triage what needs a person (Priority: P1)

An operations person opens the control room to an **exception queue** of orders that need human attention, each with a plain-language reason. Quiet orders stay out of the way. Lane or full-catalog browse is available as a secondary path for deliberate lookup. They can open any order and, within a few seconds, understand what happened, who said what and when, what an agent already did, and what decision is next.

**Why this priority**: Judging weights the control room at 40%; exception-first triage is the core product promise.

**Independent Test**: With the synthetic order set loaded, an ops person can filter or land on “needs a person,” open three such orders, and correctly state the next decision for each without digging through unrelated forms.

**Acceptance Scenarios**:

1. **Given** the synthetic snapshot of ~100 orders, **When** an ops person opens the control room, **Then** the home view is the exception queue (not a lane board), and each item shows why a person is needed.
2. **Given** an order with open alerts, unresolved work, or pending agent proposals, **When** the person opens that order, **Then** they see a short situation summary, recent conversation/activity, agent work so far, and a clear next decision or empty “nothing waiting” state that names what was checked.
3. **Given** a quiet order with no attention signals, **When** the person is on the home exception queue, **Then** that order is absent unless they use search or a secondary lanes/browse view.

---

### User Story 2 - Decide with provenance (Priority: P1)

When reviewing an order, the ops person can see where each important fact came from (message, alert, booking, quote, document, event) and distinguish quotes from bookings, alerts as reasons to look from diagnoses, and agent proposals from approved outcomes.

**Why this priority**: Judges ask whether every fact’s source is visible; messy packet data makes provenance mandatory.

**Independent Test**: On a chosen messy order (conflicting address vs message, or ferry quote not booked), the person can point to the source of each conflicting claim without leaving the order view.

**Acceptance Scenarios**:

1. **Given** an order where a message disagrees with a stored address, **When** the person views the order, **Then** both claims are visible with their sources and neither is silently “won.”
2. **Given** a ferry or travel quote that is not a booking, **When** the person views travel/cost context, **Then** the quote is labelled as not booked.
3. **Given** an agent proposal pending review, **When** the person views prior agent work, **Then** proposal status (pending/approved/rejected/failed) and review outcome are clear.

---

### User Story 3 - Approve or redirect agent proposals (Priority: P1)

After the on-road agent gathers facts (driver safety, location, evidence, vehicle/order context), it presents one clear decision (or a short option set). The ops person accepts it, changes it, or tells the agent what to do instead. Consequential changes (booking, date, cost, customer message) never apply without that approval. The agent never contacts a paying customer on its own.

**Why this priority**: Constitution non-negotiable; demonstrates human–agent collaboration for judging.

**Independent Test**: Run a demo incident on a moving-car order; verify the agent’s proposed next step appears for approval, approving records the decision and next action, and rejecting/editing does not silently apply the original proposal.

**Acceptance Scenarios**:

1. **Given** a driver reports a roadside issue (e.g. warning light), **When** the agent finishes cheap work, **Then** an ops person sees one decision with gathered context (safety, location, evidence, car/order facts) before any consequential change.
2. **Given** a pending proposal that would change a date, cost, booking, or customer-facing message, **When** the person has not approved, **Then** the system has not applied that change.
3. **Given** the person approves a proposal, **When** the decision is saved, **Then** the approved changes are applied in the synthetic demo world (local state only; no real purchases) and the order view reflects the new state and next step.
4. **Given** the person rejects or edits a proposal, **When** they save their decision, **Then** the recorded outcome reflects their choice, unapproved mutations are not applied, and the next step is clear.
5. **Given** any agent run, **When** outbound contact is considered, **Then** drivers and pickup places may be contacted under the product rules, but paying customers are never contacted autonomously.

---

### User Story 4 - Talk to the on-road agent (Priority: P2)

An ops person can converse with the real on-road agent about a specific order or incident: ask it to gather more, re-check facts, or explain what it found. The agent uses tools in a loop (lookups, mock driver replies, mock maps/phone as needed) and stays within approval and contact rules.

**Why this priority**: Brief requires a real agent a person can talk to; deepens the demo beyond a static proposal card.

**Independent Test**: From an order with an on-road situation, start a conversation, ask the agent to confirm driver safety and location, and see tool-backed answers appear in the control room without applying unapproved changes.

**Acceptance Scenarios**:

1. **Given** an order with an on-road incident signal, **When** the person asks the agent to gather missing facts, **Then** the agent performs cheap work (read/ask/lookup) and returns updated findings in the room.
2. **Given** the agent needs external information, **When** live systems are unavailable, **Then** mocked or simulated replies are acceptable and clearly part of the demo world.
3. **Given** the person asks the agent to message a paying customer, **When** the agent responds, **Then** it refuses autonomous customer contact and offers an approval-gated path or human handoff instead.

---

### User Story 5 - See collaboration when something goes wrong (Priority: P3)

The control room shows who owns what (person vs agent), how work was handed over, and what happens after failure (retry, escalate, dismiss). Failed or dismissed agent work remains visible with enough context to recover.

**Why this priority**: Brief asks to show handovers and failure paths; supports taste and process narrative in the demo video.

**Independent Test**: Trigger or open a failed/pending proposal and an acknowledged-but-open alert; confirm ownership and next human action are visible.

**Acceptance Scenarios**:

1. **Given** an agent proposal that failed or was dismissed, **When** the person opens the order, **Then** they see the failure/dismissal reason and what is still open.
2. **Given** work handed from agent to person (or back), **When** viewing the order timeline, **Then** the handover is distinguishable from routine events.

---

### Edge Cases

- Order needs a person for multiple independent reasons (several alerts + pending proposal): surface ranked or listed reasons without hiding secondary ones.
- Snapshot has no live clock: relative times and “needs attention” must stay consistent with snapshot time, not wall clock alone.
- Agent cannot reach the driver (no reply / mock timeout): still return a decision for the person with what was tried.
- Conflicting sources with equal weight: show conflict; do not invent a winner.
- Empty inbox / no exceptions: calm empty state explaining that nothing in the attention rules is waiting.
- Person browses a non-exception order via search: full record still available; board remains exception-first by default.
- Proposal would contact a customer: blocked pending explicit human action; never silent send.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present an operations control room whose **default home view is an exception queue** of orders that need a person, each with a human-readable reason derived from attention signals (open alerts, unresolved work/incidents, open conversations, pending/failed proposals, related support threads, and similar packet-backed signals). Lane board or full-catalog browse MUST be secondary, not the landing view.
- **FR-002**: System MUST let an ops person open any order and see situation summary, conversations/messages with channel context, evidence/documents when present, agent work and proposals, and recent history within a short read (target: under ~30 seconds for an experienced user).
- **FR-003**: System MUST keep facts traceable to underlying records; UI labels MUST NOT erase source distinctions (e.g. quote vs booking, alert vs diagnosis).
- **FR-004**: System MUST provide one real on-road agent: a language model operating in a tool-using loop that a person can talk to about roadside incidents, delays, and missed connections.
- **FR-005**: The on-road agent MUST do cheap work first (read order context, ask the driver via allowed channels/mocks, look up vehicle/order facts, request evidence such as a photo description) before escalating.
- **FR-006**: When the agent cannot finish alone, it MUST present one clear decision or a short option set with gathered context for human approval.
- **FR-007**: System MUST require human approval before applying changes to bookings, dates, costs, or messages to paying customers.
- **FR-008**: Agent MUST NEVER autonomously contact a paying customer; drivers and pickup places MAY be contacted.
- **FR-009**: Questions and lookups MUST NOT require approval.
- **FR-010**: System MUST record proposal outcomes (pending, approved, rejected/edited, failed) so the room shows what happens next after a human decision.
- **FR-016**: After approval, System MUST apply the approved changes in the synthetic demo world (local state only) so the order reflects the new facts; it MUST NOT perform real-world purchases or live bookings.
- **FR-011**: Control room MUST be understandable to non-engineers without a tutorial for the primary triage and decide flows.
- **FR-012**: All demo data and contacts MUST remain synthetic; no real people, messages, or purchases.
- **FR-013**: System MUST support search/browse to find orders by familiar identifiers (reference, plate, customer, vehicle, place) without abandoning exception-first defaults.
- **FR-014**: System MUST show collaboration cues: who acted (person vs agent), handovers, and failure/recovery paths for agent work on the focused area.
- **FR-015**: External phone, map, pricing, and driver reply integrations MAY be simulated; the agent loop itself MUST still be real.
- **FR-017**: System MUST start the on-road agent automatically for qualifying on-road exceptions so cheap work and a proposal exist before (or as) the person opens the order; the person MUST also be able to continue via chat.

### Key Entities

- **Order**: A car delivery job; lane/status, route endpoints, promises/slots, attention signals, linked people and vehicle.
- **Ops person**: Human decision-maker in the control room (demo assumes a single trusted ops role).
- **Agent proposal**: Suggested action or decision from the on-road agent, with status and review outcome.
- **Attention item**: Derived reason a person is needed (from alerts, work, conversations, proposals, etc.).
- **Conversation / message**: Threaded communication with channel and participants; may disagree with stored fields.
- **Alert / work item / event**: Operational signals and history used for provenance and timeline.
- **Travel quote vs booking**: Distinct entities; quotes are not bookings.
- **Driver / pickup place / customer**: Actors with different contact rules (customer = payer; no autonomous agent contact).
- **Attachment / evidence**: Documents or photos linked to an order for incident proof.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a timed review of 5 exception orders, an ops-familiar tester correctly states the next decision for at least 4 of 5 within 30 seconds each after opening the order.
- **SC-002**: At least 90% of board-visible “needs a person” cards show a non-empty plain-language reason.
- **SC-003**: In the demo incident path, 100% of booking/date/cost/customer-message changes require an explicit human approve/edit/reject before taking effect; after approve, the synthetic order state reflects those changes without any real-world purchase.
- **SC-004**: A non-engineer tester completes triage → open order → approve or reject a proposal without trainer intervention in under 5 minutes on first use.
- **SC-005**: For the scripted on-road scenario, the agent produces a structured handover (context + decision) before human review in under 3 minutes of wall time in the demo environment.
- **SC-006**: Spot-check of 3 messy orders: reviewers can identify the source record for each highlighted conflicting fact without leaving the product.
- **SC-007**: Zero autonomous customer-contact actions occur in demo scripts and automated smoke checks of agent tools.

## Assumptions

- Feature description was inferred from the ratified constitution and Bahn hackathon brief because `/speckit-specify` was invoked without a separate free-text body.
- The single deep agent area is confirmed as **on the road** (breakdowns, missed ships, delays). Pickup readiness, driver travel, and driver support agents are out of scope for this feature.
- The existing optional starter experience and synthetic packet (~100 orders, attachments, proposals) are the baseline world; packet semantics MUST be preserved. The starter lane board MUST NOT be the default home; exception queue is home, with lanes/browse secondary if retained.
- Demo authentication is out of scope: a single local ops user is assumed.
- Live telephony, payments, and real ferry booking are out of scope; mocks/simulations are expected. Approved mutations update local synthetic state only.
- “Needs a person” mirrors starter attention ideas unless product choices narrow or extend them during planning.
- Judging narrative (how the team worked with coding agents) is a process deliverable, not a product feature in this spec.
