import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "global"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Слишком много попыток" }, { status: 429 })
    }

    const formData = await req.formData()
    const schoolNick = formData.get("schoolNick") as string
    const name = formData.get("name") as string
    const email = (formData.get("email") as string) || `${schoolNick}@local.club`
    const password = formData.get("password") as string

    if (!schoolNick || !name || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 })
    }

    const existingNick = await prisma.user.findFirst({ where: { schoolNick } })
    if (existingNick) {
      return NextResponse.json({ error: "Такой ник уже занят" }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: "Такой email уже зарегистрирован" }, { status: 400 })
    }

    await prisma.user.create({
      data: {
        schoolNick,
        name,
        email,
        password: await hash(password, 12),
        role: "pending",
      },
    })

    return NextResponse.redirect(new URL("/login", req.url))
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
