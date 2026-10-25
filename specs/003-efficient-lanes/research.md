# Research: Efficient By-Lane Board

## Decision: Steal patterns, not sprint taxonomy

**Rationale**: Bahn lanes (intake, market, moving, delivered…) are operational truth. Mapping them to To-do / In Progress / Complete would destroy meaning judges and ops expect.

**Adapt from the sprint screenshot**:
| Sprint board | Lane board adaptation |
|--------------|----------------------|
| Column status pills (pink/blue/green) | Per-lane coloured pills (reuse lane tones already in CSS) |
| Assignee name pills | Owner from attention (`card.attention[].owner` / work tray) |
| Progress % bars | Snapshot-relative progress toward `decisive` date (or omit if none) |
| Dense white cards | Tighten card chrome; keep route + work lines |
| Column “+” footers | Skip — no create-order in this packet |

**Alternatives considered**: Full Kanban rewrite with drag-drop (out of scope, write-model heavy); only filter pills without card redesign (weaker).

## Decision: Progress = time toward decisive window

**Rationale**: Delivery work is date-driven, not story-point %. Use `decisive.start`/`end` vs `snapshotAt` to compute 0–100 clamped urgency, label with relative note already on the card when present.

**Alternatives considered**: Static fake % by lane (misleading); hide progress entirely (misses the efficiency cue from the reference).

## Decision: Filter pills on the board chrome

**Rationale**: Matches both the sprint density goal and the Timeline filter language already in the product. Minimum: Needs attention. Optional: Has owner.

**Alternatives considered**: Only the existing toggle button (keep as one pill among others).
