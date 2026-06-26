import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const suggestions = await prisma.suggestion.findMany({
    include: {
      user: { select: { name: true } },
      votes: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return Response.json(suggestions)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 })

  const { title, author, reason } = await req.json()
  const suggestion = await prisma.suggestion.create({
    data: { userId: session.user.id, title, author, reason },
  })
  return Response.json(suggestion)
}
