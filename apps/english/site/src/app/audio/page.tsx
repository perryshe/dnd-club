import { getDays, getWeeks } from "@/lib/data";
import { AudioPlayer } from "@/components/AudioPlayer";

export default function AudioPage() {
  const weeks = getWeeks();
  const days = getDays();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#f3f4f6]">🎧 Audio Library</h1>
      <p className="text-[#9ca3af] text-sm">All day audio files in one place</p>

      {weeks.map((week) => {
        const weekDays = days.filter((d) => d.week_num === week.id);
        return (
          <section key={week.id}>
            <h2 className="text-lg font-semibold text-[#f3f4f6] mb-3">{week.label}</h2>
            <div className="space-y-2">
              {weekDays.map((day) => (
                <AudioPlayer
                  key={day.id}
                  src={`/audio/day-${day.day_str}.mp3`}
                  label={`Day ${day.day_str} — ${day.title}`}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
