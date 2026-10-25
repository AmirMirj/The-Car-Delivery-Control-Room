# Implementation Plan: Timeline Polish

**Branch**: `006-timeline-polish` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-timeline-polish/spec.md`

## Summary

Polish the 005 unified Timeline for ops scan: collapse default chips to **status + routing**, move full tracking fields under **Show details**, structure Issue/Impact/Next bodies, wire **Approve/Reject** and **View agent steps** / conversation expand on the card. Keep birch layout: hero → Timeline → collapsed provenance. No Critical Issues duplicate band; no fake Call CTAs.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, `lib/present/timeline.ts`, `app/components/record/timeline.tsx`, AgentPanel review APIs, existing CSS tokens

**Storage**: N/A (presentation + existing order agent review routes)

**Testing**: Manual quickstart on order with pending on-road proposal

**Target Platform**: Local control room order page

**Project Type**: Web UI polish in `starter/`

**Performance Goals**: Same O(n) Timeline build; expand mounts details/steps only when open

**Constraints**: Constitution I–V; retain 005 fields under details; real actions only; birch/ops taste

**Scale/Scope**: Timeline row presentation + optional review callbacks from order-detail

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Needs a person default/filter unchanged; status makes next decision obvious |
| II. Agents Do the Legwork | Cheap steps under View agent steps |
| III. Human Approval | Approve/Reject gated on Timeline; no auto-customer contact |
| IV. Synthetic world | No new live Call integrations |
| V. Ops Taste | Fewer badges, structured body, birch UI |

**Gate**: PASS (pre/post)

## Project Structure

### Documentation

```text
specs/006-timeline-polish/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/timeline-polish-ui.md
└── tasks.md
```

### Source

```text
starter/lib/present/timeline.ts           # statusDisplay helpers; optional structuredBody
starter/app/components/record/timeline.tsx # collapsed chrome, details, actions
starter/app/components/order-detail.tsx    # pass review/reload handlers into Timeline
starter/app/globals.css                    # status pill, structured body, action row
```

**Structure Decision**: Presentation-layer polish on existing Timeline; reuse agent review fetch from AgentPanel patterns.

## Complexity Tracking

None.
