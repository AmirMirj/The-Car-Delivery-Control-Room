# Contract: Build notes UI

## Route

- `GET /build` — App Router page wrapped in `AppFrame` with `section="build"`.

## Navigation

- Sidebar group **Review** (or equivalent) includes link **Build notes** → `/build`.
- Must not replace or reorder **Needs a person** as home.

## Page structure

1. H1 + short intro  
2. Four sections in order: Asked for → Checked → Threw away → Did not take the first answer  
3. Each entry: title + detail; optional outcome chip (`kept` / `changed` / `rejected`)

## Non-goals

- No chat transcript
- No model/provider scoreboard
- No `fetch` to an LLM API on this route
