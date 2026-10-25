# Implementation Plan: Drop “Open in Conversations” Link

**Branch**: `014-drop-open-conversations` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-drop-open-conversations/spec.md`

## Summary

Remove the Timeline conversation-row ghost control “Open in Conversations” that opens the Conversations provenance fold. Keep other Timeline conversation actions intact.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js (`starter/`)  
**Primary Dependencies**: `starter/app/components/record/timeline.tsx`  
**Storage**: N/A  
**Testing**: Visual/manual + `npx tsc --noEmit`  
**Target Platform**: Ops control room browser  
**Project Type**: Web UI polish  
**Performance Goals**: N/A  
**Constraints**: Birch/ops taste; minimal diff  
**Scale/Scope**: One control removal in TimelineThread

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Exception-first | Pass — less chrome noise |
| V. Operations taste | Pass — drop redundant jump link |
| Presenter boundary | Pass — UI-only |

**Gate**: PASS

### Constitution Check (post-design)

Unchanged — UI-only removal.

## Project Structure

### Documentation

```text
specs/014-drop-open-conversations/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/timeline-ui.md
└── tasks.md
```

### Source Code

```text
starter/app/components/record/timeline.tsx
```

**Structure Decision**: Edit existing TimelineThread only.

## Complexity Tracking

N/A
