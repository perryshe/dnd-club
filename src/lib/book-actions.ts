"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Только для админа")
  return session
}

export async function createBookEvent(formData: FormData) {
  const session = await requireAdmin()

  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const genre = formData.get("genre") as string
  const dateStr = formData.get("date") as string

  if (!title || !author || !genre || !dateStr) throw new Error("Все поля обязательны")

  await prisma.bookEvent.create({
    data: {
      title,
      author,
      genre,
      date: new Date(dateStr),
      status: "plan",
      createdBy: session.user.id!,
    },
  })

  revalidatePath("/book-club")
}

export async function toggleBookEventStatus(eventId: string) {
  await requireAdmin()

  const event = await prisma.bookEvent.findUnique({ where: { id: eventId } })
  if (!event) throw new Error("Событие не найдено")

  await prisma.bookEvent.update({
    where: { id: eventId },
    data: { status: event.status === "plan" ? "done" : "plan" },
  })

  revalidatePath("/book-club")
}

export async function deleteBookEvent(eventId: string) {
  await requireAdmin()

  await prisma.bookEvent.delete({ where: { id: eventId } })

  revalidatePath("/book-club")
}

export async function getBookEvents() {
  return prisma.bookEvent.findMany({ orderBy: { date: "desc" } })
}
