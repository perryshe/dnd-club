import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Map as MapIcon, Image, Scroll, Plus, BookOpen } from "lucide-react"
import DeleteCharacterButton from "@/components/delete-character-button"
import { StatusForm, DeleteStatusButton, MapForm, GalleryForm, RuleForm, DeleteRuleButton } from "@/components/campaign-admin"
import GalleryLightbox from "@/components/gallery-lightbox"

export default async function ShardsPage() {
  const session = await auth()
  const campaign = await prisma.campaign.findUnique({ where: { slug: "shards" } })
  if (!campaign) notFound()

  const isAdmin = session?.user?.role === "admin"

  const [characters, maps, statuses, gallery, rules] = await Promise.all([
    prisma.character.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.map.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.status.findMany({
      where: { campaignId: campaign.id },
      orderBy: { date: "desc" },
    }),
    prisma.gallery.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.rule.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const imageRules = rules.filter((r) => r.type === "image")
  const pdfRules = rules.filter((r) => r.type === "pdf")

  return (
    <div className="min-h-screen text-white">
      <div className="relative bg-gradient-to-b from-purple-950/95 via-purple-950/80 to-slate-900"
        style={{
          backgroundImage: "url('/images/Fon_SoNC.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 via-purple-950/40 to-slate-900" />
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} />
          На главную
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-purple-900/50 rounded-xl">
            <svg className="text-purple-400" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold">Shards of Night City</h1>
            <p className="text-slate-400">Cyberpunk RED кампания</p>
          </div>
        </div>
      </header>

      <nav className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "characters", label: "Персонажи", icon: Users },
            { id: "statuses", label: "Летопись", icon: Scroll },
            { id: "rules", label: "Правила", icon: BookOpen },
            { id: "maps", label: "Карты", icon: MapIcon },
            { id: "gallery", label: "Галерея", icon: Image },
          ].map((tab) => (
            <a key={tab.id} href={`#${tab.id}`} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition">
              <tab.icon size={18} />
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-16 space-y-16">
        <section id="characters">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Персонажи</h2>
            {session?.user && (
              <Link href="/shards/characters/create" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition text-sm">
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
                const s = char.stats as Record<string, number>
                return (
                  <div key={char.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative group">
                    <Link href={`/shards/characters/${char.id}`} className="block">
                      <div className="flex items-center gap-3 mb-2">
                        {char.avatarUrl ? (
                          <img src={char.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover bg-slate-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-lg font-bold shrink-0">
                            {char.name[0]}
                          </div>
                        )}
                        <h3 className="text-xl font-bold">{char.name}</h3>
                      </div>
                      <div className="text-sm text-slate-400 mb-4">
                        {char.race} • {char.class} • Уровень {char.level}
                        {char.background && ` • ${char.background}`}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className={char.hp >= char.maxHp ? "text-green-400" : char.hp <= char.maxHp * 0.3 ? "text-red-400" : "text-yellow-400"}>HP: {char.hp}/{char.maxHp}</span>
                        <span className="text-blue-400">КД: {char.ac}</span>
                        <span className="text-slate-400">СИЛ:{s.str ?? 10} ЛВК:{s.dex ?? 10} ВЫН:{s.con ?? 10}</span>
                      </div>
                    </Link>
                    {(isAdmin || session?.user?.id === char.userId) && (
                      <DeleteCharacterButton characterId={char.id} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section id="statuses">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Летопись</h2>
            {isAdmin && <StatusForm slug="shards" />}
          </div>
          {statuses.length === 0 ? (
            <p className="text-slate-400">Пока нет записей</p>
          ) : (
            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {statuses.map((s) => (
                <div key={s.id} className="relative pl-10">
                  <div className="absolute left-[9px] top-1.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-slate-900" />
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <time className="text-xs text-slate-500">{new Date(s.date).toLocaleDateString("ru-RU")}</time>
                        <h3 className="text-lg font-bold mt-1">{s.title}</h3>
                      </div>
                      {isAdmin && <DeleteStatusButton statusId={s.id} />}
                    </div>
                    {s.essay && <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3">{s.essay}</p>}
                    {s.result && (
                      <div className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-purple-600">
                        <span className="text-xs font-bold text-purple-400 uppercase">Результат:</span>
                        <p className="text-sm text-slate-300 mt-1">{s.result}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === RULES === */}
        <section id="rules">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Правила</h2>
            {isAdmin && <RuleForm slug="shards" />}
          </div>

          {imageRules.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-slate-300">Изображения</h3>
              <GalleryLightbox images={imageRules.map((r) => ({ id: r.id, url: r.url, caption: r.title }))} kind="rule" isAdmin={isAdmin} />
            </>
          )}

          {pdfRules.length > 0 && (
            <>
              {imageRules.length > 0 && <h3 className="text-lg font-semibold mt-8 mb-4 text-slate-300">PDF</h3>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pdfRules.map((r) => (
                  <div key={r.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{r.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">PDF</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={r.url}
                        target="_blank"
                        download
                        className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition"
                      >
                        Скачать
                      </a>
                      {isAdmin && <DeleteRuleButton ruleId={r.id} />}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {rules.length === 0 && <p className="text-slate-400">Пока нет правил</p>}
        </section>

        <section id="maps">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Карты</h2>
            {isAdmin && <MapForm slug="shards" />}
          </div>
          {maps.length === 0 ? (
            <p className="text-slate-400">Пока нет карт</p>
          ) : (
            <GalleryLightbox
              images={maps.map((m) => ({ id: m.id, url: m.url, caption: m.name }))}
              kind="map"
              isAdmin={isAdmin}
            />
          )}
        </section>

        <section id="gallery">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Галерея</h2>
            {isAdmin && <GalleryForm slug="shards" />}
          </div>
          <GalleryLightbox
            images={gallery.map((g) => ({ id: g.id, url: g.url, caption: g.caption }))}
            kind="gallery"
            isAdmin={isAdmin}
          />
        </section>
      </main>
      </div>
    </div>
  )
}
