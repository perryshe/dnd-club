"use client"

import { useState } from "react"
import { Star } from "lucide-react"

type Review = {
  id: string
  userId: string
  rating: number
  text: string | null
}

type BookCardProps = {
  book: {
    id: string
    title: string
    author: string
    badge: string | null
    status: string
    eventDate: Date | null
    reviews: Review[]
    progress: { completed: boolean }[]
  }
  userReview: Review | null
  userId: string | undefined
  isAdmin: boolean
}

export default function BookCard({ book, userReview, userId, isAdmin }: BookCardProps) {
  const [review, setReview] = useState<Review | null>(userReview)
  const [rating, setRating] = useState(userReview?.rating ?? 0)
  const [text, setText] = useState(userReview?.text ?? "")
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const avgRating = book.reviews.length > 0
    ? (book.reviews.reduce((a, r) => a + r.rating, 0) / book.reviews.length).toFixed(1)
    : "—"
  const completed = book.progress.filter((p) => p.completed).length

  const canModify = userId && (isAdmin || review?.userId === userId)

  async function submitReview() {
    if (!userId || rating === 0) return
    setSubmitting(true)
    const method = review ? "PUT" : "POST"
    const body = review
      ? JSON.stringify({ id: review.id, bookId: book.id, rating, text })
      : JSON.stringify({ bookId: book.id, rating, text })
    const res = await fetch("/b21/api/reviews", { method, headers: { "Content-Type": "application/json" }, body })
    if (res.ok) {
      const data = await res.json()
      setReview(data)
      setEditing(false)
    }
    setSubmitting(false)
  }

  async function deleteReview() {
    if (!review || !canModify) return
    setSubmitting(true)
    const res = await fetch(`/b21/api/reviews/${review.id}`, { method: "DELETE" })
    if (res.ok) {
      setReview(null)
      setRating(0)
      setText("")
      setEditing(false)
    }
    setSubmitting(false)
  }

  const dateStr = book.eventDate
    ? book.eventDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
    : null

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
      <p className="text-xs text-slate-500 font-mono mb-1">{book.author}</p>
      {dateStr && <p className="text-[10px] text-slate-600 font-mono mb-3">📅 {dateStr}</p>}

      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Star size={12} className="text-amber-400/60" />
          {avgRating}
        </span>
        <span>{book.reviews.length} рец.</span>
        {completed > 0 && <span>{completed} прочли</span>}
      </div>

      {userId && !review && !editing && (
        <button onClick={() => setEditing(true)} className="mt-3 text-[10px] font-mono tracking-wider uppercase text-cyan-500/60 hover:text-cyan-400 transition">
          + Оценить
        </button>
      )}

      {editing && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="transition hover:scale-110" disabled={submitting}>
                <Star size={16} className={n <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Отзыв (необязательно)"
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 resize-none mb-2 focus:outline-none focus:border-cyan-500/40"
            disabled={submitting}
          />
          <div className="flex items-center gap-2">
            <button onClick={submitReview} disabled={submitting || rating === 0} className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 text-[10px] font-mono tracking-wider uppercase border border-cyan-500/30 hover:bg-cyan-600/30 transition disabled:opacity-50">
              {submitting ? "..." : review ? "Сохранить" : "Оценить"}
            </button>
            {review && canModify && (
              <button onClick={deleteReview} disabled={submitting} className="px-3 py-1.5 rounded-lg text-red-400/60 text-[10px] font-mono tracking-wider uppercase border border-red-500/20 hover:border-red-500/40 transition disabled:opacity-50">
                Удалить
              </button>
            )}
            <button onClick={() => { setEditing(false); setRating(review?.rating ?? 0); setText(review?.text ?? "") }} className="text-[10px] text-slate-600 hover:text-slate-400 transition font-mono">
              Отмена
            </button>
          </div>
        </div>
      )}

      {review && !editing && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={12} className={n <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
            ))}
          </div>
          {review.text && <p className="text-[11px] text-slate-500 leading-relaxed">{review.text}</p>}
          {canModify && (
            <button onClick={() => setEditing(true)} className="mt-1 text-[9px] font-mono tracking-wider uppercase text-slate-600 hover:text-slate-400 transition">
              Изменить
            </button>
          )}
        </div>
      )}
    </div>
  )
}
