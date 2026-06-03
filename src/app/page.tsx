import Link from "next/link";
import { Sword, Users, Map, Image, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          ДНД Клуб
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Настольные ролевые игры вживую
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <a
            href="https://t.me/d21_blg"
            target="_blank"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            <MessageCircle size={20} />
            Telegram
          </a>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Наши компании
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/dead-band"
            className="group bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition border border-slate-700 hover:border-amber-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-900/50 rounded-lg group-hover:bg-red-900 transition">
                <Sword className="text-red-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold">The Dead Band</h3>
            </div>
            <p className="text-slate-400">
              Классическое приключение в мрачном фэнтези мире
            </p>
          </Link>

          <Link
            href="/shards"
            className="group bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition border border-slate-700 hover:border-purple-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-900/50 rounded-lg group-hover:bg-purple-900 transition">
                <svg
                  className="text-purple-400"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Shards of Night City</h3>
            </div>
            <p className="text-slate-400">
              Киберпанк история в неоновом мегаполисе
            </p>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
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
