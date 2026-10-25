<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Exception-First Control Room
  - [PRINCIPLE_2_NAME] → II. Agents Do the Legwork
  - [PRINCIPLE_3_NAME] → III. Human Approval Before Change (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] → IV. Real Agent, Synthetic World
  - [PRINCIPLE_5_NAME] → V. Operations Taste Over Engineering Surface
- Added sections:
  - Challenge Scope
  - Delivery & Judging Alignment
  - Governance (filled)
- Removed sections: none (template placeholders replaced)
- Follow-up TODOs: none
-->

# Car Delivery Control Room Constitution

## Core Principles

### I. Exception-First Control Room
The control room MUST surface only orders that need a person, with a clear
reason why, and keep quiet orders out of the way. Opening an order MUST show
in a few seconds: what happened, who said what and when, what the agent has
done, and what the next decision is. Facts MUST remain traceable to their
source records. Quiet or empty states MUST still make sense; volume MUST NOT
become a wall of forms.

**Rationale**: Bahn's old portal grew into forms-on-forms. The product is a
decision surface for operations, not a second CRM.

### II. Agents Do the Legwork
Agents MUST do cheap work first: read, ask, look up, gather evidence, and
prepare context before involving a person. When they cannot finish, they MUST
hand over one clear decision (or a short set of options) with what they found,
not a raw dump. People make judgement calls; agents hold the chain of routine
steps. Handovers MUST show who does what, how work moves, and what happens
when something goes wrong.

**Rationale**: The target workflow is agents in the background bringing people
only the cases that need them—the warning-light example in the brief.

### III. Human Approval Before Change (NON-NEGOTIABLE)
The agent MUST NEVER contact a customer on its own. A customer is anyone who
pays Bahn. Drivers and pickup places MAY be contacted. A person MUST approve
before the agent changes a booking, a date, a cost, or a message to a
customer. Asking questions and looking things up MUST NOT require approval.
Design MUST allow more agent freedom later as trust is earned; the default
MUST stay approval-gated for consequential actions.

**Rationale**: Challenge rules of the game; trust is earned, not assumed.

### IV. Real Agent, Synthetic World
The agent MUST be a real language model working in a loop with tools a person
can talk to. Everything around it MAY be mocked: phone, ferry prices, maps,
driver replies, simulated counterparts. All packet data is fictional; the team
MUST NOT introduce real people, real messages, or real bookings. Demo booking
flows MUST stop before any real purchase.

**Rationale**: Judges grade a working agent loop, not live integrations, while
keeping the packet synthetic.

### V. Operations Taste Over Engineering Surface
The UI MUST be for operations people, not engineers. It MUST NOT look like a
developer tool. One glance SHOULD say what is wrong and what to do. Signal
MUST stay high and noise low even with hundreds of orders. Prefer readable
text, calm spacing, and coherent empty/loading states over novelty chrome.

**Rationale**: Taste is 30% of judging; daily ops use is the bar.

## Challenge Scope

Build exactly two deliverables for this hackathon:

1. **Control room** — people and agents working together so every car gets
   delivered; exception queue, order situation, collaboration and failure
   paths visible.
2. **One real agent for one area** — depth over breadth. Valid focus areas
   include pickup readiness (phone), driver travel planning, on-the-road
   incidents, driver support, or another car-delivery-fit area agreed with
   Bahn (Discord/booth).

Use `dataset/`, `attachments/`, `OPERATIONS-CONTEXT.md`, and optionally
`starter/` (Next.js / TypeScript / Postgres). Treat messy data as intentional:
disagreements, alerts-as-reasons-to-look, and quotes that are not bookings.
The starter lane board is prior practice, not the required answer. Stack is
free: any model, API, framework, or UI library (including local models).

## Delivery & Judging Alignment

Work MUST stay aligned with how the challenge is scored:

- **Control room (40%)**: exception focus, enough to decide, fact provenance,
  cheap work first, clear stop/handover, clear next step after a human
  decision.
- **How you worked with AI (30%)**: document judgement with coding agents—
  what was asked, checked, discarded, and where the first answer was refused.
- **Taste (30%)**: ops-usable without a tutorial; high signal; careful craft.

Hand-in target: demo video (2–3 minutes) plus a public GitHub repo that runs
from a fresh clone via README. Prefer agent traces and tests when available.
Primary domain guidance for coding agents: `PARTICIPANT-BRIEF.md`,
`OPERATIONS-CONTEXT.md`, and `dataset/SCHEMA.md`.

## Governance

This constitution supersedes informal practice for this project. Specs,
plans, and implementation MUST comply; conflicts MUST be resolved by amending
this document, not by silent exception.

- **Amendments**: update this file, bump version (MAJOR for removed/redefined
  principles, MINOR for new or materially expanded guidance, PATCH for
  clarifications), set **Last Amended** to the amendment date, and note the
  change in a Sync Impact Report comment until review.
- **Compliance review**: before merge or demo freeze, verify approval gates,
  no autonomous customer contact, synthetic-only data, ops-facing UI, and
  exception-first presentation.
- **Runtime guidance**: use `PARTICIPANT-BRIEF.md` and `OPERATIONS-CONTEXT.md`
  for domain detail; this constitution for non-negotiable product rules.

**Version**: 1.0.0 | **Ratified**: 2026-10-24 | **Last Amended**: 2026-10-24
