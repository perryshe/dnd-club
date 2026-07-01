import { getDays } from "@/lib/data";

const categories = [
  { id: "open", label: "🔓 Opening a Meeting", days: [1] },
  { id: "assign", label: "📋 Assigning Tasks", days: [2] },
  { id: "change", label: "🔄 Change Requests", days: [3] },
  { id: "clarify", label: "❓ Q&A & Clarifying", days: [4] },
  { id: "close", label: "🔚 Closing a Meeting", days: [5] },
  { id: "smalltalk", label: "☕ Small Talk", days: [6] },
  { id: "complain", label: "⚠️ Complaints & Issues", days: [7] },
  { id: "scope", label: "📐 Scope Disputes", days: [8] },
  { id: "summarize", label: "📝 Summarizing", days: [9] },
  { id: "followup", label: "📧 Follow-up", days: [10] },
];

export default function CheatSheet() {
  const days = getDays();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-[#fbbf24]">📝 Cheat Sheet</h1>
        <p className="text-[#9ca3af] text-sm mt-1">Фразы, которые спасут в любой встрече</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const phrases = cat.days.flatMap((id) => {
            const day = days.find((d) => d.id === id);
            return day ? day.phrases : [];
          });

          return (
            <div key={cat.id} className="bg-[#111827] rounded-xl border border-[#1f2937] overflow-hidden">
              <div className="bg-[#1f2937] px-4 py-2.5">
                <h2 className="text-sm font-semibold text-[#f3f4f6]">{cat.label}</h2>
              </div>
              <div className="p-3 space-y-2">
                {phrases.slice(0, 4).map((p, i) => (
                  <div key={i} className="text-sm">
                    <div className="text-[#f3f4f6] font-medium leading-snug">{p.en}</div>
                    <div className="text-[#9ca3af] text-xs mt-0.5">{p.ru}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#111827] rounded-xl border border-[#1f2937] p-4">
        <h2 className="text-sm font-semibold text-[#60a5fa] mb-3">🧰 Full Meeting Playbook (Days 11–15)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {days.filter((d) => d.id >= 11).map((day) => (
            <div key={day.id} className="bg-[#0a0f1a] rounded-lg p-3 border border-[#1f2937]">
              <h3 className="text-xs font-semibold text-[#fbbf24] mb-2">{day.title}</h3>
              <div className="space-y-1.5">
                {day.phrases.slice(0, 4).map((p, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-[#f3f4f6]">{p.en}</span>
                    <span className="text-[#6b7280] block">{p.ru}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
