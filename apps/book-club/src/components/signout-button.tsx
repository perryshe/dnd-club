"use client"

import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        const csrf = await fetch("/b21/api/auth/csrf").then(r => r.json())
        await fetch("/b21/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            csrfToken: csrf.csrfToken,
            callbackUrl: "/b21/login",
            redirect: "false",
          }),
        })
        window.location.href = "/b21/login"
      }}
      className="flex items-center gap-1 text-slate-400 hover:text-white transition text-sm"
    >
      <LogOut size={14} />
      Выйти
    </button>
  )
}