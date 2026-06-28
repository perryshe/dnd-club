import { getDays } from "@/lib/data";

export default function AiScenarios() {
  const days = getDays();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#f3f4f6]">🤖 AI Role-Play Scenarios</h1>
      <p className="text-[#9ca3af] text-sm">
        Practice each day&apos;s scenario with an AI assistant
      </p>

      {days.map((day) => (
        <div key={day.id} className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] space-y-3">
          <h2 className="text-base font-semibold text-[#60a5fa]">
            Day {day.day_str} — {day.title}
          </h2>
          <p className="text-sm text-[#f3f4f6]">{day.focus}</p>
          <div className="text-sm text-[#9ca3af]">
            <p className="mb-1"><strong>Prompt for AI:</strong></p>
            <p className="bg-[#0a0f1a] rounded-lg p-3 border border-[#1f2937]">
              Role-play a meeting scenario: &quot;{day.title}&quot;. You are the {day.dialog[0]?.role === "Customer" ? "Vendor" : "Customer"}. I am the {day.dialog[0]?.role ?? "Customer"}. Use the following phrases in our conversation:
            </p>
          </div>
          <ul className="text-xs text-[#6b7280] space-y-1 list-disc list-inside">
            {day.phrases.slice(0, 5).map((p, i) => (
              <li key={i}>{p.en}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
