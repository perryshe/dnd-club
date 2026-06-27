import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { voteForSuggestion, promoteToBookOfMonth } from "@/lib/actions"
import { ThumbsUp } from "lucide-react"

export default async function VoteSection() {
  const suggestions = await prisma.suggestion.findMany({
    include: {
      user: { select: { name: true } },
      votes: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const sorted = suggestions
    .map((s) => ({ ...s, voteCount: s.votes.length }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3)

  if (sorted.length === 0) return null

  const session = await auth()
  const userVotes = session?.user?.id
    ? new Set(
        (await prisma.vote.findMany({
          where: { userId: session.user.id, suggestionId: { in: sorted.map((s) => s.id) } },
          select: { suggestionId: true },
        })).map((v) => v.suggestionId)
      )
    : new Set()

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <ThumbsUp size={16} className="text-amber-400" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-500/60">// голосование за следующую книгу</span>
      </div>

      <div className="grid gap-3">
        {sorted.map((s, i) => {
          const voted = userVotes.has(s.id)
          return (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/30 p-4 hover:border-slate-600/50 transition"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500 border border-slate-700">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-200">{s.title}</div>
                <div className="text-xs text-slate-500 font-mono">{s.author}</div>
                {s.reason && <div className="text-xs text-slate-600 mt-1 line-clamp-1">{s.reason}</div>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  {s.voteCount} {s.voteCount === 1 ? "голос" : "голосов"}
                </span>
                {session?.user?.id && (
                  <form action={voteForSuggestion.bind(null, s.id)}>
                    <button
                      type="submit"
                      className={`p-2 rounded-lg border text-xs transition ${
                        voted
                          ? "border-amber-500/40 bg-amber-950/30 text-amber-400"
                          : "border-slate-700/50 text-slate-500 hover:border-amber-500/30 hover:text-amber-400"
                      }`}
                    >
                      <ThumbsUp size={14} />
                    </button>
                  </form>
                )}
                {session?.user?.role === "sadmin" && (
                  <form action={promoteToBookOfMonth.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-[10px] font-mono tracking-wider uppercase hover:bg-cyan-950/40 transition"
                    >
                      Назначить
                    </button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
