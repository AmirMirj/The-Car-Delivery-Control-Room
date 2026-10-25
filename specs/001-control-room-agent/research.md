# Research: Control Room + On-Road Agent

## Decision: Extend starter Next.js app in place

**Rationale**: Packet, presenters, attention signals, order record UI, and Docker/seed path already exist; judges expect a runnable app from the packet README style. Building greenfield would burn the hackathon on plumbing.

**Alternatives considered**: Separate agent service + thin UI (more ops cost); Python agent sidecar (split deploy story).

## Decision: Exception queue as `/` ; lanes at `/lanes`

**Rationale**: Clarified home = exception queue. Keep lane board as secondary deliberate browse so packet lane language remains available without violating constitution.

**Alternatives considered**: Filter-only on lanes (rejected in clarify); dual equal home (rejected).

## Decision: Vercel AI SDK tool loop + OpenAI-compatible provider

**Rationale**: Fits Next.js route handlers; structured tools; streaming optional later. Use env `OPENAI_API_KEY` / `OPENAI_BASE_URL`; when unset, use a deterministic scripted “mock LLM” that still calls the same tools so smoke/demo works offline.

**Alternatives considered**: Raw fetch to Responses API; LangGraph (heavier); always-require cloud key (fragile for clone).

## Decision: Qualifying on-road exceptions for auto-run

**Rationale**: Auto-start confirmed (clarify default). Qualify when attention includes incident/on-road style signals (open incidents, moving-car tracking gaps, delay/missed-connection alerts) OR order already has on-road narrative in alerts/work—implemented as a pure function over existing `AttentionItem` + order lane/collections.

**Alternatives considered**: Auto-run all attention orders (too noisy); person-only start (fails brief story).

## Decision: Persist agent runs/messages/mutations in Postgres; keep snapshot seed tables intact

**Rationale**: Starter seed replaces snapshot tables carefully; participant write tables must not block reseed. Store `agent_runs`, `agent_messages`, `agent_proposals_local` (or mirror packet proposals via related_records upsert), and `applied_mutations` separately.

**Alternatives considered**: Only in-memory (lost on refresh); mutate JSONL files (poor multi-reload story).

## Decision: Approval applies synthetic mutations via allowlisted patch ops

**Rationale**: Clarified apply-on-approve in local world. Represent proposals as structured ops (`set_delivery_promise`, `add_order_note`, `record_internal_status`, `draft_customer_message_pending_send`) with policy: customer message drafts never auto-send; contact_customer tool always denied.

**Alternatives considered**: Free-form SQL (unsafe); record-only (rejected in clarify).

## Decision: Mock driver/map/phone tools

**Rationale**: Constitution + brief allow fakes. Tools return scripted replies keyed by order id / incident type for demo reliability.

**Alternatives considered**: Live Twilio/maps (out of scope, real-world risk).
