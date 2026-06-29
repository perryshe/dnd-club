import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import ClubNav from "club-nav";
import { Cpu } from "lucide-react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "English for Manager — Course",
  description: "15 дней · 22 июн – 10 июл 2026",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} antialiased`}>
      <body className="h-screen flex flex-col bg-[#0a0f1a] text-[#f3f4f6] font-sans overflow-hidden">
        <ClubNav
          active="e21"
          dndClubUrl={process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/"}
          activeHref="/e21/"
          session={null}
          t21Url={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "t21/"}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
        <footer className="border-t border-[#1f2937] bg-[#0d1117]">
          <div className="flex items-center justify-between h-10 px-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Cpu size={12} />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.2.0 — e21 network</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">sadmin</span>
              <a
                href={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "api/auth/signout"}
                className="text-sm text-slate-400 hover:text-white transition"
              >
                Выйти
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
