import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { ApproveButton } from "./approve-button"
import { DeleteButton } from "./delete-button"
import { setUserRole } from "./actions"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.role || session.user.role !== "admin") {
    redirect("/login")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          На главную
        </Link>
        <div className="flex items-center gap-3">
          <Shield className="text-amber-400" size={32} />
          <h1 className="text-3xl font-bold">Админ-панель</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">Пользователи</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 px-2">Email</th>
                  <th className="text-left py-2 px-2">Имя</th>
                  <th className="text-left py-2 px-2">Роль</th>
                  <th className="text-left py-2 px-2">Дата</th>
                  <th className="text-right py-2 px-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2">{user.name}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-amber-900/50 text-amber-300"
                            : user.role === "user"
                              ? "bg-green-900/50 text-green-300"
                              : "bg-yellow-900/50 text-yellow-300"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Админ"
                          : user.role === "user"
                            ? "Подтверждён"
                            : "Ожидает"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        {user.role === "pending" && (
                          <>
                            <ApproveButton userId={user.id} />
                            <form action={setUserRole.bind(null, user.id, "admin")}>
                              <button className="text-xs px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded transition">
                                Сделать админом
                              </button>
                            </form>
                          </>
                        )}
                        {user.role === "user" && (
                          <>
                            <form action={setUserRole.bind(null, user.id, "admin")}>
                              <button className="text-xs px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded transition">
                                Сделать админом
                              </button>
                            </form>
                            <form
                              action={async () => {
                                "use server"
                                await prisma.user.update({
                                  where: { id: user.id },
                                  data: { role: "pending" },
                                })
                              }}
                            >
                              <button className="text-xs px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded transition">
                                Заблокировать
                              </button>
                            </form>
                          </>
                        )}
                        {user.role === "admin" && session.user.id !== user.id && (
                          <form action={setUserRole.bind(null, user.id, "user")}>
                            <button className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 rounded transition">
                              Забрать админа
                            </button>
                          </form>
                        )}
                        {user.role !== "admin" && <DeleteButton userId={user.id} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
