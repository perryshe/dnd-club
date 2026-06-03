import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/providers"
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
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  )
}
