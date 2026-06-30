import { getDay, getWeeks, getTotalDays } from "@/lib/data";
import { notFound } from "next/navigation";
import { PhraseList } from "@/components/PhraseList";
import { WordTable } from "@/components/WordTable";
import { CheckboxList } from "@/components/CheckboxList";
import { AudioPlayer } from "@/components/AudioPlayer";
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

export default async function DayPage({
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
      <DayNav weekNum={weekNum} dayId={dayId} totalDays={getTotalDays()} />

      <div>
        <div className="text-xs font-mono text-[#6b7280] mb-1">Day {day.day_str} · {day.date}</div>
        <h1 className="text-2xl font-bold text-[#f3f4f6]">{day.title}</h1>
        <p className="text-[#9ca3af] mt-1 text-sm">{day.focus}</p>
      </div>

      <AudioPlayer
        src={`/audio/day-${day.day_str}.mp3`}
        label={`Day ${day.day_str} — Full Audio`}
      />

      {day.phrases.length > 0 && <PhraseList phrases={day.phrases} />}

      {day.words.length > 0 && <WordTable words={day.words} />}

      {day.checks.length > 0 && <CheckboxList items={day.checks} />}

      <div className="bg-[#111827] rounded-xl p-4 border border-[#1f2937]">
        <h2 className="text-sm font-semibold text-[#9ca3af] mb-2">🔄 Review</h2>
        <p className="text-sm text-[#f3f4f6] leading-relaxed">{day.review}</p>
      </div>

      <DayNav weekNum={weekNum} dayId={dayId} totalDays={getTotalDays()} />
    </div>
  );
}
