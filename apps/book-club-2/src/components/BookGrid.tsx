import { prisma } from "@/lib/prisma"
import BookCard from "./BookCard"

export default async function BookGrid() {
  const books = await prisma.book.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reviews: { select: { rating: true } },
      progress: { select: { completed: true } },
    },
  })

  if (books.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-500">// все книги</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
