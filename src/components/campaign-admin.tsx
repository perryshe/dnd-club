"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createStatus, deleteStatus, updateStatus,
  createMaps, deleteMap,
  createGalleryImages, deleteGalleryImage,
  createRules, deleteRule,
  uploadStatusImage, deleteStatusImage,
} from "@/lib/admin-actions"

export function StatusTimeline({
  statuses,
  isAdmin,
  isApproved,
  color = "amber",
}: {
  statuses: { id: string; date: Date; title: string; essay: string; result: string; images: { id: string; url: string }[] }[]
  isAdmin: boolean
  isApproved: boolean
  color?: "amber" | "purple"
}) {
  const dotColor = color === "purple" ? "bg-purple-600 border-purple-400" : "bg-amber-600 border-amber-400"
  const resultBorder = color === "purple" ? "border-l-purple-600" : "border-l-amber-600"
  const resultLabel = color === "purple" ? "text-purple-400" : "text-amber-400"
  const accent = color === "purple" ? "#a855f7" : "#f59e0b"
  const accentRgb = color === "purple" ? "168,85,247" : "245,158,11"

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex gap-6">
      {/* timeline nav — sticky sidebar */}
      <div className="hidden md:flex flex-col items-center gap-3 sticky top-24 self-start pt-2">
        <div className="w-px h-4 bg-slate-600" />
        {statuses.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(`status-${s.id}`)}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition hover:scale-125"
            style={{
              borderColor: accent,
              color: accent,
              backgroundColor: "rgba(15,23,42,0.8)",
            }}
            title={`#${statuses.length - i}: ${s.title}`}
          >
            {statuses.length - i}
          </button>
        ))}
        <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-slate-600 to-transparent" />
      </div>

      {/* timeline body */}
      <div className="relative flex-1 min-w-0 pl-10">
        <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-current via-current/50 to-transparent rounded-full"
          style={{ color: accent }}
        />
        {statuses.map((s, i) => (
          <div key={s.id} id={`status-${s.id}`} className="relative pb-8 last:pb-0 group scroll-mt-24">
            <div
              className={`absolute left-[7px] top-2 w-[14px] h-[14px] rounded-full border-[3px] ${dotColor} shadow-lg transition-transform duration-300 group-hover:scale-150`}
              style={{ boxShadow: `0 0 12px rgba(${accentRgb},0.4)` }}
            />
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/80 ml-4 group-hover:border-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-black/30" style={{ borderLeftColor: `rgba(${accentRgb},0.15)`, borderLeftWidth: "3px" }}>
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `rgba(${accentRgb},0.15)`, color: accent }}
                  >
                    {statuses.length - i}
                  </span>
                  <div className="min-w-0">
                    <time className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(s.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                    <h3 className="text-lg font-bold mt-0.5 text-white group-hover:text-current transition-colors"
                      style={{ color: color === "purple" ? "#d8b4fe" : "#fbbf24" }}
                    >{s.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isAdmin && <EditStatusButton statusId={s.id} date={new Date(s.date).toISOString().split("T")[0]} title={s.title} essay={s.essay} result={s.result} />}
                  {isAdmin && <DeleteStatusButton statusId={s.id} />}
                </div>
              </div>
              {s.essay && <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3 leading-relaxed">{s.essay}</p>}
              {s.result && (
                <div className={`bg-slate-900/60 rounded-lg p-4 border-l-4 ${resultBorder} backdrop-blur-sm`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${resultLabel}`}>Результат</span>
                  <p className="text-sm text-slate-300 mt-1.5">{s.result}</p>
                </div>
              )}
              {s.images.length > 0 && (
                <StatusImages images={s.images} isAdmin={isAdmin} />
              )}
              {isApproved && <div className="mt-3"><StatusImageUpload statusId={s.id} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatusForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await createStatus(slug, new FormData(e.currentTarget))
      setOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
  }

  if (!open) return <button onClick={() => setOpen(true)} className="text-sm bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-lg transition">+ Добавить запись</button>

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 border border-amber-500/30">
      <h3 className="font-bold text-amber-400">Новая запись</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Дата</label>
          <input name="date" type="date" required className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Название</label>
          <input name="title" required className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Исторический очерк</label>
        <textarea name="essay" rows={4} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm resize-none" />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Результат</label>
        <textarea name="result" rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Отмена</button>
      </div>
    </form>
  )
}

export function DeleteStatusButton({ statusId }: { statusId: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить запись?")) return
    try {
      await deleteStatus(statusId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }
  return <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
}

export function EditStatusButton({ statusId, date, title, essay, result }: {
  statusId: string; date: string; title: string; essay: string; result: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await updateStatus(statusId, new FormData(e.currentTarget))
      setOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
  }

  if (!open) return <button onClick={() => setOpen(true)} className="text-xs text-amber-400 hover:text-amber-300">Редактировать</button>

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 border border-amber-500/30 mt-4">
      <h3 className="font-bold text-amber-400">Редактирование записи</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Дата</label>
          <input name="date" type="date" defaultValue={date} required className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Название</label>
          <input name="title" defaultValue={title} required className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Исторический очерк</label>
        <textarea name="essay" defaultValue={essay} rows={4} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm resize-none" />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Результат</label>
        <textarea name="result" defaultValue={result} rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Отмена</button>
      </div>
    </form>
  )
}

export function PdfRuleList({ rules, isAdmin }: { rules: { id: string; title: string; url: string }[]; isAdmin: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const first = rules[0]
  const rest = rules.slice(1)
  const hiddenCount = rest.length

  return (
    <div className="space-y-3">
      <PdfRuleItem rule={first} isAdmin={isAdmin} />
      {hiddenCount > 0 && !expanded && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setExpanded(true)} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg transition font-mono tracking-wide">
            [+] Показать ещё {hiddenCount}
          </button>
        </div>
      )}
      {expanded && rest.map((r) => <PdfRuleItem key={r.id} rule={r} isAdmin={isAdmin} />)}
      {expanded && hiddenCount > 0 && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setExpanded(false)} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg transition font-mono tracking-wide">
            [-] Скрыть
          </button>
        </div>
      )}
    </div>
  )
}

function PdfRuleItem({ rule, isAdmin }: { rule: { id: string; title: string; url: string }; isAdmin: boolean }) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 hover:border-slate-600 transition">
      <div className="text-sm font-semibold break-words mb-1">{rule.title}</div>
      <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mb-3">PDF</div>
      <div className="flex items-center gap-3">
        <a href={rule.url} target="_blank" download className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">
          Скачать
        </a>
        {isAdmin && <DeleteRuleButton ruleId={rule.id} />}
      </div>
    </div>
  )
}

export function StatusImageUpload({ statusId }: { statusId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setLoading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append("files", f))
      await uploadStatusImage(statusId, formData)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
    e.target.value = ""
  }

  return (
    <label className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer">
      <input type="file" accept="image/*" multiple onChange={handleChange} className="hidden" disabled={loading} />
      {loading ? "..." : "+ Фото"}
    </label>
  )
}

export function StatusImages({ images, isAdmin }: { images: { id: string; url: string }[]; isAdmin: boolean }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Удалить фото?")) return
    try {
      await deleteStatusImage(id)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        {images.map((img) => (
          <div key={img.id} className="relative group shrink-0">
            <button onClick={() => setSelected(img.url)}>
              <img src={img.url} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-amber-400 transition" />
            </button>
            {isAdmin && (
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
          <img src={selected} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}

export function MapForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await createMaps(slug, new FormData(e.currentTarget))
      setOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
  }

  if (!open) return <button onClick={() => setOpen(true)} className="text-sm bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-lg transition">+ Добавить карты</button>

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 border border-amber-500/30">
      <h3 className="font-bold text-amber-400">Новые карты</h3>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Файлы (можно выбрать несколько)</label>
        <input
          name="files"
          type="file"
          accept="image/*,.pdf"
          multiple
          className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:text-sm file:cursor-pointer hover:file:bg-slate-600"
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Отмена</button>
      </div>
    </form>
  )
}

export function DeleteMapButton({ mapId, onSuccess }: { mapId: string; onSuccess?: () => void }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить карту?")) return
    try {
      await deleteMap(mapId)
      router.refresh()
      onSuccess?.()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }
  return <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
}

export function GalleryForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await createGalleryImages(slug, new FormData(e.currentTarget))
      setOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
  }

  if (!open) return <button onClick={() => setOpen(true)} className="text-sm bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-lg transition">+ Добавить фото</button>

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 border border-amber-500/30">
      <h3 className="font-bold text-amber-400">Новые изображения</h3>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Файлы (можно выбрать несколько)</label>
        <input
          name="files"
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:text-sm file:cursor-pointer hover:file:bg-slate-600"
        />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Подпись (для всех)</label>
        <input name="caption" className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Отмена</button>
      </div>
    </form>
  )
}

export function DeleteGalleryButton({ imageId, onSuccess }: { imageId: string; onSuccess?: () => void }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить изображение?")) return
    try {
      await deleteGalleryImage(imageId)
      router.refresh()
      onSuccess?.()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }
  return <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
}

export function RuleForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await createRules(slug, new FormData(e.currentTarget))
      setOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
    setLoading(false)
  }

  if (!open) return <button onClick={() => setOpen(true)} className="text-sm bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-lg transition">+ Добавить правила</button>

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4 border border-amber-500/30">
      <h3 className="font-bold text-amber-400">Новые правила</h3>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Файлы (PDF или изображения, можно несколько)</label>
        <input
          name="files"
          type="file"
          accept="image/*,.pdf"
          multiple
          className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:text-sm file:cursor-pointer hover:file:bg-slate-600"
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Отмена</button>
      </div>
    </form>
  )
}

export function DeleteRuleButton({ ruleId, onSuccess }: { ruleId: string; onSuccess?: () => void }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить правило?")) return
    try {
      await deleteRule(ruleId)
      router.refresh()
      onSuccess?.()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }
  return <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
}
