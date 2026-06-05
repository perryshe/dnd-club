"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCharacter, updateCharacter } from "@/lib/character-actions"

const ABILITIES = [
  { label: "СИЛ", name: "str" },
  { label: "ЛВК", name: "dex" },
  { label: "ВЫН", name: "con" },
  { label: "ИНТ", name: "int" },
  { label: "МДР", name: "wis" },
  { label: "ХАР", name: "cha" },
]

const SAVING_THROWS = [
  { label: "Сила", name: "str", ability: "str" },
  { label: "Ловкость", name: "dex", ability: "dex" },
  { label: "Выносливость", name: "con", ability: "con" },
  { label: "Интеллект", name: "int", ability: "int" },
  { label: "Мудрость", name: "wis", ability: "wis" },
  { label: "Харизма", name: "cha", ability: "cha" },
]

const SKILLS = [
  { label: "Акробатика", name: "acrobatics", ability: "dex" },
  { label: "Анализ", name: "investigation", ability: "int" },
  { label: "Атлетика", name: "athletics", ability: "str" },
  { label: "Внимательность", name: "perception", ability: "wis" },
  { label: "Выживание", name: "survival", ability: "wis" },
  { label: "Выступление", name: "performance", ability: "cha" },
  { label: "Запугивание", name: "intimidation", ability: "cha" },
  { label: "История", name: "history", ability: "int" },
  { label: "Ловкость рук", name: "sleight_of_hand", ability: "dex" },
  { label: "Магия", name: "arcana", ability: "int" },
  { label: "Медицина", name: "medicine", ability: "wis" },
  { label: "Обман", name: "deception", ability: "cha" },
  { label: "Природа", name: "nature", ability: "int" },
  { label: "Проницательность", name: "insight", ability: "wis" },
  { label: "Религия", name: "religion", ability: "int" },
  { label: "Скрытность", name: "stealth", ability: "dex" },
  { label: "Убеждение", name: "persuasion", ability: "cha" },
  { label: "Уход за животными", name: "animal_handling", ability: "wis" },
]

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function parseSheet(sheet: Record<string, any>, field: string, def: any = {}) {
  return sheet?.[field] ?? def
}

type Props = {
  slug: string
  character?: any
  inputClass?: string
  btnClass?: string
  btnHoverClass?: string
}

export default function CharacterForm({
  slug,
  character,
  inputClass = "w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none",
  btnClass = "bg-amber-600",
  btnHoverClass = "hover:bg-amber-700",
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isEdit = !!character
  const stats = (character?.stats as Record<string, number>) || {}
  const sheet = (character?.sheet as Record<string, any>) || {}

  const [abilityScores, setAbilityScores] = useState<Record<string, number>>({
    str: stats.str ?? 10,
    dex: stats.dex ?? 10,
    con: stats.con ?? 10,
    int: stats.int ?? 10,
    wis: stats.wis ?? 10,
    cha: stats.cha ?? 10,
  })

  const [savingThrows, setSavingThrows] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVING_THROWS.map((st) => [st.name, !!parseSheet(sheet, "savingThrows")[st.name]]))
  )
  const [skillProfs, setSkillProfs] = useState<Record<string, boolean>>(
    Object.fromEntries(SKILLS.map((sk) => [sk.name, !!parseSheet(sheet, "skills")[sk.name]]))
  )
  const [attacks, setAttacks] = useState<{ name: string; atkBonus: string; damage: string; type: string }[]>(
    parseSheet(sheet, "attacks", [])
  )
  const [proficiencyBonus, setProficiencyBonus] = useState(character?.proficiencyBonus ?? 2)

  function updateAbility(name: string, value: number) {
    setAbilityScores((prev) => ({ ...prev, [name]: value }))
  }

  function addAttack() {
    setAttacks([...attacks, { name: "", atkBonus: "", damage: "", type: "" }])
  }

  function updateAttack(i: number, field: string, value: string) {
    const updated = [...attacks]
    updated[i] = { ...updated[i], [field]: value }
    setAttacks(updated)
  }

  function removeAttack(i: number) {
    setAttacks(attacks.filter((_, idx) => idx !== i))
  }

  function spellsFromSheet(): Record<string, string[]> {
    const spells = parseSheet(sheet, "spells", {})
    const result: Record<string, string[]> = {}
    for (let i = 0; i <= 9; i++) {
      result[`level_${i}`] = spells[`level_${i}`] || []
    }
    return result
  }

  function spellsToText(level: number): string {
    const spells = spellsFromSheet()
    return (spells[`level_${level}`] || []).join("\n")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    formData.set("savingThrows", JSON.stringify(savingThrows))
    formData.set("skills", JSON.stringify(skillProfs))
    formData.set("attacks", JSON.stringify(attacks))

    const spells: Record<string, string[]> = {}
    for (let i = 0; i <= 9; i++) {
      const val = formData.get(`spells_level_${i}`) as string
      if (val?.trim()) {
        spells[`level_${i}`] = val.split("\n").map((s) => s.trim()).filter(Boolean)
      }
    }
    formData.set("spells", JSON.stringify(spells))

    try {
      if (isEdit) {
        await updateCharacter(character.id, formData)
        router.push(`/${slug}/characters/${character.id}`)
      } else {
        await createCharacter(slug, formData)
        router.push(`/${slug}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
      setLoading(false)
    }
  }

  const labelClass = "text-sm text-slate-400 block mb-1"
  const sectionClass = "bg-slate-800/50 rounded-xl p-6"

  return (
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Основная информация</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Имя *</label>
            <input name="name" required defaultValue={character?.name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Раса *</label>
            <input name="race" required defaultValue={character?.race ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Класс *</label>
            <input name="class" required defaultValue={character?.class ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Уровень</label>
            <input name="level" type="number" min={1} defaultValue={character?.level ?? 1} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Архетип / Предыстория</label>
            <input name="background" defaultValue={character?.background ?? ""} className={inputClass} placeholder="Послушник, Преступник..." />
          </div>
          <div>
            <label className={labelClass}>Мировоззрение</label>
            <input name="alignment" defaultValue={character?.alignment ?? ""} className={inputClass} placeholder="Законоправный-Добрый, Хаотичный-Нейтральный..." />
          </div>
          <div>
            <label className={labelClass}>Опыт (XP)</label>
            <input name="experiencePoints" type="number" min={0} defaultValue={character?.experiencePoints ?? 0} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Аватар</label>
            <input name="avatar" type="file" accept="image/*" className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:text-sm file:cursor-pointer hover:file:bg-slate-600" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Характеристики</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ABILITIES.map((s) => (
            <div key={s.name} className="text-center">
              <label className="text-xs text-slate-500 block mb-1 font-semibold">{s.label}</label>
              <input
                name={s.name}
                type="number"
                min={1}
                max={30}
                value={abilityScores[s.name]}
                onChange={(e) => updateAbility(s.name, Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center text-lg font-bold focus:border-amber-400 outline-none"
              />
              <span className="text-sm text-slate-400">
                {abilityModifier(abilityScores[s.name]) >= 0 ? "+" : ""}
                {abilityModifier(abilityScores[s.name])}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Боевые характеристики</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>HP (текущие)</label>
            <input name="hp" type="number" min={1} defaultValue={character?.hp ?? 10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Макс. HP</label>
            <input name="maxHp" type="number" min={1} defaultValue={character?.maxHp ?? 10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Врем. HP</label>
            <input name="tempHp" type="number" min={0} defaultValue={character?.tempHp ?? 0} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>КД (Класс брони)</label>
            <input name="ac" type="number" min={1} defaultValue={character?.ac ?? 10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Инициатива</label>
            <input name="initiative" type="number" defaultValue={character?.initiative || abilityModifier(abilityScores.dex)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Скорость</label>
            <input name="speed" type="number" min={0} defaultValue={character?.speed ?? 30} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Бонус мастерства</label>
            <input
              name="proficiencyBonus"
              type="number"
              min={1}
              value={proficiencyBonus}
              onChange={(e) => setProficiencyBonus(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Вдохновение</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input name="inspiration" type="checkbox" defaultChecked={character?.inspiration ?? false} className="w-5 h-5 accent-amber-500" />
              <span className="text-sm text-slate-300">Есть</span>
            </label>
          </div>
          <div>
            <label className={labelClass}>Кость хитов</label>
            <input name="hitDice" className={inputClass} defaultValue={character?.hitDice ?? "d10"} placeholder="к8, к10, к12..." />
          </div>
          <div>
            <label className={labelClass}>Кол-во костей хитов</label>
            <input name="hitDiceTotal" type="number" min={1} defaultValue={character?.hitDiceTotal ?? 1} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Спасброски</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {SAVING_THROWS.map((st) => {
            const mod = abilityModifier(abilityScores[st.ability])
            const total = savingThrows[st.name] ? mod + proficiencyBonus : mod
            return (
              <label key={st.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!savingThrows[st.name]}
                  onChange={(e) => setSavingThrows({ ...savingThrows, [st.name]: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="w-8 text-center font-mono text-sm font-bold text-slate-200">{total >= 0 ? "+" : ""}{total}</span>
                <span className="text-sm text-slate-300">{st.label}</span>
                <span className="text-xs text-slate-500">({st.ability.toUpperCase()})</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Навыки</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {SKILLS.map((sk) => {
            const mod = abilityModifier(abilityScores[sk.ability])
            const total = skillProfs[sk.name] ? mod + proficiencyBonus : mod
            return (
              <label key={sk.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!skillProfs[sk.name]}
                  onChange={(e) => setSkillProfs({ ...skillProfs, [sk.name]: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="w-8 text-center font-mono text-sm font-bold text-slate-200">{total >= 0 ? "+" : ""}{total}</span>
                <span className="text-sm text-slate-300">{sk.label}</span>
                <span className="text-xs text-slate-500">({sk.ability.toUpperCase()})</span>
              </label>
            )
          })}
        </div>
        <div className="mt-4">
          <label className={labelClass}>Пассивная Внимательность</label>
          <input
            name="passivePerception"
            type="number"
            defaultValue={parseSheet(sheet, "passivePerception", 10 + abilityModifier(abilityScores.wis))}
            className="w-32 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Спасброски от смерти</h2>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Успехи:</span>
            {[0, 1, 2].map((i) => (
              <label key={`ds_s_${i}`} className="flex items-center gap-1">
                <input type="radio" name="deathSaveSuccesses" value={i} defaultChecked={(sheet?.deathSaveSuccesses ?? 0) === i} className="w-4 h-4 accent-green-500" />
                <span className="text-xs text-slate-500">{i}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Провалы:</span>
            {[0, 1, 2].map((i) => (
              <label key={`ds_f_${i}`} className="flex items-center gap-1">
                <input type="radio" name="deathSaveFailures" value={i} defaultChecked={(sheet?.deathSaveFailures ?? 0) === i} className="w-4 h-4 accent-red-500" />
                <span className="text-xs text-slate-500">{i}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-400">Атаки и заклинания</h2>
          <button type="button" onClick={addAttack} className="text-sm bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-lg transition">
            + Добавить
          </button>
        </div>
        {attacks.length > 0 && (
          <div className="space-y-3">
            {attacks.map((atk, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <label className="text-xs text-slate-500">Название</label>
                  <input value={atk.name} onChange={(e) => updateAttack(i, "name", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-500">Бонус</label>
                  <input value={atk.atkBonus} onChange={(e) => updateAttack(i, "atkBonus", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm text-center focus:border-amber-400 outline-none" />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-slate-500">Урон</label>
                  <input value={atk.damage} onChange={(e) => updateAttack(i, "damage", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-500">Тип</label>
                  <input value={atk.type} onChange={(e) => updateAttack(i, "type", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none" />
                </div>
                <div className="col-span-1">
                  <button type="button" onClick={() => removeAttack(i)} className="text-red-400 hover:text-red-300 text-lg">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Особенности и черты</h2>
        <textarea name="featuresAndTraits" rows={4} defaultValue={parseSheet(sheet, "featuresAndTraits", "")}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Характер</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Черты характера</label>
            <textarea name="personalityTraits" rows={3} defaultValue={parseSheet(sheet, "personalityTraits", "")}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Идеалы</label>
            <textarea name="ideals" rows={3} defaultValue={parseSheet(sheet, "ideals", "")}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Привязанности</label>
            <textarea name="bonds" rows={3} defaultValue={parseSheet(sheet, "bonds", "")}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Слабости</label>
            <textarea name="flaws" rows={3} defaultValue={parseSheet(sheet, "flaws", "")}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Магия</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Заговорная х-ка</label>
            <input name="spellcastingAbility" className={inputClass} defaultValue={parseSheet(sheet, "spellcastingAbility", "")} placeholder="МДР, ИНТ, ХАР..." />
          </div>
          <div>
            <label className={labelClass}>Сл спасброска</label>
            <input name="spellSaveDc" type="number" defaultValue={parseSheet(sheet, "spellSaveDc", "")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Бонус атаки</label>
            <input name="spellAttackBonus" type="number" defaultValue={parseSheet(sheet, "spellAttackBonus", "")} className={inputClass} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <div key={level}>
              <label className={labelClass}>
                {level === 0 ? "Заговоры" : `${level}-й уровень`}
              </label>
              <textarea
                name={`spells_level_${level}`}
                rows={2}
                defaultValue={spellsToText(level)}
                placeholder="Каждое заклинание с новой строки"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Снаряжение</h2>
        <textarea name="equipment" rows={4} defaultValue={character?.equipment ?? ""} placeholder="Каждый предмет с новой строки"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Предыстория</h2>
        <textarea name="backstory" rows={5} defaultValue={character?.backstory ?? ""}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Заметки</h2>
        <textarea name="notes" rows={3} defaultValue={character?.notes ?? ""}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`${btnClass} ${btnHoverClass} disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition text-lg`}
      >
        {loading ? "Сохранение..." : isEdit ? "Сохранить изменения" : "Создать персонажа"}
      </button>
    </form>
  )
}
