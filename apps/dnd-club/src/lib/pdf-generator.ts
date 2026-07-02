import fs from "fs"
import { PDFDocument, PDFHexString } from "pdf-lib"

interface CharacterData {
  name: string
  race: string
  class: string
  level: number
  background: string
  alignment: string
  experiencePoints: number
  hp: number
  maxHp: number
  tempHp: number
  ac: number
  initiative: number
  speed: number
  proficiencyBonus: number
  inspiration: boolean
  hitDice: string
  hitDiceTotal: number
  equipment: string
  backstory: string
  notes: string
  stats: Record<string, number>
  sheet: Record<string, any>
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function formatMod(v: number): string {
  return v >= 0 ? `+${v}` : `${v}`
}

function truncate(value: string, maxLen: number | undefined): string {
  if (!value) return ""
  if (maxLen === undefined) return value
  if (value.length <= maxLen) return value
  return value.slice(0, Math.max(maxLen - 1, 0)) + "…"
}

const SKILL_ABILITY: Record<string, string> = {
  acrobatics: "dex", animal_handling: "wis", arcana: "int",
  athletics: "str", deception: "cha", history: "int",
  insight: "wis", intimidation: "cha", investigation: "int",
  medicine: "wis", nature: "int", perception: "wis",
  performance: "cha", persuasion: "cha", religion: "int",
  sleight_of_hand: "dex", stealth: "dex", survival: "wis",
}

function computeSkillTotal(
  stats: Record<string, number>,
  skillKey: string,
  profs: Record<string, boolean>,
  pb: number
): string {
  const score = stats[SKILL_ABILITY[skillKey]] ?? 10
  const mod = abilityModifier(score)
  return formatMod(profs[skillKey] ? mod + pb : mod)
}

const PDF_INPUT_NAMES: Record<string, string> = {
  classLevel: "ClassLevel",
  background: "Background",
  playerName: "PlayerName",
  characterName: "CharacterName",
  alignment: "Alignment",
  xp: "XP",
  inspiration: "Inspiration",
  profBonus: "ProfBonus",

  str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
  strMod: "STRmod", dexMod: "DEXmod", conMod: "CONmod",
  intMod: "INTmod", wisMod: "WISmod", chaMod: "CHamod",

  ac: "AC", initiative: "Initiative", speed: "Speed",
  hpMax: "HPMax", hpCurrent: "HPCurrent", hpTemp: "HPTemp",
  hdTotal: "HDTotal", hd: "HD",

  deathSaveSuccess1: "Check Box 12",
  deathSaveSuccess2: "Check Box 13",
  deathSaveSuccess3: "Check Box 14",
  deathSaveFailure1: "Check Box 15",
  deathSaveFailure2: "Check Box 16",
  deathSaveFailure3: "Check Box 17",

  stStrength: "ST Strength", stDexterity: "ST Dexterity",
  stConstitution: "ST Constitution", stIntelligence: "ST Intelligence",
  stWisdom: "ST Wisdom", stCharisma: "ST Charisma",
  stStrengthProf: "Check Box 11", stDexterityProf: "Check Box 18",
  stConstitutionProf: "Check Box 19", stIntelligenceProf: "Check Box 20",
  stWisdomProf: "Check Box 21", stCharismaProf: "Check Box 22",

  acrobatics: "Acrobatics", animal_handling: "Animal",
  arcana: "Arcana", athletics: "Athletics",
  deception: "Deception", history: "History",
  insight: "Insight", intimidation: "Intimidation",
  investigation: "Investigation", medicine: "Medicine",
  nature: "Nature", perception: "Perception",
  performance: "Performance", persuasion: "Persuasion",
  religion: "Religion", sleight_of_hand: "SleightofHand",
  stealth: "Stealth", survival: "Survival",

  acrobaticsProf: "Check Box 23", animal_handlingProf: "Check Box 24",
  arcanaProf: "Check Box 25", athleticsProf: "Check Box 26",
  deceptionProf: "Check Box 27", historyProf: "Check Box 28",
  insightProf: "Check Box 29", intimidationProf: "Check Box 30",
  investigationProf: "Check Box 31", medicineProf: "Check Box 32",
  natureProf: "Check Box 33", perceptionProf: "Check Box 34",
  performanceProf: "Check Box 35", persuasionProf: "Check Box 36",
  religionProf: "Check Box 37", sleight_of_handProf: "Check Box 38",
  stealthProf: "Check Box 39", survivalProf: "Check Box 40",

  wpnName1: "Wpn Name", wpnAtkBonus1: "Wpn1 AtkBonus",
  wpnDamage1: "Wpn1 Damage",
  wpnName2: "Wpn Name 2", wpnAtkBonus2: "Wpn2 AtkBonus",
  wpnDamage2: "Wpn2 Damage",
  wpnName3: "Wpn Name 3", wpnAtkBonus3: "Wpn3 AtkBonus",
  wpnDamage3: "Wpn3 Damage",

  ideals: "Ideals", bonds: "Bonds", flaws: "Flaws",

  cp: "CP", sp: "SP", ep: "EP", gp: "GP", pp: "PP",
  equipment: "Equipment",

  passiveWisdom: "Passive",
  proficienciesLang: "ProficienciesLang",
  attacksSpellcasting: "AttacksSpellcasting",
  featuresTraits: "Features and Traits",

  characterName2: "CharacterName 2",
  age: "Age", height: "Height", weight: "Weight",
  eyes: "Eyes", skin: "Skin", hair: "Hair",
  factionSymbolImage: "Faction Symbol Image",
  allies: "Allies", factionName: "FactionName",
  backstory: "Backstory",
  featTraits2: "Feat+Traits",
  treasure: "Treasure",
  characterImage: "CHARACTER IMAGE",

  spellcastingClass: "Spellcasting Class 2",
  spellcastingAbility: "SpellcastingAbility 2",
  spellSaveDC: "SpellSaveDC  2",
  spellAtkBonus: "SpellAtkBonus 2",

  spellCantrip1: "Spells 1014", spellCantrip2: "Spells 1015",
  spellCantrip3: "Spells 1016", spellCantrip4: "Spells 1017",
  spellCantrip5: "Spells 1018", spellCantrip6: "Spells 1019",
  spellCantrip7: "Spells 1020", spellCantrip8: "Spells 1021",

  spellLevel1_1: "Spells 1022", spellLevel1_2: "Spells 1023",
  spellLevel1_3: "Spells 1024", spellLevel1_4: "Spells 1025",
  spellLevel1_5: "Spells 1026", spellLevel1_6: "Spells 1027",
  spellLevel1_7: "Spells 1028", spellLevel1_8: "Spells 1029",
  spellLevel1_9: "Spells 1030", spellLevel1_10: "Spells 1031",
  spellLevel1_11: "Spells 1032",

  spellLevel2_1: "Spells 1034", spellLevel2_2: "Spells 1035",
  spellLevel2_3: "Spells 1036", spellLevel2_4: "Spells 1037",
  spellLevel2_5: "Spells 1038", spellLevel2_6: "Spells 1039",
  spellLevel2_7: "Spells 1040", spellLevel2_8: "Spells 1041",
  spellLevel2_9: "Spells 1042", spellLevel2_10: "Spells 1043",
  spellLevel2_11: "Spells 1044", spellLevel2_12: "Spells 1045",
  spellLevel2_13: "Spells 1046",

  spellLevel3_1: "Spells 1047", spellLevel3_2: "Spells 1048",
  spellLevel3_3: "Spells 1049", spellLevel3_4: "Spells 1050",
  spellLevel3_5: "Spells 1051", spellLevel3_6: "Spells 1052",
  spellLevel3_7: "Spells 1053", spellLevel3_8: "Spells 1054",
  spellLevel3_9: "Spells 1055", spellLevel3_10: "Spells 1056",
  spellLevel3_11: "Spells 1057", spellLevel3_12: "Spells 1058",
  spellLevel3_13: "Spells 1059",

  spellLevel4_1: "Spells 1060", spellLevel4_2: "Spells 1061",
  spellLevel4_3: "Spells 1062", spellLevel4_4: "Spells 1063",
  spellLevel4_5: "Spells 1064", spellLevel4_6: "Spells 1065",
  spellLevel4_7: "Spells 1066", spellLevel4_8: "Spells 1067",
  spellLevel4_9: "Spells 1068", spellLevel4_10: "Spells 1069",
  spellLevel4_11: "Spells 1070", spellLevel4_12: "Spells 1071",

  spellLevel7_1: "Spells 1091", spellLevel7_2: "Spells 1092",
  spellLevel7_3: "Spells 1093", spellLevel7_4: "Spells 1094",
  spellLevel7_5: "Spells 1095", spellLevel7_6: "Spells 1096",
  spellLevel7_7: "Spells 1097", spellLevel7_8: "Spells 1098",
}

function buildPdfData(char: CharacterData): Record<string, string | boolean> {
  const stats = char.stats || {}
  const sheet = char.sheet || {}
  const pb = char.proficiencyBonus
  const savingThrows = (sheet.savingThrows || {}) as Record<string, boolean>
  const skillProfs = (sheet.skills || {}) as Record<string, boolean>
  const attacks = (sheet.attacks || []) as { name: string; atkBonus: string; damage: string; type: string }[]
  const spells = (sheet.spells || {}) as Record<string, string[]>

  const d: Record<string, string | boolean> = {}

  d.classLevel = `${char.class} ${char.level}`
  d.background = char.background || ""
  d.playerName = ""
  d.characterName = char.name
  d.alignment = char.alignment || ""
  d.xp = String(char.experiencePoints || 0)
  d.inspiration = char.inspiration ? "Yes" : ""
  d.profBonus = formatMod(pb)

  for (const key of ["str", "dex", "con", "int", "wis", "cha"] as const) {
    const score = stats[key] ?? 10
    d[key] = String(score)
    d[`${key}Mod`] = formatMod(abilityModifier(score))
  }

  d.ac = String(char.ac)
  d.initiative = formatMod(char.initiative || abilityModifier(stats.dex ?? 10))
  d.speed = String(char.speed)
  d.hpMax = String(char.maxHp)
  d.hpCurrent = String(char.hp)
  d.hpTemp = String(char.tempHp || 0)
  d.hdTotal = `${char.hitDiceTotal}${char.hitDice}`
  d.hd = char.hitDice || ""

  const dsS = sheet.deathSaveSuccesses ?? 0
  const dsF = sheet.deathSaveFailures ?? 0
  for (let i = 1; i <= 3; i++) {
    d[`deathSaveSuccess${i}`] = i <= dsS
    d[`deathSaveFailure${i}`] = i <= dsF
  }

  for (const key of ["str", "dex", "con", "int", "wis", "cha"] as const) {
    const score = stats[key] ?? 10
    const mod = abilityModifier(score)
    const proficient = savingThrows[key]
    const total = proficient ? mod + pb : mod
    const stKey = `st${key.charAt(0).toUpperCase() + key.slice(1)}`
    d[stKey] = formatMod(total)
    d[`${stKey}Prof`] = !!proficient
  }

  for (const key of Object.keys(SKILL_ABILITY)) {
    d[key] = computeSkillTotal(stats, key, skillProfs, pb)
    d[`${key}Prof`] = !!skillProfs[key]
  }

  for (let i = 0; i < 3; i++) {
    const atk = attacks[i]
    d[`wpnName${i + 1}`] = atk?.name || ""
    d[`wpnAtkBonus${i + 1}`] = atk?.atkBonus || ""
    d[`wpnDamage${i + 1}`] = atk?.damage || ""
  }

  d.ideals = sheet.ideals || ""
  d.bonds = sheet.bonds || ""
  d.flaws = sheet.flaws || ""

  d.passiveWisdom = String(sheet.passivePerception ?? (10 + abilityModifier(stats.wis ?? 10)))
  d.equipment = char.equipment || ""
  d.featuresTraits = sheet.featuresAndTraits || ""

  const personalityParts: string[] = []
  if (sheet.personalityTraits) personalityParts.push(`Personality Traits: ${sheet.personalityTraits}`)
  if (sheet.ideals) personalityParts.push(`Ideals: ${sheet.ideals}`)
  if (sheet.bonds) personalityParts.push(`Bonds: ${sheet.bonds}`)
  if (sheet.flaws) personalityParts.push(`Flaws: ${sheet.flaws}`)
  d.attacksSpellcasting = personalityParts.join("\n")

  d.characterName2 = char.name
  d.backstory = char.backstory || ""
  d.featTraits2 = sheet.featuresAndTraits || ""
  d.treasure = char.notes || ""

  d.spellcastingClass = char.class
  d.spellcastingAbility = sheet.spellcastingAbility || ""
  d.spellSaveDC = String(sheet.spellSaveDc ?? "")
  d.spellAtkBonus = sheet.spellAttackBonus || ""

  const cantrips = spells.level_0 || []
  for (let i = 0; i < 8; i++) {
    d[`spellCantrip${i + 1}`] = cantrips[i] || ""
  }

  const spellSlots: Record<number, number> = { 1: 11, 2: 13, 3: 13, 4: 13, 5: 0, 6: 0, 7: 8 }
  for (let lvl = 1; lvl <= 7; lvl++) {
    const list = spells[`level_${lvl}`] || []
    const maxSlots = spellSlots[lvl] ?? 10
    for (let i = 0; i < maxSlots; i++) {
      d[`spellLevel${lvl}_${i + 1}`] = list[i] || ""
    }
  }

  return d
}

function setFieldRawValue(field: any, value: string): void {
  try {
    const acroField = field.acroField
    acroField.setValue(PDFHexString.fromText(value))
  } catch {
    // give up on this field
  }
}

export async function generateCharacterPdf(
  char: CharacterData,
  pdfTemplatePath: string,
): Promise<Uint8Array> {
  const existingPdfBytes = fs.readFileSync(pdfTemplatePath)
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const form = pdfDoc.getForm()

  const data = buildPdfData(char)

  for (const [dataKey, pdfName] of Object.entries(PDF_INPUT_NAMES)) {
    const value = data[dataKey]
    if (value === undefined || value === null) continue

    let field: any
    try {
      field = form.getTextField(pdfName)
    } catch {
      try {
        field = form.getCheckBox(pdfName)
        if (field && field.check && typeof value === "boolean") {
          if (value) field.check()
        }
      } catch {}
      continue
    }

    if (!field) continue

    const textValue = String(value)
    let maxLen: number | undefined
    try { maxLen = field.getMaxLength() } catch {}
    setFieldRawValue(field, truncate(textValue, maxLen))
  }

  return await pdfDoc.save()
}
