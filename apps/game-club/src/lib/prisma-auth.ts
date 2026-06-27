import { PrismaClient } from "@/generated/auth"

const globalForAuth = globalThis as unknown as { authPrisma: PrismaClient }

export const authPrisma = globalForAuth.authPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForAuth.authPrisma = authPrisma
