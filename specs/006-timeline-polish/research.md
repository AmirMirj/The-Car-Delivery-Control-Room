# Research: Timeline Polish

## Decision: Collapse default chrome to status + routing

**Rationale**: Six equal chips caused cognitive overload; SC-001 wants ≤2 primary signals. Full 005 fields stay under Show details (SC-002).

**Alternatives considered**: Keep all chips (fails tidy); drop fields entirely (fails 005/SC-005 intent).

## Decision: Derive statusDisplay from progress / needsPerson / result

**Rationale**: Map to Action required | Awaiting review | Completed | Failed for one pill without new persistence.

**Alternatives considered**: Free-text result as only badge (inconsistent); emoji status (violates ops taste / FR-008).

## Decision: Lightweight structured body heuristics

**Rationale**: Split detail/summary into Issue / Next (and Impact/Driver when present) with simple line/sentence heuristics; no NLP service.

**Alternatives considered**: Require agent to emit JSON (out of scope); leave paragraph only (weaker SC for US2).

## Decision: Wire Approve/Reject via callbacks from OrderPane

**Rationale**: Same `/agent/proposals/.../review` endpoints as AgentPanel; Timeline stays presentational with `onReview` prop.

**Alternatives considered**: Duplicate review UI only in AgentPanel (fails easy-to-use); fake Call Dealer buttons (FR-005).

## Decision: No Critical Issues band

**Rationale**: Duplicates Needs a person filter (FR-007); layout preview uses filter + sorted rows.

**Alternatives considered**: Pinned critical section (rejected).
