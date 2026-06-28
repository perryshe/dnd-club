"use client"

import type { ReactNode } from "react"

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
  { id: "e21", label: "e21 Club", color: "text-green-400 hover:text-green-300" },
  { id: "g21", label: "g21 Club", color: "text-cyan-300 hover:text-cyan-200" },
  { id: "quest", label: "quest", color: "text-purple-400 hover:text-purple-300" },
]

type Props = {
  active?: ClubId
  dndClubUrl: string
  bookClubUrl?: string
  /** For the active club, use this as the href (the club's own basePath or "/") */
  activeHref?: string
  session?: { user?: { role?: string } } | null
  /** Replace the default t21 link (e.g. with GameModal) */
  t21Element?: ReactNode
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
      { label: "campaigns", href: "#" },
      { label: "characters", href: "#" },
      { label: "wiki", href: "#" },
    ],
  },
  b21: {
    division: "book club division",
    links: [
      { label: "reading log", href: "#reading-log" },
      { label: "voting", href: "#voting" },
      { label: "meetings", href: "#meetings" },
    ],
  },
  g21: {
    division: "board games division",
    links: [
      { label: "collection", href: "#" },
      { label: "voting", href: "#" },
      { label: "meetings", href: "#" },
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
    badge: "border-amber-500/20 bg-amber-950/30 text-amber-400/80",
    link: "text-amber-400/80 hover:text-amber-300",
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
        {club.toUpperCase()} Club
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

export default function ClubNav({ active, dndClubUrl, bookClubUrl, activeHref, session, t21Element }: Props) {
  const isSadmin = session?.user?.role === "sadmin"

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
        {t21Element}
        {!t21Element && (
          <span key="t21">
            <a href={hrefFor("t21", dndClubUrl, bookClubUrl)} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap">
              t21 Club
            </a>
          </span>
        )}
      </div>
    </nav>
  )
}
