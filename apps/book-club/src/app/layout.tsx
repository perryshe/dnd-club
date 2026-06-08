import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"

export const metadata: Metadata = {
  title: "b21 Club — Книжный клуб",
  description: "Книжный клуб d21 Club",
  icons: "/book-favicon.svg",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ru">
      <body className="antialiased">
        <SessionProvider session={session}>
          <nav className="bg-black border-b border-slate-800">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL} className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition">
                  <img src="/favicon21.jpg" alt="" className="w-6 h-6 rounded" />
                  d21 Club
                </a>
                <Link href="/book-club" className="flex items-center gap-2 font-bold text-cyan-400">
                  <img src="/book-favicon.svg" alt="" className="w-6 h-6" />
                  b21 Club
                </Link>
                <GameModal url={process.env.NEXT_PUBLIC_T21_GAME_URL ?? ""} />
              </div>
              <div className="flex items-center gap-4 text-sm">
                {session?.user ? (
                  <>
                    <Link href="/profile" className="text-slate-300 hover:text-white transition">Профиль</Link>
                    <span className="text-slate-400">{session.user.name}</span>
                    <SignOutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-slate-300 hover:text-white transition"
                    >
                      Войти
                    </Link>
                    <Link
                      href="/register"
                      className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg transition"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
