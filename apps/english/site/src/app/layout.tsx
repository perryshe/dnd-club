import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

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
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-[#0a0f1a] text-[#f3f4f6] font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
