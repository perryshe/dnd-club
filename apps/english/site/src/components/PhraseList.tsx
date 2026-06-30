"use client";

import { useState } from "react";

export function PhraseList({ phrases }: { phrases: { en: string; ru: string }[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [reveal, setReveal] = useState(false);

  const toggle = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : next.add(i);
    setChecked(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#60a5fa]">Phrases</h2>
        <button
          onClick={() => setReveal((r) => !r)}
          className="text-xs px-3 py-1 rounded-full bg-[#1f2937] text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
        >
          {reveal ? "Hide" : "Reveal"} RU
        </button>
      </div>
      <div className="space-y-2">
        {phrases.map((p, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              checked.has(i)
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-[#1f2937] bg-[#111827] hover:bg-[#1f2937]"
            }`}
          >
            <input
              type="checkbox"
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              className="mt-1 accent-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{p.en}</div>
              <div
                className={`text-sm mt-0.5 transition-all ${
                  reveal || checked.has(i)
                    ? "text-[#9ca3af] opacity-100"
                    : "text-transparent select-none"
                }`}
              >
                {reveal || checked.has(i) ? p.ru : "••••••"}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
