import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const reviews = await prisma.review.findMany({
    include: {
      book: { select: { title: true, author: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return Response.json(reviews)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 })

  const { bookId, rating, text } = await req.json()
  const existing = await prisma.review.findUnique({ where: { userId_bookId: { userId: session.user.id, bookId } } })
  if (existing) return Response.json({ error: "already exists" }, { status: 409 })

  const review = await prisma.review.create({
    data: { userId: session.user.id, bookId, rating, text },
  })
  return Response.json(review)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "unauthorized" }, { status: 401 })

  const { id, bookId, rating, text } = await req.json()
  const existing = await prisma.review.findUnique({ where: { id } })
  if (!existing) return Response.json({ error: "not found" }, { status: 404 })
  if (existing.userId !== session.user.id && session.user.role !== "admin" && session.user.role !== "sadmin") {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  const review = await prisma.review.update({ where: { id }, data: { rating, text } })
  return Response.json(review)
}
