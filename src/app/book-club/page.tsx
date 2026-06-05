import Link from "next/link"
import { Book, BookOpen, Feather, Library, Quote } from "lucide-react"

export default function BookClubPage() {
  return (
    <main className="min-h-screen text-stone-800 selection:bg-amber-200/60 selection:text-stone-900">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />

      {/* Nav */}
      <div className="relative">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-stone-500 hover:text-stone-700 transition flex items-center gap-2 text-sm font-mono">
            ← d21 Club
          </Link>
          <div className="flex items-center gap-2 text-stone-400">
            <Feather size={14} />
            <span className="text-xs font-mono tracking-widest uppercase">Book Club</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-100/50 border border-amber-200/60 text-amber-700 text-xs font-mono tracking-widest uppercase mb-10">
            <Book size={14} />
            Клуб любителей чтения
            <Book size={14} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-amber-800 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
              Книжный
            </span>
            <br />
            <span className="bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent">
              клуб
            </span>
          </h1>

          <p className="text-stone-500 text-lg max-w-lg mx-auto leading-relaxed font-serif italic mb-12">
            «Мы — это то, что мы читаем.
            <br />
            А читаем мы вместе.»
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mx-auto mb-16 rounded-full" />

          {/* Decorative bookshelf grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-20">
            {[
              { icon: Book, label: "Классика", color: "amber" },
              { icon: BookOpen, label: "Современное", color: "stone" },
              { icon: Library, label: "Нон-фикшн", color: "amber" },
              { icon: Feather, label: "Поэзия", color: "stone" },
              { icon: Quote, label: "Рассказы", color: "amber" },
              { icon: Book, label: "Фантастика", color: "stone" },
            ].map((item, i) => (
              <div key={i} className="group cursor-default">
                <div className={`
                  aspect-[3/4] rounded-xl flex flex-col items-center justify-center gap-3 p-4
                  border transition-all duration-300
                  ${item.color === "amber"
                    ? "bg-amber-50/50 border-amber-200/40 hover:bg-amber-100/60 hover:border-amber-300/60 hover:shadow-lg hover:shadow-amber-200/30"
                    : "bg-stone-50/50 border-stone-200/40 hover:bg-stone-100/60 hover:border-stone-300/60 hover:shadow-lg hover:shadow-stone-200/30"
                  }
                `}>
                  <item.icon size={24} className={item.color === "amber" ? "text-amber-500" : "text-stone-500"} />
                  <span className="text-[10px] font-mono tracking-wider uppercase text-center leading-tight text-stone-500">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content area — placeholder for future */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Divider */}
            <div className="flex items-center gap-4 mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <span className="text-amber-400/60 text-2xl">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>

            {/* Empty state for future content */}
            <div className="text-center py-20 px-8 rounded-2xl border border-dashed border-amber-200/40 bg-amber-50/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100/60 mb-6">
                <BookOpen size={28} className="text-amber-500/60" />
              </div>
              <h2 className="text-xl font-semibold text-stone-600 mb-3">
                Здесь пока пусто
              </h2>
              <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed font-serif italic">
                Но скоро в этом клубе появятся встречи, обсуждения,
                <br />
                подборки книг и тёплые вечера за чашкой чая.
              </p>
              <div className="mt-8 w-12 h-0.5 bg-gradient-to-r from-amber-300/60 to-transparent mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-amber-200/30">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Feather size={16} className="text-amber-400/60" />
            <span className="text-stone-400 text-xs font-mono tracking-widest uppercase">
              d21 Book Club
            </span>
            <Feather size={16} className="text-amber-400/60" />
          </div>
          <p className="text-stone-400/60 text-xs font-serif italic">
            Страница создана с любовью к книгам
          </p>
        </div>
      </footer>
    </main>
  )
}
