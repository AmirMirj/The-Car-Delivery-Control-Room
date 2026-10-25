# Feature Specification: Timeline Counters & Search

**Feature Branch**: `012-timeline-search`

**Created**: 2026-10-25

**Status**: Draft

**Input**: Always-visible numeric counters on Timeline tabs. Add a search/sort bar below tabs to filter by car model (e.g. BMW), driver names, or ops categories.

## User Scenarios & Testing

### User Story 1 - Always-visible tab counts (Priority: P1)

Ops sees how much work sits in each Timeline queue (Everything, Needs a person, Conversations, Agent, Activity) without switching tabs—counts stay visible on every pill, including zeros.

**Why this priority**: Avoid tab hopping to discover workload.

**Independent Test**: With any filter selected, all five pills show their category counts; inactive pills still show numbers.

**Acceptance Scenarios**:

1. **Given** the Timeline, **When** viewing any active filter, **Then** every filter pill shows its stable count from the unfiltered model.
2. **Given** an empty category, **When** viewing pills, **Then** that pill still shows `0` (not blank).

---

### User Story 2 - Search/filter bar (Priority: P1)

Below the pills, a compact search line filters visible Timeline rows by typed text matching car model/make, driver names on the order, or ops-ish labels in the entry (category, title, routing, detail).

**Independent Test**: Typing “BMW” or a known driver fragment or “agent” reduces the list; clearing restores the pill filter result.

**Acceptance Scenarios**:

1. **Given** entries and order vehicle/drivers, **When** the person types a model/make substring, **Then** rows that match (or the order context matches while listing relevant categories) filter accordingly—at minimum match against entry text fields and order vehicle/driver context when the query hits them.
2. **Given** a query with no matches, **When** viewing, **Then** a calm empty state appears; pill counts remain the unfiltered category totals.
3. **Given** a sort control, **When** choosing Newest vs Urgency, **Then** the filtered list order updates.

## Requirements

- **FR-001**: Filter pills MUST always show numeric counts for each category (including 0).
- **FR-002**: Counts MUST reflect the full Timeline model for that order (not the search-narrowed subset).
- **FR-003**: A search input MUST sit below the pills and filter the currently pill-filtered list by case-insensitive substring over entry fields plus order vehicle make/model/title and assignment driver names.
- **FR-004**: A compact sort control MUST offer at least Newest and Urgency (critical first, then elevated, then calm; then time).
- **FR-005**: Header “showing N” MUST match the list after pill + search + sort.
- **FR-006**: Birch/ops styling; no purple novelty.

## Success Criteria

- **SC-001**: All five pills show numbers without selecting them.
- **SC-002**: Search “BMW” on a BMW order with multiple rows still shows a reduced/relevant list or empty calm state without crashing.
- **SC-003**: Clearing search restores the full pill-filtered set.

## Assumptions

- Timeline remains per-order; vehicle/driver search uses that order’s context plus entry text.
- Pill counts already partially exist—harden always-visible zeros and add search/sort.
