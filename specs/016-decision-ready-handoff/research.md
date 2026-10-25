# Research: Decision-Ready Handoff

## Decision: Derive decide cues from existing attention + agent status

**Rationale**: Exception items already carry `reason`, `work`, and `agentStatus`. A short `decideCue` can be composed server-side without new tables (e.g. “Approve on-road proposal”, “Reply to open thread”, “Resolve open alert”).

**Alternatives considered**: Client-only heuristics (duplicated logic); new DB column (unnecessary for demo).

## Decision: Show DecisionOutcome inline on timeline after review

**Rationale**: Approve/Reject already mutates proposal state via API; the gap is UI certainty. After successful review, set local outcome copy on the entry / banner: applied vs not applied + next step.

**Alternatives considered**: Toast-only (easy to miss); navigate to Prior agent fold (noise; FR-009 forbids jump CTAs).

## Decision: Keep provenance as routing line + finding attribution; remove leftover Prior-agent jump

**Rationale**: Timeline already has `source → destination`. Agent cheap steps provide tool-level attribution. A leftover “Open in Prior agent work” button may still exist and violates FR-009 / prior feature 015.

**Alternatives considered**: Full audit table per field (too heavy for ops taste).

## Decision: No new agent runtime behaviour in this feature

**Rationale**: Cheap-first / stop / hand over already exist in the agent loop; this feature makes them **visible and judgeable**, not re-architecting the agent.

**Alternatives considered**: Changing stop conditions (out of scope; risk to demo stability).
