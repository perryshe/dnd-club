import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"
import ClubHeader from "club-nav"
import { Cpu } from "lucide-react"

export const metadata: Metadata = {
  title: "d21 Club",
  description: "Настольные ролевые игры",
  icons: "/favicon21.jpg",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ru">
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider session={session}>
          <ClubHeader club="d21" session={session}>
            <GameModal url={process.env.NEXT_PUBLIC_T21_GAME_URL ?? ""} />
          </ClubHeader>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/40 bg-slate-950/50">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Cpu size={12} />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.1.0 — d21 network</span>
                <span className="text-[8px] text-slate-700 font-mono">system online</span>
              </div>
              <div className="flex items-center gap-4">
                {session?.user ? (
                  <>
                    {(session.user.role === "admin" || session.user.role === "sadmin") && (
                      <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition">Админ</Link>
                    )}
                    <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition">Профиль</Link>
                    <span className="text-sm text-slate-500">{session.user.name}</span>
                    <SignOutButton />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Войти</Link>
                    <Link href="/register" className="bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg text-white text-sm transition">Регистрация</Link>
                  </>
                )}
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
