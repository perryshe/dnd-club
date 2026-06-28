import Link from "next/link";

type Props = {
  dayId: number;
  dayStr: string;
  title: string;
  weekNum: number;
};

export function DayCard({ dayId, dayStr, title, weekNum }: Props) {
  const href = `/week/${weekNum}/day/${dayStr}`;
  return (
    <Link
      href={href}
      className="block p-4 rounded-xl bg-[#111827] border border-[#1f2937] hover:bg-[#1f2937] hover:border-[#374151] transition-all group"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-[#6b7280]">Day {dayStr}</span>
        <span className="text-xs text-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity">
          → open
        </span>
      </div>
      <div className="text-sm font-medium text-[#f3f4f6] leading-snug">{title}</div>
    </Link>
  );
}
