import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sword, Users, Map as MapIcon, Image, Scroll, Plus } from "lucide-react"
import DeleteCharacterButton from "@/components/delete-character-button"

export default async function DeadBandPage() {
  const session = await auth()
  const campaign = await prisma.campaign.findUnique({
    where: { slug: "dead-band" },
  })
  if (!campaign) notFound()

  const characters = await prisma.character.findMany({
    where: { campaignId: campaign.id },
    orderBy: { createdAt: "desc" },
  })

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
            <MapIcon size={18} />
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Персонажи</h2>
          {session?.user && (
            <Link
              href="/dead-band/characters/create"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-sm"
            >
              <Plus size={18} />
              Создать
            </Link>
          )}
        </div>

        {characters.length === 0 ? (
          <p className="text-slate-400">Пока нет персонажей</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => {
              const stats = char.stats as Record<string, number>
              return (
                <div
                  key={char.id}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative group"
                >
                  <Link
                    href={`/dead-band/characters/${char.id}`}
                    className="block"
                  >
                    <h3 className="text-xl font-bold mb-2">{char.name}</h3>
                    <div className="text-sm text-slate-400 mb-4">
                      {char.race} • {char.class} • Уровень {char.level}
                      {char.background && ` • ${char.background}`}
                      {char.alignment && ` • ${char.alignment}`}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-red-400">HP: {char.hp}/{char.maxHp}</span>
                      <span className="text-blue-400">AC: {char.ac}</span>
                      <span className="text-slate-400">STR: {stats.str ?? 10} DEX: {stats.dex ?? 10} CON: {stats.con ?? 10}</span>
                    </div>
                  </Link>
                  {(session?.user?.role === "admin" || session?.user?.id === char.userId) && (
                    <DeleteCharacterButton characterId={char.id} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
