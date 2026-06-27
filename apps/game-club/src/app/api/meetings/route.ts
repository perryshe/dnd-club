import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function GET() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { date: "desc" },
    include: { games: { include: { game: true } } },
  })
  return NextResponse.json(meetings)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const gameIds: string[] = body.gameIds || []

  const meeting = await prisma.meeting.create({
    data: {
      date: new Date(body.date),
      allGames: body.allGames ?? true,
      games: gameIds.length
        ? { create: gameIds.map((gid: string) => ({ gameId: gid })) }
        : undefined,
    },
    include: { games: { include: { game: true } } },
  })
  return NextResponse.json(meeting)
}
