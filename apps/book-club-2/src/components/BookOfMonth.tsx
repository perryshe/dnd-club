import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { BookOpen } from "lucide-react"
import { completeBookOfMonth, toggleReadProgress } from "@/lib/actions"

export default async function BookOfMonth() {
  const book = await prisma.book.findFirst({ where: { status: "current" } })
  if (!book) return null

  const session = await auth()
  const totalUsers = await prisma.user.count({ where: { role: { not: "pending" } } })
  const completedCount = await prisma.readProgress.count({
    where: { bookId: book.id, completed: true },
  })
  const pct = totalUsers > 0 ? Math.round((completedCount / totalUsers) * 100) : 0

  const userProgress = session?.user?.id
    ? await prisma.readProgress.findUnique({
        where: { userId_bookId: { userId: session.user.id, bookId: book.id } },
      })
    : null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={16} className="text-cyan-400" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-500/60">// книга месяца</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-900/50 to-slate-950/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-[10px] font-mono tracking-wider uppercase mb-4">
            🏆 {book.month ?? "книга месяца"}
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{book.title}</h2>
          <p className="text-slate-400 text-sm mb-4">{book.author}</p>

          {book.description && (
            <p className="text-slate-500 text-sm mb-6 max-w-xl leading-relaxed">{book.description}</p>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1.5">
              <span>Прогресс чтения</span>
              <span>{completedCount} из {totalUsers} участников</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {session?.user?.id && (
              <form action={toggleReadProgress.bind(null, book.id)}>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border transition ${
                    userProgress?.completed
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-400"
                      : "border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-950/30"
                  }`}
                >
                  {userProgress?.completed ? "✓ Прочитал" : "Отметить прочитанным"}
                </button>
              </form>
            )}

            {session?.user?.role === "sadmin" && (
              <form action={completeBookOfMonth.bind(null, book.id)}>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition"
                >
                  Завершить книгу месяца
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
