import type { Metadata } from "next"
import { Download, ExternalLink, Cog, MessageCircle, Plus, RotateCcw, Trash2 } from "lucide-react"
import { auth } from "@/lib/auth"
import { getBookEvents, createBookEvent, toggleBookEventStatus, deleteBookEvent } from "@/lib/book-actions"
import Countdown from "@/components/countdown"

export const metadata: Metadata = {
  title: "b21 Club",
  description: "Книжный клуб d21 Club",
}

const libraries = [
  { name: "lib.ru", url: "https://lib.ru" },
  { name: "flibusta", url: "https://flibusta.is" },
  { name: "traumlibrary", url: "https://traumlibrary.net" },
]

const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

function formatDate(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`
}

function searchQuery(title: string, author: string): string {
  return encodeURIComponent(`${title} ${author}`.replace(/\s+/g, "+"))
}

export default async function BookClubPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "admin"
  const events = await getBookEvents()

  const genreMap = new Map<string, number>()
  for (const e of events) {
    genreMap.set(e.genre, (genreMap.get(e.genre) || 0) + 1)
  }

  return (
    <main className="min-h-screen text-stone-300 bg-stone-950 scanlines selection:bg-amber-500/20 selection:text-amber-200">
      {/* Blueprint grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,.2) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,158,11,.2) 1px,transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient warm glow */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-700/5 blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-950/30 text-amber-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-12">
            <Cog size={12} />
            Module // reading division
            <Cog size={12} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-700 bg-clip-text text-transparent">
              Книжный
            </span>
            <br />
            <span className="bg-gradient-to-r from-stone-200 via-stone-300 to-stone-400 bg-clip-text text-transparent">
              клуб
            </span>
          </h1>

          <p className="text-stone-500 text-base max-w-lg mx-auto leading-relaxed font-mono mb-8">
            <span className="text-amber-500/60">[</span> brass & leather reading society <span className="text-amber-500/60">]</span>
          </p>

          <a
            href="https://t.me/c/3035877322/2"
            target="_blank"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-800 hover:from-amber-500 hover:to-yellow-700 px-6 py-3 rounded-lg transition shadow-lg shadow-amber-900/30 text-sm font-mono tracking-wider uppercase mb-16"
          >
            <MessageCircle size={18} />
            Telegram
          </a>

          {/* Brass divider */}
          <div className="relative w-32 h-px mx-auto mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border border-amber-500/40" />
          </div>

          {/* Genre tags with counts */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {Array.from(genreMap.entries()).map(([genre, count]) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-stone-700/50 bg-stone-800/40 text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500"
              >
                {genre}
                <span className="text-amber-500/50 text-[9px]">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />
              <span className="text-stone-600 font-mono text-[10px] tracking-[0.3em] uppercase">// reading log</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />
            </div>

            {/* Admin form */}
            {isAdmin && (
              <form action={createBookEvent} className="mb-8 p-4 rounded-xl border border-dashed border-amber-700/30 bg-amber-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <Plus size={14} className="text-amber-500/60" />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-500/60">Новое событие</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <input name="title" placeholder="Название" required
                    className="col-span-2 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-xs text-white font-mono placeholder:text-stone-600 outline-none focus:border-amber-500/50" />
                  <input name="author" placeholder="Автор" required
                    className="px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-xs text-white font-mono placeholder:text-stone-600 outline-none focus:border-amber-500/50" />
                  <input name="genre" placeholder="Жанр" required
                    className="px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-xs text-white font-mono placeholder:text-stone-600 outline-none focus:border-amber-500/50" />
                  <input name="date" type="datetime-local" required
                    className="px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-xs text-white font-mono outline-none focus:border-amber-500/50 [color-scheme:dark]" />
                  <button type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-mono tracking-wider uppercase text-white font-semibold transition">
                    Добавить
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {events.map((book, idx) => (
                <div
                  key={book.id}
                  className={`
                    group relative flex items-start gap-5 p-5 rounded-xl
                    border transition-all duration-300
                    ${book.status === "plan"
                      ? "border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/30 hover:border-amber-400/50"
                      : "border-stone-800/60 bg-stone-900/30 hover:bg-stone-900/50 hover:border-stone-700/60"
                    }
                  `}
                >
                  <div className="absolute left-[27px] top-12 bottom-0 w-px bg-gradient-to-b from-stone-700/30 to-transparent" />

                  <div className={`
                    relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                    text-xs font-mono border
                    ${book.status === "plan"
                      ? "border-amber-500/40 bg-amber-950/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,.15)]"
                      : "border-stone-700/50 bg-stone-800/50 text-stone-500"
                    }
                  `}>
                    {String(events.length - idx).padStart(2, "0")}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-semibold text-sm leading-tight ${book.status === "plan" ? "text-amber-200" : "text-stone-300"}`}>
                        {book.title}
                      </h3>
                      <span className={`
                        flex-shrink-0 text-[9px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded
                        ${book.status === "plan"
                          ? "text-amber-500/70 border border-amber-500/20 bg-amber-950/30"
                          : "text-stone-600 border border-stone-700/30 bg-stone-800/30"
                        }
                      `}>
                        {book.status === "plan" ? "plan" : "done"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-mono mb-2">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wide border
                        ${book.status === "plan"
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,.15)]"
                          : "bg-stone-700/50 border-stone-600/50 text-stone-300"
                        }
                      `}>
                        {formatDate(book.date)}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded border border-stone-700/30 text-stone-500 font-mono tracking-wider">
                        {book.genre}
                      </span>
                      {book.status === "plan" && <Countdown target={new Date(book.date)} />}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative z-10 flex items-start gap-1 pt-1">
                    {isAdmin && (
                      <>
                        <form action={toggleBookEventStatus.bind(null, book.id)}>
                          <button type="submit" title={book.status === "plan" ? "Отметить прочитанным" : "Вернуть в план"}
                            className="p-2 rounded-lg text-stone-600 hover:text-amber-400 hover:bg-stone-800/50 transition">
                            <RotateCcw size={13} />
                          </button>
                        </form>
                        <form action={deleteBookEvent.bind(null, book.id)}>
                          <button type="submit" title="Удалить"
                            className="p-2 rounded-lg text-stone-600 hover:text-red-400 hover:bg-stone-800/50 transition">
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
                        ${book.status === "plan"
                          ? "text-amber-400/70 border-amber-500/20 hover:bg-amber-950/40 hover:border-amber-500/40"
                          : "text-stone-600 border-stone-700/30 hover:bg-stone-800/50 hover:border-stone-600/50 hover:text-stone-400"
                        }
                      `}
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">Читать</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Libraries reference */}
            <div className="mt-8 p-4 rounded-xl border border-stone-800/50 bg-stone-900/20">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink size={12} className="text-stone-600" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-600">Бесплатные библиотеки</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {libraries.map((lib) => (
                  <a
                    key={lib.name}
                    href={lib.url}
                    target="_blank"
                    className="text-[10px] font-mono tracking-wider text-stone-500 hover:text-amber-400 transition px-2 py-1 rounded border border-stone-700/30 hover:border-amber-700/30"
                  >
                    {lib.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-stone-800/60">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-px h-3 bg-amber-500/30" />
            <span className="text-stone-600 text-[10px] font-mono tracking-[0.3em] uppercase">
              d21 // book-club
            </span>
            <div className="w-px h-3 bg-amber-500/30" />
          </div>
        </div>
      </footer>
    </main>
  )
}
