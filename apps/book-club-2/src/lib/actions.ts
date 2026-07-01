"use server"

import { prisma } from "./prisma"
import { auth } from "./auth"
import { revalidatePath } from "next/cache"

export async function completeBookOfMonth(bookId: string) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") return

  await prisma.book.update({
    where: { id: bookId },
    data: { status: "past" },
  })
  revalidatePath("/")
}

export async function toggleReadProgress(bookId: string) {
  const session = await auth()
  if (!session?.user?.id) return

  const existing = await prisma.readProgress.findUnique({
    where: { userId_bookId: { userId: session.user.id, bookId } },
  })
  if (existing) {
    await prisma.readProgress.delete({ where: { id: existing.id } })
  } else {
    await prisma.readProgress.create({
      data: { userId: session.user.id, bookId, completed: true },
    })
  }
  revalidatePath("/")
}

export async function createBookEvent(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") return

  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const genre = formData.get("genre") as string
  const dateStr = formData.get("date") as string
  if (!title || !author || !genre || !dateStr) return

  await prisma.book.create({
    data: {
      title,
      author,
      description: genre,
      eventDate: new Date(dateStr),
      status: "current",
    },
  })
  revalidatePath("/")
}

export async function toggleBookEventStatus(bookId: string) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") return

  const book = await prisma.book.findUnique({ where: { id: bookId } })
  if (!book) return

  await prisma.book.update({
    where: { id: bookId },
    data: { status: book.status === "current" ? "past" : "current" },
  })
  revalidatePath("/")
}

export async function deleteBookEvent(bookId: string) {
  const session = await auth()
  if (session?.user?.role !== "admin" && session?.user?.role !== "sadmin") return

  await prisma.book.delete({ where: { id: bookId } })
  revalidatePath("/")
}
