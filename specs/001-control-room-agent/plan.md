# Implementation Plan: Control Room + On-Road Agent

**Branch**: `001-control-room-agent` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-control-room-agent/spec.md`

## Summary

Evolve the existing `starter/` Next.js control room into an **exception-queue-first** operations surface and add one **real on-road agent** (LLM tool loop) that auto-runs on qualifying roadside/delay exceptions, gathers facts via mocks, proposes a decision for human approval, and on approve applies **synthetic local mutations** only. Preserve packet semantics and provenance; never autonomously contact paying customers.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 24+ (starter already requires Node 24)

**Primary Dependencies**: Next.js 16 (App Router), React 19, Drizzle ORM, `postgres`, existing starter presenters; add Vercel AI SDK (`ai` + `@ai-sdk/openai` or compatible) for the agent loop; optional `OPENAI_API_KEY` with deterministic mock-LLM fallback for offline demo

**Storage**: PostgreSQL 17 (Docker Compose in starter) + local S3-compatible attachments (RustFS); new tables for agent runs, chat turns, and applied mutation audit—without breaking seed replace rules (participant tables kept separate from snapshot wipe where required)

**Testing**: Existing `npm run smoke` / `attachments:smoke` / `typecheck`; extend smoke for exception queue + proposal approve path; no full TDD suite required by spec

**Target Platform**: Local web app (localhost:3000) for hackathon demo

**Project Type**: Web application (Next.js fullstack in `starter/`)

**Performance Goals**: Order open readable in ~30s human time; agent structured handover under 3 minutes wall time in demo; overview/exception list responsive for ~100 orders

**Constraints**: Constitution gates (approvals, no autonomous customer contact, synthetic-only, ops UI not eng tooling); starter lane board must not be default home; mocks for phone/map/driver

**Scale/Scope**: ~100 synthetic orders; one agent domain (on-road); single local ops user; demo video + runnable README path

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Plan compliance |
|-----------|-----------------|
| I. Exception-First Control Room | Home = exception queue; lanes secondary; reasons + provenance retained |
| II. Agents Do the Legwork | Auto cheap-work loop → one decision; chat for follow-up |
| III. Human Approval Before Change | Approve API gates mutations; customer contact tools blocked |
| IV. Real Agent, Synthetic World | Real LLM loop (or explicit mock-LLM for CI); mocked driver/tools; no real purchases |
| V. Operations Taste | Ops copy, calm empty states, no developer-console aesthetic |

**Gate status (pre-research)**: PASS  
**Gate status (post-design)**: PASS — contracts keep approval and contact rules explicit

## Project Structure

### Documentation (this feature)

```text
specs/001-control-room-agent/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── exception-queue.md
│   ├── order-record.md
│   └── on-road-agent.md
└── tasks.md
```

### Source Code (repository root)

```text
starter/
├── app/
│   ├── page.tsx                 # Exception queue home (replace lane-default)
│   ├── lanes/page.tsx           # Secondary lane browse (optional move of old board)
│   ├── orders/[id]/page.tsx
│   ├── api/
│   │   ├── overview/route.ts    # Extend: exceptions-first payload helpers
│   │   ├── exceptions/route.ts  # Exception queue API (or overview mode)
│   │   ├── orders/[id]/
│   │   │   ├── route.ts
│   │   │   └── agent/
│   │   │       ├── route.ts           # Chat / continue
│   │   │       ├── run/route.ts       # Trigger/auto-run status
│   │   │       └── proposals/[proposalId]/review/route.ts
│   │   └── ...
│   └── components/              # Queue, proposal review, agent chat UI
├── lib/
│   ├── present/                 # Existing attention/board/record (reuse)
│   ├── agent/                   # Tools, loop, policies, mocks
│   │   ├── loop.ts
│   │   ├── tools.ts
│   │   ├── policy.ts            # Customer-contact ban, approval kinds
│   │   └── mocks.ts             # Driver replies, maps, etc.
│   ├── schema.ts                # + agent_runs, agent_messages, applied_mutations
│   └── mutations.ts             # Apply approved synthetic changes
├── scripts/
└── ...
```

**Structure Decision**: Extend `starter/` in place (same app judges will run). Do not create a second frontend. Agent code lives under `starter/lib/agent/` with App Router API routes.

## Complexity Tracking

> No constitution violations requiring justification.
