import { getWeeks, getDaysInWeek } from "@/lib/data";
import { DayCard } from "@/components/DayCard";

export default function Schedule() {
  const weeks = getWeeks();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[#f3f4f6]">📅 Schedule</h1>

      {weeks.map((week) => {
        const days = getDaysInWeek(week.id);
        return (
          <section key={week.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#f3f4f6]">{week.label}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {days.map((day) => (
                <DayCard
                  key={day.id}
                  dayId={day.id}
                  dayStr={day.day_str}
                  title={day.title}
                  weekNum={week.id}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
