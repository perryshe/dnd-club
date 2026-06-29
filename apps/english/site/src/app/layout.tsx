import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import ClubNav from "club-nav";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "English for Manager — Course",
  description: "15 дней · 22 июн – 10 июл 2026",
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
      </body>
    </html>
  );
}
