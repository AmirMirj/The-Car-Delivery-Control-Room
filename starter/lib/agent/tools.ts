import { denyCustomerContact } from "./policy"
import { mockAskDriver, mockEvidenceRequest, mockMapLookup } from "./mocks"

export type ToolResult = { ok: boolean; name: string; output: string }

export type OrderToolContext = {
  orderId: string
  reference: string
  vehicle: string
  customer: string
  lane: string
  attentionSummary: string
  route: string
}

export async function runTool(name: string, args: Record<string, unknown>, ctx: OrderToolContext): Promise<ToolResult> {
  const blocked = denyCustomerContact(name)
  if (blocked) return { ok: false, name, output: blocked }

  switch (name) {
    case "lookup_order":
      return {
        ok: true,
        name,
        output: JSON.stringify({
          orderId: ctx.orderId,
          reference: ctx.reference,
          vehicle: ctx.vehicle,
          customer: ctx.customer,
          lane: ctx.lane,
          route: ctx.route,
          attention: ctx.attentionSummary,
          note: "Customer is the paying party — do not contact them autonomously.",
        }),
      }
    case "ask_driver":
      return { ok: true, name, output: mockAskDriver(ctx.orderId, String(args.question ?? "status?")) }
    case "request_evidence":
      return { ok: true, name, output: mockEvidenceRequest(ctx.orderId, String(args.kind ?? "photo")) }
    case "map_lookup":
      return { ok: true, name, output: mockMapLookup(ctx.orderId) }
    case "contact_customer":
      return { ok: false, name, output: denyCustomerContact("contact_customer")! }
    default:
      return { ok: false, name, output: `Unknown tool: ${name}` }
  }
}

export const TOOL_NAMES = ["lookup_order", "ask_driver", "request_evidence", "map_lookup"] as const
