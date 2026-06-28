import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 })

  const existing = await prisma.review.findUnique({ where: { id: params.id } })
  if (!existing) return Response.json({ error: "not found" }, { status: 404 })
  if (existing.userId !== session.user.id && session.user.role !== "admin" && session.user.role !== "sadmin") {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  await prisma.review.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}
