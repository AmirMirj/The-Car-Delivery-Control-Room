# Feature Specification: Timeline Polish (Tidy · Informative · Easy)

**Feature Branch**: `006-timeline-polish`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: Polish the unified Timeline after 005: collapse badge explosion to status + routing; structured Issue / Impact / Next body; real inline Approve / Reject / View steps and Open conversation; keep FR tracking fields under Show details; match birch ops layout (hero → Timeline primary → collapsed provenance). Mockup reference: layout preview for after state.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan without badge noise (Priority: P1)

An ops person opens an order and scans the Timeline without reading six overlapping tags per row. Each row shows one clear status and who it is from/to; extra tracking fields are one click away under Show details.

**Why this priority**: Badge explosion blocks “few seconds to decide” (constitution I / V).

**Independent Test**: On a Needs a person row, count visible status/routing chips at a glance (≤2 primary signals + optional Needs a person tag); open Show details and still find activity type, progress, agent involvement, result.

**Acceptance Scenarios**:

1. **Given** an agent proposal awaiting review, **When** viewing the Timeline row collapsed, **Then** the person sees one status such as “Awaiting review” (or Action required) and a routing line (e.g. On-road agent → Ops)—not Consequential + Waiting on person + Agent proposed + result all as equal chips.
2. **Given** the same row, **When** they open Show details, **Then** retained tracking fields from 005 (activity type, progress, agent involvement, source→destination, result) remain available.

---

### User Story 2 - Structured next-step body (Priority: P1)

For attention and agent rows that need a person, the body uses short labeled lines (Issue / Impact or Driver / Next) instead of one undifferentiated paragraph so the person can extract the decision fast.

**Why this priority**: Informative without more chrome.

**Independent Test**: Pick an on-road agent proposal row; identify issue and recommended next step from labeled lines without expanding provenance folds.

**Acceptance Scenarios**:

1. **Given** an on-road agent proposal with summary/decision text, **When** viewing the row, **Then** content is presented as labeled structure (at least Issue and Next, or equivalent), not only a single blob.
2. **Given** an attention/blocker item with detail, **When** viewing the row, **Then** Issue and Impact (or similar) are distinguishable when the source text supports it; otherwise a calm single detail line is fine.

---

### User Story 3 - Real actions on the card (Priority: P1)

Pending agent proposals expose Approve / Reject on the Timeline card (wired to existing review APIs). Conversations expose Open / expand. Cheap steps use “View agent steps (N)”—no fake Call Dealer / Call buttons without a real action.

**Why this priority**: Easy to use = do the next thing without hunting the Agent panel.

**Independent Test**: Approve or Reject from a pending Timeline agent row updates proposal state; conversation expand still works; no decorative phone CTAs.

**Acceptance Scenarios**:

1. **Given** a pending local/on-road proposal on the Timeline, **When** the person clicks Approve or Reject on that row, **Then** the existing review path runs and the Timeline reflects the new status after reload.
2. **Given** a conversation Timeline row, **When** they expand or Open conversation, **Then** messages show inline and/or the Conversations fold opens—no fake contact buttons.
3. **Given** an agent row with cheap steps, **When** they click View agent steps, **Then** nested cheap steps expand on that row.

---

### User Story 4 - Layout hierarchy stays (Priority: P2)

Order page order remains: hero → Timeline (primary) → collapsed provenance folds. No second “Critical issues” band that duplicates Needs a person.

**Why this priority**: Matches agreed layout preview; avoids competing primaries.

**Independent Test**: Visual check against layout: Timeline above folds; Needs a person remains a filter pill only.

**Acceptance Scenarios**:

1. **Given** the order page, **When** loaded, **Then** Timeline is above Conversations / Prior agent work / Activity folds, and those folds start collapsed.
2. **Given** attention exists, **When** cold-opening, **Then** default filter remains Needs a person (from 005)—no extra critical section required.

---

### Edge Cases

- Settled history rows: one calm status (Completed / Failed); no Approve buttons.
- Missing structure in source text: fall back to title + detail without inventing Issue/Impact.
- Duplicate same-thread conversation entries: prefer one thread card (merge if same threadId).
- Record proposals without local review API: show status + Open in Prior agent work; do not invent Approve if no wireable review.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Collapsed Timeline rows MUST show at most one primary **status** badge and one **routing** line (source → destination or assignee); MUST NOT show the full 005 chip stack by default.
- **FR-002**: Full tracking fields from 005 (timestamp, activity type, progress, agent involvement, source/destination, result) MUST remain available via **Show details** (or equivalent expand) so SC-005 intent is preserved.
- **FR-003**: Attention and pending-agent rows SHOULD render structured body labels (Issue / Impact / Next / Driver as applicable) when text can be mapped; otherwise keep a single detail line.
- **FR-004**: Pending proposals that already support review MUST expose **Approve** and **Reject** on the Timeline row, calling the same review endpoints as the Agent panel.
- **FR-005**: Conversation rows MUST keep inline expand; optional control opens the collapsed Conversations fold. MUST NOT add fake Call/Email CTAs without a real product action.
- **FR-006**: Cheap steps remain nested; access via **View agent steps (N)** (or Show details), not as top-level rows.
- **FR-007**: MUST NOT add a separate Critical Issues list that duplicates the Needs a person filter.
- **FR-008**: Visual language MUST stay birch/ops control-room (no dark terminal ASCII skin as the product UI).

### Key Entities

- **Status presentation**: Derived display enum (e.g. action_required | awaiting_review | completed | failed) mapped from progress / needsPerson / result.
- **Structured body**: Optional `{ issue?, impact?, next?, driver? }` parsed or mapped from entry detail/summary for display.
- **Row actions**: Approve / Reject / View steps / Open conversation / Show details—only when backed by real behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a sample of 5 Needs a person rows, collapsed view shows ≤2 primary chrome signals (status + routing) excluding the single Needs a person tag when shown.
- **SC-002**: Show details (or expand) still exposes activity type, progress, agent involvement, and result for those rows.
- **SC-003**: Tester can Approve or Reject a pending on-road proposal from the Timeline without opening a separate primary panel.
- **SC-004**: Order page retains hero → Timeline → collapsed provenance layout with no Critical Issues duplicate band.

## Assumptions

- Builds on 005 unified tracking present model; presentation polish, not a new feed.
- Local/on-road proposal review APIs already exist on the order agent routes.
- Layout reference image is guidance; implementation uses existing CSS tokens.
