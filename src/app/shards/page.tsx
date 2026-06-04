import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Map as MapIcon, Image, Scroll, Plus, BookOpen } from "lucide-react"
import DeleteCharacterButton from "@/components/delete-character-button"
import { StatusForm, StatusTimeline, MapForm, GalleryForm, RuleForm, PdfRuleList } from "@/components/campaign-admin"
import GalleryLightbox from "@/components/gallery-lightbox"

export default async function ShardsPage() {
  const session = await auth()
  const campaign = await prisma.campaign.findUnique({ where: { slug: "shards" } })
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
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(88,28,135,0.85), rgba(88,28,135,0.55), rgba(15,23,42,0.9)), url('/images/Fon_SoNC.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      <div className="relative z-10">
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
            { id: "rules", label: "Правила", icon: BookOpen },
            { id: "maps", label: "Карты", icon: MapIcon },
            { id: "gallery", label: "Галерея", icon: Image },
            { id: "statuses", label: "Летопись", icon: Scroll },
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

        {isApproved && (
        <section id="rules">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Правила</h2>
            {isAdmin && <RuleForm slug="shards" />}
          </div>

          {imageRules.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-slate-300">Изображения</h3>
              <GalleryLightbox images={imageRules.map((r) => ({ id: r.id, url: r.url, caption: r.title }))} kind="rule" isAdmin={isAdmin} maxVisible={4} />
            </>
          )}

          {pdfRules.length > 0 && (
            <>
              {imageRules.length > 0 && <h3 className="text-lg font-semibold mt-8 mb-4 text-slate-300">PDF</h3>}
              <PdfRuleList rules={pdfRules} isAdmin={isAdmin} />
            </>
          )}

          {rules.length === 0 && <p className="text-slate-400">Пока нет правил</p>}
        </section>
        )}

        {/* === MAPS === */}
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
                maxVisible={4}
              />
          )}
        </section>

        {/* === GALLERY === */}
        <section id="gallery">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Галерея</h2>
            {isApproved && <GalleryForm slug="shards" />}
          </div>
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
            <h2 className="text-2xl font-bold">Летопись</h2>
            {isAdmin && <StatusForm slug="shards" />}
          </div>
          {statuses.length === 0 ? (
            <p className="text-slate-400">Пока нет записей</p>
          ) : (
            <StatusTimeline
              statuses={statuses.map((s) => ({
                ...s,
                images: s.images as { id: string; url: string }[],
              }))}
              isAdmin={isAdmin}
              isApproved={isApproved}
              color="purple"
            />
          )}
        </section>
      </main>
      </div>
      </div>
    </div>
  )
}
