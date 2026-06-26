import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"
import { Cpu } from "lucide-react"

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
      <body className="antialiased min-h-screen flex flex-col">
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
          </nav>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/40 bg-slate-950/50">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Cpu size={12} />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.1.0 — b21 network</span>
                <span className="text-[8px] text-slate-700 font-mono">system online</span>
              </div>
              <div className="flex items-center gap-4">
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
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
