# Contract: Unified Timeline UI

## Surface

Order detail page (`/orders/[id]`): **Timeline** remains the primary trackable stream above provenance folds.

## Row must show (when data exists)

| Chip / field | Source |
|--------------|--------|
| Time | `at` (locale short date+time; no broken concatenation) |
| Activity type | `activityType` → Cheap / Consequential / omit if `na` |
| Progress | `progress` |
| Agent | `agentInvolvement` (hide if `none`) |
| From → To | `source` · `destination` |
| Result | `result` |
| Needs a person | tag when `needsPerson` |

## Filters

Pills: Everything | **Needs a person** | Conversations | Agent | Activity  
Default: Needs a person when any matching rows exist; else Everything.

Header: `Timeline · showing {visibleCount}` (not a bare count glued to the title).

## Expand

- Conversation rows: toggle expands messages inline (ThreadMessages pattern).
- Agent rows: toggle expands `cheapSteps` + proposal summary; Review/Apply stay on consequential rows.
- Optional link: “Open in Conversations” / “Open in Prior agent work” scrolls to folded section.

## Provenance folds

Conversations, Prior agent work, Activity (and equivalent) **collapsed by default**. Timeline remains expanded as primary.

## Non-goals

No new HTTP endpoints for this feature; presentation + existing order/agent payloads only.
