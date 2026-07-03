export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatMod(v: number): string {
  return v >= 0 ? `+${v}` : `${v}`
}

export const ABILITY_NAMES: Record<string, string> = {
  str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
}

export const SKILL_LABELS: Record<string, string> = {
  acrobatics: "Акробатика", animal_handling: "Уход за животными", arcana: "Магия",
  athletics: "Атлетика", deception: "Обман", history: "История",
  insight: "Проницательность", intimidation: "Запугивание", investigation: "Анализ",
  medicine: "Медицина", nature: "Природа", perception: "Внимательность",
  performance: "Выступление", persuasion: "Убеждение", religion: "Религия",
  sleight_of_hand: "Ловкость рук", stealth: "Скрытность", survival: "Выживание",
}

export const SKILL_ABILITY: Record<string, string> = {
  acrobatics: "dex", animal_handling: "wis", arcana: "int",
  athletics: "str", deception: "cha", history: "int",
  insight: "wis", intimidation: "cha", investigation: "int",
  medicine: "wis", nature: "int", perception: "wis",
  performance: "cha", persuasion: "cha", religion: "int",
  sleight_of_hand: "dex", stealth: "dex", survival: "wis",
}

export function computeSkillTotal(
  stats: Record<string, number>,
  skillKey: string,
  profs: Record<string, boolean>,
  pb: number
): string {
  const score = stats[SKILL_ABILITY[skillKey]] ?? 10
  const mod = abilityModifier(score)
  return formatMod(profs[skillKey] ? mod + pb : mod)
}

export const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const

export const SKILL_KEYS = Object.keys(SKILL_LABELS)
