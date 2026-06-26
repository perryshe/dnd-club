import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"

const basePath = "/b21"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "b21 Club — Книжный клуб",
    description: "Книжный клуб d21 Club",
  }
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
        <link rel="icon" href={`${basePath}/club-logo.svg`} type="image/svg+xml" />
        <SessionProvider session={session}>
          <nav className="bg-black border-b border-slate-800">
            <div className="container mx-auto px-4 h-12 flex items-center gap-6">
              <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL} className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition">
                <Image src={`${basePath}/d21-logo.jpg`} alt="" width={24} height={24} className="w-6 h-6 rounded" unoptimized />
                d21 Club
              </a>
              <Link href="/book-club" className="flex items-center gap-2 font-bold text-cyan-400">
                <Image src={`${basePath}/club-logo.svg`} alt="" width={24} height={24} className="w-6 h-6" unoptimized />
                b21 Club
              </Link>
              <a href="/b22/" className="flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300 transition">
                b22 Club
              </a>
              <GameModal url={process.env.NEXT_PUBLIC_T21_GAME_URL ?? ""} />
              <a href="/e21/" className="flex items-center gap-2 font-bold text-green-400 hover:text-green-300 transition">
                e21 Club
              </a>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            <div className="container mx-auto px-4 h-10 flex items-center justify-end gap-4">
              {session?.user ? (
                <>
                  <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition">Профиль</Link>
                  <span className="text-sm text-slate-500">{session.user.name}</span>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Войти</Link>
                  <Link href="/register" className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg text-white text-sm transition">Регистрация</Link>
                </>
              )}
            </div>
          </nav>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
