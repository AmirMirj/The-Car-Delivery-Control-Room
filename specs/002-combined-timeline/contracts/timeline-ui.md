# Contract: Timeline UI (order record)

## Placement

On `/orders/:id`, after the hero/story, before tiles/route detail sections.

## Structure

```text
section.timeline
  header: "Timeline" + visibleCount + note "Combined view · full details remain below"
  nav.timeline-pills[role=tablist]
    button[aria-pressed] Everything {counts.everything}
    button Needs attention {counts.attention}
    button Conversations {counts.conversations}
    button Agent work {counts.agent}
    button Activity {counts.activity}
  ol.timeline-list
    li.timeline-row
      icon | main (title + chip?, meta, detail) | time
```

## Behaviour

- Client filter only; no navigation.
- Active pill: filled dark (`--ink`) on light background pills.
- Empty filter: short empty copy.
- Default: `attention` if `counts.attention > 0`, else `everything`.
