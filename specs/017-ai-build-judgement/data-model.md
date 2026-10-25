# Data Model: AI Build Judgement

## JudgementEntry

| Field | Constraint |
|-------|------------|
| title | required, ≤80 chars |
| detail | required, plain language |
| outcome | optional enum: `kept` \| `changed` \| `rejected` |

## JudgementSection

| Field | Constraint |
|-------|------------|
| id | `asked` \| `checked` \| `threw-away` \| `first-answer` |
| title | required |
| lead | required short intro |
| entries | 3–6 JudgementEntry |

## BuildNotesDoc

| Field | Constraint |
|-------|------------|
| title | required |
| intro | required (≤3 sentences) |
| sections | exactly the four ids above, in that order |
