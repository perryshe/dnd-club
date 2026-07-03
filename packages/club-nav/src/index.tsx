"use client"

import { useState } from "react"

export type ClubId = "d21" | "b21" | "t21" | "e21" | "g21" | "quest"

type ClubDef = {
  id: ClubId
  label: string
  color: string
  icon?: string
  iconSize?: number
  iconClass?: string
}

const clubs: ClubDef[] = [
  { id: "d21", label: "d21 Club", color: "text-amber-400 hover:text-amber-300", icon: "/favicon21.jpg", iconSize: 24, iconClass: "rounded" },
  { id: "b21", label: "b21 Club", color: "text-cyan-400 hover:text-cyan-300", icon: "/book-favicon.svg", iconSize: 20 },
  { id: "t21", label: "t21 Club", color: "text-indigo-400 hover:text-indigo-300" },
  { id: "g21", label: "g21 Club", color: "text-cyan-300 hover:text-cyan-200" },
  { id: "quest", label: "quest", color: "text-purple-400 hover:text-purple-300" },
  { id: "e21", label: "e21 Club", color: "text-green-400 hover:text-green-300", icon: "/e21-favicon.svg", iconSize: 20 },
]

type Props = {
  active?: ClubId
  dndClubUrl: string
  bookClubUrl?: string
  activeHref?: string
  session?: { user?: { role?: string } } | null
  t21Url?: string
}

function hrefFor(id: ClubId, dndClubUrl: string, bookClubUrl?: string): string {
  switch (id) {
    case "d21": return dndClubUrl
    case "b21": return bookClubUrl ?? `${dndClubUrl}/b21`
    case "t21": return `${dndClubUrl}/t21/`
    case "e21": return `${dndClubUrl}/e21/`
    case "g21": return `${dndClubUrl}/g21/`
    case "quest": return `${dndClubUrl}/quest/`
  }
}

// --- ClubHeader (for main pages) ---

export type ClubIdMain = "d21" | "b21" | "g21" | "e21"

const clubHeaderConfig: Record<ClubIdMain, { division: string; links: { label: string; href: string }[] }> = {
  d21: {
    division: "rpg division",
    links: [
      { label: "The dead Band", href: "/dead-band" },
      { label: "Night city", href: "/shards" },
    ],
  },
  b21: {
    division: "book club division",
    links: [
      { label: "reading log", href: "#reading-log" },
      { label: "vote", href: "#voting" },
      { label: "books", href: "#books" },
    ],
  },
  g21: {
    division: "board games division",
    links: [
      { label: "collection", href: "#collection" },
      { label: "vote", href: "#vote" },
      { label: "wishlist", href: "#wish" },
    ],
  },
  e21: {
    division: "english division",
    links: [
      { label: "home", href: "/" },
      { label: "schedule", href: "/schedule" },
      { label: "audio", href: "/audio" },
      { label: "cheat sheet", href: "/cheat-sheet" },
      { label: "glossary", href: "/glossary" },
      { label: "AI scenarios", href: "/ai-scenarios" },
      { label: "emails", href: "/email-templates" },
    ],
  },
}

const clubStyles: Record<ClubIdMain, {
  title: string
  badge: string
  link: string
  linkSep: string
  telegram: string
}> = {
  d21: {
    title: "bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent",
    badge: "border-amber-500/40 bg-amber-950/70 text-amber-300",
    link: "text-amber-300 hover:text-amber-200",
    linkSep: "text-amber-700",
    telegram: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-900/30",
  },
  b21: {
    title: "text-cyan-400",
    badge: "border-slate-700/30 bg-slate-900/50 text-slate-500",
    link: "text-slate-500 hover:text-white",
    linkSep: "text-slate-700",
    telegram: "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-sky-900/30",
  },
  g21: {
    title: "text-cyan-300",
    badge: "border-slate-700/30 bg-slate-900/50 text-slate-500",
    link: "text-slate-500 hover:text-white",
    linkSep: "text-slate-700",
    telegram: "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-sky-900/30",
  },
  e21: {
    title: "text-green-400",
    badge: "border-green-500/40 bg-green-950/70 text-green-300",
    link: "text-green-400 hover:text-green-300",
    linkSep: "text-green-700",
    telegram: "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 shadow-green-900/30",
  },
}

const telegramUrls: Record<ClubIdMain, string | null> = {
  d21: "https://t.me/d21_blg",
  b21: "https://t.me/+P8j9F-vG5b0zNWVi",
  g21: "https://t.me/+mGU5rw83i380ZGYy",
  e21: null,
}

type ClubHeaderProps = {
  club: ClubIdMain
}

export function ClubHeader({ club }: ClubHeaderProps) {
  const config = clubHeaderConfig[club]
  const style = clubStyles[club]
  const tg = telegramUrls[club]

  return (
    <header className="text-center pt-24 pb-16">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-[0.25em] uppercase mb-8 ${style.badge}`}>
        Module // {config.division}
      </div>

      <h1 className={`text-5xl md:text-7xl font-black mb-4 tracking-tight ${style.title}`}>
        {club} Club
      </h1>

      <nav className={`flex items-center justify-center gap-3 text-xs font-mono tracking-wider uppercase mb-8 ${style.link}`}>
        {config.links.map((link, i) => (
          <span key={link.label}>
            {i > 0 && <span className={`${style.linkSep} mx-1`}>·</span>}
            <a href={link.href} className={`${style.link} transition`}>{link.label}</a>
          </span>
        ))}
      </nav>

      {tg && (
        <a
          href={tg}
          target="_blank"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg text-sm font-mono tracking-wider uppercase ${style.telegram}`}
        >
          Telegram
        </a>
      )}
    </header>
  )
}

// --- ClubNav (top bar) ---

export default function ClubNav({ active, dndClubUrl, bookClubUrl, activeHref, session, t21Url }: Props) {
  const isSadmin = session?.user?.role === "sadmin"
  const [t21Open, setT21Open] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleClubs = clubs.filter(
    (c) => c.id !== "t21" && (c.id !== "quest" || isSadmin)
  )

  const activeClub = active ? clubs.find((c) => c.id === active) : undefined

  return (
    <nav className="bg-black border-b border-slate-800">
      <div className="container mx-auto px-4 h-12 flex items-center gap-6">
        {/* Desktop: horizontal links */}
        <div className="hidden md:flex items-center gap-6">
          {visibleClubs.map((club) => {
            const isActive = active === club.id
            const baseClass = "flex items-center gap-2 font-bold transition whitespace-nowrap"
            const colorClass = isActive ? club.color.replace(" hover:", " ") : club.color

            const inner = (
              <>
                {club.icon && (
                  <img src={club.icon} alt="" className={club.iconClass ?? ""} style={{ width: club.iconSize ?? 20, height: club.iconSize ?? 20 }} />
                )}
                {club.label}
              </>
            )

            const el = isActive && activeHref ? (
              <a href={activeHref} className={`${baseClass} ${colorClass}`}>{inner}</a>
            ) : (
              <a href={hrefFor(club.id, dndClubUrl, bookClubUrl)} className={`${baseClass} ${colorClass}`}>{inner}</a>
            )
            return <span key={club.id}>{el}</span>
          })}
          {t21Url && (
            <span key="t21">
              <button onClick={() => setT21Open(true)} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap bg-transparent border-none cursor-pointer">
                <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-600 text-white text-[8px] font-bold shrink-0">#</span>
                <span className="text-xs">t21 Club</span>
              </button>
            </span>
          )}
        </div>

        {/* Mobile: button + dropdown menu */}
        <div className="flex md:hidden items-center w-full relative">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex items-center gap-2 w-full bg-slate-900 border border-slate-700 text-white text-sm font-semibold rounded-lg px-3 py-1.5 outline-none"
          >
            {activeClub?.icon && (
              <img src={activeClub.icon} alt="" className={activeClub.iconClass ?? ""} style={{ width: activeClub.iconSize ?? 20, height: activeClub.iconSize ?? 20 }} />
            )}
            <span className="flex-1 text-left">{activeClub?.label ?? "Club"}</span>
            <svg className={`w-4 h-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {mobileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {visibleClubs.map((club) => {
                  const isActive = active === club.id
                  const href = isActive && activeHref ? activeHref : hrefFor(club.id, dndClubUrl, bookClubUrl)
                  return (
                    <a
                      key={club.id}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                    >
                      {club.icon && (
                        <img src={club.icon} alt="" className={club.iconClass ?? ""} style={{ width: club.iconSize ?? 20, height: club.iconSize ?? 20 }} />
                      )}
                      {club.label}
                    </a>
                  )
                })}
                {t21Url && (
                  <button
                    onClick={() => { setT21Open(true); setMobileOpen(false) }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold text-indigo-400 hover:bg-slate-800 transition bg-transparent border-none cursor-pointer text-left"
                  >
                    <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-600 text-white text-[8px] font-bold shrink-0">#</span>
                    <span className="text-xs">t21 Club</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {t21Open && t21Url && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-start bg-black/70"
          onClick={() => setT21Open(false)}
        >
          <div
            className="relative w-[400px] h-[600px] mt-16 ml-4 bg-[#1a1a2e] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setT21Open(false)}
              className="absolute top-2 right-2 z-10 w-5 h-5 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full text-xs leading-none"
            >
              &times;
            </button>
            <iframe src={t21Url} className="w-full h-full border-none" title="t21 Club" />
          </div>
        </div>
      )}
    </nav>
  )
}
