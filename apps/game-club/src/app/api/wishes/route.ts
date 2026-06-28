import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function GET() {
  const nextMeeting = await prisma.meeting.findFirst({
    where: { date: { gt: new Date() } },
    orderBy: { date: "asc" },
  })

  if (!nextMeeting) return NextResponse.json([])

  const wishes = await prisma.wish.findMany({
    where: { meetingId: nextMeeting.id },
    include: { game: true },
  })
  return NextResponse.json(wishes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { gameId, meetingId } = await req.json()
  if (!meetingId) return NextResponse.json({ error: "meetingId required" }, { status: 400 })

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { games: true },
  })
  if (!meeting || meeting.date <= new Date())
    return NextResponse.json({ error: "Meeting not found or already passed" }, { status: 400 })

  if (!meeting.allGames && !meeting.games.some(g => g.gameId === gameId))
    return NextResponse.json({ error: "Game not in meeting" }, { status: 400 })

  const existing = await prisma.wish.findUnique({
    where: { userId_gameId: { userId: session.user.id!, gameId } },
  })

  if (existing) {
    await prisma.wish.delete({ where: { id: existing.id } })
    return NextResponse.json({ action: "removed" })
  }

  await prisma.wish.create({
    data: { userId: session.user.id!, gameId, meetingId },
  })
  return NextResponse.json({ action: "added" })
}