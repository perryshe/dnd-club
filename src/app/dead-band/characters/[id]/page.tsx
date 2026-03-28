import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

const character = {
  name: "Торин",
  race: "Человек",
  class: "Варвар",
  level: 5,
  hp: 45,
  maxHp: 52,
  ac: 16,
  str: 18,
  dex: 12,
  con: 16,
  int: 8,
  wis: 10,
  cha: 14,
  backstory:
    "Бывший солдат, который оставил службу после того, как его отряд был предан. Теперь ищет тех, кто стоит за предательством.",
  equipment: ["Двуручный топор +1", "Щит", "Золото: 120"],
  notes: "Верит в силу кулаков больше чем в слова",
};

export default function CharacterPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href="/dead-band"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          К персонажам
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{character.name}</h1>
            <p className="text-slate-400">
              {character.race} {character.class} • Уровень {character.level}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition">
            <Edit size={18} />
            Редактировать
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Предыстория</h2>
              <p className="text-slate-300">{character.backstory}</p>
            </section>

            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Снаряжение</h2>
              <ul className="list-disc list-inside text-slate-300">
                {character.equipment.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Заметки</h2>
              <p className="text-slate-300">{character.notes}</p>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Характеристики</h2>
              <div className="space-y-3">
                {[
                  { name: "STR", value: character.str },
                  { name: "DEX", value: character.dex },
                  { name: "CON", value: character.con },
                  { name: "INT", value: character.int },
                  { name: "WIS", value: character.wis },
                  { name: "CHA", value: character.cha },
                ].map((stat) => (
                  <div key={stat.name} className="flex justify-between">
                    <span className="text-slate-400">{stat.name}</span>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">HP / AC</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">HP</span>
                  <span className="text-red-400 font-bold">
                    {character.hp}/{character.maxHp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AC</span>
                  <span className="text-blue-400 font-bold">{character.ac}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
