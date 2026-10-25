# Feature Specification: Timeline Action Column

**Feature Branch**: `009-timeline-actions`

**Created**: 2026-10-25

**Status**: Draft

**Input**: Row-level action placement — move final actions (Approve / Reject) to the far right of the Timeline row in a standardized action column for vertical scanning. Color-coded actions — primary (Approve) solid colored; secondary (Reject) outlined/softer.

## User Scenarios & Testing

### User Story 1 - Scan and clear down the right edge (Priority: P1)

An ops person works the Needs a person filter by scanning the right side of the Timeline and clicking Approve/Reject without hunting inside each row’s body.

**Why this priority**: Faster clear of waiting items; reduces eye travel.

**Independent Test**: On two pending proposal rows, Approve/Reject sit in a right-hand column aligned across rows; body text stays left.

**Acceptance Scenarios**:

1. **Given** a pending local agent proposal Timeline row, **When** viewing it on desktop, **Then** Approve and Reject appear in a far-right action column (not under the Issue/Next body).
2. **Given** multiple such rows, **When** scanning the list, **Then** the action controls align vertically in that column.

---

### User Story 2 - Primary vs secondary action weight (Priority: P1)

Approve reads as the primary choice (solid fill using calm ops green or teal accent); Reject is outlined / softer so cognitive load is lower.

**Why this priority**: Color coding reduces wrong-click risk and speeds choice.

**Independent Test**: Approve is visually heavier (solid) than Reject (outline or muted); both remain usable and labeled in text (not color-only).

**Acceptance Scenarios**:

1. **Given** Approve and Reject on a row, **When** comparing them, **Then** Approve uses a solid filled style and Reject uses an outlined or softer style.
2. **Given** color-blind or low-contrast viewing, **When** reading the buttons, **Then** labels “Approve” and “Reject” remain visible (color is not the only signal).

---

### User Story 3 - Secondary utilities stay with content (Priority: P2)

“View agent steps” and “Open in Prior agent work” / conversation open remain near the content (or as quieter controls), not competing with the far-right decision column.

**Independent Test**: Far-right column is reserved for decisive actions; utility links are not mixed as equal weight in that column.

## Requirements

- **FR-001**: Pending proposal rows MUST place Approve/Reject in a far-right Timeline **action column**.
- **FR-002**: Approve MUST use solid primary styling; Reject MUST use outlined/secondary styling (birch/ops tokens—prefer green/teal solid for Approve, not purple novelty).
- **FR-003**: Timestamp MAY share the right meta area above or beside actions without pushing actions under the body text.
- **FR-004**: Conversation primary open MAY use the action column when it is the row’s main next step; provenance links stay quieter.
- **FR-005**: Narrow viewports MAY stack the action column under the main content while keeping Approve solid / Reject outlined.
- **FR-006**: Review API behavior unchanged.

## Success Criteria

- **SC-001**: Tester can clear two pending rows by only looking at the right column.
- **SC-002**: Approve and Reject are distinguishable by fill style without reading body text.
- **SC-003**: Approve/Reject still update proposal state after click.

## Assumptions

- Builds on 006 Timeline polish; presentation/CSS + row layout only.
- Local pending proposals only for Approve/Reject (existing wire).
