# Implementation Plan: Drop Residual Timeline Details Bar

**Branch**: `008-drop-details-bar` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

Remove the Timeline “Show details” beige chip bar (`.timeline-details`) and its toggle—residual duplicate of status/routing already on the row.

## Technical Context

**Language/Version**: TypeScript / starter Next.js  
**Primary Dependencies**: `starter/app/components/record/timeline.tsx`, `starter/app/globals.css`  
**Storage**: N/A  
**Testing**: Visual check on order Timeline  
**Target Platform**: Local control room  
**Project Type**: UI cleanup  
**Constraints**: Keep 006 status pill, routing, actions, steps expand  
**Scale/Scope**: Timeline component + CSS only

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| V. Ops Taste | Less chrome noise |
| I–IV | Unaffected |

**Gate**: PASS

## Project Structure

```text
starter/app/components/record/timeline.tsx
starter/app/globals.css
```

## Complexity Tracking

None.
