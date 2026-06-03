import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 },
    )
  }

  const { email, name, password } = await req.json()

  if (!email || !name || !password) {
    return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен быть минимум 6 символов" },
      { status: 400 },
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "Пользователь с таким email уже существует" },
      { status: 400 },
    )
  }

  const hashed = await hash(password, 12)
  await prisma.user.create({
    data: { email, name, password: hashed, role: "pending" },
  })

  return NextResponse.json({
    message:
      "Регистрация успешна. Дождитесь подтверждения администратором.",
  })
}
