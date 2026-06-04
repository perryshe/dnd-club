"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createStatus, deleteStatus,
  createMaps, deleteMap,
  createGalleryImages, deleteGalleryImage,
  createRules, deleteRule,
} from "@/lib/admin-actions"

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

export function DeleteMapButton({ mapId }: { mapId: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить карту?")) return
    try {
      await deleteMap(mapId)
      router.refresh()
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

export function DeleteGalleryButton({ imageId }: { imageId: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить изображение?")) return
    try {
      await deleteGalleryImage(imageId)
      router.refresh()
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

export function DeleteRuleButton({ ruleId }: { ruleId: string }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm("Удалить правило?")) return
    try {
      await deleteRule(ruleId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка")
    }
  }
  return <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
}
