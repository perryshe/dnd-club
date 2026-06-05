"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { saveFile } from "./admin-actions"

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

async function handleAvatar(formData: FormData): Promise<string> {
  const avatarFile = formData.get("avatar") as File | null
  if (!avatarFile || avatarFile.size === 0) return ""
  return await saveFile(avatarFile)
}

export async function createCharacter(slug: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизован")

  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const count = await prisma.character.count({
    where: { userId: session.user.id, campaignId: campaign.id },
  })
  if (count >= 3) throw new Error("Не более 3 персонажей на аккаунт в одной кампании")

  const getNum = (name: string, def = 0) => Number(formData.get(name)) || def
  const getStr = (name: string, def = "") => (formData.get(name) as string) || def

  const str = getNum("str", 10)
  const dex = getNum("dex", 10)
  const con = getNum("con", 10)
  const int = getNum("int", 10)
  const wis = getNum("wis", 10)
  const cha = getNum("cha", 10)

  const stats = { str, dex, con, int, wis, cha }

  const savingThrowsRaw = formData.get("savingThrows") as string || "{}"
  const skillsRaw = formData.get("skills") as string || "{}"
  const attacksRaw = formData.get("attacks") as string || "[]"
  const spellsRaw = formData.get("spells") as string || "{}"

  const sheet = {
    savingThrows: JSON.parse(savingThrowsRaw),
    skills: JSON.parse(skillsRaw),
    attacks: JSON.parse(attacksRaw),
    spells: JSON.parse(spellsRaw),
    featuresAndTraits: getStr("featuresAndTraits"),
    personalityTraits: getStr("personalityTraits"),
    ideals: getStr("ideals"),
    bonds: getStr("bonds"),
    flaws: getStr("flaws"),
    spellcastingAbility: getStr("spellcastingAbility"),
    spellSaveDc: getNum("spellSaveDc"),
    spellAttackBonus: getNum("spellAttackBonus"),
    deathSaveSuccesses: getNum("deathSaveSuccesses"),
    deathSaveFailures: getNum("deathSaveFailures"),
    passivePerception: getNum("passivePerception", 10 + abilityModifier(wis)),
  }

  const avatarUrl = await handleAvatar(formData)

  await prisma.character.create({
    data: {
      userId: session.user.id,
      campaignId: campaign.id,
      name: getStr("name"),
      race: getStr("race"),
      class: getStr("class"),
      level: getNum("level", 1),
      background: getStr("background"),
      alignment: getStr("alignment"),
      experiencePoints: getNum("experiencePoints"),
      avatarUrl,
      hp: getNum("hp", 10),
      maxHp: getNum("maxHp", 10),
      tempHp: getNum("tempHp"),
      ac: getNum("ac", 10),
      initiative: getNum("initiative"),
      speed: getNum("speed", 30),
      proficiencyBonus: getNum("proficiencyBonus", 2),
      inspiration: formData.get("inspiration") === "on",
      hitDice: getStr("hitDice", "d10"),
      hitDiceTotal: getNum("hitDiceTotal", 1),
      stats,
      sheet,
      equipment: getStr("equipment"),
      notes: getStr("notes"),
      backstory: getStr("backstory"),
    },
  })

  revalidatePath(`/${slug}`)
}

export async function updateCharacter(characterId: string, formData: FormData) {
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

  const getNum = (name: string, def = 0) => Number(formData.get(name)) || def
  const getStr = (name: string, def = "") => (formData.get(name) as string) || def

  const str = getNum("str", 10)
  const dex = getNum("dex", 10)
  const con = getNum("con", 10)
  const int = getNum("int", 10)
  const wis = getNum("wis", 10)
  const cha = getNum("cha", 10)

  const stats = { str, dex, con, int, wis, cha }

  const savingThrowsRaw = formData.get("savingThrows") as string || "{}"
  const skillsRaw = formData.get("skills") as string || "{}"
  const attacksRaw = formData.get("attacks") as string || "[]"
  const spellsRaw = formData.get("spells") as string || "{}"

  const sheet = {
    savingThrows: JSON.parse(savingThrowsRaw),
    skills: JSON.parse(skillsRaw),
    attacks: JSON.parse(attacksRaw),
    spells: JSON.parse(spellsRaw),
    featuresAndTraits: getStr("featuresAndTraits"),
    personalityTraits: getStr("personalityTraits"),
    ideals: getStr("ideals"),
    bonds: getStr("bonds"),
    flaws: getStr("flaws"),
    spellcastingAbility: getStr("spellcastingAbility"),
    spellSaveDc: getNum("spellSaveDc"),
    spellAttackBonus: getNum("spellAttackBonus"),
    deathSaveSuccesses: getNum("deathSaveSuccesses"),
    deathSaveFailures: getNum("deathSaveFailures"),
    passivePerception: getNum("passivePerception", 10 + abilityModifier(wis)),
  }

  const avatarUrl = await handleAvatar(formData)

  await prisma.character.update({
    where: { id: characterId },
    data: {
      name: getStr("name"),
      race: getStr("race"),
      class: getStr("class"),
      level: getNum("level", 1),
      background: getStr("background"),
      alignment: getStr("alignment"),
      experiencePoints: getNum("experiencePoints"),
      ...(avatarUrl ? { avatarUrl } : {}),
      hp: getNum("hp", 10),
      maxHp: getNum("maxHp", 10),
      tempHp: getNum("tempHp"),
      ac: getNum("ac", 10),
      initiative: getNum("initiative"),
      speed: getNum("speed", 30),
      proficiencyBonus: getNum("proficiencyBonus", 2),
      inspiration: formData.get("inspiration") === "on",
      hitDice: getStr("hitDice", "d10"),
      hitDiceTotal: getNum("hitDiceTotal", 1),
      stats,
      sheet,
      equipment: getStr("equipment"),
      notes: getStr("notes"),
      backstory: getStr("backstory"),
    },
  })

  revalidatePath(`/${character.campaign.slug}`)
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
