import { NextResponse } from "next/server"
import { executeFleetPass, serializeFleetPass, startFleetPass } from "@/lib/agent/fleet"
import { latestFleetPass } from "@/lib/agent/store"

export const runtime = "nodejs"

export async function GET() {
  try {
    const pass = await latestFleetPass()
    return NextResponse.json({
      active: pass?.status === "running",
      pass: pass ? serializeFleetPass(pass) : null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fleet status unavailable"
    return NextResponse.json({ active: false, pass: null, error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const started = await startFleetPass()
    if (!started.ok) {
      return NextResponse.json(
        { error: "A fleet pass is already running", pass: serializeFleetPass(started.pass) },
        { status: 409 },
      )
    }
    void executeFleetPass(started.pass.id)
    return NextResponse.json({ pass: serializeFleetPass(started.pass) }, { status: 202 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start fleet pass"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
