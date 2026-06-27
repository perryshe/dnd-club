"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { submitSuggestion } from "@/lib/actions"

export default function SuggestModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 flex items-center justify-center transition hover:scale-105"
      >
        <Plus size={24} />
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl border border-slate-700/50 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Предложить книгу</h2>
            <p className="text-xs text-slate-500 font-mono mb-6">// предложение будет вынесено на голосование</p>

            <form
              action={async (formData) => {
                await submitSuggestion(formData)
                setOpen(false)
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Название</label>
                  <input
                    name="title"
                    required
                    placeholder="Введите название книги"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Автор</label>
                  <input
                    name="author"
                    required
                    placeholder="Введите автора"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">
                    Почему эту книгу стоит прочитать
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    placeholder="Напишите пару предложений..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-mono tracking-wider uppercase transition"
              >
                Отправить предложение
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
