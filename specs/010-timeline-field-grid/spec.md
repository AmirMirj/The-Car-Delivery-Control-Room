# Feature Specification: Timeline Field Grid

**Feature Branch**: `010-timeline-field-grid`

**Created**: 2026-10-25

**Status**: Draft

**Input**: Grid or two-column layout for Timeline structured attributes (Issue / Impact / Driver / Next)—compact, aligned, less vertical height. Stylize field labels muted; values bold/dark so the eye jumps to data.

## User Scenarios & Testing

### User Story 1 - Compact two-column field grid (Priority: P1)

Ops scans a Timeline row and sees Issue / Impact / Driver / Next in a tight two-column grid (pairs side-by-side when space allows) instead of a tall stack of rows.

**Why this priority**: Cuts vertical height; more items visible without scrolling.

**Independent Test**: On an agent/attention row with at least two structured fields, fields appear in a compact grid (two attribute cells per row on desktop), not one field per full-width stacked line only.

**Acceptance Scenarios**:

1. **Given** a row with Issue and Next (and optionally Impact/Driver), **When** viewing on desktop, **Then** attributes use a compact two-column grid layout that reduces height vs a single-column stack of all fields.
2. **Given** only one structured field, **When** viewing, **Then** it still renders cleanly (full width or single cell) without broken layout.

---

### User Story 2 - Muted labels, strong values (Priority: P1)

Labels like “Issue” / “Impact” use lighter muted color; values use darker/bold text so attention hits the content.

**Independent Test**: Labels are visibly quieter than values; values remain readable.

**Acceptance Scenarios**:

1. **Given** structured fields, **When** viewing, **Then** labels use muted/subtle color and are not heavier than values.
2. **Given** the same fields, **When** viewing, **Then** values use standard dark (or bold) text.

## Requirements

- **FR-001**: Structured Timeline body MUST use a compact two-column (or two-up) grid for attribute cells on typical desktop widths.
- **FR-002**: Field labels MUST be muted; values MUST be darker and/or bold.
- **FR-003**: Narrow viewports MAY collapse to one column of label+value pairs without losing label/value contrast.
- **FR-004**: Fallback single detail line (no structured fields) unchanged.
- **FR-005**: Birch/ops tokens only; no purple novelty skins.

## Success Criteria

- **SC-001**: Desktop row with 4 fields uses ≤2 visual rows of attribute cells (2×2), not 4 full stacked blocks.
- **SC-002**: Labels are muted relative to values (spot-check contrast).
- **SC-003**: Timeline actions/status/routing remain intact.

## Assumptions

- Builds on existing `structuredBodyFromEntry` / `timeline-struct` markup; mainly CSS + small markup tweak for field cells.
