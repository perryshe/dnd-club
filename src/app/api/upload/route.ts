import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "Файл не загружен" }, { status: 400 })

  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!ext || !["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)) {
    return NextResponse.json({ error: "Недопустимый формат. Разрешены: jpg, png, webp, gif, avif" }, { status: 400 })
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
