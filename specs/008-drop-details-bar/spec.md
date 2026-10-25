# Feature Specification: Drop Residual Timeline Details Bar

**Feature Branch**: `008-drop-details-bar`

**Created**: 2026-10-25

**Status**: Draft

**Input**: Remove the residual Timeline “Show details / Hide details” beige chip bar (Waiting on person · routing · Needs a person) that duplicates status already on the row.

## User Scenarios & Testing

### User Story 1 - No duplicate chip strip (Priority: P1)

Ops scanning the Timeline no longer opens a second bar of chips that repeat status and routing already visible on the row.

**Independent Test**: No “Show details” / “Hide details” control; no beige `.timeline-details` chip strip on conversation or agent/attention rows.

**Acceptance Scenarios**:

1. **Given** any Timeline row, **When** viewing it, **Then** there is no expandable details bar of progress/routing/result chips.
2. **Given** the order page, **When** scanning all Timeline filters, **Then** that residual bar does not appear anywhere on the Timeline.

## Requirements

- **FR-001**: Remove Timeline Show/Hide details UI and the details chip panel across Timeline rows (including conversations).
- **FR-002**: Keep collapsed chrome from 006 (status pill + routing + actions / steps / conversation expand). Do not remove those.
- **FR-003**: Present-layer TrackingEntry fields may remain in data; they need not be shown in a details strip.

## Success Criteria

- **SC-001**: Zero instances of the beige details chip bar on the order Timeline.
- **SC-002**: Approve / View agent steps / Open conversation still work.
