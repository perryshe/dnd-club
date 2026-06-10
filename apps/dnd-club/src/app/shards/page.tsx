import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Map as MapIcon, Image, Scroll, BookOpen } from "lucide-react"
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
            backgroundImage: "url('/images/Fon_SoNC.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="relative z-10">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-700/70 hover:text-cyan-400 mb-6 transition font-mono text-sm">
          <ArrowLeft size={16} />
          &lt;&lt; На главную
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-900/40 to-purple-900/60 rounded-xl border border-cyan-700/30 shadow-lg shadow-cyan-900/20">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-cyan-600/60 font-mono tracking-widest uppercase">// Company //</p>
            <h1 className="text-4xl font-black">
              <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Shards of Night City
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">Cyberpunk RED campaign</p>
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
              className="flex items-center gap-2 border border-cyan-900/30 hover:border-cyan-600/50 bg-slate-950/60 hover:bg-slate-900/60 px-3 py-1.5 rounded-lg transition text-sm text-slate-500 hover:text-cyan-300 font-mono"
            >
              <tab.icon size={15} />
              [ {tab.label} ]
            </a>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-16 space-y-20">
        {/* === CHARACTERS === */}
        <section id="characters">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-neon text-2xl flex items-center gap-3 font-mono">
              <span className="text-cyan-600/40">[#]</span>
              Персонажи
            </h2>
            {session?.user && (
              <Link href="/shards/characters/create" className="flex items-center gap-2 bg-gradient-to-r from-cyan-700 to-purple-800 hover:from-cyan-600 hover:to-purple-700 px-4 py-2 rounded-lg transition text-sm shadow-lg shadow-cyan-900/20 font-mono">
                [+ Создать]
              </Link>
            )}
          </div>
          <div className="cyber-divider mb-6" />
          {characters.length === 0 ? (
            <p className="text-slate-500 font-mono">// Система: персонажи не найдены, проверьте свой интерфейс</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((char) => {
                const s = char.stats as Record<string, number>
                return (
                  <div key={char.id} className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-900/30 hover:border-cyan-600/40 transition-all duration-300 group hover:shadow-xl hover:shadow-cyan-900/10 card-glow-neon relative">
                    <Link href={`/shards/characters/${char.id}`} className="block">
                      <div className="flex items-center gap-3 mb-2">
                        {char.avatarUrl ? (
                          <img src={char.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-800/50" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center text-cyan-400 text-lg font-bold shrink-0 ring-2 ring-cyan-800/30">
                            {char.name[0]}
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-cyan-100">{char.name}</h3>
                      </div>
                      <div className="text-sm text-slate-600 font-mono mb-4">
                        {char.race} // {char.class} // Lv.{char.level}
                        {char.background && ` // ${char.background}`}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-mono">
                        <span className={char.hp >= char.maxHp ? "text-green-400" : char.hp <= char.maxHp * 0.3 ? "text-red-400" : "text-yellow-400"}>HP: {char.hp}/{char.maxHp}</span>
                        <span className="text-cyan-400">AC: {char.ac}</span>
                        <span className="text-slate-600">STR:{s.str ?? 10} DEX:{s.dex ?? 10} CON:{s.con ?? 10}</span>
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
            <h2 className="section-title-neon text-2xl flex items-center gap-3 font-mono">
              <span className="text-cyan-600/40">[!]</span>
              Правила
            </h2>
            {isAdmin && <RuleForm slug="shards" />}
          </div>
          <div className="cyber-divider mb-6" />

          {imageRules.length > 0 && (
            <>
              <h3 className="text-xs font-mono tracking-widest text-cyan-600/80 uppercase mb-4">// Images //</h3>
              <GalleryLightbox images={imageRules.map((r) => ({ id: r.id, url: r.url, caption: r.title }))} kind="rule" isAdmin={isAdmin} maxVisible={4} />
            </>
          )}

          {pdfRules.length > 0 && (
            <>
              {imageRules.length > 0 && <div className="cyber-divider my-6" />}
              <h3 className="text-xs font-mono tracking-widest text-cyan-600/80 uppercase mb-4">// PDF //</h3>
              <PdfRuleList rules={pdfRules} isAdmin={isAdmin} />
            </>
          )}

          {rules.length === 0 && <p className="text-slate-500 font-mono">// Система: правила не найдены, проверьте свой интерфейс</p>}
        </section>
        )}

        {/* === MAPS === */}
        <section id="maps">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-neon text-2xl flex items-center gap-3 font-mono">
              <span className="text-cyan-600/40">[#]</span>
              Карты
            </h2>
            {isAdmin && <MapForm slug="shards" />}
          </div>
          <div className="cyber-divider mb-6" />
          {maps.length === 0 ? (
            <p className="text-slate-500 font-mono">// Система: карты не найдены, проверьте свой интерфейс</p>
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
            <h2 className="section-title-neon text-2xl flex items-center gap-3 font-mono">
              <span className="text-cyan-600/40">[@]</span>
              Галерея
            </h2>
            {isApproved && <GalleryForm slug="shards" />}
          </div>
          <div className="cyber-divider mb-6" />
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
            <h2 className="section-title-neon text-2xl flex items-center gap-3 font-mono">
              <span className="text-cyan-600/40">[~]</span>
              Летопись
            </h2>
            {isAdmin && <StatusForm slug="shards" />}
          </div>
          <div className="cyber-divider mb-6" />
          {statuses.length === 0 ? (
            <p className="text-slate-500 font-mono">// Система: записи не найдены, проверьте свой интерфейс</p>
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