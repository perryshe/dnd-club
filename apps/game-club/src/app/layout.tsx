import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import SignOutButton from "@/components/signout-button"
import ClubNav from "club-nav"
import { Cpu } from "lucide-react"

export const metadata: Metadata = {
  title: "g21 Club — Board Games",
  description: "Board games club",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ru">
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider session={session}>
          <ClubNav
            active="g21"
            dndClubUrl={process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/"}
            bookClubUrl={process.env.NEXT_PUBLIC_BOOK_CLUB_URL}
            activeHref="/"
            session={session}
            t21Url={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "t21/"}
          />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/40 bg-slate-950/50">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Cpu size={12} />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.1.0 — g21 network</span>
                <span className="text-[8px] text-slate-700 font-mono">system online</span>
              </div>
              <div className="flex items-center gap-4">
                {session?.user ? (
                  <>
                    <span className="text-sm text-slate-500">{session.user.name}</span>
                    <SignOutButton />
                  </>
                ) : (
                  <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL?.replace(/\/?$/, "") + "/g21/login"} className="text-sm text-slate-400 hover:text-white transition">Войти</a>
                )}
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
