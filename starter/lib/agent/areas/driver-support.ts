import type { OrderToolContext } from "../tools"

export function driverSupportPlan(userMessage?: string) {
  return [
    { name: "lookup_order", args: {} },
    {
      name: "ask_driver",
      args: { question: userMessage?.trim() || "What do you need help with on this delivery?" },
    },
  ]
}

export function supportHandover(ctx: OrderToolContext, findings: string[]): string {
  return [
    `Driver support on ${ctx.reference} (${ctx.vehicle}).`,
    "Routine lookup done; if the ask is simple, answer is ready—otherwise escalate.",
    findings.join(" · ").slice(0, 280),
  ].join(" ")
}

export function supportDecision(ctx: OrderToolContext): string {
  return `Escalate to ops with context for ${ctx.vehicle}: driver question needs judgment (not a routine FAQ). Do not invent a booking change. Approve to log the escalation summary.`
}
