# Contract: Timeline Field Grid UI

## Markup

```html
<dl class="timeline-struct">
  <div class="timeline-struct-field">
    <dt>Issue</dt><dd>…</dd>
  </div>
  …
</dl>
```

## Layout

- Desktop: `.timeline-struct` → `grid-template-columns: 1fr 1fr` (two field cells per row).
- Narrow: one column.
- Inside cell: `dt` + `dd` inline or mini grid; `dt` muted; `dd` bold/dark.

## Non-goals

No change to status/routing/actions; no change to structuredBody heuristics.
