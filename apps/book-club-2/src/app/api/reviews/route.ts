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
  const review = await prisma.review.create({
    data: { userId: session.user.id, bookId, rating, text },
  })
  return Response.json(review)
}
