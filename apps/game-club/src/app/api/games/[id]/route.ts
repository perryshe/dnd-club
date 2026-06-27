import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma-game"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const game = await prisma.game.update({
    where: { id: params.id },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  await prisma.game.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
