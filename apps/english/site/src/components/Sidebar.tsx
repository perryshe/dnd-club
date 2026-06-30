import Link from "next/link";

const navItems = [
  { href: "/", label: "🏠 Home", icon: "H" },
  { href: "/schedule", label: "📅 Schedule", icon: "S" },
  { href: "/audio", label: "🎧 Audio", icon: "A" },
  { href: "/cheat-sheet", label: "📝 Cheat Sheet", icon: "C" },
  { href: "/glossary", label: "📖 Glossary", icon: "G" },
  { href: "/ai-scenarios", label: "🤖 AI Scenarios", icon: "R" },
  { href: "/email-templates", label: "✉️ Emails", icon: "E" },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-[#111827] border-r border-[#1f2937] flex flex-col">
      <div className="p-5 border-b border-[#1f2937]">
        <h1 className="text-lg font-bold text-[#60a5fa] leading-tight">
          English for<br />Manager
        </h1>
        <p className="text-xs text-[#6b7280] mt-1">15 дней · курс</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#f3f4f6] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[#1f2937] text-xs text-[#6b7280]">
        v2.0
      </div>
    </aside>
  );
}
