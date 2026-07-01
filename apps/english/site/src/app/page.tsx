import Link from "next/link";
import { getWeeks, getDaysInWeek, getMeta, getDay } from "@/lib/data";

export default function Home() {
  const meta = getMeta();
  const weeks = getWeeks();
  const totalDays = getDaysInWeek(1).length + getDaysInWeek(2).length + getDaysInWeek(3).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-[#60a5fa]">{meta.title}</h1>
        <p className="text-[#9ca3af] mt-2">{meta.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-[#111827] rounded-xl p-4 border border-[#1f2937]">
          <div className="text-2xl font-bold text-[#60a5fa]">{totalDays}</div>
          <div className="text-xs text-[#6b7280] mt-1">Days</div>
        </div>
        <div className="bg-[#111827] rounded-xl p-4 border border-[#1f2937]">
          <div className="text-2xl font-bold text-[#34d399]">{weeks.length}</div>
          <div className="text-xs text-[#6b7280] mt-1">Weeks</div>
        </div>
        <div className="bg-[#111827] rounded-xl p-4 border border-[#1f2937]">
          <div className="text-2xl font-bold text-[#fbbf24]">{meta.version}</div>
          <div className="text-xs text-[#6b7280] mt-1">Version</div>
        </div>
      </div>

      {weeks.map((week) => {
        const days = getDaysInWeek(week.id);
        return (
          <section key={week.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#f3f4f6]">{week.label}</h2>
              <Link
                href={`/week/${week.id}/day/${String(days[0]?.id ?? 1).padStart(2, "0")}`}
                className="text-xs text-[#60a5fa] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {days.map((day) => (
                <Link
                  key={day.id}
                  href={`/week/${week.id}/day/${day.day_str}`}
                  className="block p-3 rounded-xl bg-[#111827] border border-[#1f2937] hover:bg-[#1f2937] hover:border-[#374151] transition-all group"
                >
                  <div className="text-xs font-mono text-[#6b7280] mb-1">Day {day.day_str}</div>
                  <div className="text-xs font-medium text-[#f3f4f6] leading-snug line-clamp-2">
                    {day.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
