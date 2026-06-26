import { Star } from "lucide-react"

interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    badge: string | null
    status: string
    reviews: { rating: number }[]
    progress: { completed: boolean }[]
  }
}

export default function BookCard({ book }: BookCardProps) {
  const avgRating = book.reviews.length > 0
    ? (book.reviews.reduce((a, r) => a + r.rating, 0) / book.reviews.length).toFixed(1)
    : "—"
  const completed = book.progress.filter((p) => p.completed).length

  return (
    <div className={`rounded-xl border p-5 transition ${
      book.status === "current"
        ? "border-cyan-500/30 bg-cyan-950/20"
        : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50"
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-slate-200 leading-tight">{book.title}</h3>
        {book.badge && (
          <span className="flex-shrink-0 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-400">
            {book.badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 font-mono mb-3">{book.author}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Star size={12} className="text-amber-400/60" />
          {avgRating}
        </span>
        <span>{book.reviews.length} рец.</span>
        {completed > 0 && <span>{completed} прочли</span>}
      </div>
    </div>
  )
}
