import { auth } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return Response.json({ error: "No file" }, { status: 400 })

  const ext = file.name.split(".").pop() || "jpg"
  const ts = Date.now()
  const safeName = `ul_${ts}_${Math.random().toString(36).slice(2, 6)}.${ext}`
  const dir = path.join(process.cwd(), "public", "images")
  const buf = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, safeName), buf)

  return Response.json({ filename: safeName })
}
