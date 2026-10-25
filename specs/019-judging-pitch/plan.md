# Implementation Plan: Judging Pitch (Max Points)

**Branch**: `019-judging-pitch` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-judging-pitch/spec.md`

## Summary

Add an in-app **Pitch** page that maps the three judging weights (Control Room 40%, AI 30%, Taste 30%) to short talking points and live deep links into Needs a person, Browse by lane, a showcase order, and Build notes. Enrich Build notes with the event-formatting throw-away and approval-gate narrative. No new agent runtime; narrative + navigation only.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (App Router)

**Primary Dependencies**: Existing starter React UI; static curated modules (`lib/pitch.ts`, `lib/build-notes.ts`)

**Storage**: N/A for Pitch content; showcase order resolved from existing exceptions/overview APIs or snapshot helpers

**Testing**: Manual quickstart; `npm run typecheck`

**Target Platform**: Local hackathon demo (browser)

**Project Type**: Web application (control-room starter)

**Performance Goals**: Pitch and Build notes render with zero LLM calls

**Constraints**: Home stays `/`; Pitch is Review chrome; ops taste for Pitch copy (calm, not marketing fluff); synthetic data only

**Scale/Scope**: One Pitch route + nav link + Build notes content updates + small CSS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status |
|------|--------|
| I. Exception-first | PASS — Pitch links into exception queue; does not replace it as home |
| II. Agents do legwork | PASS — Criterion 1 talking points highlight cheap passes + stop/handoff; no new auto-actions |
| III. Human approval before change | PASS — Build notes + Pitch explicitly call out Approve gates for consequential ops |
| IV. Real agent, synthetic world | PASS — Showcase uses seeded/synthetic orders only |
| V. Operations taste | PASS — Pitch is judge/demo chrome under Review; short, scannable, no badge walls |

**Post-design re-check**: Still PASS — contracts keep Pitch as guided narrative; showcase resolver falls back calmly.

## Project Structure

### Documentation (this feature)

```text
specs/019-judging-pitch/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── pitch-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
starter/
├── lib/
│   ├── pitch.ts                 # PitchDoc + showcase hint
│   ├── present/showcase-order.ts # Resolve showcase order id from exceptions/overview
│   └── build-notes.ts           # Enrich judgement entries
├── app/
│   ├── pitch/page.tsx           # Pitch UI
│   ├── build/page.tsx           # unchanged structure; content via build-notes
│   ├── components/app-frame.tsx # nav: Pitch under Review
│   └── globals.css              # .pitch-* styles
```

## Complexity Tracking

N/A — additive Review surface; no new services beyond a thin showcase resolver.
