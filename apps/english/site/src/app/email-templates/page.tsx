import { getDays } from "@/lib/data";

export default function EmailTemplates() {
  const days = getDays();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#f3f4f6]">✉️ Email Templates</h1>
      <p className="text-[#9ca3af] text-sm">
        Ready-to-use email templates based on each day&apos;s scenario
      </p>

      {days.map((day) => (
        <div key={day.id} className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#fbbf24]">
              Day {day.day_str}
            </h2>
            <span className="text-xs font-mono text-[#6b7280]">{day.date}</span>
          </div>
          <h3 className="text-sm font-medium text-[#f3f4f6]">{day.title}</h3>
          <div className="bg-[#0a0f1a] rounded-lg p-4 border border-[#1f2937] text-sm space-y-2 font-mono text-[#9ca3af]">
            <p><strong className="text-[#f3f4f6]">Subject:</strong> {day.title} — Follow-up</p>
            <p><strong className="text-[#f3f4f6]">To:</strong> [Vendor Contact]</p>
            <hr className="border-[#1f2937]" />
            <p>Dear Team,</p>
            <p>Thank you for the productive discussion during our recent meeting regarding {day.title.toLowerCase()}.</p>
            <p>As discussed, please find below the key points:</p>
            <ul className="list-disc list-inside text-[#9ca3af]">
              {day.phrases.slice(0, 3).map((p, i) => (
                <li key={i}>{p.en.replace(/^[^ ]+ /, "... ").slice(0, 60)}</li>
              ))}
            </ul>
            <p>Please let me know if you have any questions.</p>
            <p>Best regards,</p>
            <p>[Your Name]</p>
          </div>
        </div>
      ))}
    </div>
  );
}
