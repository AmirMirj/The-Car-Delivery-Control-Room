# Contract: Timeline Polish UI

## Collapsed row (default)

| Element | Required |
|---------|----------|
| Title | yes |
| Time | when `at` set |
| **One** status pill | yes (from StatusDisplay) |
| Routing line `source → destination` | yes |
| Needs a person tag | only if needsPerson |
| Structured body labels | when StructuredBody has any field; else detail |
| Action row | when actions apply |

MUST NOT show activityType / progress / agentInvolvement / result as equal sibling chips by default.

## Expanded: Show details

MUST reveal: activity type, progress, agent involvement, source→destination, result (005 fields).

## Expanded: View agent steps

Lists `cheapSteps` (name + result).

## Actions

- **Approve** / **Reject**: POST existing review route for pending local proposal; disable while busy; reload order on success.
- **Open conversation**: expand inline messages and/or open `#conversations` fold.
- No Call Dealer / Email unless a real product handler exists (none in scope).

## Layout

Hero → Timeline → collapsed provenance. Filter pills unchanged (Needs a person label). No Critical Issues section.
