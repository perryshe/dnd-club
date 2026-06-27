import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function GET() {
  const votes = await prisma.vote.findMany()
  const counts: Record<string, { up: number; down: number }> = {}
  for (const v of votes) {
    if (!counts[v.gameId]) counts[v.gameId] = { up: 0, down: 0 }
    if (v.direction === "up") counts[v.gameId].up++
    else counts[v.gameId].down++
  }
  return NextResponse.json(counts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { gameId, direction } = await req.json()
  if (!["up", "down"].includes(direction)) {
    return NextResponse.json({ error: "Invalid direction" }, { status: 400 })
  }

  const existing = await prisma.vote.findUnique({
    where: { userId_gameId: { userId: session.user.id!, gameId } },
  })

  if (existing) {
    if (existing.direction === direction) {
      await prisma.vote.delete({ where: { id: existing.id } })
      return NextResponse.json({ action: "removed" })
    }
    await prisma.vote.update({
      where: { id: existing.id },
      data: { direction },
    })
    return NextResponse.json({ action: "switched" })
  }

  await prisma.vote.create({
    data: { userId: session.user.id!, gameId, direction },
  })
  return NextResponse.json({ action: "created" })
}
