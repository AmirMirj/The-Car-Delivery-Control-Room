/** Contact and mutation policy for the on-road agent (constitution III / IV). */

export type MutationOp =
  | { type: "add_order_note"; text: string }
  | { type: "set_internal_flag"; key: string; value: string }
  | { type: "adjust_promise_window"; start: string; end: string | null; timezone: string | null }
  | { type: "draft_customer_message"; body: string }
  | { type: "record_driver_contact"; channel: string; summary: string }

const ALLOWED = new Set([
  "add_order_note",
  "set_internal_flag",
  "adjust_promise_window",
  "draft_customer_message",
  "record_driver_contact",
])

export function assertAllowlistedOps(ops: unknown[]): MutationOp[] {
  const out: MutationOp[] = []
  for (const raw of ops) {
    if (!raw || typeof raw !== "object") throw new Error("Invalid mutation op")
    const type = String((raw as { type?: string }).type ?? "")
    if (!ALLOWED.has(type)) throw new Error(`Mutation type not allowlisted: ${type}`)
    out.push(raw as MutationOp)
  }
  return out
}

export function denyCustomerContact(toolName: string): string | null {
  const blocked = new Set(["contact_customer", "message_customer", "call_customer", "email_customer"])
  if (blocked.has(toolName)) {
    return "Blocked: the agent must never contact a paying customer on its own. Ask an ops person to approve any customer message."
  }
  return null
}

export function isConsequentialOp(op: MutationOp): boolean {
  return op.type === "adjust_promise_window" || op.type === "draft_customer_message"
}
