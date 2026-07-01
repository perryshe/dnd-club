import { prisma } from "@/lib/prisma"
import { prismaAuth } from "@/lib/prisma-auth"
import { auth } from "@/lib/auth"
import BookCard from "./BookCard"

export default async function BookGrid() {
  const session = await auth()
  const userId = session?.user?.id
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "sadmin"

  const books = await prisma.book.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reviews: { select: { id: true, userId: true, rating: true, text: true, createdAt: true } },
      progress: { select: { completed: true } },
    },
  })

  if (books.length === 0) return null

  const userIds = Array.from(new Set(books.flatMap((b) => b.reviews.map((r) => r.userId))))
  const users = await prismaAuth.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  })
  const userNames: Record<string, string> = {}
  for (const u of users) userNames[u.id] = u.name

  return (
    <section id="books" className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-500">// все книги</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => {
          const userReview = book.reviews.find((r) => r.userId === userId) ?? null
          return (
            <BookCard key={book.id} book={book} userReview={userReview} userId={userId} isAdmin={isAdmin} userNames={userNames} />
          )
        })}
      </div>
    </section>
  )
}
