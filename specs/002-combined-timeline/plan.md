# Implementation Plan: Combined Order Timeline

**Branch**: `002-combined-timeline` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-combined-timeline/spec.md`

## Summary

Add an ops-facing **Timeline** on the order record: one combined list of attention, conversations, agent work, and activity, with filter pills matching the provided screenshot. Derive entries from existing `RecordView`; keep full detail sections below.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, existing presenters and UI tokens in `starter/app/globals.css`

**Storage**: N/A (derived view; optional inclusion of local on-road agent proposals already on order payload)

**Testing**: Manual on order pages; optional smoke assert Timeline markup or entry builder unit via tsx

**Target Platform**: Local control room web UI

**Project Type**: Web UI enhancement inside `starter/`

**Performance Goals**: Client-side pill filtering; build entries once per order load

**Constraints**: Constitution I/V (exception-first, ops taste); no eng-tool chrome; provenance sections retained

**Scale/Scope**: One order at a time; tens of entries typical

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Default pill = Needs attention when present |
| II. Agents Do the Legwork | Agent work visible in combined feed |
| III–IV | No contact/approval changes in this feature |
| V. Ops Taste | Pills + hairline rows using existing CSS variables |

**Gate**: PASS (pre and post design)

## Project Structure

### Documentation

```text
specs/002-combined-timeline/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/timeline-ui.md
└── tasks.md
```

### Source

```text
starter/lib/present/timeline.ts      # buildTimeline(view) → entries + counts
starter/app/components/record/timeline.tsx  # Timeline UI + pills
starter/app/components/order-detail.tsx     # mount Timeline after hero/attention
starter/app/globals.css                    # timeline + pill styles
```

**Structure Decision**: Present-layer pure function + client component; no new API required for MVP (entries from `view` already on order GET).

## Complexity Tracking

None.
