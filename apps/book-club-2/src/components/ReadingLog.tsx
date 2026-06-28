import { Download, Plus, RotateCcw, Trash2 } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createBookEvent, toggleBookEventStatus, deleteBookEvent } from "@/lib/actions"
import Countdown from "./Countdown"

const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

function formatDate(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

function searchQuery(title: string, author: string): string {
  return encodeURIComponent(`${title} ${author}`.replace(/\s+/g, "+"))
}

export default async function ReadingLog() {
  const session = await auth()
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "sadmin"
  const events = await prisma.book.findMany({
    where: { eventDate: { not: null } },
    orderBy: { eventDate: "desc" },
  })

  if (events.length === 0) return null

  const genreMap = new Map<string, number>()
  for (const e of events) {
    if (e.description) {
      genreMap.set(e.description, (genreMap.get(e.description) || 0) + 1)
    }
  }

  return (
    <section id="reading-log" className="relative pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// reading log</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          </div>

          {/* Genre tags with counts */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Array.from(genreMap.entries()).map(([genre, count]) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-700/50 bg-slate-800/40 text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500"
              >
                {genre}
                <span className="text-cyan-500/50 text-[9px]">{count}</span>
              </span>
            ))}
          </div>

          {/* Admin form */}
          {isAdmin && (
            <form action={createBookEvent} className="mb-8 p-4 rounded-xl border border-dashed border-cyan-700/30 bg-cyan-950/10">
              <div className="flex items-center gap-2 mb-4">
                <Plus size={14} className="text-cyan-500/60" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-500/60">Новое событие</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <input name="title" placeholder="Название" required
                  className="col-span-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
                <input name="author" placeholder="Автор" required
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
                <input name="genre" placeholder="Жанр" required
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
                <input name="date" type="datetime-local" required
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50 [color-scheme:dark]" />
                <button type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono tracking-wider uppercase text-white font-semibold transition">
                  Добавить
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {events.map((book, idx) => {
              const isPlan = book.status === "current"
              return (
                <div
                  key={book.id}
                  className={`
                    group relative flex items-start gap-5 p-5 rounded-xl
                    border transition-all duration-300
                    ${isPlan
                      ? "border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/30 hover:border-cyan-400/50"
                      : "border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-700/60"
                    }
                  `}
                >
                  <div className="absolute left-[27px] top-12 bottom-0 w-px bg-gradient-to-b from-slate-700/30 to-transparent" />

                  <div className={`
                    relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                    text-xs font-mono border
                    ${isPlan
                      ? "border-cyan-500/40 bg-cyan-950/50 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.15)]"
                      : "border-slate-700/50 bg-slate-800/50 text-slate-500"
                    }
                  `}>
                    {String(events.length - idx).padStart(2, "0")}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-semibold text-sm leading-tight ${isPlan ? "text-cyan-200" : "text-slate-300"}`}>
                        {book.title}
                      </h3>
                      <span className={`
                        flex-shrink-0 text-[9px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded
                        ${isPlan
                          ? "text-cyan-500/70 border border-cyan-500/20 bg-cyan-950/30"
                          : "text-slate-600 border border-slate-700/30 bg-slate-800/30"
                        }
                      `}>
                        {isPlan ? "plan" : "done"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-2">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wide border
                        ${isPlan
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,.15)]"
                          : "bg-slate-700/50 border-slate-600/50 text-slate-300"
                        }
                      `}>
                        {book.eventDate ? formatDate(new Date(book.eventDate)) : book.month}
                      </span>
                      {book.description && (
                        <span className="text-[9px] px-2 py-0.5 rounded border border-slate-700/30 text-slate-500 font-mono tracking-wider">
                          {book.description}
                        </span>
                      )}
                      {isPlan && book.eventDate && <Countdown target={new Date(book.eventDate)} />}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative z-10 flex items-start gap-1 pt-1">
                    {isAdmin && (
                      <>
                        <form action={toggleBookEventStatus.bind(null, book.id)}>
                          <button type="submit" title={isPlan ? "Отметить прочитанным" : "Вернуть в план"}
                            className="p-2 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-slate-800/50 transition">
                            <RotateCcw size={13} />
                          </button>
                        </form>
                        <form action={deleteBookEvent.bind(null, book.id)}>
                          <button type="submit" title="Удалить"
                            className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800/50 transition">
                            <Trash2 size={13} />
                          </button>
                        </form>
                      </>
                    )}
                    <a
                      href={`https://www.google.com/search?q=${searchQuery(book.title, book.author)}+fb2+pdf`}
                      target="_blank"
                      className={`
                        flex items-center gap-1.5 px-3 py-2 rounded-lg
                        text-[10px] font-mono tracking-wider uppercase border transition-all duration-300
                        ${isPlan
                          ? "text-cyan-400/70 border-cyan-500/20 hover:bg-cyan-950/40 hover:border-cyan-500/40"
                          : "text-slate-600 border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50 hover:text-slate-400"
                        }
                      `}
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">Читать</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
