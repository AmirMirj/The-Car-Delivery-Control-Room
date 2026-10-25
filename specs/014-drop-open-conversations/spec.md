# Feature Specification: Drop “Open in Conversations” Link

**Feature Branch**: `014-drop-open-conversations`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: Remove the Timeline “Open in Conversations” control (underlined ghost link that scrolls/opens the Conversations provenance fold).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - No Conversations jump link on Timeline threads (Priority: P1)

An ops person viewing a conversation row on the Timeline no longer sees an “Open in Conversations” link. They stay on the Timeline (or use existing Open messages / filter actions) without that provenance jump.

**Why this priority**: The link adds noise and duplicates access already available via Timeline actions / folds.

**Independent Test**: Open an order with a conversation Timeline entry; confirm “Open in Conversations” text is absent.

**Acceptance Scenarios**:

1. **Given** a Timeline conversation thread row, **When** viewing the row chrome, **Then** there is no “Open in Conversations” button or link.
2. **Given** other Timeline actions (e.g. Open messages, Approve/Reject where applicable), **When** viewing, **Then** those remain available if they were already present.
3. **Given** the Conversations provenance section elsewhere on the order, **When** viewing the page, **Then** that section may still exist—only the Timeline jump link is removed.

---

### Edge Cases

- Rows that only had that link in `timeline-utils` should not leave an empty awkward button group if nothing else remains there.
- “Open in Prior agent work” (if present on agent rows) is **out of scope** unless explicitly requested later.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Timeline MUST NOT render an “Open in Conversations” control on conversation entries.
- **FR-002**: Removing the control MUST NOT break opening inline messages or other existing Timeline conversation actions.
- **FR-003**: Filter pills, search, and status badges MUST remain unchanged by this feature.

### Key Entities

- **Timeline conversation row**: Existing Timeline UI for `category === "conversation"` entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero instances of the string “Open in Conversations” in the Timeline component UI.
- **SC-002**: Conversation rows still render title, status, routing, and message open controls as before (minus the removed link).

## Assumptions

- Scope is limited to the Timeline ghost link labeled “Open in Conversations”.
- Conversations fold / section elsewhere on the order record stays; only the jump affordance is dropped.
