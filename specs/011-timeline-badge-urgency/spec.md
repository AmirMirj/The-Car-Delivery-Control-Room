# Feature Specification: Timeline Badge Consolidation & Urgency Color

**Feature Branch**: `011-timeline-badge-urgency`

**Created**: 2026-10-25

**Status**: Draft

**Input**: Multiple overlapping badges (“Awaiting review”, “Action required”, “Needs a person”). Consolidate duplicates. Color hierarchy by urgency—bright red/orange only for immediate high-priority intervention; muted/gray for routine or resolved.

## User Scenarios & Testing

### User Story 1 - One status badge per row (Priority: P1)

Ops sees a single meaningful status chip on each Timeline row—not “Awaiting review” plus “Needs a person” together.

**Why this priority**: Overlapping tags add noise without new information.

**Independent Test**: Pending proposal row shows Awaiting review (or equivalent) only—no second Needs a person tag on that row.

**Acceptance Scenarios**:

1. **Given** a pending agent proposal, **When** viewing the row, **Then** one status badge conveys the wait (e.g. Awaiting review) and “Needs a person” is not also shown.
2. **Given** an open conversation that needs a person, **When** viewing the row, **Then** one status badge is shown (e.g. Action required)—not stacked with a duplicate Needs a person tag.
3. **Given** the Timeline filter pills, **When** viewing the filter bar, **Then** the “Needs a person” **filter** label remains (queue language)—only row tags are consolidated.

---

### User Story 2 - Color by urgency (Priority: P1)

Bright saturated red/orange is reserved for critical intervention (e.g. vehicle stopped, ferry sold-out alert). Awaiting review and routine/resolved states use muted or gray tones.

**Independent Test**: Critical attention alert uses bright urgency color; awaiting-review proposal uses a calmer muted chip; completed uses muted/gray-green.

**Acceptance Scenarios**:

1. **Given** a high-urgency attention item (danger/warn attention), **When** viewing its status badge, **Then** it uses a bright critical treatment (red or strong orange).
2. **Given** an awaiting-review agent proposal, **When** viewing its badge, **Then** it uses a muted/elevated treatment—not the same critical red as a stopped-vehicle alert.
3. **Given** completed or neutral activity, **When** viewing, **Then** the badge uses muted/gray (or calm green)—not bright critical colors.

## Requirements

- **FR-001**: Timeline rows MUST show at most one primary status badge; MUST NOT pair “Needs a person” with a status that already implies human wait (Awaiting review / Action required / Failed).
- **FR-002**: Bright saturated critical colors MUST be reserved for high-urgency intervention items (attention with danger/warn, or failed).
- **FR-003**: Awaiting review and in-progress MUST use muted/elevated (not critical) chip colors.
- **FR-004**: Completed / neutral MUST use muted calm colors.
- **FR-005**: Filter pill “Needs a person” unchanged.
- **FR-006**: Birch/ops tokens; no purple novelty.

## Success Criteria

- **SC-001**: On a sample of 5 pending-proposal rows, 0 show both Awaiting review and Needs a person tags.
- **SC-002**: Critical attention badge is visually hotter than awaiting-review badge (spot-check).
- **SC-003**: Approve/Reject and filters still work.

## Assumptions

- Status pill from 006/009 remains the single badge; duplicate Needs a person row tag removed when redundant.
- Urgency derived from category + tone + statusDisplay—no new API.
