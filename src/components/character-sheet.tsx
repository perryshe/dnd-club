import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import { deleteCharacter } from "@/lib/character-actions"

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function formatMod(v: number): string {
  return v >= 0 ? `+${v}` : `${v}`
}

const ABILITY_NAMES: Record<string, string> = {
  str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
}

const SKILL_LABELS: Record<string, string> = {
  acrobatics: "Acrobatics", animal_handling: "Animal Handling", arcana: "Arcana",
  athletics: "Athletics", deception: "Deception", history: "History",
  insight: "Insight", intimidation: "Intimidation", investigation: "Investigation",
  medicine: "Medicine", nature: "Nature", perception: "Perception",
  performance: "Performance", persuasion: "Persuasion", religion: "Religion",
  sleight_of_hand: "Sleight of Hand", stealth: "Stealth", survival: "Survival",
}

const SKILL_ABILITY: Record<string, string> = {
  acrobatics: "dex", animal_handling: "wis", arcana: "int",
  athletics: "str", deception: "cha", history: "int",
  insight: "wis", intimidation: "cha", investigation: "int",
  medicine: "wis", nature: "int", perception: "wis",
  performance: "cha", persuasion: "cha", religion: "int",
  sleight_of_hand: "dex", stealth: "dex", survival: "wis",
}

export default async function CharacterSheet({
  characterId,
  accentColor = "red-500",
  accentBorder = "border-red-500/30",
}: {
  characterId: string
  accentColor?: string
  accentBorder?: string
}) {
  const session = await auth()
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { campaign: true, user: true },
  })
  if (!character) notFound()

  const stats = character.stats as Record<string, number>
  const sheet = character.sheet as Record<string, any>
  const pb = character.proficiencyBonus

  const savingThrows = (sheet?.savingThrows || {}) as Record<string, boolean>
  const skillProfs = (sheet?.skills || {}) as Record<string, boolean>
  const attacks = (sheet?.attacks || []) as { name: string; atkBonus: string; damage: string; type: string }[]
  const spells = (sheet?.spells || {}) as Record<string, string[]>
  const canDelete = session?.user?.role === "admin" || session?.user?.id === character.userId
  const equipment = character.equipment ? character.equipment.split("\n").filter(Boolean) : []

  const sectionCard = `bg-slate-800 rounded-xl p-6 border ${accentBorder}`

  return (
    <>
      <header className="container mx-auto px-4 py-8">
        <Link
          href={`/${character.campaign.slug}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          К персонажам
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{character.name}</h1>
            <p className="text-slate-400 text-lg">
              {character.race} {character.class} • Уровень {character.level}
              {character.background && ` • ${character.background}`}
              {character.alignment && ` • ${character.alignment}`}
            </p>
            {character.experiencePoints > 0 && (
              <p className="text-sm text-slate-500">XP: {character.experiencePoints}</p>
            )}
          </div>
          {canDelete && (
            <form
              action={async () => {
                "use server"
                await deleteCharacter(character.id)
              }}
            >
              <button className="flex items-center gap-2 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg transition">
                <Trash2 size={18} />
                Удалить
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 space-y-6">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className={`${sectionCard} text-center`}>
            <div className="text-xs text-slate-400 uppercase">AC</div>
            <div className={`text-3xl font-bold ${accentColor.replace("500", "400")}`}>{character.ac}</div>
          </div>
          <div className={`${sectionCard} text-center`}>
            <div className="text-xs text-slate-400 uppercase">HP</div>
            <div className="text-3xl font-bold text-red-400">{character.hp}</div>
            <div className="text-xs text-slate-500">/ {character.maxHp}</div>
          </div>
          <div className={`${sectionCard} text-center`}>
            <div className="text-xs text-slate-400 uppercase">Temp HP</div>
            <div className="text-3xl font-bold text-slate-300">{character.tempHp || 0}</div>
          </div>
          <div className={`${sectionCard} text-center`}>
            <div className="text-xs text-slate-400 uppercase">Initiative</div>
            <div className="text-3xl font-bold text-slate-300">
              {formatMod(character.initiative || abilityModifier(stats.dex ?? 10))}
            </div>
          </div>
          <div className={`${sectionCard} text-center`}>
            <div className="text-xs text-slate-400 uppercase">Speed</div>
            <div className="text-3xl font-bold text-slate-300">{character.speed}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Характеристики</h2>
              <div className="space-y-2">
                {["str", "dex", "con", "int", "wis", "cha"].map((key) => {
                  const score = stats[key] ?? 10
                  const mod = abilityModifier(score)
                  return (
                    <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                      <span className="font-semibold text-slate-300 w-12">{ABILITY_NAMES[key]}</span>
                      <span className="text-2xl font-bold text-white w-10 text-center">{score}</span>
                      <span className={`text-lg font-bold w-8 text-center ${mod >= 0 ? "text-green-400" : "text-red-400"}`}>{formatMod(mod)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Спасброски</h2>
              <div className="space-y-1">
                {["str", "dex", "con", "int", "wis", "cha"].map((key) => {
                  const score = stats[key] ?? 10
                  const mod = abilityModifier(score)
                  const proficient = savingThrows[key]
                  const total = proficient ? mod + pb : mod
                  return (
                    <div key={key} className="flex items-center gap-3 py-1">
                      {proficient ? (
                        <span className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold">P</span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-500">-</span>
                      )}
                      <span className={`w-8 text-center font-mono text-sm font-bold ${total >= 0 ? "text-green-400" : "text-red-400"}`}>{formatMod(total)}</span>
                      <span className="text-sm text-slate-300">{ABILITY_NAMES[key]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Навыки</h2>
              <div className="space-y-1">
                {Object.entries(SKILL_LABELS).map(([key, label]) => {
                  const score = stats[SKILL_ABILITY[key]] ?? 10
                  const mod = abilityModifier(score)
                  const proficient = skillProfs[key]
                  const total = proficient ? mod + pb : mod
                  return (
                    <div key={key} className="flex items-center gap-3 py-0.5">
                      {proficient ? (
                        <span className="w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold">P</span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-700" />
                      )}
                      <span className={`w-8 text-center font-mono text-sm ${total >= 0 ? "text-green-400" : "text-red-400"}`}>{formatMod(total)}</span>
                      <span className="text-sm text-slate-300">{label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <span className="text-sm text-slate-400">Пассивная Внимательность: </span>
                <span className="font-bold text-amber-400">{sheet?.passivePerception ?? (10 + abilityModifier(stats.wis ?? 10))}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Боевые х-ки</h2>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">HP</span><span className="font-bold text-red-400">{character.hp} / {character.maxHp}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Временные HP</span><span className="font-bold">{character.tempHp || 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Кость хитов</span><span className="font-bold">{character.hitDice} ({character.hitDiceTotal})</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Бонус мастерства</span><span className="font-bold text-amber-400">{formatMod(pb)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Вдохновение</span><span className="font-bold">{character.inspiration ? "✓ Есть" : "—"}</span></div>
                {character.alignment && <div className="flex justify-between"><span className="text-slate-400">Мировоззрение</span><span className="font-bold">{character.alignment}</span></div>}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Спасброски от смерти</h2>
              <div className="flex gap-8">
                <div><span className="text-sm text-slate-400">Успехи: </span>{[0, 1, 2].map((i) => (<span key={i} className={`inline-block w-5 h-5 rounded-full mx-1 ${i < (sheet?.deathSaveSuccesses ?? 0) ? "bg-green-600" : "border border-slate-600"}`} />))}</div>
                <div><span className="text-sm text-slate-400">Провалы: </span>{[0, 1, 2].map((i) => (<span key={i} className={`inline-block w-5 h-5 rounded-full mx-1 ${i < (sheet?.deathSaveFailures ?? 0) ? "bg-red-600" : "border border-slate-600"}`} />))}</div>
              </div>
            </div>

            {attacks.length > 0 && (
              <div className={sectionCard}>
                <h2 className="text-lg font-bold mb-4 text-amber-400">Атаки</h2>
                <div className="space-y-2">
                  {attacks.map((atk, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
                      <div><div className="font-semibold">{atk.name}</div><div className="text-xs text-slate-400">{atk.type}</div></div>
                      <div className="text-right"><div className="text-sm font-mono text-green-400">{atk.atkBonus}</div><div className="text-xs text-slate-400">{atk.damage}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(sheet?.featuresAndTraits) && (
              <div className={sectionCard}>
                <h2 className="text-lg font-bold mb-4 text-amber-400">Особенности и черты</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{sheet.featuresAndTraits}</p>
              </div>
            )}

            {Object.keys(spells).length > 0 && (
              <div className={sectionCard}>
                <h2 className="text-lg font-bold mb-4 text-amber-400">Магия</h2>
                {sheet?.spellcastingAbility && (
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div><span className="text-slate-400">Х-ка: </span>{sheet.spellcastingAbility}</div>
                    <div><span className="text-slate-400">DC: </span>{sheet.spellSaveDc}</div>
                    <div><span className="text-slate-400">Бонус: </span>{sheet.spellAttackBonus}</div>
                  </div>
                )}
                <div className="space-y-3">
                  {Object.entries(spells).map(([level, spellList]) => (
                    spellList.length > 0 && (
                      <div key={level}>
                        <h3 className="text-sm font-semibold text-slate-400 mb-1">{level === "level_0" ? "Заговоры" : `${level.replace("level_", "")}-й уровень`}</h3>
                        <ul className="list-disc list-inside text-sm text-slate-300">{spellList.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Характер</h2>
              <div className="space-y-4">
                {sheet?.personalityTraits && <div><h3 className="text-xs font-semibold text-slate-500 uppercase">Черты характера</h3><p className="text-sm text-slate-300 whitespace-pre-wrap">{sheet.personalityTraits}</p></div>}
                {sheet?.ideals && <div><h3 className="text-xs font-semibold text-slate-500 uppercase">Идеалы</h3><p className="text-sm text-slate-300 whitespace-pre-wrap">{sheet.ideals}</p></div>}
                {sheet?.bonds && <div><h3 className="text-xs font-semibold text-slate-500 uppercase">Привязанности</h3><p className="text-sm text-slate-300 whitespace-pre-wrap">{sheet.bonds}</p></div>}
                {sheet?.flaws && <div><h3 className="text-xs font-semibold text-slate-500 uppercase">Слабости</h3><p className="text-sm text-slate-300 whitespace-pre-wrap">{sheet.flaws}</p></div>}
                {!sheet?.personalityTraits && !sheet?.ideals && !sheet?.bonds && !sheet?.flaws && <p className="text-slate-500 text-sm">Не указано</p>}
              </div>
            </div>

            <div className={sectionCard}>
              <h2 className="text-lg font-bold mb-4 text-amber-400">Снаряжение</h2>
              {equipment.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">{equipment.map((item, i) => <li key={i}>{item}</li>)}</ul>
              ) : <p className="text-slate-500 text-sm">Нет снаряжения</p>}
            </div>

            {character.backstory && (
              <div className={sectionCard}>
                <h2 className="text-lg font-bold mb-4 text-amber-400">Предыстория</h2>
                <p className="text-slate-300 whitespace-pre-wrap text-sm">{character.backstory}</p>
              </div>
            )}

            {character.notes && (
              <div className={sectionCard}>
                <h2 className="text-lg font-bold mb-4 text-amber-400">Заметки</h2>
                <p className="text-slate-300 whitespace-pre-wrap text-sm">{character.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
