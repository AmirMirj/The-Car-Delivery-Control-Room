# Implementation Plan: Timeline Counters & Search

**Branch**: `012-timeline-search` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

Keep Timeline pill counts always visible (including zeros). Add a search + sort bar under pills that filters entries by car model/make, driver names, and ops text fields without shrinking the pill counts.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js App Router  
**Primary Dependencies**: Existing Timeline + `RecordView`  
**Storage**: N/A (client filter)  
**Testing**: Manual via order detail  
**Target Platform**: Ops control room browser  
**Project Type**: Web app (`starter/`)  
**Performance Goals**: Instant filter on keystroke for typical Timeline size  
**Constraints**: Counts from full model; filter is client-only; birch/ops UI  
**Scale/Scope**: One order Timeline

## Constitution Check

| Principle | Status |
|-----------|--------|
| Exception-first | Pass — search helps find actionable rows |
| Human approval | Pass — no agent changes |
| Shared order record | Pass — uses RecordView |
| Presenter boundary | Pass — filter helpers in `timeline.ts` |
| Fail closed | N/A |
| Observability | Pass — empty state when no matches |

Gate: PASS

## Project Structure

### Documentation

```text
specs/012-timeline-search/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/timeline-ui.md
└── tasks.md
```

### Source Code

```text
starter/lib/present/timeline.ts          # search haystack + sort
starter/app/components/record/timeline.tsx
starter/app/globals.css
```

## Complexity Tracking

N/A

## Phase 0 / Phase 1

See research.md, data-model.md, contracts/, quickstart.md.
