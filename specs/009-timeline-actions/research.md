# Research: Timeline Action Column

## Decision: Four-column row grid — icon | main | meta (time) | actions

**Rationale**: Far-right dedicated action column aligns Approve/Reject vertically; time stays scannable above or in adjacent meta without burying buttons in body.

**Alternatives considered**: Actions under body (current—fails vertical scan); absolute position buttons (fragile).

## Decision: Approve = solid `--green` / green-ink; Reject = outline hair border

**Rationale**: Ops taste; green = go/approve; outline = secondary. Avoid purple/blue novelty per product bias rules; teal reserved for links.

**Alternatives considered**: Ink-black primary (less “approve” semantics); red Reject solid (too alarmist for routine reject).

## Decision: Utility controls under main

**Rationale**: View steps / Open in Prior agent work are not “clear the queue” actions; keep them quieter under content (FR-004).

**Alternatives considered**: All buttons in right column (crowds decisive actions).
