"use client"

import { useState } from "react"

export type ClubId = "d21" | "t21"

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
]

type Props = {
  active?: ClubId
  dndClubUrl: string
  activeHref?: string
  session?: { user?: { role?: string } } | null
  t21Url?: string
  basePath?: string
}

function hrefFor(id: ClubId, dndClubUrl: string): string {
  switch (id) {
    case "d21": return dndClubUrl
    case "t21": return `${dndClubUrl}/t21/`
  }
}

// --- ClubHeader (for main pages) ---

export type ClubIdMain = "d21"

const clubHeaderConfig: Record<ClubIdMain, { division: string; links: { label: string; href: string }[] }> = {
  d21: {
    division: "rpg division",
    links: [
      { label: "The dead Band", href: "/dead-band" },
      { label: "Night city", href: "/shards" },
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
}

const telegramUrls: Record<ClubIdMain, string | null> = {
  d21: "https://t.me/d21_blg",
}

type ClubHeaderProps = {
  club: ClubIdMain
  rightContent?: React.ReactNode
}

export function ClubHeader({ club, rightContent }: ClubHeaderProps) {
  const config = clubHeaderConfig[club]
  const style = clubStyles[club]
  const tg = telegramUrls[club]

  const label = (
    <>
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-[0.25em] uppercase ${rightContent ? "" : "mb-8"} ${style.badge}`}>
        Module // {config.division}
      </div>

      <h1 className={`text-5xl md:text-7xl font-black tracking-tight ${rightContent ? "mt-3 mb-3" : "mb-4"} ${style.title}`}>
        {club} Club
      </h1>

      <nav className={`flex items-center gap-3 text-xs font-mono tracking-wider uppercase mb-8 ${style.link} ${rightContent ? "" : "justify-center"}`}>
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
    </>
  )

  if (rightContent) {
    return (
      <header className="pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
            <div className="text-left shrink-0">
              {label}
            </div>
            <div className="flex-1 min-w-0 w-full">
              {rightContent}
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="text-center pt-24 pb-16">
      {label}
    </header>
  )
}

// --- ClubNav (top bar) ---

export default function ClubNav({ active, dndClubUrl, activeHref, t21Url, basePath }: Props) {
  const [t21Open, setT21Open] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const iconSrc = (club: ClubDef): string => {
    if (!club.icon) return ""
    if (basePath && club.id === active) return `${basePath}${club.icon}`
    return club.icon
  }

  const activeClub = active ? clubs.find((c) => c.id === active) : undefined

  const renderClub = (club: ClubDef, mobile: boolean) => {
    const isActive = active === club.id
    const baseClass = "flex items-center gap-2 font-bold transition whitespace-nowrap"
    const colorClass = isActive ? club.color.replace(" hover:", " ") : club.color

    const inner = (
      <>
        {club.icon && (
          <img src={iconSrc(club)} alt="" className={club.iconClass ?? ""} style={{ width: club.iconSize ?? 20, height: club.iconSize ?? 20 }} />
        )}
        {club.label}
      </>
    )

    if (mobile) {
      const href = isActive && activeHref ? activeHref : hrefFor(club.id, dndClubUrl)
      return (
        <a
          key={club.id}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
        >
          {inner}
        </a>
      )
    }

    const el = isActive && activeHref ? (
      <a href={activeHref} className={`${baseClass} ${colorClass}`}>{inner}</a>
    ) : (
      <a href={hrefFor(club.id, dndClubUrl)} className={`${baseClass} ${colorClass}`}>{inner}</a>
    )
    return <span key={club.id}>{el}</span>
  }

  return (
    <nav className="bg-black border-b border-slate-800">
      <div className="container mx-auto px-4 h-12 flex items-center gap-6">
        {/* Desktop: horizontal links */}
        <div className="hidden md:flex items-center gap-6">
          {clubs.map((club) => renderClub(club, false))}
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
              <img src={iconSrc(activeClub)} alt="" className={activeClub.iconClass ?? ""} style={{ width: activeClub.iconSize ?? 20, height: activeClub.iconSize ?? 20 }} />
            )}
            <span className="flex-1 text-left">{activeClub?.label ?? "Club"}</span>
            <svg className={`w-4 h-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {mobileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {clubs.map((club) => renderClub(club, true))}
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
