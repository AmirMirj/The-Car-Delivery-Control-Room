# Implementation Plan: Timeline Badge Consolidation & Urgency Color

**Branch**: `011-timeline-badge-urgency` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

One status badge per Timeline row (drop redundant “Needs a person” when status already implies a wait). Color chips by urgency: critical red/orange only for high-priority intervention; muted tones for awaiting review / routine / resolved.

## Technical Context

**Language/Version**: TypeScript / starter  
**Primary Dependencies**: `lib/present/timeline.ts`, `record/timeline.tsx`, `globals.css`  
**Storage**: N/A  
**Testing**: Visual on attention + pending proposal rows  
**Project Type**: UI polish  
**Constraints**: Constitution I/V; birch tokens  
**Scale/Scope**: Present helper + StatusPill + CSS

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Critical items visually hotter |
| V. Ops Taste | Less badge noise; clear urgency |

**Gate**: PASS

## Project Structure

```text
starter/lib/present/timeline.ts
starter/app/components/record/timeline.tsx
starter/app/globals.css
```

## Complexity Tracking

None.
