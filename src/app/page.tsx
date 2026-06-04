import Link from "next/link";
import { Sword, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Hero with background image */}
      <div
        className="relative bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-900"
        style={{
          backgroundImage: "url('/images/Fon_prime.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900 pointer-events-none" />

        <header className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            ДНД Клуб
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Настольные ролевые игры вживую
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <a
              href="https://t.me/d21_blg"
              target="_blank"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
            >
              <MessageCircle size={20} />
              Telegram
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/dead-band"
              className="group bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 hover:bg-slate-700/80 transition border border-slate-700 hover:border-amber-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-900/50 rounded-lg group-hover:bg-red-900 transition">
                  <Sword className="text-red-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold">The Dead Band</h3>
              </div>
              <p className="text-slate-300">
                Классическое приключение в мрачном фэнтези мире
              </p>
            </Link>

            <Link
              href="/shards"
              className="group bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 hover:bg-slate-700/80 transition border border-slate-700 hover:border-purple-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-900/50 rounded-lg group-hover:bg-purple-900 transition">
                  <svg className="text-purple-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Shards of Night City</h3>
              </div>
              <p className="text-slate-300">
                Киберпанк история в неоновом мегаполисе
              </p>
            </Link>
          </div>
        </header>
      </div>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">О клубе</h2>
        <div className="max-w-2xl mx-auto text-center text-slate-300 space-y-4">
          <p>
            Мы собираемся каждую неделю для совместных приключений. 
            Новые игроки всегда welcome!
          </p>
        </div>
      </section>
    </main>
  );
}
