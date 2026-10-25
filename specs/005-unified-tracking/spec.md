# Feature Specification: Unified Order Tracking

**Feature Branch**: `005-unified-tracking`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "How can I combine Conversations, Needs a person, Activity, and agent work so that it is unified in one place, easy to track." Follow-up: retain timestamps; type of activity (cheap work or not); progress; agent involvement; source and destination of interaction/conversation or activity; and the result of each.

## Clarifications

### Session 2026-10-24

- Q: For agent work in the unified Timeline, what should each row represent? → A: One row per agent run or proposal; cheap steps summarized in that row (or expanded), result on the same thread
- Q: What should happen to the longer Conversations, Prior agent work, and Activity sections that still sit below the Timeline? → A: Keep them below, collapsed by default; Timeline remains the primary tracker
- Q: What label should the Timeline filter use for attention items that still need a human? → A: Use “Needs a person” on the Timeline pill (and matching tags)
- Q: When someone opens a conversation from the Timeline, how should they see the full messages? → A: Expand full (or recent) messages inline on the Timeline row; optional link to provenance fold

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One place to track the order story (Priority: P1)

An ops person opens an order and uses a **single unified Timeline** as the primary place to track what needs a person, what was said in conversations, what the agent has done or proposed, and what else happened (activity)—without hunting across four separate mental models first.

**Why this priority**: Constitution “enough to decide in a few seconds”; today’s Combined Timeline already lists these streams but still feels fragmented (confusing counts, weak default, competing sections below).

**Independent Test**: Open an order that has attention, a conversation, agent work, and activity; the person can answer “what needs me?”, “what did people say?”, “what did the agent propose?”, and “what else happened?” using only the unified Timeline and its filters.

**Acceptance Scenarios**:

1. **Given** an order with items in all four streams, **When** the person opens the order, **Then** the unified Timeline is above the deep-detail folds and clearly presents those streams as one trackable list with filter pills for Needs a person, Conversations, Agent work, Activity (and Everything).
2. **Given** the Timeline is visible, **When** the person switches pills, **Then** the list shows only that stream (or everything), and the header count matches what is currently shown without looking like a typo or orphaned number.
3. **Given** something still needs a person (attention and/or pending agent proposal), **When** the order opens, **Then** the Timeline defaults to a filter that surfaces that work first (Needs a person / attention-first), not a quieter stream such as Conversations-only.

---

### User Story 2 - Every entry keeps the tracking fields (Priority: P1)

While scanning the unified list, each row retains enough structure to track work over time: **when** it happened, **what kind** of work it was (cheap legwork vs consequential / needs approval), **progress** of that item, whether an **agent** was involved, **who it was from and to** (source and destination of the interaction or activity), and **what resulted**.

**Why this priority**: Unification without these fields loses the ops story; the user called them out as must-retain.

**Independent Test**: Pick three Timeline rows of different types (conversation, agent work, activity); for each, the tester can name timestamp, work kind (cheap or not), progress, agent involvement (yes/no/role), from→to parties, and result/outcome without opening a second primary panel.

**Acceptance Scenarios**:

1. **Given** any Timeline row, **When** viewing it in the unified list, **Then** a clear **timestamp** is visible (absolute and, when useful, relative to the snapshot).
2. **Given** a row that represents agent or ops work, **When** viewing it, **Then** its **activity type** distinguishes **cheap work** (read, ask, look up, gather) from **consequential / gated** work (booking, date, cost, or customer-message changes that need a person)—or states “not classified” only when the source record truly has no such notion.
3. **Given** a row that is in progress or waiting, **When** viewing it, **Then** **progress** is visible (e.g. open, in progress, waiting on person, waiting on counterparty, completed, failed)—not only a static headline.
4. **Given** any row, **When** viewing it, **Then** **agent involvement** is explicit (none / agent assisted / agent proposed / agent applied after approval, as applicable).
5. **Given** a conversation or directed activity, **When** viewing it, **Then** **source and destination** of the interaction are visible (e.g. driver → support desk, agent → ops, system → order)—not only a free-text blurb.
6. **Given** a finished or decided item, **When** viewing it, **Then** the **result** is visible (e.g. proposal pending, approved, rejected, failed, message sent to driver, no booking yet, resolved, still open).
7. **Given** an agent run with multiple cheap tool steps and a proposal, **When** viewing Agent work, **Then** there is **one** top-level row for that run/proposal; cheap steps appear in summary or expand on that row; the result reflects the proposal/run outcome.

---

### User Story 3 - Easy to see status and next step (Priority: P1)

While scanning the unified list, the person can tell at a glance which rows still need action versus settled history, and can jump to the decision (e.g. agent proposal) without losing the thread of the story.

**Why this priority**: “Easy to track” fails if every row looks the same.

**Independent Test**: On an order with a pending agent proposal and an open conversation tagged needs attention, both cues are visible in the unified list under the appropriate filters within a few seconds.

**Acceptance Scenarios**:

1. **Given** a pending agent proposal, **When** viewing Agent work (or Everything / Needs a person when flagged), **Then** the row shows a clear waiting-for-person / proposal status distinct from completed agent history, with result = awaiting review.
2. **Given** an open conversation that needs attention, **When** viewing Conversations or Needs a person, **Then** the row shows open / needs-attention progress, from→to parties, and enough result/meta to decide whether to open the thread.
3. **Given** the person needs the full thread or provenance, **When** they expand a conversation row on the Timeline, **Then** messages appear **inline** under that row (full thread or a clear “recent + show all”); an optional control may open the matching collapsed Conversations fold below for provenance.

---

### User Story 4 - Arrive from exceptions already oriented (Priority: P2)

From the exception queue (“Needs a person”), opening an order lands the person in the unified Timeline oriented to why it was on the queue (attention / agent waiting), so tracking continues in the same language as the home list.

**Why this priority**: Closes the loop between home triage and order tracking.

**Independent Test**: From an exception item, open the order; Timeline is visible and not stuck on an unrelated empty-feeling filter when attention exists.

**Acceptance Scenarios**:

1. **Given** an exception-queue item opened into its order, **When** the record loads, **Then** the unified Timeline is in view (above the fold or immediately under the situation header) and defaults to the attention-oriented filter when attention exists.
2. **Given** no attention remains but history exists, **When** the order opens, **Then** Everything (or the richest non-empty stream) is shown with a calm empty Needs a person state available via its pill.

---

### Edge Cases

- Only one stream populated: pills still show zeros for empty streams; empty filter shows calm copy, not a blank box.
- Many activity events: Everything remains scannable (ordering + density); Activity filter isolates noise.
- Agent failed run: visible as failed **result**, with timestamp and agent involvement retained.
- Cheap-work-only agent steps (lookups, asks): retained **inside** the parent run/proposal row (summary or expand)—not omitted, and not each forced as its own top-level Timeline row.
- Missing from/to on system events: show a calm fallback (e.g. “System → order”) rather than inventing people.
- Duplicate content below Timeline: deep Conversations / Prior agent work / Activity sections remain but start **collapsed**; expanding them is optional provenance, not the default scan path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The order record MUST provide one **unified Timeline** that combines Needs a person (attention), Conversations, Agent work, and Activity into a single trackable list.
- **FR-002**: The Timeline MUST offer filter pills for Everything, **Needs a person**, Conversations, Agent work, and Activity, each with a stable count of items in that category. The attention filter and equivalent row tags MUST use the label **Needs a person** (not “Needs attention”) so wording matches the exception-queue home.
- **FR-003**: The Timeline header count MUST match the **currently visible** filtered set and be worded so it cannot be mistaken for a product version or error (e.g. avoid a bare “Timeline 1” with no context).
- **FR-004**: When the order has items that need a person (attention and/or pending agent proposal awaiting review), the Timeline MUST **default** to the Needs a person (attention) filter—or an equivalent attention-first view—not Conversations-only.
- **FR-005**: Rows MUST expose tracking cues: needs-attention / open / waiting-for-approval / failed / settled, as applicable to the item type.
- **FR-006**: Agent proposals awaiting a person MUST appear in the unified list under Agent work and under Needs a person when they require human review.
- **FR-007**: Deep-detail sections for Conversations, Prior agent work, and Activity (and equivalent provenance folds) MUST remain below the Timeline for provenance, MUST be **collapsed by default**, and MUST NOT compete as a second primary tracker. Timeline copy MAY point to them as full detail.
- **FR-008**: Opening an order from the exception queue MUST present the unified Timeline without requiring the person to discover a separate Conversations-only or Activity-only panel first.
- **FR-017**: Conversation entries in the Timeline MUST support **inline expansion** of messages (full thread or recent with show-all) so tracking stays in the Timeline; a link to the collapsed Conversations provenance fold is optional.
- **FR-009**: Every Timeline entry MUST retain a **timestamp** (when the interaction or activity occurred or was last material).
- **FR-010**: Every Timeline entry MUST retain an **activity type** that indicates whether the work was **cheap work** (read / ask / look up / gather) or **not cheap** (consequential / approval-gated), when that distinction applies; agent tool steps that are lookups or asks MUST be labelled cheap work. Agent work MUST use **one top-level row per agent run or proposal**; cheap-work steps MUST be summarized on that row (and MAY expand inline), not each as a separate top-level row. The row’s **result** covers the run/proposal outcome (e.g. awaiting review, approved, rejected, failed).
- **FR-011**: Every Timeline entry MUST retain **progress** of that item (e.g. not started, in progress, waiting on person, waiting on counterparty, completed, failed).
- **FR-012**: Every Timeline entry MUST retain **agent involvement** (none, agent performed cheap work, agent proposed, person approved/rejected, applied after approval—as fits the record).
- **FR-013**: Every conversation or directed activity entry MUST retain **source and destination** of the interaction (from → to parties or roles). System-only events MUST still show a clear source/destination pair (e.g. System → order).
- **FR-014**: Every Timeline entry MUST retain the **result** of that interaction or activity (outcome visible in the list: pending review, approved, rejected, failed, answered, still open, no booking, etc.).
- **FR-015**: Unification MUST NOT drop FR-009–FR-014 when merging streams; filters change which rows show, not which fields a row keeps.

### Key Entities

- **Unified Timeline**: Ordered list of tracking entries for one order.
- **Tracking entry**: One conversation thread summary, attention item, **agent run or proposal** (with cheap steps nested/summarized), or activity/event row that always carries:
  - **Timestamp**
  - **Activity type** (cheap work vs not / consequential)
  - **Progress**
  - **Agent involvement**
  - **Source** and **destination** of the interaction or activity
  - **Result** (outcome)
- **Timeline filter**: Everything | **Needs a person** | Conversations | Agent work | Activity (canonical attention label: Needs a person).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a seeded messy order (attention + conversation + agent + activity), an ops tester can state the next human decision and the latest conversation gist using **only** the unified Timeline (and its pills) in under **45 seconds**.
- **SC-002**: When attention exists, **100%** of cold opens of that order land on the Needs a person (or attention-first) filter—not Conversations-only.
- **SC-003**: Testers do not need a second primary panel to answer “is an agent proposal waiting?”—**100%** of pending proposals are visible via Agent work and/or Needs a person in the Timeline.
- **SC-004**: Timeline header count always equals the number of rows shown for the active filter (spot-check all five pills).
- **SC-005**: For a sample of **10** Timeline rows spanning all four streams, **100%** show timestamp, activity type (cheap or not, or explicit N/A), progress, agent involvement, source→destination, and result without opening a secondary primary panel.
- **SC-006**: On a demo order with an agent run, the tester sees **one** top-level Agent work row for that run/proposal, can identify both cheap-work steps (in summary/expand) and the consequential/gated outcome (result), without a separate top-level row per tool call.

## Assumptions

- Builds on the existing Combined Timeline (feature 002); this feature is about **making unification actually easy to track** (defaults, counts, status cues, retained tracking fields, primary-surface clarity), not inventing a fifth unrelated feed.
- Scope is **per order** (plus orientation when arriving from the exception queue). A separate control-room-wide mega-feed of all conversations across all orders is out of scope unless later specified.
- Provenance folds below the Timeline stay and start **collapsed by default**; they are secondary, not removed.
- Naming: Timeline attention pill and tags use **Needs a person** only (replacing earlier “Needs attention” wording on that control) so home and order stay consistent.
- **Cheap work** follows the constitution: read, ask, look up, gather evidence—does not require approval. **Not cheap** means consequential change (booking, date, cost, customer message) or an explicit decision waiting on a person.
- “Progress” is the state of **that entry**, not a fake percentage on the whole order unless a real decisive window already exists on the row’s subject.
- Source/destination use roles and names already in the packet (driver, support desk, customer, agent, system); do not invent people.
