export function DialogView({
  dialog,
  title,
}: {
  dialog: { role: string; text: string }[];
  title?: string;
}) {
  return (
    <div>
      {title && (
        <h2 className="text-lg font-semibold text-[#fbbf24] mb-3">{title}</h2>
      )}
      <div className="space-y-3">
        {dialog.map((line, i) => {
          const isCust = line.role === "Customer";
          return (
            <div key={i} className={`flex ${isCust ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isCust
                    ? "bg-blue-500/10 border border-blue-500/20 text-[#f3f4f6]"
                    : "bg-amber-500/10 border border-amber-500/20 text-[#f3f4f6]"
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${isCust ? "text-blue-400" : "text-amber-400"}`}>
                  {isCust ? "🧑‍💼 Customer" : "🤝 Vendor"}
                </div>
                <div className="text-sm leading-relaxed">{line.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
