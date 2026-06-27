import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reviews: { select: { rating: true } },
      progress: { select: { completed: true } },
    },
  })

  return Response.json(books)
}
