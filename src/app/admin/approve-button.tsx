"use client"

import { Check } from "lucide-react"
import { approveUser } from "./actions"

export function ApproveButton({ userId }: { userId: string }) {
  return (
    <form
      action={async () => {
        await approveUser(userId)
      }}
    >
      <button className="flex items-center gap-1 text-xs px-2 py-1 bg-green-700 hover:bg-green-600 rounded transition">
        <Check size={12} />
        Принять
      </button>
    </form>
  )
}
