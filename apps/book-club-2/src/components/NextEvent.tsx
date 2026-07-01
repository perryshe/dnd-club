import { prisma } from "@/lib/prisma"
import Countdown from "./Countdown"
import { BookOpen } from "lucide-react"

export default async function NextEvent() {
  const book = await prisma.book.findFirst({
    where: { status: "current", eventDate: { not: null } },
    orderBy: { eventDate: "asc" },
  })

  if (!book) return null

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-slate-900/40 p-6 text-center mb-12">
      <div className="flex items-center justify-center gap-2 mb-3">
        <BookOpen size={14} className="text-cyan-400/60" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400/60">
          Ближайшее событие
        </span>
      </div>
      <h3 className="text-lg font-semibold text-cyan-200 mb-1">{book.title}</h3>
      <p className="text-sm text-slate-500 font-mono mb-3">{book.author}</p>
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
          {book.eventDate!.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <Countdown target={new Date(book.eventDate!)} />
      </div>
    </div>
  )
}
