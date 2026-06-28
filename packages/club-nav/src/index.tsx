"use client"

import type { ReactNode } from "react"

export type ClubId = "d21" | "b21" | "g21"

type NavLink = {
  label: string
  href: string
}

const clubConfig: Record<ClubId, { division: string; links: NavLink[] }> = {
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

const colors: Record<ClubId, string> = {
  d21: "text-amber-400",
  b21: "text-cyan-400",
  g21: "text-cyan-300",
}

const telegrams: Record<ClubId, string | null> = {
  d21: "https://t.me/d21_blg",
  b21: null,
  g21: null,
}

type Props = {
  club: ClubId
  session?: { user?: { role?: string } } | null
  children?: ReactNode
}

export default function ClubHeader({ club, session, children }: Props) {
  const config = clubConfig[club]
  const tg = telegrams[club]

  return (
    <header className="bg-black border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-600">
          Module // {config.division}
        </div>
        <div className={`text-2xl font-bold mt-1 ${colors[club]}`}>
          {club.toUpperCase()} Club
        </div>
        <nav className="flex items-center gap-3 mt-2 text-xs font-mono tracking-wider uppercase text-slate-400">
          {config.links.map((link, i) => (
            <span key={link.label}>
              {i > 0 && <span className="text-slate-700 mx-1">·</span>}
              <a href={link.href} className="hover:text-white transition">{link.label}</a>
            </span>
          ))}
        </nav>
        <div className="mt-3 pt-3 border-t border-slate-800">
          {tg ? (
            <a href={tg} className="text-xs text-slate-500 hover:text-sky-400 transition font-mono" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          ) : (
            <span className="text-xs text-slate-600 font-mono">Telegram</span>
          )}
        </div>
        {children}
      </div>
    </header>
  )
}
