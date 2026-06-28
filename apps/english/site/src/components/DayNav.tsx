import Link from "next/link";

type Props = {
  weekNum: number;
  dayId: number;
  totalDays: number;
};

export function DayNav({ weekNum, dayId, totalDays }: Props) {
  const prev = dayId > 1 ? dayId - 1 : null;
  const next = dayId < totalDays ? dayId + 1 : null;

  const prevWeek = prev ? (prev <= 5 ? 1 : prev <= 10 ? 2 : 3) : null;
  const nextWeek = next ? (next <= 5 ? 1 : next <= 10 ? 2 : 3) : null;

  return (
    <div className="flex items-center justify-between mb-6">
      {prev && prevWeek ? (
        <Link
          href={`/week/${prevWeek}/day/${String(prev).padStart(2, "0")}`}
          className="text-sm px-4 py-2 rounded-lg bg-[#111827] border border-[#1f2937] text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#1f2937] transition-colors"
        >
          ← Day {String(prev).padStart(2, "0")}
        </Link>
      ) : (
        <div />
      )}
      <Link
        href={`/week/${weekNum}/read/${String(dayId).padStart(2, "0")}`}
        className="text-sm px-4 py-2 rounded-lg bg-[#fbbf24] text-[#0a0f1a] font-medium hover:bg-amber-400 transition-colors"
      >
        📖 Reading
      </Link>
      {next && nextWeek ? (
        <Link
          href={`/week/${nextWeek}/day/${String(next).padStart(2, "0")}`}
          className="text-sm px-4 py-2 rounded-lg bg-[#111827] border border-[#1f2937] text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#1f2937] transition-colors"
        >
          Day {String(next).padStart(2, "0")} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
