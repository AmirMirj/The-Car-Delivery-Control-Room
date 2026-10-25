# UI Contract: Timeline without “Open in Conversations”

## Conversation row

- MUST NOT render a control whose accessible/visible label is `Open in Conversations`.
- MUST NOT call `openProvenanceFold("conversations")` from the Timeline conversation row utils for that purpose.
- MAY keep inline message open/hide actions in the actions column.
- Agent-row “Open in Prior agent work” is out of scope for this contract.
