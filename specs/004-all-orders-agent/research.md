# Research: All-Orders Agent Coverage

## Decision: Explicit fleet pass API + reuse per-order run

**Rationale**: Spec requires a deliberate “Run for all qualifying” control and forbids start-on-load. Reusing `POST /api/orders/:id/agent/run` (or the shared `runAgent` loop) keeps approval, tools, and traces identical per order.

**Alternatives considered**: Fire-and-forget client loops from the browser only (fragile, no lock); separate “fleet agent” with different prompts (violates one-area depth).

## Decision: Persist fleet pass with single-flight lock

**Rationale**: FR-009 needs a durable “pass in progress” flag so home and lanes agree and a second POST returns 409. Store `onroad_fleet_passes` with status `running|completed|failed` and counters (qualifying, ran, skipped, failed, proposals).

**Alternatives considered**: In-memory only (lost on refresh/restart); filesystem lock (awkward in Next).

## Decision: Sequential (or concurrency=1–2) order processing

**Rationale**: ~100 orders, few dozen qualifying; sequential avoids rate/cost spikes and simplifies skip/progress. Optional tiny concurrency later; default 1.

**Alternatives considered**: Full parallel Promise.all (noisy, harder to reason about mid-pass UI).

## Decision: Skip pending proposals; expose agentStatus on board cards

**Rationale**: Clarification A. Surface `proposal_waiting` / `working` / `failed` from existing `onroad_proposals` / `onroad_runs` when building overview cards or a thin join in the fleet/overview path.

**Alternatives considered**: Supersede (rejected in clarify); status only on exception list (fails SC-003).

## Decision: Progress UI — full on home, summary on lanes

**Rationale**: Clarification B + constitution I. Home hosts button + counts; `/lanes` polls same GET status for a compact banner.

**Alternatives considered**: Duplicate Run buttons (rejected); lanes-only control (rejected).
