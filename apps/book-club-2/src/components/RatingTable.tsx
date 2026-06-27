import { prisma } from "@/lib/prisma"
import { prismaAuth } from "@/lib/prisma-auth"
import { Users, ArrowUpDown } from "lucide-react"

export default async function RatingTable({
  searchParams,
}: {
  searchParams?: { sort?: string }
}) {
  const sort = searchParams?.sort ?? "rating"

  const [reviews, users] = await Promise.all([
    prisma.review.findMany({ select: { userId: true, rating: true } }),
    prismaAuth.user.findMany({
      where: { role: { not: "pending" } },
      select: { id: true, name: true },
    }),
  ])

  const userMap = new Map(users.map((u) => [u.id, u.name]))
  const reviewMap = new Map<string, { count: number; total: number }>()
  for (const r of reviews) {
    const entry = reviewMap.get(r.userId) ?? { count: 0, total: 0 }
    entry.count++
    entry.total += r.rating
    reviewMap.set(r.userId, entry)
  }

  const rows = Array.from(reviewMap.entries())
    .filter(([uid]) => userMap.has(uid))
    .map(([uid, data]) => ({
      name: userMap.get(uid)!,
      reviewCount: data.count,
      avgRating: data.total / data.count,
    }))

  rows.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name)
    if (sort === "count") return b.reviewCount - a.reviewCount
    return b.avgRating - a.avgRating
  })

  const sorted = rows.slice(0, 20)

  if (sorted.length === 0) return null

  const sortUrl = (col: string) => {
    const params = new URLSearchParams()
    params.set("sort", col)
    return `?${params.toString()}`
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Users size={16} className="text-purple-400" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-purple-500/60">// рейтинг читателей</span>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-[10px] font-mono tracking-wider uppercase text-slate-500">
              <th className="text-left p-4">
                <a href={sortUrl("name")} className="flex items-center gap-1 hover:text-slate-300 transition">
                  Участник <ArrowUpDown size={10} />
                </a>
              </th>
              <th className="text-left p-4">
                <a href={sortUrl("count")} className="flex items-center gap-1 hover:text-slate-300 transition">
                  Рецензий <ArrowUpDown size={10} />
                </a>
              </th>
              <th className="text-left p-4">
                <a href={sortUrl("rating")} className="flex items-center gap-1 hover:text-slate-300 transition">
                  Средняя оценка <ArrowUpDown size={10} />
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.name} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">
                      {i + 1}
                    </span>
                    <span className="text-slate-200">{row.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-400 font-mono">{row.reviewCount}</td>
                <td className="p-4">
                  <span className={`font-mono font-semibold ${
                    row.avgRating >= 4 ? "text-cyan-400" : row.avgRating >= 3 ? "text-amber-400" : "text-slate-500"
                  }`}>
                    {row.avgRating.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
