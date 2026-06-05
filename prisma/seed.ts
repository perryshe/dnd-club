import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dnd-club.ru"
  const adminPass = process.env.ADMIN_PASSWORD || "admin123"

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        schoolNick: "admin",
        name: "Admin",
        password: await hash(adminPass, 12),
        role: "admin",
      },
    })
    console.log(`Admin created: ${adminEmail}`)
  } else {
    console.log("Admin already exists")
  }

  const campaigns = [
    { name: "The Dead Band", slug: "dead-band" },
    { name: "Shards of Night City", slug: "shards" },
  ]

  for (const c of campaigns) {
    const exists = await prisma.campaign.findUnique({ where: { slug: c.slug } })
    if (!exists) {
      await prisma.campaign.create({ data: c })
      console.log(`Campaign created: ${c.name}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
