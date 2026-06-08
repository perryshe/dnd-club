"use client"

import { useState } from "react"

export default function GameModal({ url }: { url: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition bg-transparent border-none cursor-pointer text-base">
        <span className="w-6 h-6 rounded flex items-center justify-center bg-indigo-600 text-white text-xs font-bold">t</span>
        t21 Club
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-[90vw] h-[90vh] bg-[#1a1a2e] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full text-lg leading-none"
            >
              &times;
            </button>
            <iframe
              src={url}
              className="w-full h-full border-none"
              title="t21 Club"
            />
          </div>
        </div>
      )}
    </>
  )
}
