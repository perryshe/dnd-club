import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 })

  const { suggestionId } = await req.json()
  const existing = await prisma.vote.findUnique({
    where: { suggestionId_userId: { suggestionId, userId: session.user.id } },
  })
  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } })
    return Response.json({ action: "unvoted" })
  }
  await prisma.vote.create({
    data: { suggestionId, userId: session.user.id },
  })
  return Response.json({ action: "voted" })
}
