import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import { deleteCharacter } from "@/lib/character-actions"

export default async function CharacterPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const character = await prisma.character.findUnique({
    where: { id: params.id },
    include: { campaign: true, user: true },
  })
  if (!character) notFound()

  const stats = character.stats as Record<string, number>
  const canDelete = session?.user?.role === "admin" || session?.user?.id === character.userId
  const equipment = character.equipment ? character.equipment.split("\n").filter(Boolean) : []

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href={`/${character.campaign.slug}`}
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
          {canDelete && (
            <form
              action={async () => {
                "use server"
                await deleteCharacter(character.id)
              }}
            >
              <button className="flex items-center gap-2 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg transition">
                <Trash2 size={18} />
                Удалить
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Предыстория</h2>
              <p className="text-slate-300">
                {character.backstory || "Нет предыстории"}
              </p>
            </section>

            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Снаряжение</h2>
              {equipment.length > 0 ? (
                <ul className="list-disc list-inside text-slate-300">
                  {equipment.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Нет снаряжения</p>
              )}
            </section>

            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Заметки</h2>
              <p className="text-slate-300">
                {character.notes || "Нет заметок"}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Характеристики</h2>
              <div className="space-y-3">
                {[
                  { name: "STR", key: "str" },
                  { name: "DEX", key: "dex" },
                  { name: "CON", key: "con" },
                  { name: "INT", key: "int" },
                  { name: "WIS", key: "wis" },
                  { name: "CHA", key: "cha" },
                ].map((stat) => (
                  <div key={stat.key} className="flex justify-between">
                    <span className="text-slate-400">{stat.name}</span>
                    <span className="font-bold">{stats[stat.key] ?? 10}</span>
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
  )
}
