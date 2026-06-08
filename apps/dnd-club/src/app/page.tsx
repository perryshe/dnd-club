import Link from "next/link"
import { Sword, MessageCircle, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen text-white scanlines">
      {/* Hero */}
      <div
        className="relative cyber-grid"
        style={{
          backgroundImage: "url('/images/Fon_prime.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/80 pointer-events-none" />

        <header className="relative container mx-auto px-4 py-24 text-center">
          {/* Medieval decorative element */}
          <div className="text-amber-500/30 text-6xl mb-6 select-none">⚜</div>

          <h1 className="text-7xl font-black mb-4 tracking-wide">
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              d21
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-4">
              Club
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto font-mono tracking-wider uppercase">
            /* medieval cyberpunk */
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <a
              href="https://t.me/d21_blg"
              target="_blank"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-6 py-3 rounded-lg transition shadow-lg shadow-amber-900/30"
            >
              <MessageCircle size={20} />
              Telegram
            </a>
          </div>

          {/* Campaign cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dead Band — medieval */}
            <Link
              href="/dead-band"
              className="group relative block rounded-2xl overflow-hidden border border-amber-900/40 hover:border-amber-500/70 transition-all duration-500 hover:shadow-xl hover:shadow-amber-900/30"
              style={{ minHeight: "360px" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/images/Fon_TDB.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/40 pointer-events-none" />
              <div className="relative p-8 flex flex-col justify-between h-full min-h-[360px]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-900/60 to-red-900/60 rounded-xl border border-amber-700/30 shadow-lg shadow-amber-900/20">
                    <Sword className="text-amber-400" size={28} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black text-left">
                      <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                        The Dead Band
                      </span>
                    </h3>
                    <p className="text-xs text-amber-600/80 font-mono tracking-widest uppercase text-left">Company</p>
                  </div>
                </div>
                <div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
                  <p className="text-slate-400 leading-relaxed text-left text-sm">
                    Серия сюжетных ролевых событий в сеттинге Средиземья эпохи Второй Великой войны,
                    где отряд наёмников-попаданцев выполняет опасные задания.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-amber-400 group-hover:gap-4 transition-all">
                    <span className="text-sm font-semibold">Войти в мир</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Shards — cyberpunk */}
            <Link
              href="/shards"
              className="group relative block rounded-2xl overflow-hidden border border-purple-900/40 hover:border-cyan-500/70 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-900/30"
              style={{ minHeight: "360px" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/images/Fon_SoNC.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/40 pointer-events-none" />
              <div className="relative p-8 flex flex-col justify-between h-full min-h-[360px]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-900/40 to-purple-900/60 rounded-xl border border-cyan-700/30 shadow-lg shadow-cyan-900/20">
                    <svg className="text-cyan-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black text-left">
                      <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {/* Shards of Night City  */}
                      </span>
                    </h3>
                    <p className="text-xs text-cyan-600/80 font-mono tracking-widest uppercase text-left">Company</p>
                  </div>
                </div>
                <div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent mb-3" />
                  <p className="text-slate-400 leading-relaxed text-left text-sm">
                    Те, кто выкупает битые нейротреки, продаёт чужие воспоминания и иногда
                    собирает человека заново из осколков того, кем он был.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-cyan-400 group-hover:gap-4 transition-all">
                    <span className="text-sm font-semibold">Войти в мир</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </header>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="medieval-divider max-w-2xl mx-auto" />
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-amber-500/30 text-xl">⚜</span>
            <h2 className="text-3xl font-black tracking-wide">
              <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                d21
              </span>
              <span className="text-slate-600 mx-2">—</span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                меч, киберпанк
              </span>
              <span className="text-slate-600 mx-2">—</span>
              <span className="text-slate-300">команда</span>
            </h2>
            <span className="text-cyan-500/30 text-xl">◆</span>
          </div>
          <div className="text-slate-500 leading-relaxed text-base space-y-1 font-mono text-sm">
            <p>Мы собираемся нечасто,</p>
            <p>Но каждый раз — как малый бой.</p>
            <p>Сыграем партию? Прекрасно.</p>
            <p>Команда будет за спиной.</p>
          </div>
          <div className="mt-8 cyber-divider max-w-xs mx-auto opacity-50" />
        </div>
      </footer>
    </main>
  )
}
