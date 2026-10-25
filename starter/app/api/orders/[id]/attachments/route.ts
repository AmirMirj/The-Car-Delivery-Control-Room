import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { attachmentKey, readAttachmentManifest } from "@/lib/attachments"
import { db } from "@/lib/db"
import { objectStore } from "@/lib/object-store"
import { orders } from "@/lib/schema"

export const runtime = "nodejs"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  // Hosted deploys (e.g. Vercel) may have no attachments folder or object store; show "no files" instead of erroring.
  if (!process.env.S3_ENDPOINT || !process.env.S3_BUCKET) return NextResponse.json({ attachments: [] })
  let manifest: Awaited<ReturnType<typeof readAttachmentManifest>>
  try {
    manifest = await readAttachmentManifest()
  } catch {
    return NextResponse.json({ attachments: [] })
  }
  const attachments = manifest.filter((attachment) => attachment.order_id === id)
  if (!attachments.length) return NextResponse.json({ attachments: [] })
  const { client, bucket } = objectStore()
  try {
    const records = await Promise.all(attachments.map(async (attachment) => ({
      ...attachment,
      url: await getSignedUrl(client, new GetObjectCommand({
        Bucket: bucket,
        Key: attachmentKey(attachment),
        ResponseContentType: attachment.content_type,
        ResponseContentDisposition: "inline",
      }), { expiresIn: 900 }),
    })))
    return NextResponse.json({ attachments: records })
  } finally {
    client.destroy()
  }
}
