# Implementation Plan: AI Build Judgement

**Branch**: `017-ai-build-judgement` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-ai-build-judgement/spec.md`

## Summary

Add a judge-facing **Build notes** page (`/build`) with curated, static content answering the four AI-judgement prompts: what we asked agents for, what we checked, what we threw away, and where we rejected the first answer. Emphasize human judgement; keep home as the exception queue.

## Technical Context

**Language/Version**: TypeScript / Next.js 16 (existing starter)

**Primary Dependencies**: React, existing `AppFrame` / CSS tokens

**Storage**: N/A (static module under `starter/lib/build-notes.ts`)

**Testing**: Manual quickstart + `npm run typecheck`

**Target Platform**: Local web demo

**Project Type**: Web UI (Next.js App Router page)

**Performance Goals**: Static render; no network on page body

**Constraints**: Constitution V (ops taste); no live LLM; home stays `/`

**Scale/Scope**: One route + nav link + curated content module

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Exception-First | PASS — Build notes is secondary nav; `/` unchanged |
| II–IV. Agents / approval / synthetic | N/A for this meta page |
| V. Operations Taste | PASS — calm notes, no tool scoreboard |

Post-design: unchanged.

## Project Structure

```text
specs/017-ai-build-judgement/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/build-notes-ui.md
└── tasks.md

starter/
├── lib/build-notes.ts              # curated sections
├── app/build/page.tsx              # Build notes page
└── app/components/app-frame.tsx    # nav + Section type
```

## Complexity Tracking

None. Static content page only.
