import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function GET() {
  const games = await prisma.game.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(games)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const game = await prisma.game.create({
    data: {
      name: body.name,
      time: body.time || null,
      players: body.players || null,
      age: body.age || null,
      year: body.year ? parseInt(body.year) : null,
      isExp: body.isExp || false,
      image: body.image || null,
    },
  })
  return NextResponse.json(game)
}
