"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/b21/login" })}
      className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm"
    >
      Выйти
    </button>
  )
}
