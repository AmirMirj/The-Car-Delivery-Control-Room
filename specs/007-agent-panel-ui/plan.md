# Implementation Plan: On-road Agent Panel — Concise UI

**Branch**: `007-agent-panel-ui` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-agent-panel-ui/spec.md`

## Summary

Rebuild the On-road agent panel presentation to cut text walls: compact findings (bullets / labeled facts + expand), **one** approval card (decision once), short header, truncated chat turns. APIs and approval gate unchanged. Birch/ops visual language.

## Technical Context

**Language/Version**: TypeScript / Node 24 (starter)

**Primary Dependencies**: Next.js 16, React 19, `app/components/agent-panel.tsx`, `globals.css`; existing `/api/orders/[id]/agent*` routes

**Storage**: N/A (display-only over existing `AgentState`)

**Testing**: Manual quickstart on order with pending on-road proposal

**Target Platform**: Local control room order page

**Project Type**: Web UI polish in `starter/`

**Performance Goals**: Negligible; truncate/expand client-side only

**Constraints**: Constitution I–V; no behavior change to Run/review/chat; no fake CTAs; no dark-terminal skin

**Scale/Scope**: Agent panel component + CSS (+ tiny present helpers if useful)

## Constitution Check

| Principle | Compliance |
|-----------|------------|
| I. Exception-First | Faster scan of why the order needs a person |
| II. Agents Do the Legwork | Findings stay; display compressed |
| III. Human Approval | Single clear Approve/Reject card |
| IV. Synthetic world | Demo hint kept; no live contact |
| V. Ops Taste | Less prose, modern compact layout |

**Gate**: PASS (pre/post)

## Project Structure

### Documentation

```text
specs/007-agent-panel-ui/
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/agent-panel-ui.md
└── tasks.md  # later
```

### Source

```text
starter/app/components/agent-panel.tsx   # compact layout, expand, chat truncate
starter/lib/present/agent-panel.ts       # optional: splitHandover / preview helpers
starter/app/globals.css                  # denser agent-panel styles
```

**Structure Decision**: Presentation rewrite of AgentPanel; optional small present helper for handoff bullets.

## Complexity Tracking

None.
