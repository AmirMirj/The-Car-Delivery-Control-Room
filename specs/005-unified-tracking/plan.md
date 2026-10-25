# Implementation Plan: Unified Order Tracking

**Branch**: `005-unified-tracking` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-unified-tracking/spec.md`

## Summary

Upgrade the existing Combined Timeline into the **primary order tracking surface**: rich tracking fields on every entry (timestamp, cheap vs not, progress, agent involvement, source→destination, result), one top-level row per agent run/proposal with nested cheap steps, “Needs a person” labelling and default filter, clearer header counts, inline conversation expand, and provenance sections (Conversations / Prior agent work / Activity) **collapsed by default**.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, existing `lib/present/timeline.ts`, `app/components/record/timeline.tsx`, `ThreadMessages`, order detail folds in `record/` / `order-detail.tsx`

**Storage**: N/A (presentation over `RecordView` + local agent proposals/runs already loaded)

**Testing**: Manual via quickstart on a messy order (e.g. ferry-capacity / on-road proposal)

**Target Platform**: Local control room order page

**Project Type**: Web UI enhancement in `starter/`

**Performance Goals**: Timeline build O(n) over attention+threads+proposals+events; expand only mounts messages for open rows

**Constraints**: Constitution I–V; no new agent area; retain tracking fields; no mega-feed across orders

**Scale/Scope**: One order page Timeline + fold defaults; extend present model only

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Default filter Needs a person; exception → order lands on Timeline |
| II. Agents Do the Legwork | Cheap vs not typed; cheap steps nested under run |
| III. Human Approval | Proposal result / awaiting review visible; no auto-customer contact |
| IV. Synthetic world | No new live integrations |
| V. Ops Taste | Clear labels, collapsed provenance, scannable fields |

**Gate**: PASS (pre/post)

## Project Structure

### Documentation

```text
specs/005-unified-tracking/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/timeline-ui.md
└── tasks.md  # later
```

### Source

```text
starter/lib/present/timeline.ts              # TrackingEntry fields; agent run grain; counts/default
starter/app/components/record/timeline.tsx   # pills label, header copy, row fields, inline expand
starter/app/components/order-detail.tsx      # collapse Conversations / agent / activity folds by default
starter/app/globals.css                      # tracking field chrome, expand, cheap/consequential chips
```

**Structure Decision**: Extend present-layer Timeline + order-detail fold defaults; reuse ThreadMessages for inline expand.

## Complexity Tracking

None.
