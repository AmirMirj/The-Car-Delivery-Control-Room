# Feature Specification: All-Orders Agent Coverage

**Feature Branch**: `004-all-orders-agent`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "for all orders" (with brief context: one real agent for one area—cheap work first; finish or bring a clear decision; example areas include pickup readiness by phone, driver travel, on the road, driver support)

## Clarifications

### Session 2026-10-24

- Q: How should the fleet-wide agent pass start for qualifying orders? → A: Explicit control (“Run for all qualifying”); per-order auto-run on the exception queue can stay as today
- Q: When a fleet pass hits an order that already has a pending agent proposal, what should it do? → A: Always skip; leave the pending proposal; note the order as skipped in fleet progress
- Q: Where should the “Run for all qualifying” control and fleet-pass progress appear? → A: Exception home for control + full progress; all-orders browse also shows pass progress / status summary
- Q: What should happen if the ops person tries to start another fleet pass while one is already running? → A: Block; disable “Run” while a pass is in progress; show that one is already running

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent covers the full order set (Priority: P1)

An operations person expects the control room’s real agent to evaluate **every order in the synthetic snapshot** that qualifies for its focus area—not only the order currently open, and not only those already on the exception home list. Quiet orders stay quiet; qualifying ones get cheap work first (read, ask, look up), then either a finished routine step or one clear decision for a person.

**Why this priority**: “For all orders” closes the gap between single-order agent demos and a control room that keeps the whole fleet moving.

**Independent Test**: With the full snapshot loaded, after a fleet pass, every qualifying order shows agent activity or a pending decision; non-qualifying quiet orders show no invented agent noise.

**Acceptance Scenarios**:

1. **Given** ~100 synthetic orders including several that qualify for the agent’s area and many that do not, **When** an ops person starts an explicit fleet pass (“Run for all qualifying”), **Then** each qualifying order has an updated agent run/proposal/status, and non-qualifying orders are unchanged.
2. **Given** a qualifying order that is not yet on the exception queue but meets the agent’s rules, **When** the fleet pass completes, **Then** that order either gains a clear next decision for a person or a completed cheap step with a visible trail—without requiring the person to open that order first.
3. **Given** a quiet order with no qualifying signals, **When** the fleet pass runs, **Then** the agent does not invent work or spam proposals for that order.

---

### User Story 2 - See agent status wherever all orders are browsed (Priority: P1)

When browsing **all orders** (secondary lane/browse view) or the exception queue, the ops person can spot which orders already have agent work in progress, a proposal waiting, or a completed handoff—without opening every card.

**Why this priority**: Fleet coverage is useless if status only appears after opening each record.

**Independent Test**: On the all-orders browse view, cards or list rows for orders with pending agent proposals show a clear status cue; opening one matches the cue.

**Acceptance Scenarios**:

1. **Given** at least one order with a pending agent proposal and one with none, **When** viewing the all-orders browse (by lane), **Then** the pending proposal is visible as a status cue on that card without opening the order.
2. **Given** the same pending proposal, **When** viewing the exception queue, **Then** that order still appears with why a person is needed, including agent-waiting context when that is the reason.
3. **Given** home remains the exception queue, **When** the person uses all-orders browse, **Then** that browse stays secondary (link/nav), not the new default landing, and may show a progress/status summary for the latest or in-flight fleet pass without hosting the primary “Run for all qualifying” control.

---

### User Story 3 - Same rules, many orders (Priority: P1)

Across all orders, the agent still follows the brief’s pattern: cheap work first; finish or bring a clear decision. It never contacts a paying customer on its own. Consequential changes (booking, date, cost, customer message) still require a person’s approval. Drivers and pickup places may be contacted when the area allows. Approving a proposal applies only in the synthetic demo world.

**Why this priority**: Scaling to all orders must not weaken non-negotiable safety rules.

**Independent Test**: From two different qualifying orders after a fleet pass, approve one proposal and reject another; only the approved synthetic change applies; no customer contact occurs without approval.

**Acceptance Scenarios**:

1. **Given** pending proposals on two orders after a fleet pass, **When** the person approves one and rejects the other, **Then** only the approved order’s synthetic state changes, and both outcomes are recorded.
2. **Given** any agent run on any order, **When** inspecting its trail, **Then** cheap lookups/asks appear before any consequential proposal, and customer-facing contact is absent unless a person approved it.
3. **Given** a fleet pass in progress or completed, **When** a run fails for one order, **Then** other orders still complete; the failure is visible on that order without blocking the whole fleet.

---

### Edge Cases

- No qualifying orders in the snapshot: calm empty outcome (“nothing for the agent”); no error wall.
- Partially failed fleet pass: per-order failure visible; remaining orders processed.
- Order already has a pending proposal: fleet pass **skips** that order, leaves the pending proposal unchanged, and records it as skipped in fleet progress (never supersedes silently).
- Person opens an order mid-pass: live or refreshable status; no corrupt double-write of the same proposal.
- Extremely busy snapshot: pass may be paced or batched, but progress remains understandable (how many done / remaining).
- Second “Run for all qualifying” while a pass is in progress: control stays disabled; calm message that a pass is already running; no queued or parallel second pass.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide an explicit **“Run for all qualifying”** control that runs the real agent’s cheap-work-first loop across **all qualifying orders** in the current synthetic snapshot (fleet pass), not only the single open order. Per-order auto-run on the exception queue MAY remain as today; a fleet pass MUST NOT start solely because the snapshot loaded or refreshed.
- **FR-002**: Qualification MUST stay tied to the **one** chosen agent area already in force for this project (on the road: breakdowns, missed ships, delays, and related on-road exceptions). Other brief areas (pickup phone, driver travel, driver support) remain out of scope for this feature.
- **FR-003**: Quiet / non-qualifying orders MUST NOT receive fabricated agent work from a fleet pass.
- **FR-004**: All-orders browse (lane board or equivalent) MUST surface agent status cues (idle / working / proposal waiting / failed) for orders that have agent activity.
- **FR-005**: Exception-queue home MUST remain the default landing; all-orders browse stays secondary.
- **FR-006**: Approval gates from the constitution MUST apply identically for every order in a fleet pass (no autonomous customer contact; person approves consequential changes).
- **FR-007**: The explicit **“Run for all qualifying”** control and full fleet-pass progress (counts and per-order outcomes) MUST appear on the **exception-queue home**. The all-orders browse view MUST also show a lighter pass progress / status summary while a pass is running or after the latest pass, without becoming the primary control surface. Starting a fleet pass MUST be available from the exception-queue home; all-orders browse MUST NOT be the only place to start a pass.
- **FR-009**: While a fleet pass is in progress, the product MUST disable starting another pass and MUST show that a pass is already running—no parallel or queued second pass.
- **FR-008**: If an order already has a pending proposal, a fleet pass MUST **skip** that order, leave the proposal unchanged, and count it as skipped in progress—never create a duplicate or silently supersede.

### Key Entities

- **Fleet pass**: One sweep that evaluates all orders in the snapshot for qualification and runs the agent where appropriate.
- **Qualifying order**: An order that meets the on-road agent’s existing attention/lane rules.
- **Agent status (per order)**: Working, proposal waiting, applied, rejected, failed, or none.
- **Proposal**: Decision package for a person; approval applies synthetic change only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After one fleet pass on the seeded snapshot, **100%** of orders that meet on-road qualification rules have either a completed cheap-work trail, a pending proposal, an applied/rejected outcome, or a recorded failure—none are silently skipped without a reason.
- **SC-002**: **0%** of non-qualifying quiet orders gain a new pending proposal from that same pass.
- **SC-003**: An ops tester can identify at least **3** orders with “proposal waiting” from the all-orders browse view in under **30 seconds** without opening each order.
- **SC-004**: Approving a proposal on any order from a fleet pass still never contacts a paying customer without explicit approval, verified on at least two orders.
- **SC-005**: Home remains the exception queue after this feature (verified by opening the product root).

## Assumptions

- “For all orders” means **coverage across the full snapshot** for the existing **on-road** agent, informed by the brief’s cheap-work-first / clear-decision pattern—not implementing all four example agent areas in one feature (constitution: depth over breadth).
- Fleet pass is **explicit only** (“Run for all qualifying”). Per-order auto-run on the exception queue may continue independently; loading the snapshot does not start a fleet pass.
- Synthetic-only world; no real phone purchases, bookings, or customer messages.
- Exception-first constitution stands: fleet coverage must not replace the exception home with a wall of all orders.
