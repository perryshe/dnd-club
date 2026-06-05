import Link from "next/link"
import { Book, BookOpen, Cpu, Library, ScanLine, Sparkles } from "lucide-react"

export default function BookClubPage() {
  return (
    <main className="min-h-screen text-slate-300 bg-slate-950 scanlines selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Digital grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,.2) 1px,transparent 1px),
            linear-gradient(90deg,rgba(34,211,238,.2) 1px,transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient neon glow */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Nav */}
      <div className="relative border-b border-slate-800/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-slate-500 hover:text-cyan-400 transition flex items-center gap-2 text-sm font-mono group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <Cpu size={14} />
            d21 Club
          </Link>
          <div className="flex items-center gap-2 text-cyan-500/50">
            <ScanLine size={14} />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase">v.0.1 — Book Club</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-12">
            <Sparkles size={12} />
            Module // reading division
            <Sparkles size={12} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Книжный
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              клуб
            </span>
          </h1>

          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed font-mono mb-12">
            <span className="text-cyan-500/60">[</span> digital library & reading collective <span className="text-cyan-500/60">]</span>
          </p>

          {/* Holographic divider */}
          <div className="relative w-32 h-px mx-auto mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border border-cyan-400/40" />
          </div>

          {/* Genre pods — futuristic book categories */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto mb-20">
            {[
              { icon: Book, label: "Классика", gradient: "from-cyan-900/40 to-blue-900/40", border: "border-cyan-700/30", iconColor: "text-cyan-400" },
              { icon: BookOpen, label: "Современное", gradient: "from-purple-900/40 to-pink-900/40", border: "border-purple-700/30", iconColor: "text-purple-400" },
              { icon: Library, label: "Нон-фикшн", gradient: "from-blue-900/40 to-cyan-900/40", border: "border-blue-700/30", iconColor: "text-blue-400" },
              { icon: ScanLine, label: "Поэзия", gradient: "from-fuchsia-900/40 to-purple-900/40", border: "border-fuchsia-700/30", iconColor: "text-fuchsia-400" },
              { icon: Sparkles, label: "Рассказы", gradient: "from-cyan-900/40 to-emerald-900/40", border: "border-cyan-700/30", iconColor: "text-emerald-400" },
              { icon: Cpu, label: "Фантастика", gradient: "from-purple-900/40 to-indigo-900/40", border: "border-purple-700/30", iconColor: "text-indigo-400" },
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <div className={`
                  aspect-[3/4] rounded-xl flex flex-col items-center justify-center gap-3 p-4
                  border bg-gradient-to-b ${item.gradient} ${item.border}
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-cyan-900/20 hover:-translate-y-1
                  relative overflow-hidden
                `}>
                  {/* Corner glitch lines */}
                  <div className="absolute top-0 left-0 w-4 h-px bg-gradient-to-r from-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 left-0 w-px h-4 bg-gradient-to-b from-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <item.icon size={22} className={`${item.iconColor} transition-transform group-hover:scale-110`} />
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-center leading-tight text-slate-500 group-hover:text-slate-300 transition-colors">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty state — future content */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section divider */}
            <div className="flex items-center gap-4 mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// node_00</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            </div>

            <div className="text-center py-20 px-8 rounded-2xl border border-slate-800/60 bg-slate-900/30 relative overflow-hidden group">
              {/* Hover scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl border border-slate-700/50 bg-slate-800/50 mb-6 group-hover:border-cyan-700/30 transition-colors">
                  <BookOpen size={26} className="text-slate-600 group-hover:text-cyan-500/60 transition-colors" />
                </div>

                <div className="inline-block px-3 py-1 rounded border border-slate-700/30 bg-slate-800/30 text-[10px] font-mono tracking-[0.2em] uppercase text-slate-600 mb-6">
                  status: empty
                </div>

                <h2 className="text-lg font-semibold text-slate-400 mb-3 font-mono">
                  <span className="text-cyan-500/40">$</span> Контент не загружен
                </h2>

                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed font-mono">
                  Модуль в разработке. Здесь появятся прочитанные книги,
                  <br />
                  обсуждения и материалы к встречам.
                </p>

                <div className="mt-8 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-700">awaiting data stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/60">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-px h-3 bg-cyan-500/30" />
            <span className="text-slate-600 text-[10px] font-mono tracking-[0.3em] uppercase">
              d21 // book-club
            </span>
            <div className="w-px h-3 bg-cyan-500/30" />
          </div>
          <p className="text-slate-700 text-[10px] font-mono tracking-[0.2em]">
            <span className="text-cyan-500/30">[</span> built with curiosity <span className="text-cyan-500/30">]</span>
          </p>
        </div>
      </footer>
    </main>
  )
}
