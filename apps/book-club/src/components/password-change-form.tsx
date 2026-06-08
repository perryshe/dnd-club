"use client"

export default function PasswordChangeForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
  return (
    <form action={onSubmit} className="space-y-3">
      <input name="current" type="password" required placeholder="Текущий пароль"
        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
      <input name="new" type="password" required placeholder="Новый пароль"
        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
      <button type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-xs font-mono tracking-wider uppercase font-semibold transition">
        Сменить
      </button>
    </form>
  )
}
