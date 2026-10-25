import type { OrderToolContext } from "../tools"

export function pickupReadinessPlan() {
  return [
    { name: "lookup_order", args: {} },
    { name: "ask_driver", args: { question: "(Simulated call to pickup lot) Is the car ready and are papers complete?" } },
    { name: "request_evidence", args: { kind: "pickup_readiness_checklist" } },
  ]
}

export function pickupHandover(ctx: OrderToolContext, findings: string[]): string {
  return [
    `Pickup readiness for ${ctx.reference} (${ctx.vehicle}).`,
    "Simulated phone: navigated lot menu; first attempt reached voicemail; callback proposed.",
    findings.slice(0, 2).join(" · "),
  ].join(" ")
}

export function pickupDecision(ctx: OrderToolContext): string {
  return `Confirm with ops: schedule a callback to the pickup lot for ${ctx.vehicle}, and only proceed once papers are verified. No commitment or booking change yet.`
}
