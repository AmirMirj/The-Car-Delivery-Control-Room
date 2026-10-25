# Feature Specification: Agent Focus Areas

**Feature Branch**: `013-agent-focus-areas`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Let the AI handle routine, time-consuming tasks (researching, calling, gathering facts) and pass the final choice or purchase to a human. Four buildable agent areas: Pickup Readiness (phone), Driver Travel (route planner), On the Road (incident responder), Driver Support (help desk)."

## Clarifications

### Session 2026-10-25

- Q: Which agent focus area should be the single deep, live agent for this deliverable? → A: Live agents for all four areas (Pickup readiness, Driver travel, On the road, Driver support)—not catalog-only for unused areas.
- Q: When more than one of those four agents could apply to the same order, how should they run? → A: Only the matching agent for the current situation runs (not all four at once; not free-form ops pick as the primary rule).
- Q: How should the product decide which of the four agents matches the current situation? → A: System matches automatically from the order situation.
- Q: If the system cannot tell which focus area matches, what should happen? → A: Pause and ask ops to pick the area once (do not force a default or skip agent entirely without that choice).
- Q: Where should ops see the four agent focus areas named and described? → A: On the order Timeline / agent panel (primary)—not a dedicated catalog page as the main surface.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shared handoff: agent prep, human decision (Priority: P1)

An operations person sees that the agent has done the routine work—calls, lookups, fact-gathering, draft bookings or options—and that the final choice or purchase sits with them. They can approve, reject, or pick among prepared options without redoing the research.

**Why this priority**: This is the product rule for every agent area and the core of “agents do the legwork.”

**Independent Test**: Open an order where the active agent has finished prep work; confirm a clear decision (or short option set) is waiting, with facts the agent gathered, and that completing the decision does not require the person to re-research.

**Acceptance Scenarios**:

1. **Given** the agent has finished routine prep for a case, **When** an ops person opens that order, **Then** they see what was done, what was found, and one clear next decision (or a short set of options)—not a raw dump.
2. **Given** a consequential action (booking change, spend, customer-facing message), **When** the agent reaches that point, **Then** work stops for a person; the agent does not complete the purchase or change on its own.
3. **Given** an ops person decides (approve / reject / choose an option), **When** the decision is recorded, **Then** the order shows the outcome and what happens next.

---

### User Story 2 - All four live agents, each clearly named (Priority: P1)

Ops (and demo viewers) can tell that the control room runs **four live agents**—Pickup readiness, Driver travel, On the road, and Driver support—each with a plain name and one-line job, not a single vague assistant.

**Why this priority**: The team chose live coverage of every focus area; each must be recognizable and distinguishable.

**Independent Test**: From the control room without a tutorial, name all four agents and state each one’s one-line job.

**Acceptance Scenarios**:

1. **Given** an order is open, **When** viewing the Timeline or agent panel, **Then** each of the four focus areas can be identified by plain name and a short job description on those surfaces.
2. **Given** agent work appears on an order, **When** ops reviews it, **Then** they can tell which of the four agents produced that prep or handoff (not an unlabeled “agent”).
3. **Given** a situation that fits one focus area, **When** an agent runs on that order, **Then** only the matching agent for that situation runs—not all four at once.
4. **Given** a clear order situation (e.g. on-road incident), **When** agent work starts, **Then** the system selects the matching focus area automatically without ops first picking an agent.
5. **Given** matching is ambiguous, **When** the system would start an agent, **Then** it pauses and asks ops to pick the focus area once before that agent runs.

---

### User Story 3 - Four live areas with clear agent vs human boundaries (Priority: P2)

A person can understand what each of the four live agents is for and where the human still decides, so demos and daily use stay coherent under the shared prep→decision pattern.

**Why this priority**: Live coverage of all four only works if each area’s job and handoff boundary stay crisp.

**Independent Test**: For each of the four agents, state its goal and what the agent vs human does.

**Acceptance Scenarios**:

1. **Given** Pickup readiness is live, **When** it runs, **Then** it confirms car and paperwork by phone (including menus and callbacks); a person owns any consequential commitment beyond confirmation prep.
2. **Given** Driver travel is live, **When** it runs, **Then** it plans multimodal travel and lodging (e.g. small-town Germany → Helsinki), compares options, and prepares bookings up to—but not past—final payment.
3. **Given** On the road is live, **When** it runs, **Then** it handles breakdowns, missed connections, and delays: gather facts, talk to the driver, propose a path; a person decides.
4. **Given** Driver support is live, **When** it runs, **Then** it answers routine driver questions and escalates hard cases to a person with a short summary and context.

---

### User Story 4 - Area-shaped work on the order (Priority: P2)

Agent activity on an order looks like the responsible area’s job (phone readiness, travel plan, incident response, or help-desk), not a generic “agent ran” blob—and the same prep→human decision pattern applies in every area.

**Why this priority**: Live multi-area coverage is only valuable if each story fits its domain.

**Independent Test**: For a sample order in each area, agent steps and the pending human decision match that area’s story.

**Acceptance Scenarios**:

1. **Given** an On the road incident is in play, **When** viewing the order, **Then** facts from the driver, proposed fix, and waiting human decision are visible and attributed to that agent.
2. **Given** Pickup readiness, Driver travel, or Driver support prep completes, **When** viewing the order, **Then** the same handoff pattern applies with area-specific prep content (calls, itinerary options, FAQ answer + escalate, etc.).

---

### Edge Cases

- Agent cannot reach anyone (no answer on phone, driver offline): show attempt history and a clear next step for a person (retry later, escalate, leave waiting).
- Multiple distinct situations on one order over time: only the agent matching the **current** situation runs at a time; earlier handoffs from other areas remain visible and labeled.
- Ambiguous situation (could fit two areas or none clearly): do not start an agent yet; pause and ask ops to pick the focus area once, then that agent runs; do not force a silent default.
- Person rejects a proposal: agent work stops or returns to “needs a person” with the rejection visible; no silent re-purchase.
- Routine question that turns complex (Driver support): escalate with summary; do not invent a booking change without approval.
- Travel plan with no affordable option: present best-effort options and blockers; still stop before payment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST define exactly four named agent focus areas: Pickup readiness, Driver travel, On the road, and Driver support.
- **FR-002**: Each focus area MUST document: goal, what the agent may do without approval (research, call/ask allowed counterparties, gather facts, prepare options), and what requires a person (final choice, purchase, booking/date/cost changes, customer messages).
- **FR-003**: The control room MUST provide **live agents for all four** focus areas (Pickup readiness, Driver travel, On the road, Driver support), each able to perform area-shaped prep and hand off to a person.
- **FR-003a**: For a given situation on an order, exactly **one** matching focus-area agent MUST run at a time; the product MUST NOT run all four agents in parallel on the same situation.
- **FR-003b**: The system MUST select the matching focus area **automatically** from the order situation (ops does not choose the agent as the primary path).
- **FR-003c**: When automatic matching is ambiguous or unclear, the system MUST pause agent start and ask ops to pick the focus area once; it MUST NOT force a default area or leave the case with no path to start the matching agent.
- **FR-004**: Agent routine work MUST be allowed without human approval when it is limited to reading, asking allowed parties, looking up, and preparing context or draft options.
- **FR-005**: No agent MUST complete a purchase, change a booking/date/cost, or contact a customer without a recorded human decision.
- **FR-006**: When an agent cannot finish, it MUST hand over one clear decision or a short option set plus what it found, labeled by focus area.
- **FR-007**: Ops MUST be able to see, on the order, each agent’s prep trail and any pending human decision, with the producing focus area identified.
- **FR-008**: Pickup readiness MUST attempt contact with seller/pickup, handle phone menus in the simulated world, and schedule or propose callbacks if no one answers.
- **FR-009**: Driver travel MUST plan multimodal legs and stays, compare time/price, and prepare bookings that stop before final payment.
- **FR-010**: On the road MUST gather incident facts, communicate with the driver, and propose a resolution path for a supervisor.
- **FR-011**: Driver support MUST answer routine driver questions and escalate complex issues to a person with a concise issue summary and gathered context.
- **FR-012**: Product language MUST present all four areas as live agents with clear jobs; it MUST NOT imply unused/catalog-only stubs for any of the four.
- **FR-013**: The primary place to name and describe the four focus areas MUST be the order **Timeline / agent panel** (not a dedicated catalog page as the main surface).

### Key Entities

- **Agent focus area**: One of the four domains (id/name, goal, agent-allowed work, human-gated work, example situations).
- **Live focus set**: The four focus areas that each have a live agent in this deployment/demo.
- **Matching situation**: The current order problem or task that selects which one of the four agents is allowed to run now.
- **Agent prep package**: What the agent gathered and did (attempts, facts, options) before handing over.
- **Human decision**: Approve / reject / choose option (or equivalent), recorded against the order and visible afterward.
- **Escalation summary**: Short handoff used especially by Driver support (and any failed/incomplete prep).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a demo walkthrough, a new ops viewer can name all four live agent focus areas and state each one’s one-line job within 60 seconds of opening an order’s Timeline / agent panel.
- **SC-002**: For a completed agent prep case in any of the four areas, an ops person can reach a decision (approve, reject, or pick an option) without leaving the order to re-research, in under 2 minutes in a typical sample case.
- **SC-003**: 100% of sample consequential actions in the demo path stop for a person before purchase or booking/cost change.
- **SC-004**: Each of the four live agents can be explained in one sentence of goal + one sentence of “agent vs human” by a teammate from product language alone.
- **SC-005**: At least one end-to-end story **per focus area** shows: routine work done by that agent → clear handoff → human decision → visible next step.

## Assumptions

- The team explicitly chose **live agents for all four** focus areas (breadth of coverage). Shared handoff rules still apply everywhere; depth may be uneven across areas but none are catalog-only stubs.
- Note: this diverges from the constitution’s “one real agent for one area” preference; product scope follows the clarification session unless the constitution is amended.
- Counterparties agents may contact without being “customers”: drivers and pickup places; anyone who pays Bahn is a customer and stays approval-gated for outreach.
- Phone, travel inventory, ferry prices, driver replies, and similar integrations stay **synthetic / mocked**; flows stop before real payment.
- The control room already surfaces exceptions and order Timeline; this feature layers four-area identity and the shared prep→decision contract onto that surface.
- Coexistence rule: **situation-matched single agent**—only the agent that matches the current situation runs.
- Matching rule: **automatic** selection from the order situation; on ambiguity, **ops picks once** then that agent runs.
- Discoverability: four focus areas are named/described primarily on the order **Timeline / agent panel**.
