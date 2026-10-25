# Quickstart: Timeline Counters & Search

## Prerequisites

- App running from `starter/` with seeded order that has a vehicle make (e.g. BMW) and Timeline entries.

## Validate

1. Open an order detail → Timeline.
2. Confirm all five pills show numbers including inactive ones; empty categories show `(0)`.
3. Type part of the vehicle make (e.g. `BMW`) in the search bar → list updates; pill counts stay the same.
4. Type a driver name fragment if drivers exist → matching behavior.
5. Type a nonsense string → empty state; clear search → full pill set returns.
6. Switch sort to Urgency on Needs a person → elevated/critical rows float up.
7. `npx tsc --noEmit` in `starter/` passes.
