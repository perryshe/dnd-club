import { PrismaClient } from "@/generated/gameclub"

const globalForGame = globalThis as unknown as { gamePrisma: PrismaClient }

export const prisma = globalForGame.gamePrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForGame.gamePrisma = prisma
