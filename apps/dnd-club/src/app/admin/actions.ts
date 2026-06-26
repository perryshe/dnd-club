"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function approveUser(userId: string) {
  const session = await auth()
  if (!session?.user?.role || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
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
  if (!session?.user?.role || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    throw new Error("Нет доступа")
  }

  await prisma.user.delete({ where: { id: userId } })
  revalidatePath("/admin")
}

export async function setUserRole(userId: string, role: "admin" | "user" | "sadmin") {
  const session = await auth()
  if (!session?.user?.role || (session.user.role !== "admin" && session.user.role !== "sadmin")) {
    throw new Error("Нет доступа")
  }
  if (session.user.id === userId) {
    throw new Error("Нельзя изменить свою роль")
  }
  if (role === "sadmin" && session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Только главный администратор может назначить SAdmin")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  revalidatePath("/admin")
}
