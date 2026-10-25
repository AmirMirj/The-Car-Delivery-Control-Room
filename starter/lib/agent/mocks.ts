/** Deterministic mock world for phone/map/driver replies (constitution IV). */

export function mockAskDriver(orderId: string, question: string): string {
  const q = question.toLowerCase()
  if (q.includes("safe") || q.includes("ok")) {
    return `[mock driver · ${orderId}] Yes, I'm safe. Pulled into a motorway service area. Hazard lights on.`
  }
  if (q.includes("where") || q.includes("location") || q.includes("exact")) {
    return `[mock driver · ${orderId}] Service area on the A7, northbound, about 40 minutes south of Hamburg. No GPS pin in the packet — this is a simulated reply.`
  }
  if (q.includes("photo") || q.includes("light") || q.includes("warning")) {
    return `[mock driver · ${orderId}] Sent a photo of the red warning light on the dash (simulated). Engine still runs but I stopped as instructed.`
  }
  if (q.includes("ferry") || q.includes("ship") || q.includes("miss")) {
    return `[mock driver · ${orderId}] I missed the sailing. Next ship is tomorrow evening unless we rebook. Waiting for ops.`
  }
  return `[mock driver · ${orderId}] Got your message. Standing by for instructions. (Simulated reply to: ${question.slice(0, 120)})`
}

export function mockMapLookup(orderId: string): string {
  return `[mock map · ${orderId}] Approximate position: motorway services, DE. Live coordinates are not in the packet; this is a simulated lookup for the demo.`
}

export function mockEvidenceRequest(orderId: string, kind: string): string {
  return `[mock evidence · ${orderId}] Requested ${kind} from driver. Simulated acknowledgement: file will appear as a demo attachment reference when available.`
}
