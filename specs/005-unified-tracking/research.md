# Research: Unified Order Tracking

## Decision: Extend TimelineEntry with explicit tracking fields

**Rationale**: Spec FR-009–015 require timestamp, activity type, progress, agent involvement, source/destination, result on every row. Today many of these are smashed into `meta`/`detail` strings. Structured fields enable consistent UI chips and SC-005 checks.

**Alternatives considered**: Keep free-text meta only (fails testability); duplicate a second “tracker” component (violates one-place rule).

## Decision: One Timeline row per agent run/proposal; nest cheap steps

**Rationale**: Clarification B. Load run messages/tool steps when expanding the agent row (from local agent state or proposal trail already on the page). Top-level list stays scannable.

**Alternatives considered**: One row per tool call (noisy); hide cheap steps (rejected by retain-fields).

## Decision: Default filter = Needs a person; rename pill

**Rationale**: Clarification A + FR-004. Update `defaultTimelineFilter` to prefer attention when counts.attention > 0 **or** pending agent proposals; label pill “Needs a person”. Header: “Timeline · showing N” (or equivalent) instead of bare “Timeline N”.

**Alternatives considered**: Keep Conversations-first default (fails SC-002).

## Decision: Provenance folds collapsed by default

**Rationale**: Clarification B. Order detail accordion sections for Conversations, Prior agent work, Activity (and similar) start closed; Timeline note points to them.

**Alternatives considered**: Remove sections (hurts provenance); leave expanded (two primaries).

## Decision: Inline conversation expand via existing ThreadMessages

**Rationale**: Clarification A. Timeline already force-opens threads for some filters; make expand user-controlled by default, with optional “Open in Conversations below” anchor to `#` fold id.

**Alternatives considered**: Side panel (extra chrome); only scroll to fold (slower tracking).
