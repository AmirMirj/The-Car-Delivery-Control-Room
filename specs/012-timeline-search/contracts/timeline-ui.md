# UI Contract: Timeline Counters & Search

## Filter pills

- Each pill MUST render `{label} ({count})` with `count` from `model.counts[countKey]` (integer ≥ 0).
- Counts MUST NOT change when search query or sort changes.
- Zero counts remain visible as `(0)`.

## Search/sort bar

- Placed directly below the pill row.
- Controls:
  - Text input: placeholder e.g. `Search model, driver, or category…`
  - Sort select: `Newest` | `Urgency`
- Filtering is case-insensitive substring.
- Match sources: entry `title`, `detail`, `source`, `destination`, `result`, `category`; order vehicle make/model/title; driver names from the record.
- If context (vehicle/drivers) matches, all currently pill-filtered entries may remain visible OR each entry is included when either its own fields or the shared context matches—prefer: include entry if haystack OR context matches (so model search shows the list for that order under the active pill).

## Header / empty

- “Showing N” uses post-search length.
- No matches: calm empty copy; pills unchanged.
