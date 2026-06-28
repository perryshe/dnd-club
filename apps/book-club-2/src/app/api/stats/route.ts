import { prisma } from "@/lib/prisma"
import { prismaAuth } from "@/lib/prisma-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const [users, books, reviews, meetings] = await Promise.all([
    prismaAuth.user.count({ where: { role: { not: "pending" } } }),
    prisma.book.count({ where: { status: "past" } }),
    prisma.review.count(),
    prisma.meeting.count(),
  ])

  return Response.json({ users, books, reviews, meetings })
}
