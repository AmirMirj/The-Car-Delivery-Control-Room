# Data Model: Judging Pitch

## PitchDoc

| Field | Type | Rules |
|-------|------|-------|
| title | string | Required; short (e.g. “Pitch”) |
| intro | string | ≤2 sentences; Problem → Solution framing |
| checklist | PitchCheckItem[] | Exactly 4: problem, solution, ai, demo |
| criteria | PitchCriterion[] | Exactly 3; weights 40 / 30 / 30 |

## PitchCheckItem

| Field | Type | Rules |
|-------|------|-------|
| id | `"problem" \| "solution" \| "ai" \| "demo"` | Unique |
| label | string | Checklist heading |
| detail | string | One sentence |

## PitchCriterion

| Field | Type | Rules |
|-------|------|-------|
| id | `"control-room" \| "ai" \| "taste"` | Unique |
| weight | number | 40, 30, or 30 |
| title | string | Judge-facing criterion name |
| talkingPoints | string[] | 2–4 bullets; high signal |
| liveLinks | PitchLink[] | ≥1 for control-room and ai |

## PitchLink

| Field | Type | Rules |
|-------|------|-------|
| label | string | Button/link text |
| href | string | App path (`/`, `/lanes`, `/build`, `/orders/{id}`) |
| hint | string \| null | Optional one-line why |

## ShowcaseHint

| Field | Type | Rules |
|-------|------|-------|
| vehicleSubstrings | string[] | Case-insensitive match against vehicle title (e.g. `["M4","BMW"]`) |
| preferOnRoad | boolean | Prefer qualifiesOnRoad / agent status when choosing |

## ShowcaseResolution (runtime)

| Field | Type | Rules |
|-------|------|-------|
| orderId | string \| null | Null → Pitch shows fallback copy |
| href | string | `/orders/{id}` or `/` |
| label | string | Vehicle + reference or “Pick any exception card” |
