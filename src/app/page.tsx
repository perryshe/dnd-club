import Link from "next/link";
import { Sword, MessageCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Hero */}
      <div
        className="relative"
        style={{
          backgroundImage: "url('/images/Fon_prime.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900 pointer-events-none" />

        <header className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            d21 Club
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Настольные ролевые игры вживую
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <a
              href="https://t.me/d21_blg"
              target="_blank"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
            >
              <MessageCircle size={20} />
              Telegram
            </a>
          </div>

          {/* Campaign cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dead Band Company */}
            <Link
              href="/dead-band"
              className="group relative block rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-500 transition"
              style={{ minHeight: "320px" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to bottom, rgba(127,29,29,0.85), rgba(127,29,29,0.55), rgba(15,23,42,0.9)), url('/images/Fon_TDB.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-900/70 rounded-lg">
                      <Sword className="text-red-400" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white">The Dead Band Company</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-left">
                    Серия сюжетных ролевых событий "The Dead Band" в сеттинге Средиземья эпохи
                    Второй Великой войны, где отряд наёмников-попаданцев выполняет опасные
                    задания — от переговоров и захвата крепости некроманта до сожжения кораблей
                    и тестирования новых механик, неизбежно сталкиваясь с эльфами, гоблинами,
                    туманом и собственным чувством юмора участников.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-amber-400 group-hover:gap-4 transition-all">
                  <span className="font-semibold">Перейти</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            {/* Shards of Night City Company */}
            <Link
              href="/shards"
              className="group relative block rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition"
              style={{ minHeight: "320px" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to bottom, rgba(88,28,135,0.85), rgba(88,28,135,0.55), rgba(15,23,42,0.9)), url('/images/Fon_SoNC.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-900/70 rounded-lg">
                      <svg className="text-purple-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white">The Shards of Night City Company</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-left">
                    Те, кто выкупает битые нейротреки, продаёт чужие воспоминания и иногда
                    собирает человека заново из осколков того, кем он был.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-purple-400 group-hover:gap-4 transition-all">
                  <span className="font-semibold">Перейти</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </header>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            d21 — меч, киберпанк и команда
          </h2>
          <div className="text-slate-300 leading-relaxed text-lg space-y-2">
            <p>Мы собираемся нечасто,</p>
            <p>Но каждый раз — как малый бой.</p>
            <p>Сыграем партию? Прекрасно.</p>
            <p>Команда будет за спиной.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
