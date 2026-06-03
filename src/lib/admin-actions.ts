"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Только для админа")
  return session
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

  await prisma.map.create({
    data: {
      campaignId: campaign.id,
      name: (formData.get("name") as string) || "",
      url: (formData.get("url") as string) || "",
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

  await prisma.gallery.create({
    data: {
      campaignId: campaign.id,
      url: (formData.get("url") as string) || "",
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
