import type { FocusAreaId } from "./focus-areas"
import { driverSupportPlan, supportDecision, supportHandover } from "./areas/driver-support"
import { driverTravelPlan, travelDecision, travelHandover } from "./areas/driver-travel"
import { onRoadDecision, onRoadHandover, onTheRoadPlan } from "./areas/on-the-road"
import { pickupDecision, pickupHandover, pickupReadinessPlan } from "./areas/pickup-readiness"
import type { OrderToolContext } from "./tools"
import type { MutationOp } from "./policy"

export type AreaPlan = {
  focusArea: FocusAreaId
  title: string
  tools: { name: string; args: Record<string, unknown> }[]
  handover: (ctx: OrderToolContext, findings: string[]) => string
  decision: (ctx: OrderToolContext) => string
  ops: (ctx: OrderToolContext, decisionText: string) => MutationOp[]
}

export function planForFocusArea(focusArea: FocusAreaId, userMessage?: string): AreaPlan {
  switch (focusArea) {
    case "pickup_readiness":
      return {
        focusArea,
        title: "Pickup readiness next step",
        tools: pickupReadinessPlan(),
        handover: pickupHandover,
        decision: pickupDecision,
        ops: (ctx, decisionText) => [
          { type: "record_driver_contact", channel: "phone", summary: "Simulated pickup-lot call / callback." },
          { type: "add_order_note", text: `Pickup readiness agent: ${decisionText}` },
          { type: "set_internal_flag", key: "pickup_readiness", value: "awaiting_ops" },
        ],
      }
    case "driver_travel":
      return {
        focusArea,
        title: "Driver travel options",
        tools: driverTravelPlan(),
        handover: travelHandover,
        decision: travelDecision,
        ops: (ctx, decisionText) => [
          { type: "add_order_note", text: `Driver travel agent (pre-payment): ${decisionText}` },
          { type: "set_internal_flag", key: "driver_travel", value: "awaiting_ops_choice" },
        ],
      }
    case "driver_support":
      return {
        focusArea,
        title: "Driver support escalation",
        tools: driverSupportPlan(userMessage),
        handover: supportHandover,
        decision: supportDecision,
        ops: (ctx, decisionText) => [
          { type: "record_driver_contact", channel: "app", summary: "Driver support conversation (simulated)." },
          { type: "add_order_note", text: `Driver support: ${decisionText}` },
        ],
      }
    case "on_the_road":
    default:
      return {
        focusArea: "on_the_road",
        title: "On-road next step",
        tools: onTheRoadPlan(userMessage),
        handover: onRoadHandover,
        decision: onRoadDecision,
        ops: (ctx, decisionText) => [
          { type: "record_driver_contact", channel: "app", summary: "Asked driver about safety and location (simulated)." },
          { type: "add_order_note", text: `On-road agent: ${decisionText}` },
          { type: "set_internal_flag", key: "on_road_status", value: "awaiting_ops_decision" },
          {
            type: "draft_customer_message",
            body: `Draft only (not sent): Delivery for ${ctx.reference} may be delayed due to an on-road stop. Ops will confirm next steps.`,
          },
        ],
      }
  }
}
