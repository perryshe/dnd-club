import Link from "next/link";
import { ArrowLeft, Map, Users, Image, Scroll } from "lucide-react";

export default function ShardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          На главную
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-purple-900/50 rounded-xl">
            <svg
              className="text-purple-400"
              width="48"
              height="48"
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
          <div>
            <h1 className="text-4xl font-bold">Shards of Night City</h1>
            <p className="text-slate-400">Cyberpunk RED кампания</p>
          </div>
        </div>
      </header>

      <nav className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg">
            <Users size={18} />
            Персонажи
          </button>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition">
            <Map size={18} />
            Карты
          </button>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition">
            <Image size={18} />
            Галерея
          </button>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition">
            <Scroll size={18} />
            Статус
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Персонажи</h2>
        <p className="text-slate-400">Скоро здесь появятся персонажи...</p>
      </main>
    </div>
  );
}
