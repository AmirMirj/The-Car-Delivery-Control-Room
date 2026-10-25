# Feature Specification: Combined Order Timeline

**Feature Branch**: `002-combined-timeline`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "Make a Combined view with filter pills like the Timeline screenshot: Everything / Needs attention / Conversations / Agent work / Activity; list rows with icon, headline, Needs attention tag, owner/status meta, detail, and timestamp; combined view with full details remaining below."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scan one combined timeline (Priority: P1)

An ops person opens an order and sees a **Timeline** section that combines attention items, conversations, agent work, and activity into one chronological (or attention-first) list so they do not jump between separate panels first.

**Why this priority**: Matches the exception-first / “enough to decide” constitution; the screenshot is the product target.

**Independent Test**: Open any order with attention + history; Timeline shows rows and a non-zero count; sections below still exist.

**Acceptance Scenarios**:

1. **Given** an order with attention items, **When** the person opens the record, **Then** they see a Timeline headed “Timeline” with a count and note “Combined view · full details remain below”.
2. **Given** Timeline is visible, **When** they read a row, **Then** they see icon, headline, optional “Needs attention” tag (tone-coloured), owner/status meta, detail text, and timestamp (absolute + relative when available).

---

### User Story 2 - Filter with pills (Priority: P1)

The person filters the timeline with pills: Everything, Needs attention, Conversations, Agent work, Activity — each showing a count. Active pill is high-contrast (filled).

**Why this priority**: Core of the requested UI.

**Independent Test**: Click each pill; list contents and header count match the filter; counts on pills stay stable.

**Acceptance Scenarios**:

1. **Given** Timeline loaded, **When** “Needs attention” is selected, **Then** only attention-class rows show and the Timeline count matches that subset.
2. **Given** “Everything” is selected, **When** viewing the list, **Then** all combined categories appear.
3. **Given** empty filter result, **When** a pill with zero matching rows is selected, **Then** a calm empty state appears (not a blank panel).

---

### User Story 3 - Details remain below (Priority: P2)

Existing order sections (route, conversations, evidence, prior agent work, activity, folds) remain below the Timeline for deep reading; Timeline is a reading aid, not a replacement of provenance sections.

**Why this priority**: Screenshot copy and constitution provenance.

**Independent Test**: Scroll past Timeline; Conversations / Prior agent work / Activity still present.

**Acceptance Scenarios**:

1. **Given** Timeline on the page, **When** scrolling down, **Then** full detail sections remain available unchanged in role.

---

### Edge Cases

- Order with only activity events: Everything and Activity work; Needs attention empty-state.
- Duplicate-looking rows (attention derived from same proposal): prefer distinct keys; do not crash.
- Missing timestamps: still show row; side time may be blank or “—”.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Order record MUST show a Combined Timeline above the detailed sections.
- **FR-002**: Timeline MUST support filter pills: `everything`, `attention`, `conversations`, `agent`, `activity`, each with a live count.
- **FR-003**: Default selected pill MUST be `attention` when any attention rows exist; otherwise `everything`.
- **FR-004**: Attention rows MUST show a “Needs attention” chip with tone from the attention item.
- **FR-005**: Timeline MUST NOT remove or replace provenance-bearing sections below.
- **FR-006**: Timeline presentation MUST stay ops-facing (calm pills, hairline rows, existing brand tokens)—not a developer console.

### Key Entities

- **TimelineEntry**: id, category (`attention`|`conversation`|`agent`|`activity`), icon, title, detail, meta, at, tone, needsAttention flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a sample order with ≥3 attention items, default Timeline filter shows only those items within one glance (no lane board required).
- **SC-002**: Switching pills updates the visible list in under 100ms perceived (client-side filter; no reload).
- **SC-003**: 100% of orders still expose Conversations and Activity sections below Timeline when those records exist.

## Assumptions

- Built into the existing starter order page (`starter/`), not a separate app.
- Entries are derived client- or server-side from existing `RecordView` (attention, threads, proposals, history); no new packet collections required.
- Local on-road agent proposals may also appear under Agent work when present on the page payload.
