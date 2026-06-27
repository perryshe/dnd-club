"use client"

import type { ReactNode } from "react"

export type ClubId = "d21" | "b21" | "b22" | "t21" | "e21" | "g21" | "quest"

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
  { id: "b22", label: "b22 Club", color: "text-cyan-400 hover:text-cyan-300", icon: "/book-favicon.svg", iconSize: "w-5 h-5" },
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
    case "b22": return `${dndClubUrl}/b22/`
    case "t21": return `${dndClubUrl}/t21/`
    case "e21": return `${dndClubUrl}/e21/`
    case "g21": return `${dndClubUrl}/g21/`
    case "quest": return `${dndClubUrl}/quest/`
  }
}

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
