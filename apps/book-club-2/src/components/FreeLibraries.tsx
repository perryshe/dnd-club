import { ExternalLink } from "lucide-react"

const libraries = [
  { name: "lib.ru", url: "https://lib.ru" },
  { name: "flibusta", url: "https://flibusta.is" },
  { name: "traumlibrary", url: "https://traumlibrary.net" },
]

export default function FreeLibraries() {
  return (
    <div className="p-4 rounded-xl border border-slate-800/50 bg-slate-900/20">
      <div className="flex items-center gap-2 mb-3">
        <ExternalLink size={12} className="text-slate-600" />
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-600">Бесплатные библиотеки</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {libraries.map((lib) => (
          <a
            key={lib.name}
            href={lib.url}
            target="_blank"
            className="text-[10px] font-mono tracking-wider text-slate-500 hover:text-cyan-400 transition px-2 py-1 rounded border border-slate-700/30 hover:border-cyan-700/30"
          >
            {lib.name}
          </a>
        ))}
      </div>
    </div>
  )
}
