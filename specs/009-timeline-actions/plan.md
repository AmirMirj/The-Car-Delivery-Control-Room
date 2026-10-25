# Implementation Plan: Timeline Action Column

**Branch**: `009-timeline-actions` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

Restructure Timeline rows so decisive actions (Approve / Reject, and conversation Open when primary) sit in a **far-right action column** for vertical scanning. Style Approve as solid primary (ops green), Reject as outlined secondary. Utility links stay under content.

## Technical Context

**Language/Version**: TypeScript / starter  
**Primary Dependencies**: `record/timeline.tsx`, `globals.css`  
**Storage**: N/A  
**Testing**: Manual on pending proposal order  
**Target Platform**: Desktop-first; stack on narrow  
**Project Type**: UI layout polish  
**Constraints**: Constitution III (approval); V (ops taste, no purple); birch tokens  
**Scale/Scope**: Timeline row grid + button styles

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| III. Human Approval | Approve/Reject clearer, not skipped |
| V. Ops Taste | Solid green primary, soft reject; aligned column |

**Gate**: PASS

## Project Structure

```text
starter/app/components/record/timeline.tsx
starter/app/globals.css
specs/009-timeline-actions/{plan,research,data-model,contracts,quickstart,tasks}.md
```

## Complexity Tracking

None.
