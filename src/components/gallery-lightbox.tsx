"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { DeleteGalleryButton, DeleteMapButton, DeleteRuleButton } from "./campaign-admin"

interface ImageItem {
  id: string
  url: string
  caption: string | null
}

interface Props {
  images: ImageItem[]
  kind?: "gallery" | "map" | "rule"
  isAdmin?: boolean
}

const DELETE_PROPS = { gallery: "imageId", map: "mapId", rule: "ruleId" } as const
const DELETE_BTNS = { gallery: DeleteGalleryButton, map: DeleteMapButton, rule: DeleteRuleButton } as const

export default function GalleryLightbox({ images, kind = "gallery", isAdmin }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    setSelected((s) => (s !== null ? (s - 1 + images.length) % images.length : null))
  }, [images.length])

  const next = useCallback(() => {
    setSelected((s) => (s !== null ? (s + 1) % images.length : null))
  }, [images.length])

  useEffect(() => {
    if (selected === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [selected, close, prev, next])

  if (images.length === 0) return <p className="text-slate-400">Пока нет изображений</p>

  const DeleteBtn = DELETE_BTNS[kind]
  const deleteProp = DELETE_PROPS[kind]

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelected(i)}
            className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group cursor-pointer text-left"
          >
            <div className="aspect-[4/3] bg-slate-700 overflow-hidden">
              <img
                src={img.url}
                alt={img.caption || ""}
                className="w-full h-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3 flex items-center justify-between">
              <p className="text-sm text-slate-300 truncate">{img.caption || "—"}</p>
              {isAdmin && <DeleteBtn {...({ [deleteProp]: img.id } as any)} />}
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition z-10"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selected].url}
              alt={images[selected].caption || ""}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {images[selected].caption && (
              <p className="text-white/80 text-center mt-3 text-lg">{images[selected].caption}</p>
            )}
            {isAdmin && (
              <div className="flex justify-center mt-2">
                <DeleteBtn {...({ [deleteProp]: images[selected].id } as any)} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
