"use client";

import { useState } from "react";

export function CheckboxList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : next.add(i);
    setChecked(next);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#9ca3af] mb-3">☑️ Checklist</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
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
              className="mt-0.5 accent-emerald-500"
            />
            <span className={`text-sm ${checked.has(i) ? "line-through text-[#6b7280]" : ""}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
