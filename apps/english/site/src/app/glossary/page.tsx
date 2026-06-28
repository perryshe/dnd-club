import { getDays } from "@/lib/data";

export default function Glossary() {
  const days = getDays();
  const seen = new Set<string>();
  const allWords = days.flatMap((d) => d.words).filter((w) => {
    const key = w.en.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#f3f4f6]">📖 Glossary</h1>
      <p className="text-[#9ca3af] text-sm">
        {allWords.length} unique words across all days
      </p>

      <div className="overflow-hidden rounded-xl border border-[#1f2937]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111827] border-b border-[#1f2937]">
              <th className="text-left p-3 text-[#9ca3af] font-medium">#</th>
              <th className="text-left p-3 text-[#9ca3af] font-medium">English</th>
              <th className="text-left p-3 text-[#9ca3af] font-medium">Русский</th>
            </tr>
          </thead>
          <tbody>
            {allWords.map((w, i) => (
              <tr key={i} className="border-b border-[#1f2937] last:border-0 hover:bg-[#1f2937]/50">
                <td className="p-3 text-[#6b7280] font-mono text-xs">{i + 1}</td>
                <td className="p-3 font-medium">{w.en}</td>
                <td className="p-3 text-[#9ca3af]">{w.ru}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
