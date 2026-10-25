export type FocusAreaId =
  | "pickup_readiness"
  | "driver_travel"
  | "on_the_road"
  | "driver_support"

export type AgentFocusArea = {
  id: FocusAreaId
  name: string
  jobLine: string
  agentMay: string[]
  humanMust: string[]
  exampleSituations: string[]
}

const CATALOG: AgentFocusArea[] = [
  {
    id: "pickup_readiness",
    name: "Pickup readiness",
    jobLine: "Calls the seller or lot to confirm car and paperwork are ready.",
    agentMay: ["Call pickup/seller", "Navigate phone menus", "Schedule callbacks", "Gather readiness facts"],
    humanMust: ["Consequential commitments", "Booking or cost changes", "Customer messages"],
    exampleSituations: ["pickup", "seller", "paperwork", "lot", "keys", "documents"],
  },
  {
    id: "driver_travel",
    name: "Driver travel",
    jobLine: "Plans multimodal travel and lodging up to—but not past—payment.",
    agentMay: ["Look up trains/buses/ferries/flights/hotels", "Compare price and time", "Prepare draft bookings"],
    humanMust: ["Final payment", "Confirm purchase", "Change booking dates or cost"],
    exampleSituations: ["travel", "ferry", "train", "hotel", "flight", "itinerary", "helsinki"],
  },
  {
    id: "on_the_road",
    name: "On the road",
    jobLine: "Handles breakdowns, missed connections, and delays with a proposed fix.",
    agentMay: ["Ask the driver", "Gather evidence", "Map lookup", "Draft a resolution path"],
    humanMust: ["Approve the plan", "Customer outreach", "Spend or tow commitment"],
    exampleSituations: ["breakdown", "delay", "missed", "incident", "warning", "roadside", "tow"],
  },
  {
    id: "driver_support",
    name: "Driver support",
    jobLine: "Answers routine driver questions; escalates hard cases with a summary.",
    agentMay: ["Answer routine FAQs", "Look up order facts", "Escalate with context"],
    humanMust: ["Complex judgment", "Booking invent / change", "Customer contact"],
    exampleSituations: ["faq", "question", "help desk", "how do i", "support"],
  },
]

export function listFocusAreas(): AgentFocusArea[] {
  return CATALOG.map((area) => ({ ...area, agentMay: [...area.agentMay], humanMust: [...area.humanMust], exampleSituations: [...area.exampleSituations] }))
}

export function getFocusArea(id: FocusAreaId): AgentFocusArea {
  const area = CATALOG.find((item) => item.id === id)
  if (!area) throw new Error(`Unknown focus area: ${id}`)
  return area
}

export function focusAreaLabel(id: FocusAreaId | string | null | undefined): string {
  if (!id) return "Agent"
  const found = CATALOG.find((item) => item.id === id)
  return found?.name ?? id
}
