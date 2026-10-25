# Implementation Plan: Efficient By-Lane Board

**Branch**: `003-efficient-lanes` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-efficient-lanes/spec.md`

## Summary

Make `/lanes` more efficient by borrowing sprint-board **visual patterns** (coloured column pills, assignee pills, progress cues, top filter pills) while keeping Bahn **operational lanes** and exception-first home. Do not rename lanes to To-do / In Progress / Complete.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, existing `/api/overview`, `BoardCard`, `LANES` labels, board CSS

**Storage**: N/A (presentation over existing overview)

**Testing**: Manual on `/lanes`; optional smoke that `/` still exception-home and `/lanes` returns 200

**Target Platform**: Local control room UI

**Project Type**: Web UI enhancement in `starter/app/lanes/`

**Performance Goals**: Client-side filter over ~100 cards; no extra round-trips for pill filters

**Constraints**: Constitution I/V; secondary browse only; no fake sprint %; ops language

**Scale/Scope**: One board page; 7 lanes; ~100 orders

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Home unchanged; lanes secondary; Needs attention filter on board |
| II–IV | No agent/contact changes |
| V. Ops Taste | Pills/progress use existing tokens; no eng-tool look |

**Gate**: PASS (pre/post)

## Project Structure

### Documentation

```text
specs/003-efficient-lanes/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/lanes-board-ui.md
└── tasks.md  # later via /speckit-tasks
```

### Source

```text
starter/app/lanes/page.tsx           # filter pills + denser board chrome
starter/app/components/card.tsx      # owner pill + progress cue
starter/app/globals.css              # lane pills, progress bar, filter pills
starter/lib/present/labels.ts        # optional lane pill tones
starter/lib/present/board-progress.ts  # decisive-date → urgency/progress
```

**Structure Decision**: Enhance existing lanes page and Card; reuse overview API.

## Complexity Tracking

None.
