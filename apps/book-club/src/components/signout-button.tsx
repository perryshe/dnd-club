"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm"
    >
      <LogOut size={14} />
      Выйти
    </button>
  )
}
