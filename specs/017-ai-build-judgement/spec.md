# Feature Specification: AI Build Judgement

**Feature Branch**: `017-ai-build-judgement`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "How you worked with AI, 30%. Tell us how you used coding agents like Claude Code or Codex while you built it: what you asked for, what you checked, what you threw away, and where you did not take the first answer. We care about your judgement, not the number of tools"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Judges can read how AI was used with judgement (Priority: P1)

A hackathon judge opens a short in-app **Build notes** page and sees a clear narrative of how coding agents were used: what was asked, what was verified, what was discarded, and where the first agent answer was rejected—without a tool dump or prompt log.

**Why this priority**: Directly answers the 30% “how you worked with AI” criterion; must be findable during review.

**Independent Test**: From the control room nav, open Build notes; within one minute identify at least one ask, one check, one throw-away, and one “did not take the first answer” example.

**Acceptance Scenarios**:

1. **Given** the running app, **When** a judge opens Build notes, **Then** the page shows four sections: Asked for, Checked, Threw away, Did not take the first answer.
2. **Given** those sections, **When** reading entries, **Then** each entry is a concrete product decision from this build (not generic AI advice).
3. **Given** the control room nav, **When** scanning links, **Then** Build notes is reachable without burying the ops exception queue as home.

---

### User Story 2 - Narrative stays ops-tasteful (Priority: P2)

The page reads like a calm build note for humans—not a developer tool, chat transcript, or badge wall of models/tools.

**Why this priority**: Taste is judged alongside AI use; chrome that looks like “look how many agents” fails the brief.

**Independent Test**: Remove the word “AI” from headings mentally; the page still reads as product judgement notes, not an LLM scoreboard.

**Acceptance Scenarios**:

1. **Given** Build notes, **When** viewing the first screen, **Then** there is one short intro and the four judgement sections—no model name grids, token counts, or prompt dumps.
2. **Given** any entry, **When** it mentions an agent, **Then** the emphasis is the human decision (kept / changed / rejected), not the tool brand.

---

### Edge Cases

- Missing content file: page shows a calm empty/error state, not a stack trace.
- Home remains exception queue; Build notes must not become the default landing page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Build notes route reachable from primary nav.
- **FR-002**: Build notes MUST include sections: Asked for, Checked, Threw away, Did not take the first answer.
- **FR-003**: Content MUST be curated structured data (or markdown) checked into the repo—not generated live by an LLM at request time.
- **FR-004**: Home MUST remain the exception queue (`/`).
- **FR-005**: Page MUST NOT list every tool/session; quality over quantity of examples (target 3–6 items per section).
- **FR-006**: Copy MUST reflect real decisions from this control-room build (timeline noise removal, decide cues, agent handoff, infra dead-ends).

### Key Entities

- **JudgementSection**: id; title; intro; entries[]
- **JudgementEntry**: title; detail; (optional) outcome kept|changed|rejected

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can answer the four judging prompts from the page alone in ≤60 seconds.
- **SC-002**: Build notes is one click from the app chrome.
- **SC-003**: Zero live LLM calls on the Build notes route.

## Assumptions

- Audience is hackathon judges and teammates, not end ops users day-to-day.
- Cursor / Spec Kit / coding agents were used; brand names appear sparingly and only when they clarify a decision.
- Content can be updated as the build evolves without schema migrations.
