"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createCharacter(slug: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизован")

  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const stats = {
    str: Number(formData.get("str")) || 10,
    dex: Number(formData.get("dex")) || 10,
    con: Number(formData.get("con")) || 10,
    int: Number(formData.get("int")) || 10,
    wis: Number(formData.get("wis")) || 10,
    cha: Number(formData.get("cha")) || 10,
  }

  await prisma.character.create({
    data: {
      userId: session.user.id,
      campaignId: campaign.id,
      name: formData.get("name") as string,
      race: formData.get("race") as string,
      class: formData.get("class") as string,
      level: Number(formData.get("level")) || 1,
      hp: Number(formData.get("hp")) || 10,
      maxHp: Number(formData.get("maxHp")) || 10,
      ac: Number(formData.get("ac")) || 10,
      stats,
      equipment: (formData.get("equipment") as string) || "",
      notes: (formData.get("notes") as string) || "",
      backstory: (formData.get("backstory") as string) || "",
    },
  })

  revalidatePath(`/${slug}`)
}

export async function deleteCharacter(characterId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизован")

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { campaign: true },
  })
  if (!character) throw new Error("Персонаж не найден")

  const isAdmin = session.user.role === "admin"
  const isOwner = character.userId === session.user.id
  if (!isAdmin && !isOwner) throw new Error("Нет доступа")

  await prisma.character.delete({ where: { id: characterId } })

  revalidatePath(`/${character.campaign.slug}`)
}
