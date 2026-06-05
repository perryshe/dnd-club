import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        schoolNick: { label: "Школьный ник", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.schoolNick || !credentials?.password) return null

        const nick = credentials.schoolNick as string
        let user = await prisma.user.findFirst({ where: { schoolNick: nick } })
        if (!user) user = await prisma.user.findUnique({ where: { email: nick } })

        if (!user) return null
        if (user.role === "pending") return null

        const valid = await compare(credentials.password as string, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
