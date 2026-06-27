import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function GET() {
  const wishes = await prisma.wish.findMany({
    include: { game: true },
  })
  return NextResponse.json(wishes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { gameId } = await req.json()

  const existing = await prisma.wish.findUnique({
    where: { userId_gameId: { userId: session.user.id!, gameId } },
  })

  if (existing) {
    await prisma.wish.delete({ where: { id: existing.id } })
    return NextResponse.json({ action: "removed" })
  }

  await prisma.wish.create({
    data: { userId: session.user.id!, gameId },
  })
  return NextResponse.json({ action: "added" })
}
