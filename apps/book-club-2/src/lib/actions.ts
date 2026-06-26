"use server"

import { prisma } from "./prisma"
import { auth } from "./auth"
import { revalidatePath } from "next/cache"

export async function voteForSuggestion(suggestionId: string) {
  const session = await auth()
  if (!session?.user?.id) return

  const existing = await prisma.vote.findUnique({
    where: { suggestionId_userId: { suggestionId, userId: session.user.id } },
  })
  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } })
  } else {
    await prisma.vote.create({
      data: { suggestionId, userId: session.user.id },
    })
  }
  revalidatePath("/")
}

export async function submitSuggestion(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.suggestion.create({
    data: {
      userId: session.user.id,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      reason: formData.get("reason") as string,
    },
  })
  revalidatePath("/")
}

export async function promoteToBookOfMonth(suggestionId: string) {
  const session = await auth()
  if (session?.user?.role !== "sadmin") return

  const suggestion = await prisma.suggestion.findUnique({ where: { id: suggestionId } })
  if (!suggestion) return

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

  await prisma.book.create({
    data: {
      title: suggestion.title,
      author: suggestion.author,
      status: "current",
      month,
      badge: "🏆 Книга месяца",
      suggestedById: suggestion.userId,
    },
  })
  revalidatePath("/")
}

export async function completeBookOfMonth(bookId: string) {
  const session = await auth()
  if (session?.user?.role !== "sadmin") return

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
