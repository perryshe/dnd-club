import { prisma } from "@/lib/prisma"
import { prismaAuth } from "@/lib/prisma-auth"
import { BookOpen, Users, FileText, Calendar } from "lucide-react"

export default async function StatsCards() {
  const [users, books, reviews, meetings] = await Promise.all([
    prismaAuth.user.count({ where: { role: { not: "pending" } } }),
    prisma.book.count({ where: { status: "past" } }),
    prisma.review.count(),
    prisma.meeting.count(),
  ])

  const items = [
    { icon: Users, label: "Участников", value: users, color: "cyan" },
    { icon: BookOpen, label: "Книг прочитано", value: books, color: "purple" },
    { icon: FileText, label: "Рецензий написано", value: reviews, color: "amber" },
    { icon: Calendar, label: "Встреч проведено", value: meetings, color: "emerald" },
  ]

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-950/20 text-cyan-400",
    purple: "border-purple-500/30 bg-purple-950/20 text-purple-400",
    amber: "border-amber-500/30 bg-amber-950/20 text-amber-400",
    emerald: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl border p-4 text-center ${colorMap[item.color]}`}>
          <item.icon size={20} className="mx-auto mb-2 opacity-70" />
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-[10px] font-mono tracking-wider uppercase mt-1 opacity-60">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
