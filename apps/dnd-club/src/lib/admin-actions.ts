"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import bcrypt from "bcryptjs"

function decodeFilename(name: string): string {
  let s = name
  try { if (s.includes("%")) s = decodeURIComponent(s) } catch {}

  let hasHigh = false
  for (let i = 0; i < s.length; i++) { if (s.charCodeAt(i) > 127) { hasHigh = true; break } }
  if (hasHigh) {
    try {
      const bytes = new Uint8Array(s.length)
      for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xFF
      const fixed = new TextDecoder("utf-8").decode(bytes)
      if (fixed !== s) s = fixed
    } catch {}
  }
  return s
}

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Только для админа")
  return session
}

export async function saveFile(file: File): Promise<string> {
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

  const date = new Date(formData.get("date") as string || Date.now())

  await prisma.status.create({
    data: {
      campaignId: campaign.id,
      date,
      title: (formData.get("title") as string) || "",
      essay: (formData.get("essay") as string) || "",
      result: (formData.get("result") as string) || "",
      status: date > new Date() ? "plan" : "done",
      createdBy: session.user.id!,
    },
  })

  revalidatePath(`/${slug}`)
}

export async function updateStatus(statusId: string, formData: FormData) {
  await requireAdmin()
  const status = await prisma.status.findUnique({ where: { id: statusId }, include: { campaign: true } })
  if (!status) throw new Error("Статус не найден")
  await prisma.status.update({
    where: { id: statusId },
    data: {
      date: new Date(formData.get("date") as string || Date.now()),
      title: (formData.get("title") as string) || "",
      essay: (formData.get("essay") as string) || "",
      result: (formData.get("result") as string) || "",
    },
  })
  revalidatePath(`/${status.campaign.slug}`)
}

export async function toggleStatus(statusId: string) {
  await requireAdmin()
  const status = await prisma.status.findUnique({ where: { id: statusId }, include: { campaign: true } })
  if (!status) throw new Error("Статус не найден")
  await prisma.status.update({
    where: { id: statusId },
    data: { status: status.status === "plan" ? "done" : "plan" },
  })
  revalidatePath(`/${status.campaign.slug}`)
}

export async function deleteStatus(statusId: string) {
  await requireAdmin()
  const status = await prisma.status.findUnique({ where: { id: statusId }, include: { campaign: true } })
  if (!status) throw new Error("Статус не найден")
  await prisma.status.delete({ where: { id: statusId } })
  revalidatePath(`/${status.campaign.slug}`)
}

async function requireUser() {
  const session = await auth()
  if (!session?.user || session.user.role === "pending") throw new Error("Только для зарегистрированных")
  return session
}

export async function uploadStatusImage(statusId: string, formData: FormData) {
  await requireUser()
  const status = await prisma.status.findUnique({ where: { id: statusId }, include: { campaign: true } })
  if (!status) throw new Error("Статус не найден")

  const files = formData.getAll("files") as File[]
  if (!files.length) throw new Error("Выберите файлы")
  if (files.length > 10) throw new Error("Не более 10 файлов за раз")

  for (const file of files) {
    const url = await saveFile(file)
    await prisma.statusImage.create({
      data: { statusId, url },
    })
  }

  revalidatePath(`/${status.campaign.slug}`)
}

export async function deleteStatusImage(imageId: string) {
  await requireAdmin()
  const image = await prisma.statusImage.findUnique({
    where: { id: imageId },
    include: { status: { include: { campaign: true } } },
  })
  if (!image) throw new Error("Изображение не найдено")
  await prisma.statusImage.delete({ where: { id: imageId } })
  revalidatePath(`/${image.status.campaign.slug}`)
}

// --- Map ---

export async function createMaps(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const files = formData.getAll("files") as File[]
  if (!files.length) throw new Error("Выберите файлы")
  if (files.length > 10) throw new Error("Не более 10 файлов за раз")

  for (const file of files) {
    const url = await saveFile(file)
    const name = decodeFilename(file.name.replace(/\.[^.]+$/, ""))
    await prisma.map.create({
      data: { campaignId: campaign.id, name, url, uploadedBy: session.user.id! },
    })
  }

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

export async function createGalleryImages(slug: string, formData: FormData) {
  const session = await requireUser()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const files = formData.getAll("files") as File[]
  if (!files.length) throw new Error("Выберите файлы")
  if (files.length > 10) throw new Error("Не более 10 файлов за раз")

  const caption = (formData.get("caption") as string) || ""

  for (const file of files) {
    const url = await saveFile(file)
    await prisma.gallery.create({
      data: { campaignId: campaign.id, url, caption, uploadedBy: session.user.id! },
    })
  }

  revalidatePath(`/${slug}`)
}

export async function deleteGalleryImage(imageId: string) {
  await requireUser()
  const image = await prisma.gallery.findUnique({ where: { id: imageId }, include: { campaign: true } })
  if (!image) throw new Error("Изображение не найдено")
  await prisma.gallery.delete({ where: { id: imageId } })
  revalidatePath(`/${image.campaign.slug}`)
}

// --- Rules ---

export async function createRules(slug: string, formData: FormData) {
  const session = await requireAdmin()
  const campaign = await prisma.campaign.findUnique({ where: { slug } })
  if (!campaign) throw new Error("Кампания не найдена")

  const files = formData.getAll("files") as File[]
  if (!files.length) throw new Error("Выберите файлы")
  if (files.length > 10) throw new Error("Не более 10 файлов за раз")

  for (const file of files) {
    const url = await saveFile(file)
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    const title = decodeFilename(file.name.replace(/\.[^.]+$/, ""))
    await prisma.rule.create({
      data: { campaignId: campaign.id, title, url, type: isPdf ? "pdf" : "image", uploadedBy: session.user.id! },
    })
  }

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
