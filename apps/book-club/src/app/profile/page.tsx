import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { Cpu, ScanLine, Sparkles } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  return (
    <main className="min-h-screen bg-slate-950 scanlines">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-6">
            <Sparkles size={12} />
            Book Club
            <Sparkles size={12} />
          </div>
          <h1 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Профиль
            </span>
          </h1>
        </div>

        <div className="p-6 rounded-xl border border-slate-800/60 bg-slate-900/30">
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 mb-1">Ник</p>
              <p className="text-sm font-mono text-slate-300">{user?.schoolNick}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 mb-1">Имя</p>
              <p className="text-sm font-mono text-slate-300">{user?.name}</p>
            </div>
            {user?.email && (
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 mb-1">Email</p>
                <p className="text-sm font-mono text-slate-300">{user.email}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 mb-1">Роль</p>
              <p className="text-sm font-mono text-slate-300">{user?.role === "admin" ? "Админ" : user?.role === "pending" ? "Ожидает подтверждения" : "Участник"}</p>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-6">
            <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-slate-500 mb-4">Сменить пароль</h2>
            <form
              action={async (formData: FormData) => {
                "use server"
                const session = await auth()
                if (!session?.user?.id) return
                const current = formData.get("current") as string
                const newPass = formData.get("new") as string
                if (!current || !newPass) return

                const user = await prisma.user.findUnique({ where: { id: session.user.id } })
                if (!user) return

                const { compare } = await import("bcryptjs")
                const valid = await compare(current, user.password)
                if (!valid) throw new Error("Неверный текущий пароль")

                await prisma.user.update({
                  where: { id: session.user.id },
                  data: { password: await hash(newPass, 12) },
                })
                revalidatePath("/profile")
              }}
              className="space-y-3"
            >
              <input name="current" type="password" required placeholder="Текущий пароль"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
              <input name="new" type="password" required placeholder="Новый пароль"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
              <button type="submit"
                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-xs font-mono tracking-wider uppercase font-semibold transition">
                <ScanLine size={12} className="inline mr-1" />
                Сменить
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center mt-8">
          <Cpu size={12} className="text-slate-700" />
          <span className="text-[10px] font-mono text-slate-700">b21 Club // profile</span>
        </div>
      </div>
    </main>
  )
}
