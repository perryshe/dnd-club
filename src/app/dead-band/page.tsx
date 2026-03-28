import Link from "next/link";
import { ArrowLeft, Sword, Users, Map, Image, Scroll } from "lucide-react";

const characters = [
  {
    id: "1",
    name: "Варвар",
    race: "Человек",
    level: 5,
    hp: 45,
    ac: 16,
    description: "Несёт двуручный топор и горячее сердце",
  },
  {
    id: "2",
    name: "Волшебник",
    race: "Эльф",
    level: 5,
    hp: 28,
    ac: 13,
    description: "Знаток запретных знаний",
  },
  {
    id: "3",
    name: "Плут",
    race: "Полурослик",
    level: 5,
    hp: 32,
    ac: 15,
    description: "Мастер теней и тихих шагов",
  },
];

const maps = [
  { id: "1", name: "Заброшенная крепость", preview: "/maps/fortress.jpg" },
  { id: "2", name: "Логово дракона", preview: "/maps/dragon-lair.jpg" },
];

export default function DeadBandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          На главную
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-red-900/50 rounded-xl">
            <Sword size={48} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">The Dead Band</h1>
            <p className="text-slate-400">Классическая D&D 5e кампания</p>
          </div>
        </div>
      </header>

      <nav className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <Link
              key={char.id}
              href={`/dead-band/characters/${char.id}`}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500 transition"
            >
              <h3 className="text-xl font-bold mb-2">{char.name}</h3>
              <div className="text-sm text-slate-400 mb-4">
                {char.race} • Уровень {char.level}
              </div>
              <p className="text-slate-300 mb-4">{char.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-red-400">HP: {char.hp}</span>
                <span className="text-blue-400">AC: {char.ac}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
