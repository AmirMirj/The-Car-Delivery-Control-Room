import {
  findActiveRun, finishRun, insertMessage, insertProposal, insertRun, latestProposalForRun,
} from "./store"
import type { MutationOp } from "./policy"
import { runTool, type OrderToolContext } from "./tools"

export type LoopInput = {
  orderId: string
  trigger: "auto_exception" | "user_chat" | "user_rerun" | "fleet_pass"
  userMessage?: string
  ctx: OrderToolContext
}

export type LoopResult = {
  runId: string
  status: string
  proposalId: string | null
  handoverSummary: string | null
  decisionText: string | null
}

/** Deterministic tool-using agent loop with optional OpenAI completion when OPENAI_API_KEY is set. */
export async function runOnRoadAgent(input: LoopInput): Promise<LoopResult> {
  const existing = await findActiveRun(input.orderId)
  if (existing && (input.trigger === "auto_exception" || input.trigger === "fleet_pass")) {
    const open = await latestProposalForRun(existing.id)
    return {
      runId: existing.id,
      status: existing.status,
      proposalId: open?.id ?? null,
      handoverSummary: existing.handover_summary,
      decisionText: existing.decision_text,
    }
  }

  const runId = await insertRun({ orderId: input.orderId, trigger: input.trigger })

  try {
    if (input.userMessage) {
      await insertMessage({ runId, orderId: input.orderId, role: "user", content: input.userMessage })
    } else {
      await insertMessage({
        runId,
        orderId: input.orderId,
        role: "system",
        content: "Auto-started on-road exception: gather safety, location, evidence, then propose one decision for ops.",
      })
    }

    const toolPlan: { name: string; args: Record<string, unknown> }[] = [
      { name: "lookup_order", args: {} },
      { name: "ask_driver", args: { question: "Are you safe? Where exactly are you?" } },
      { name: "request_evidence", args: { kind: "warning_light_photo" } },
      { name: "map_lookup", args: {} },
    ]

    if (input.userMessage?.toLowerCase().includes("customer")) {
      const blocked = await runTool("contact_customer", {}, input.ctx)
      await insertMessage({ runId, orderId: input.orderId, role: "tool", content: blocked.output, toolName: blocked.name, toolPayload: { ok: blocked.ok } })
      await insertMessage({ runId, orderId: input.orderId, role: "assistant", content: blocked.output })
    }

    const findings: string[] = []
    for (const step of toolPlan) {
      const result = await runTool(step.name, step.args, input.ctx)
      findings.push(`${result.name}: ${result.output}`)
      await insertMessage({
        runId,
        orderId: input.orderId,
        role: "tool",
        content: result.output,
        toolName: result.name,
        toolPayload: { args: step.args, ok: result.ok },
      })
    }

    let decisionText = buildDecision(input.ctx)
    let handoverSummary = buildHandover(input.ctx, findings)
    if (process.env.OPENAI_API_KEY) {
      try {
        const live = await maybeLivePolish(input.ctx, findings, input.userMessage)
        if (live) {
          decisionText = live.decision
          handoverSummary = live.handover
        }
      } catch {
        // Keep deterministic draft if live polish fails.
      }
    }

    await insertMessage({
      runId,
      orderId: input.orderId,
      role: "assistant",
      content: `${handoverSummary}\n\nProposed decision: ${decisionText}`,
    })

    const ops: MutationOp[] = [
      { type: "record_driver_contact", channel: "app", summary: "Asked driver about safety and location (simulated)." },
      { type: "add_order_note", text: `On-road agent: ${decisionText}` },
      { type: "set_internal_flag", key: "on_road_status", value: "awaiting_ops_decision" },
      {
        type: "draft_customer_message",
        body: `Draft only (not sent): Delivery for ${input.ctx.reference} may be delayed due to an on-road stop. Ops will confirm next steps.`,
      },
    ]

    const proposalId = await insertProposal({
      orderId: input.orderId,
      runId,
      title: "On-road next step",
      summary: handoverSummary,
      decision: decisionText,
      ops,
    })

    await finishRun({ runId, status: "awaiting_review", handoverSummary, decisionText })
    return { runId, status: "awaiting_review", proposalId, handoverSummary, decisionText }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent run failed"
    await finishRun({ runId, status: "failed", error: message })
    await insertMessage({ runId, orderId: input.orderId, role: "assistant", content: `Run failed: ${message}` })
    return { runId, status: "failed", proposalId: null, handoverSummary: null, decisionText: null }
  }
}

function buildHandover(ctx: OrderToolContext, findings: string[]): string {
  return [
    `Order ${ctx.reference} (${ctx.vehicle}) on lane “${ctx.lane}”, route ${ctx.route}.`,
    `Attention: ${ctx.attentionSummary || "none listed"}.`,
    "Gathered (simulated): driver reports they are safe at a service area; warning-light evidence requested; map lookup is mock-only.",
    findings[1] ? `Driver: ${findings[1].replace(/^ask_driver:\s*/, "").slice(0, 220)}` : null,
  ].filter(Boolean).join(" ")
}

function buildDecision(ctx: OrderToolContext): string {
  return `Car ${ctx.vehicle} is stopped and the driver is safe. Call the dealer (${ctx.customer}) to ask whether they send roadside assistance or want a tow, and expect the delivery promise to slip. Approve to record this plan in the synthetic demo world (draft customer message is stored, not sent).`
}

async function maybeLivePolish(ctx: OrderToolContext, findings: string[], userMessage?: string): Promise<{ handover: string; decision: string } | null> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  const base = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "")
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  const prompt = `You are Bahn's on-road ops agent. Never contact the paying customer yourself. Summarize findings and propose ONE decision for an ops person.\nOrder: ${ctx.reference} ${ctx.vehicle} ${ctx.route}\nFindings:\n${findings.join("\n")}\nUser: ${userMessage ?? "(auto-run)"}\nReply as JSON {"handover":"...","decision":"..."}`
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  })
  if (!response.ok) return null
  const data = await response.json() as { choices?: { message?: { content?: string } }[] }
  const content = data.choices?.[0]?.message?.content
  if (!content) return null
  const parsed = JSON.parse(content) as { handover?: string; decision?: string }
  if (!parsed.handover || !parsed.decision) return null
  return { handover: parsed.handover, decision: parsed.decision }
}
