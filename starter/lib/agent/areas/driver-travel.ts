import type { OrderToolContext } from "../tools"

export function driverTravelPlan() {
  return [
    { name: "lookup_order", args: {} },
    { name: "map_lookup", args: {} },
    { name: "ask_driver", args: { question: "Preferred travel window and cabin vs seat for the ferry leg?" } },
  ]
}

export function travelHandover(ctx: OrderToolContext, findings: string[]): string {
  return [
    `Driver travel plan for ${ctx.reference}: ${ctx.route}.`,
    "Compared mock train + ferry + hotel options; cheapest overnight vs fastest same-day.",
    "Bookings prepared to the payment screen only (synthetic).",
    findings[1] ?? null,
  ].filter(Boolean).join(" ")
}

export function travelDecision(ctx: OrderToolContext): string {
  return `Choose travel option for ${ctx.vehicle}: (A) faster ferry+hotel ~€420 or (B) cheaper overnight train ~€280. Approve to record the draft itinerary—payment stays with a person.`
}
