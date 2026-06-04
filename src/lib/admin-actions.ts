"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import bcrypt from "bcryptjs"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Только для админа")
  return session
}

async function saveFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!ext || !["jpg", "jpeg", "png", "webp", "gif", "avif", "pdf"].includes(ext)) {
    throw new Error("Недопустимый формат. Разрешены: jpg, png, webp, gif, avif, pdf")
  }
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/uploads/${filename}`
}

// --- Status ---

export async function createStatus(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  await prisma.status.create({
    data: {
      campaignId: campaign.id,
      date: new Date(formData.get("date") as string || Date.now()),
      title: (formData.get("title") as string) || "",
      essay: (formData.get("essay") as string) || "",
      result: (formData.get("result") as string) || "",
      createdBy: session.user.id!,
    },
  })

  revalidatePath(`/${slug}`)
}

export async function deleteStatus(statusId: string) {
  await requireAdmin()
  const status = await prisma.status.findUnique({ where: { id: statusId }, include: { campaign: true } })
  if (!status) throw new Error("Статус не найден")
  await prisma.status.delete({ where: { id: statusId } })
  revalidatePath(`/${status.campaign.slug}`)
}

// --- Map ---

export async function createMap(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const file = formData.get("file") as File
  if (!file || !file.size) throw new Error("Выберите файл")
  const url = await saveFile(file)

  await prisma.map.create({
    data: {
      campaignId: campaign.id,
      name: (formData.get("name") as string) || "",
      url,
      uploadedBy: session.user.id!,
    },
  })

  revalidatePath(`/${slug}`)
}

export async function deleteMap(mapId: string) {
  await requireAdmin()
  const map = await prisma.map.findUnique({ where: { id: mapId }, include: { campaign: true } })
  if (!map) throw new Error("Карта не найдена")
  await prisma.map.delete({ where: { id: mapId } })
  revalidatePath(`/${map.campaign.slug}`)
}

// --- Gallery ---

export async function createGalleryImage(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const file = formData.get("file") as File
  if (!file || !file.size) throw new Error("Выберите файл")
  const url = await saveFile(file)

  await prisma.gallery.create({
    data: {
      campaignId: campaign.id,
      url,
      caption: (formData.get("caption") as string) || "",
      uploadedBy: session.user.id!,
    },
  })

  revalidatePath(`/${slug}`)
}

export async function deleteGalleryImage(imageId: string) {
  await requireAdmin()
  const image = await prisma.gallery.findUnique({ where: { id: imageId }, include: { campaign: true } })
  if (!image) throw new Error("Изображение не найдено")
  await prisma.gallery.delete({ where: { id: imageId } })
  revalidatePath(`/${image.campaign.slug}`)
}

// --- Rules ---

export async function createRule(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const file = formData.get("file") as File
  if (!file || !file.size) throw new Error("Выберите файл")
  const url = await saveFile(file)

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

  await prisma.rule.create({
    data: {
      campaignId: campaign.id,
      title: (formData.get("title") as string) || file.name,
      url,
      type: isPdf ? "pdf" : "image",
      uploadedBy: session.user.id!,
    },
  })

  revalidatePath(`/${slug}`)
}

export async function deleteRule(ruleId: string) {
  await requireAdmin()
  const rule = await prisma.rule.findUnique({ where: { id: ruleId }, include: { campaign: true } })
  if (!rule) throw new Error("Правило не найдено")
  await prisma.rule.delete({ where: { id: ruleId } })
  revalidatePath(`/${rule.campaign.slug}`)
}

// --- Password ---

export async function changePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизован")

  const current = formData.get("current") as string
  const newPass = formData.get("new") as string
  const confirm = formData.get("confirm") as string

  if (!current || !newPass || !confirm) throw new Error("Заполните все поля")
  if (newPass.length < 6) throw new Error("Новый пароль должен быть не менее 6 символов")
  if (newPass !== confirm) throw new Error("Пароли не совпадают")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) throw new Error("Пользователь не найден")

  const valid = await bcrypt.compare(current, user.password)
  if (!valid) throw new Error("Неверный текущий пароль")

  const hashed = await bcrypt.hash(newPass, 10)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

  revalidatePath("/")
}
