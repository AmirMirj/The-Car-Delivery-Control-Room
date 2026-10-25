# Implementation Plan: All-Orders Agent Coverage

**Branch**: `004-all-orders-agent` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-all-orders-agent/spec.md`

## Summary

Add an explicit **“Run for all qualifying”** fleet pass that walks the synthetic snapshot, runs the existing on-road agent on each qualifying order (skipping those with pending proposals), and surfaces progress on the exception home plus a lighter summary and per-card agent cues on `/lanes`. Per-order auto-run on the exception queue stays; overlapping fleet passes are blocked.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, existing `lib/agent/*` (loop, qualify, store, policy), `/api/overview`, `/api/exceptions`, `/api/orders/[id]/agent/run`

**Storage**: Existing Postgres `onroad_*` tables; add `onroad_fleet_passes` (+ per-order outcome rows) for pass progress and single-flight lock

**Testing**: Manual via quickstart; optional smoke that fleet endpoint returns 409 when busy

**Target Platform**: Local control room UI + API

**Project Type**: Web app enhancement in `starter/`

**Performance Goals**: Sequential (or lightly batched) runs over ≤~50 qualifying of ~100 orders; progress updates pollable every few seconds; no full-snapshot LLM fan-out in parallel

**Constraints**: Constitution I–V; explicit trigger only; skip pending proposals; no customer contact without approval; exception home remains default

**Scale/Scope**: One fleet API + UI on home and lanes; reuse single-order agent loop

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Run control + full progress on exception home; lanes secondary with summary/cues only |
| II. Agents Do the Legwork | Fleet reuses cheap-work-first on-road loop |
| III. Human Approval | Unchanged proposal review/apply path per order |
| IV. Real Agent, Synthetic World | Same mock tools / overlays |
| V. Ops Taste | Calm progress + card cues; no eng debug chrome |

**Gate**: PASS (pre/post Phase 1)

## Project Structure

### Documentation

```text
specs/004-all-orders-agent/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/fleet-pass-api.md, contracts/fleet-pass-ui.md
└── tasks.md  # later via /speckit-tasks
```

### Source

```text
starter/lib/agent/fleet.ts              # qualify scan, skip rules, pass orchestration
starter/lib/agent/store.ts              # fleet pass persistence + lock helpers
starter/scripts/ensure-agent-tables.ts  # onroad_fleet_passes (+ outcomes)
starter/app/api/agent/fleet/route.ts    # GET status, POST start (409 if busy)
starter/app/page.tsx                    # Run control + full progress
starter/app/lanes/page.tsx              # progress summary
starter/app/components/card.tsx         # agent status cue
starter/app/api/overview/… or board present  # optional agentStatus on cards
starter/app/globals.css                 # progress + cue styles
```

**Structure Decision**: Orchestrate fleet in `lib/agent/fleet.ts` calling existing per-order run path; persist pass state for UI polling; no new agent area.

## Complexity Tracking

None — sequential orchestration over existing loop is justified by approval/skip semantics.
