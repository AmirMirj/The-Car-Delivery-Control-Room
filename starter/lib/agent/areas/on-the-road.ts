import type { OrderToolContext } from "../tools"

/** Thin registration of the existing on-road tool plan. */
export function onTheRoadPlan(userMessage?: string) {
  const plan = [
    { name: "lookup_order", args: {} },
    { name: "ask_driver", args: { question: "Are you safe? Where exactly are you?" } },
    { name: "request_evidence", args: { kind: "warning_light_photo" } },
    { name: "map_lookup", args: {} },
  ]
  if (userMessage?.toLowerCase().includes("tow")) {
    plan.push({ name: "ask_driver", args: { question: "Is a tow already arranged on your side?" } })
  }
  return plan
}

export function onRoadHandover(ctx: OrderToolContext, findings: string[]): string {
  return [
    `Order ${ctx.reference} (${ctx.vehicle}) on lane “${ctx.lane}”, route ${ctx.route}.`,
    `Attention: ${ctx.attentionSummary || "none listed"}.`,
    "Gathered (simulated): driver reports they are safe at a service area; warning-light evidence requested; map lookup is mock-only.",
    findings[1] ? `Driver: ${findings[1].replace(/^ask_driver:\s*/, "").slice(0, 220)}` : null,
  ].filter(Boolean).join(" ")
}

export function onRoadDecision(ctx: OrderToolContext): string {
  return `Car ${ctx.vehicle} is stopped and the driver is safe. Call the dealer (${ctx.customer}) to ask whether they send roadside assistance or want a tow, and expect the delivery promise to slip. Approve to record this plan in the synthetic demo world (draft customer message is stored, not sent).`
}
