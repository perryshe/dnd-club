"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function approveUser(userId: string) {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    throw new Error("Нет доступа")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: "user" },
  })

  revalidatePath("/admin")
}

export async function deleteUser(userId: string) {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    throw new Error("Нет доступа")
  }

  await prisma.user.delete({ where: { id: userId } })
  revalidatePath("/admin")
}

export async function setUserRole(userId: string, role: "admin" | "user") {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    throw new Error("Нет доступа")
  }
  if (session.user.id === userId && role !== "admin") {
    throw new Error("Нельзя понизить себя")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  revalidatePath("/admin")
}
