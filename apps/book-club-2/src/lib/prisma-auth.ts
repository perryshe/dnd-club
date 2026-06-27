import { PrismaClient } from "../generated/auth"

const globalForAuth = globalThis as unknown as { auth: PrismaClient }

export const prismaAuth = globalForAuth.auth ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForAuth.auth = prismaAuth