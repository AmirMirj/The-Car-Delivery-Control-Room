# Implementation Plan: Ops Taste Polish

**Branch**: `018-ops-taste-polish` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

Polish everyday ops UX: plain-language labels, friendlier errors, sticky exception head, calmer fleet chrome, and complete loading/empty copy across primary surfaces—so the room looks cared for and usable without a tutorial.

## Technical Context

**Language/Version**: TypeScript / Next.js 16  
**Primary Dependencies**: Existing App Router UI + `globals.css`  
**Storage**: N/A  
**Testing**: Manual quickstart + `npm run typecheck`  
**Target Platform**: Local web demo  
**Project Type**: Web UI polish  
**Performance Goals**: No extra fetches; CSS sticky only  
**Constraints**: Constitution V; keep `/` as exception home; no novelty chrome  
**Scale/Scope**: Home, lanes, order, inbox, entity list copy/CSS

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Exception-First | PASS — sticky head + clearer cards |
| V. Operations Taste | PASS — primary goal of this feature |
| II–IV | Unchanged |

## Project Structure

```text
specs/018-ops-taste-polish/ …
starter/
├── lib/present/ops-copy.ts
├── app/page.tsx, lanes/page.tsx, inbox/page.tsx, orders/[id]/page.tsx
├── app/components/entity-page.tsx
└── app/globals.css
```

## Complexity Tracking

None.
