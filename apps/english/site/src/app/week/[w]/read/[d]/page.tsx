import { getDay, getWeeks } from "@/lib/data";
import { notFound } from "next/navigation";
import { DialogView } from "@/components/DialogView";
import { DayNav } from "@/components/DayNav";

export function generateStaticParams() {
  const weeks = getWeeks();
  const params: { w: string; d: string }[] = [];
  for (const week of weeks) {
    for (const dayId of week.days) {
      params.push({ w: String(week.id), d: String(dayId).padStart(2, "0") });
    }
  }
  return params;
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ w: string; d: string }>;
}) {
  const { w, d } = await params;
  const dayId = parseInt(d, 10);
  const weekNum = parseInt(w, 10);
  const day = getDay(dayId);
  if (!day || day.week_num !== weekNum) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <DayNav weekNum={weekNum} dayId={dayId} totalDays={15} />

      <div>
        <div className="text-xs font-mono text-[#6b7280] mb-1">Day {day.day_str} · Reading</div>
        <h1 className="text-xl font-bold text-[#fbbf24]">{day.reading_title || day.title}</h1>
      </div>

      <DialogView dialog={day.dialog} title="Customer ↔ Vendor" />

      <div className="flex justify-center">
        <DayNav weekNum={weekNum} dayId={dayId} totalDays={15} />
      </div>
    </div>
  );
}
