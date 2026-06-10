import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sword, Users, Map as MapIcon, Image, Scroll, BookOpen } from "lucide-react"
import DeleteCharacterButton from "@/components/delete-character-button"
import { StatusForm, StatusTimeline, MapForm, GalleryForm, RuleForm, PdfRuleList } from "@/components/campaign-admin"
import GalleryLightbox from "@/components/gallery-lightbox"

export default async function DeadBandPage() {
  const session = await auth()
  const campaign = await prisma.campaign.findUnique({ where: { slug: "dead-band" } })
  if (!campaign) notFound()

  const isAdmin = session?.user?.role === "admin"
  const isApproved = !!session?.user && session.user.role !== "pending"

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
      include: { images: { orderBy: { createdAt: "asc" } } },
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="relative z-10">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-600/70 hover:text-amber-400 mb-6 transition font-mono text-sm">
          <ArrowLeft size={16} />
          ← На главную
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-amber-900/50 to-red-900/50 rounded-xl border border-amber-700/30">
            <Sword size={36} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-amber-600/60 font-mono tracking-widest uppercase">Company</p>
            <h1 className="text-4xl font-black">
              <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                The Dead Band
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Классическая D&D 5e кампания в Средиземье</p>
          </div>
        </div>
      </header>

      <nav className="container mx-auto px-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "characters", label: "Персонажи", icon: Users },
            { id: "rules", label: "Правила", icon: BookOpen },
            { id: "maps", label: "Карты", icon: MapIcon },
            { id: "gallery", label: "Галерея", icon: Image },
            { id: "statuses", label: "Летопись", icon: Scroll },
          ].map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className="flex items-center gap-2 border border-amber-900/30 hover:border-amber-700/50 bg-slate-900/60 hover:bg-slate-800/60 px-3 py-1.5 rounded-lg transition text-sm text-slate-400 hover:text-amber-300"
            >
              <tab.icon size={15} />
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-16 space-y-20">
        {/* === CHARACTERS === */}
        <section id="characters">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-medieval text-2xl flex items-center gap-3">
              <span className="text-amber-600/40 text-xl">⚔</span>
              Персонажи
            </h2>
            {session?.user && (
              <Link href="/dead-band/characters/create" className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 px-4 py-2 rounded-lg transition text-sm shadow-lg shadow-amber-900/20">
                + Создать
              </Link>
            )}
          </div>
          <div className="medieval-divider mb-6" />
          {characters.length === 0 ? (
            <p className="text-slate-500">Пока нет персонажей</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((char) => {
                const s = char.stats as Record<string, number>
                return (
                  <div key={char.id} className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-amber-900/30 hover:border-amber-700/50 transition-all duration-300 group hover:shadow-xl hover:shadow-amber-900/10 card-glow-medieval relative">
                    <Link href={`/dead-band/characters/${char.id}`} className="block">
                      <div className="flex items-center gap-3 mb-2">
                        {char.avatarUrl ? (
                          <img src={char.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-800/50" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-900/50 to-red-900/50 flex items-center justify-center text-amber-400 text-lg font-bold shrink-0 ring-2 ring-amber-800/30">
                            {char.name[0]}
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-amber-100">{char.name}</h3>
                      </div>
                      <div className="text-sm text-slate-500 mb-4">
                        {char.race} • {char.class} • Уровень {char.level}
                        {char.background && ` • ${char.background}`}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className={char.hp >= char.maxHp ? "text-green-400" : char.hp <= char.maxHp * 0.3 ? "text-red-400" : "text-yellow-400"}>HP: {char.hp}/{char.maxHp}</span>
                        <span className="text-amber-400">КД: {char.ac}</span>
                        <span className="text-slate-500">СИЛ:{s.str ?? 10} ЛВК:{s.dex ?? 10} ВЫН:{s.con ?? 10}</span>
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

        {isApproved && (
        <section id="rules">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-medieval text-2xl flex items-center gap-3">
              <span className="text-amber-600/40 text-xl">📜</span>
              Правила
            </h2>
            {isAdmin && <RuleForm slug="dead-band" />}
          </div>
          <div className="medieval-divider mb-6" />

          {imageRules.length > 0 && (
            <>
              <h3 className="text-sm font-mono tracking-widest text-amber-600/80 uppercase mb-4">Изображения</h3>
              <GalleryLightbox images={imageRules.map((r) => ({ id: r.id, url: r.url, caption: r.title }))} kind="rule" isAdmin={isAdmin} maxVisible={4} />
            </>
          )}

          {pdfRules.length > 0 && (
            <>
              {imageRules.length > 0 && <div className="medieval-divider my-6" />}
              <h3 className="text-sm font-mono tracking-widest text-amber-600/80 uppercase mb-4">PDF</h3>
              <PdfRuleList rules={pdfRules} isAdmin={isAdmin} />
            </>
          )}

          {rules.length === 0 && <p className="text-slate-500">Пока нет правил</p>}
        </section>
        )}

        {/* === MAPS === */}
        <section id="maps">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-medieval text-2xl flex items-center gap-3">
              <span className="text-amber-600/40 text-xl">🗺</span>
              Карты
            </h2>
            {isAdmin && <MapForm slug="dead-band" />}
          </div>
          <div className="medieval-divider mb-6" />
          {maps.length === 0 ? (
            <p className="text-slate-500">Пока нет карт</p>
          ) : (
              <GalleryLightbox
                images={maps.map((m) => ({ id: m.id, url: m.url, caption: m.name }))}
                kind="map"
                isAdmin={isAdmin}
                maxVisible={4}
              />
          )}
        </section>

        {/* === GALLERY === */}
        <section id="gallery">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-medieval text-2xl flex items-center gap-3">
              <span className="text-amber-600/40 text-xl">🖼</span>
              Галерея
            </h2>
            {isApproved && <GalleryForm slug="dead-band" />}
          </div>
          <div className="medieval-divider mb-6" />
          <GalleryLightbox
            images={gallery.map((g) => ({ id: g.id, url: g.url, caption: g.caption }))}
            kind="gallery"
            isAdmin={isApproved}
            maxVisible={4}
          />
        </section>

        {/* === STATUSES (ЛЕТОПИСЬ) === */}
        <section id="statuses">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-medieval text-2xl flex items-center gap-3">
              <span className="text-amber-600/40 text-xl">📖</span>
              Летопись
            </h2>
            {isAdmin && <StatusForm slug="dead-band" />}
          </div>
          <div className="medieval-divider mb-6" />
          {statuses.length === 0 ? (
            <p className="text-slate-500">Пока нет записей</p>
          ) : (
            <StatusTimeline
              statuses={statuses.map((s) => ({
                ...s,
                images: s.images as { id: string; url: string }[],
              }))}
              isAdmin={isAdmin}
              isApproved={isApproved}
              color="amber"
            />
          )}
        </section>
      </main>
      </div>
      </div>
    </div>
  )
}