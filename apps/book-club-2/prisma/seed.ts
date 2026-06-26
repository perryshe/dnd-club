import { prisma } from "../src/lib/prisma"

async function main() {
  const books = [
    {
      title: "1984",
      author: "Джордж Оруэлл",
      status: "current",
      month: "2026-06",
      badge: "🏆 Книга месяца",
    },
    {
      title: "Мастер и Маргарита",
      author: "Михаил Булгаков",
      status: "past",
      month: "2026-05",
      badge: "🏆 Книга месяца",
    },
  ]

  for (const book of books) {
    const existing = await prisma.book.findFirst({
      where: { title: book.title, month: book.month },
    })
    if (!existing) {
      await prisma.book.create({ data: book })
      console.log(`  ✓ Book created: ${book.title}`)
    } else {
      console.log(`  · Already exists: ${book.title}`)
    }
  }

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
