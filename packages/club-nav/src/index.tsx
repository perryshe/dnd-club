"use client"

import { useState } from "react"

export type ClubId = "d21" | "b21" | "t21" | "e21" | "g21" | "quest"

type ClubDef = {
  id: ClubId
  label: string
  color: string
  icon?: string
  iconSize?: string
  iconClass?: string
}

const clubs: ClubDef[] = [
  { id: "d21", label: "d21 Club", color: "text-amber-400 hover:text-amber-300", icon: "/favicon21.jpg", iconSize: "w-6 h-6", iconClass: "rounded" },
  { id: "b21", label: "b21 Club", color: "text-cyan-400 hover:text-cyan-300", icon: "/book-favicon.svg", iconSize: "w-5 h-5" },
  { id: "t21", label: "t21 Club", color: "text-indigo-400 hover:text-indigo-300" },
  { id: "g21", label: "g21 Club", color: "text-cyan-300 hover:text-cyan-200" },
  { id: "quest", label: "quest", color: "text-purple-400 hover:text-purple-300" },
  { id: "e21", label: "e21 Club", color: "text-green-400 hover:text-green-300", icon: "/e21-favicon.svg", iconSize: "w-5 h-5" },
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

export type ClubIdMain = "d21" | "b21" | "g21"

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
}

const clubStyles: Record<ClubIdMain, {
  title: string
  badge: string
  link: string
  linkSep: string
  telegram: string
  telegramDisabled: string
}> = {
  d21: {
    title: "bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 bg-clip-text text-transparent",
    badge: "border-amber-500/40 bg-amber-950/70 text-amber-300",
    link: "text-amber-300 hover:text-amber-200",
    linkSep: "text-amber-700",
    telegram: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-900/30",
    telegramDisabled: "text-amber-600 border-amber-800",
  },
  b21: {
    title: "text-cyan-400",
    badge: "border-slate-700/30 bg-slate-900/50 text-slate-500",
    link: "text-slate-500 hover:text-white",
    linkSep: "text-slate-700",
    telegram: "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-sky-900/30",
    telegramDisabled: "text-slate-600 border-slate-800",
  },
  g21: {
    title: "text-cyan-300",
    badge: "border-slate-700/30 bg-slate-900/50 text-slate-500",
    link: "text-slate-500 hover:text-white",
    linkSep: "text-slate-700",
    telegram: "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-sky-900/30",
    telegramDisabled: "text-slate-600 border-slate-800",
  },
}

const telegramUrls: Record<ClubIdMain, string | null> = {
  d21: "https://t.me/d21_blg",
  b21: null,
  g21: null,
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

      {tg ? (
        <a
          href={tg}
          target="_blank"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition shadow-lg text-sm font-mono tracking-wider uppercase ${style.telegram}`}
        >
          Telegram
        </a>
      ) : (
        <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-mono tracking-wider uppercase border ${style.telegramDisabled}`}>
          Telegram
        </span>
      )}
    </header>
  )
}

// --- ClubNav (top bar) ---

export default function ClubNav({ active, dndClubUrl, bookClubUrl, activeHref, session, t21Url }: Props) {
  const isSadmin = session?.user?.role === "sadmin"
  const [t21Open, setT21Open] = useState(false)

  return (
    <nav className="bg-black border-b border-slate-800">
      <div className="container mx-auto px-4 h-12 flex items-center gap-6">
        {clubs.map((club) => {
          if (club.id === "quest" && !isSadmin) return null
          if (club.id === "t21") return null

          const isActive = active === club.id
          const baseClass = "flex items-center gap-2 font-bold transition whitespace-nowrap"
          const colorClass = isActive ? club.color.replace(" hover:", " ") : club.color

          const inner = (
            <>
              {club.icon && (
                <img src={club.icon} alt="" className={`${club.iconSize ?? "w-5 h-5"} ${club.iconClass ?? ""}`} />
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
        <span key="t21">
          <button onClick={() => setT21Open(true)} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap bg-transparent border-none cursor-pointer">
            <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-600 text-white text-[8px] font-bold shrink-0">#</span>
            <span className="text-xs">t21 Club</span>
          </button>
        </span>
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
