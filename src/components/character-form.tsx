"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCharacter } from "@/lib/character-actions"

const ABILITIES = [
  { label: "STR", name: "str" },
  { label: "DEX", name: "dex" },
  { label: "CON", name: "con" },
  { label: "INT", name: "int" },
  { label: "WIS", name: "wis" },
  { label: "CHA", name: "cha" },
]

const SAVING_THROWS = [
  { label: "Strength", name: "str", ability: "str" },
  { label: "Dexterity", name: "dex", ability: "dex" },
  { label: "Constitution", name: "con", ability: "con" },
  { label: "Intelligence", name: "int", ability: "int" },
  { label: "Wisdom", name: "wis", ability: "wis" },
  { label: "Charisma", name: "cha", ability: "cha" },
]

const SKILLS = [
  { label: "Acrobatics", name: "acrobatics", ability: "dex" },
  { label: "Animal Handling", name: "animal_handling", ability: "wis" },
  { label: "Arcana", name: "arcana", ability: "int" },
  { label: "Athletics", name: "athletics", ability: "str" },
  { label: "Deception", name: "deception", ability: "cha" },
  { label: "History", name: "history", ability: "int" },
  { label: "Insight", name: "insight", ability: "wis" },
  { label: "Intimidation", name: "intimidation", ability: "cha" },
  { label: "Investigation", name: "investigation", ability: "int" },
  { label: "Medicine", name: "medicine", ability: "wis" },
  { label: "Nature", name: "nature", ability: "int" },
  { label: "Perception", name: "perception", ability: "wis" },
  { label: "Performance", name: "performance", ability: "cha" },
  { label: "Persuasion", name: "persuasion", ability: "cha" },
  { label: "Religion", name: "religion", ability: "int" },
  { label: "Sleight of Hand", name: "sleight_of_hand", ability: "dex" },
  { label: "Stealth", name: "stealth", ability: "dex" },
  { label: "Survival", name: "survival", ability: "wis" },
]

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

type Props = {
  slug: string
  inputClass?: string
  focusClass?: string
  btnClass?: string
  btnHoverClass?: string
}

export default function CharacterForm({
  slug,
  inputClass = "w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none",
  focusClass = "focus:border-amber-400",
  btnClass = "bg-amber-600",
  btnHoverClass = "hover:bg-amber-700",
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [abilityScores, setAbilityScores] = useState<Record<string, number>>({
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
  })

  const [savingThrows, setSavingThrows] = useState<Record<string, boolean>>({})
  const [skillProfs, setSkillProfs] = useState<Record<string, boolean>>({})
  const [attacks, setAttacks] = useState<{ name: string; atkBonus: string; damage: string; type: string }[]>([])
  const [proficiencyBonus, setProficiencyBonus] = useState(2)

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
      await createCharacter(slug, formData)
      router.push(`/${slug}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
      setLoading(false)
    }
  }

  const labelClass = "text-sm text-slate-400 block mb-1"
  const sectionClass = "bg-slate-800/50 rounded-xl p-6"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Основная информация</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Имя *</label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Раса *</label>
            <input name="race" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Класс *</label>
            <input name="class" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Уровень</label>
            <input name="level" type="number" min={1} defaultValue={1} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Архетип / Предыстория</label>
            <input name="background" className={inputClass} placeholder="Acolyte, Criminal..." />
          </div>
          <div>
            <label className={labelClass}>Мировоззрение</label>
            <input name="alignment" className={inputClass} placeholder="Lawful Good, Chaotic Neutral..." />
          </div>
          <div>
            <label className={labelClass}>Опыт (XP)</label>
            <input name="experiencePoints" type="number" min={0} defaultValue={0} className={inputClass} />
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
            <input name="hp" type="number" min={1} defaultValue={10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Макс. HP</label>
            <input name="maxHp" type="number" min={1} defaultValue={10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Врем. HP</label>
            <input name="tempHp" type="number" min={0} defaultValue={0} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>AC (Класс брони)</label>
            <input name="ac" type="number" min={1} defaultValue={10} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Инициатива</label>
            <input name="initiative" type="number" value={abilityModifier(abilityScores.dex)} readOnly className={`${inputClass} opacity-70`} />
          </div>
          <div>
            <label className={labelClass}>Скорость</label>
            <input name="speed" type="number" min={0} defaultValue={30} className={inputClass} />
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
              <input name="inspiration" type="checkbox" className="w-5 h-5 accent-amber-500" />
              <span className="text-sm text-slate-300">Есть</span>
            </label>
          </div>
          <div>
            <label className={labelClass}>Кость хитов</label>
            <input name="hitDice" className={inputClass} defaultValue="d10" placeholder="d8, d10, d12..." />
          </div>
          <div>
            <label className={labelClass}>Кол-во костей хитов</label>
            <input name="hitDiceTotal" type="number" min={1} defaultValue={1} className={inputClass} />
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
            defaultValue={10 + abilityModifier(abilityScores.wis)}
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
                <input type="radio" name="deathSaveSuccesses" value={i} defaultChecked={i === 0} className="w-4 h-4 accent-green-500" />
                <span className="text-xs text-slate-500">{i}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Провалы:</span>
            {[0, 1, 2].map((i) => (
              <label key={`ds_f_${i}`} className="flex items-center gap-1">
                <input type="radio" name="deathSaveFailures" value={i} defaultChecked={i === 0} className="w-4 h-4 accent-red-500" />
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
        <textarea name="featuresAndTraits" rows={4} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Характер</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Черты характера</label>
            <textarea name="personalityTraits" rows={3} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Идеалы</label>
            <textarea name="ideals" rows={3} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Привязанности</label>
            <textarea name="bonds" rows={3} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
          <div>
            <label className={labelClass}>Слабости</label>
            <textarea name="flaws" rows={3} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Магия</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Заговорная х-ка</label>
            <input name="spellcastingAbility" className={inputClass} placeholder="WIS, INT, CHA..." />
          </div>
          <div>
            <label className={labelClass}>Сл спасброска</label>
            <input name="spellSaveDc" type="number" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Бонус атаки</label>
            <input name="spellAttackBonus" type="number" className={inputClass} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <div key={level}>
              <label className={labelClass}>
                {level === 0 ? "Заговоры (Cantrips)" : `${level}-й уровень`}
              </label>
              <textarea
                name={`spells_level_${level}`}
                rows={2}
                placeholder="Каждое заклинание с новой строки"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Снаряжение</h2>
        <textarea name="equipment" rows={4} placeholder="Каждый предмет с новой строки"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Предыстория</h2>
        <textarea name="backstory" rows={5} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold mb-4 text-amber-400">Заметки</h2>
        <textarea name="notes" rows={3} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none resize-none" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`${btnClass} ${btnHoverClass} disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition text-lg`}
      >
        {loading ? "Сохранение..." : "Создать персонажа"}
      </button>
    </form>
  )
}
