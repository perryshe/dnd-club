import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const { role } = await req.json()
  if (!["user", "pending"].includes(role)) {
    return NextResponse.json({ error: "Некорректная роль" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ message: "Пользователь удалён" })
}
