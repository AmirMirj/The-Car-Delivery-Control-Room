# Data Model: Control Room + On-Road Agent

## Existing (packet / starter — read-mostly)

- **Order** and linked collections via `related_records` / typed tables (alerts, conversations, messages, work_items, incidents, agent_proposals, time_windows, etc.) as already modeled in `starter/lib/schema.ts` and presenters.
- **AttentionItem** (derived, not stored): kind, tone, title, detail, owner, at, section, recordId.
- **ProposalView** (from packet `agent_proposals`): status, summary, review, execution.

## New entities (participant / demo writable)

### AgentRun

| Field | Rules |
|-------|--------|
| id | UUID / text PK |
| order_id | required, FK-ish to orders.id |
| trigger | enum: `auto_exception` \| `user_chat` \| `user_rerun` |
| status | enum: `running` \| `awaiting_review` \| `completed` \| `failed` |
| started_at / finished_at | timestamptz |
| error | nullable text |
| handover_summary | nullable text — context for person |
| decision_text | nullable text — one decision or short options |

### AgentMessage

| Field | Rules |
|-------|--------|
| id | PK |
| run_id | FK AgentRun |
| order_id | required |
| role | `user` \| `assistant` \| `tool` \| `system` |
| content | text |
| tool_name / tool_payload | nullable JSON for tool rows |
| created_at | timestamptz |

### LocalProposal

| Field | Rules |
|-------|--------|
| id | PK |
| order_id | required |
| run_id | FK AgentRun |
| status | `pending` \| `approved` \| `rejected` \| `edited` \| `failed` |
| title | short text |
| summary | text — what agent found |
| decision | text — proposed next step |
| ops | JSON array of MutationOp (allowlisted) |
| review_note | nullable |
| reviewed_at | nullable |
| created_at | timestamptz |

### MutationOp (embedded JSON)

Allowlisted `type` values only, e.g.:

- `add_order_note` — `{ text }`
- `set_internal_flag` — `{ key, value }`
- `adjust_promise_window` — `{ start, end, timezone }` (synthetic)
- `draft_customer_message` — `{ body }` — **never sends**; status `draft` until human uses a separate send path (out of MVP: store draft only)
- `record_driver_contact` — `{ channel, summary }` — allowed (not customer)

### AppliedMutation

| Field | Rules |
|-------|--------|
| id | PK |
| proposal_id | FK LocalProposal |
| order_id | required |
| op | JSON copy of applied op |
| applied_at | timestamptz |
| applied_by | `ops` (demo single user) |

## Relationships

- Order 1—* AgentRun *—* AgentMessage
- AgentRun 1—* LocalProposal
- LocalProposal 1—* AppliedMutation (on approve)

## State transitions

```text
AgentRun: running → awaiting_review | failed
          awaiting_review → completed (after review recorded)

LocalProposal: pending → approved | rejected | edited
               approved → (ops applied) ; failed if apply errors
```

## Validation rules

- No MutationOp may imply autonomous customer contact/send.
- Approve without pending proposal → reject.
- Auto-run at most one **active** run per order (running/awaiting_review); new chat continues same or starts `user_chat` child run linked by order.
- Qualifying exception predicate must be pure and testable.
