"use client";

import { useState } from "react";

export function WordTable({ words }: { words: { en: string; ru: string }[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : next.add(i);
    setChecked(next);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#34d399] mb-3">Vocabulary</h2>
      <div className="overflow-hidden rounded-xl border border-[#1f2937]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111827] border-b border-[#1f2937]">
              <th className="w-10 p-3" />
              <th className="text-left p-3 text-[#9ca3af] font-medium">English</th>
              <th className="text-left p-3 text-[#9ca3af] font-medium">Русский</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w, i) => (
              <tr
                key={i}
                className={`border-b border-[#1f2937] last:border-0 transition-colors ${
                  checked.has(i) ? "bg-emerald-500/5" : "hover:bg-[#1f2937]/50"
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggle(i)}
                    className="accent-emerald-500"
                  />
                </td>
                <td className="p-3 font-medium">{w.en}</td>
                <td className="p-3 text-[#9ca3af]">{w.ru}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
