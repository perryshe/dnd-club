import Link from "next/link"

const navItems = [
  { href: "/", label: "Home", icon: "H" },
  { href: "/schedule", label: "Schedule", icon: "S" },
  { href: "/audio", label: "Audio", icon: "A" },
  { href: "/cheat-sheet", label: "Cheat Sheet", icon: "C" },
  { href: "/glossary", label: "Glossary", icon: "G" },
  { href: "/ai-scenarios", label: "AI Scenarios", icon: "R" },
  { href: "/email-templates", label: "Emails", icon: "E" },
]

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-slate-950 border-r border-slate-800/40 flex flex-col">
      <div className="p-5 border-b border-slate-800/40">
        <h1 className="text-lg font-bold text-blue-400 leading-tight">
          English for<br />Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">15 days · course</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 text-slate-400 text-[10px] font-bold shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800/40 text-xs text-slate-600">
        v2.0
      </div>
    </aside>
  )
}
