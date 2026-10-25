# Feature Specification: Ops Taste Polish

**Feature Branch**: `018-ops-taste-polish`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Would our operations people use this every day? Could someone who is not an engineer use it without a tutorial? Does one glance tell you what is wrong and what to do? Is it high signal and low noise, even with hundreds of orders? Does it look like something made with care, or like the first thing Claude gave you? The small things count: readable text, calm spacing, and pages that make sense when they are empty or loading."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Glanceable exception queue for daily ops (Priority: P1)

An ops person opens the home queue and, without a tutorial, sees what is wrong and what to do on each card. Engineer jargon is gone; agent statuses read in plain language; the list stays scannable when many orders need a person.

**Why this priority**: Directly answers everyday use, no-tutorial, one-glance, and high-signal questions.

**Independent Test**: Hand the home page to a non-engineer; they can state why the top three cards need them and what “Decide” asks, without explaining DB/seed or snake_case statuses.

**Acceptance Scenarios**:

1. **Given** the exception queue with items, **When** viewing a card, **Then** reason + decide cue remain primary; agent line uses plain words (not `awaiting_review`).
2. **Given** a load or API failure, **When** an error shows, **Then** copy is ops-facing (what to try next), not “database/seed” engineer talk.
3. **Given** dozens of exception cards, **When** scrolling, **Then** the page title/tools stay usable (sticky head) and cards keep calm spacing.

---

### User Story 2 - Empty and loading states make sense (Priority: P1)

Every primary surface (exceptions, lanes, order, inbox, entity lists) has loading and empty copy that explains the situation in plain language—not a bare “Loading…” or a blank hole.

**Why this priority**: Explicit in the brief; empty/loading is where “first Claude draft” usually shows.

**Independent Test**: Throttle or open empty search; each surface states what is happening or why it is empty and offers a next path when useful.

**Acceptance Scenarios**:

1. **Given** exceptions still loading, **When** the page shows skeletons, **Then** the subtitle says the queue is loading—not silent.
2. **Given** an order still loading, **When** viewing `/orders/:id`, **Then** copy says the order record is loading (not only a grey block).
3. **Given** inbox/entity list empty or loading, **When** viewing those pages, **Then** sentences are complete and calm.

---

### User Story 3 - Quiet chrome; care over novelty (Priority: P2)

Fleet/agent chrome does not dominate when idle. Buttons and banners use human labels. Spacing and type stay readable; no new decorative gradients, pill piles, or glow effects.

**Why this priority**: “Made with care vs first Claude output”; noise control with hundreds of orders.

**Independent Test**: With no fleet pass running, home focuses on the queue; fleet summary is secondary or collapsed when idle.

**Acceptance Scenarios**:

1. **Given** no active fleet pass, **When** on home, **Then** the primary action label is plain language; idle fleet stats do not outshout the exception list.
2. **Given** Build notes / secondary nav, **When** doing daily triage, **Then** Work group remains first; taste polish does not move home off exceptions.

---

### Edge Cases

- Search with zero matches: empty state mentions the search and how to clear/browse.
- Fleet failure: error stays readable, not a raw stack.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Exception cards MUST show human-readable agent status labels (no raw snake_case).
- **FR-002**: Primary error strings on queue/lanes MUST avoid engineer-only DB/seed phrasing.
- **FR-003**: Exception queue header MUST remain visible while scrolling the list (sticky).
- **FR-004**: Loading subtitles/copy on exceptions, lanes, order, inbox, and entity index MUST be full sentences.
- **FR-005**: Empty states MUST say what is empty and, when useful, offer a next link (e.g. lanes).
- **FR-006**: Fleet “run” control MUST use plain-language label; idle completed-pass panel MUST be quieter than the queue (collapsed by default or visually secondary).
- **FR-007**: No new purple/glow/pill-cluster chrome; preserve Bahn birch/asphalt tokens.

### Key Entities

- **OpsLabel**: maps internal codes (agent status) → plain phrase
- **SurfaceState**: loading | empty | error | ready copy per surface

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Non-engineer can explain top card’s problem + decide action in ≤10 seconds.
- **SC-002**: Zero visible `awaiting_review` / `auto_exception` raw tokens on home cards.
- **SC-003**: Order/inbox/entity loading states use ≥1 full sentence each.
- **SC-004**: Exception list scroll keeps head actions reachable without hunting.

## Assumptions

- Builds on existing exception queue, decide cues, and timeline (016); this feature is taste/copy/layout, not new agent behaviour.
- Judges evaluate taste with the live app; copy changes are the main lever.
