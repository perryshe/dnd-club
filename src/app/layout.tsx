import type { Metadata } from "next"
import "./globals.css"
import Nav from "@/components/nav"

export const metadata: Metadata = {
  title: "ДНД Клуб",
  description: "Настольные ролевые игры",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
