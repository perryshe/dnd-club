import { prisma } from "../src/lib/prisma"

const events: { title: string; eventDate: Date; description: string; status: string }[] = [
  { title: "Автостопом по Галактике",       eventDate: new Date("2026-02-15T18:00:00"), description: "Фантастика", status: "past" },
  { title: "Маникюр для покойника",          eventDate: new Date("2025-11-30T18:00:00"), description: "Детектив",   status: "past" },
  { title: "Бойцовский клуб",                eventDate: new Date("2025-11-08T18:00:00"), description: "Драма",      status: "past" },
  { title: "Одноэтажная Америка",            eventDate: new Date("2026-05-11T18:00:00"), description: "Нон-фикшн",  status: "past" },
  { title: "Похождения бравого солдата Швейка", eventDate: new Date("2026-03-29T18:00:00"), description: "Сатира",  status: "past" },
  { title: "Понедельник начинается в субботу",  eventDate: new Date("2026-06-13T17:00:00"), description: "Фантастика", status: "past" },
  { title: "Механическое пианино",              eventDate: new Date("2026-07-15T12:00:00"), description: "Сатира",    status: "current" },
]

async function main() {
  const books = await prisma.book.findMany()
  let updated = 0

  for (const ev of events) {
    const match = books.find(
      (b) => b.title.trim().toLowerCase() === ev.title.trim().toLowerCase()
    )
    if (!match) {
      console.log(`  ✗ Not found: ${ev.title}`)
      continue
    }
    await prisma.book.update({
      where: { id: match.id },
      data: {
        eventDate: ev.eventDate,
        description: ev.description,
        status: ev.status,
      },
    })
    console.log(`  ✓ ${ev.title} → ${ev.eventDate.toISOString()}`)
    updated++
  }

  console.log(`\nDone. ${updated} books updated.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
