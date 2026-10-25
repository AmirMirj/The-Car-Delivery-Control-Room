# Research: AI Build Judgement

## Decision: Static curated TypeScript module, not live LLM prose

**Rationale**: Judges care about judgement authenticity; generating the “how we used AI” page with an LLM at runtime undermines the claim. A checked-in module is reviewable in git.

**Alternatives considered**: Markdown file + runtime parse (fine, slightly more plumbing); README-only (harder to find during in-app demo).

## Decision: In-app `/build` route with sidebar link under a “Review” group

**Rationale**: One click during a live walkthrough; keeps ops Work group clean.

**Alternatives considered**: Modal from footer only; external Notion doc.

## Decision: Four fixed sections matching the judging prompt verbatim

**Rationale**: Mirrors the score rubric so reviewers need no translation.

**Alternatives considered**: Chronological timeline of chats (noisy; tool-count smell).
