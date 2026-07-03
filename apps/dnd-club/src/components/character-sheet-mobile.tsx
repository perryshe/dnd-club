"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateCharacter,
  deleteCharacter,
} from "@/lib/character-actions";
import {
  abilityModifier,
  formatMod,
  SKILL_ABILITY,
  ABILITY_NAMES,
  SKILL_LABELS,
  SKILL_KEYS,
  ABILITY_KEYS,
} from "@/lib/character-utils";

type Tab = "stats" | "combat" | "spells" | "details";

const TAB_ICONS: Record<Tab, string> = {
  stats: "S",
  combat: "C",
  spells: "M",
  details: "D",
};

const TAB_LABELS: Record<Tab, string> = {
  stats: "Характеристики",
  combat: "Бой",
  spells: "Магия",
  details: "Детали",
};

type Props = {
  character: any;
  currentUserId: string | undefined;
  isOwner: boolean;
  isAdmin: boolean;
  accentColor: string;
  accentBorder: string;
};

function parseSheet(sheet: Record<string, any>, field: string, def: any = {}) {
  return sheet?.[field] ?? def;
}

export default function MobileCharacterSheet(props: Props) {
  const { character, isOwner, isAdmin, accentColor, accentBorder } = props;
  const canEdit = isOwner || isAdmin;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const headerRef = useRef<HTMLDivElement>(null);

  const initialStats = (character.stats || {}) as Record<string, number>;
  const sheet = (character.sheet || {}) as Record<string, any>;

  const [stats, setStats] = useState<Record<string, number>>({
    str: initialStats.str ?? 10,
    dex: initialStats.dex ?? 10,
    con: initialStats.con ?? 10,
    int: initialStats.int ?? 10,
    wis: initialStats.wis ?? 10,
    cha: initialStats.cha ?? 10,
  });
  const [savingThrows, setSavingThrows] = useState<Record<string, boolean>>(
    Object.fromEntries(ABILITY_KEYS.map((k) => [k, !!parseSheet(sheet, "savingThrows")[k]]))
  );
  const [skills, setSkills] = useState<Record<string, boolean>>(
    Object.fromEntries(SKILL_KEYS.map((k) => [k, !!parseSheet(sheet, "skills")[k]]))
  );
  const [attacks, setAttacks] = useState<{ name: string; atkBonus: string; damage: string; type: string }[]>(
    parseSheet(sheet, "attacks", [])
  );
  const [spells, setSpells] = useState<Record<string, string[]>>(() => {
    const s = parseSheet(sheet, "spells", {});
    const r: Record<string, string[]> = {};
    for (let i = 0; i <= 9; i++) r["level_" + i] = s["level_" + i] || [];
    return r;
  });
  const [name, setName] = useState(character.name || "");
  const [race, setRace] = useState(character.race || "");
  const [charClass, setCharClass] = useState(character.class || "");
  const [level, setLevel] = useState(character.level || 1);
  const [background, setBackground] = useState(character.background || "");
  const [alignment, setAlignment] = useState(character.alignment || "");
  const [xp, setXp] = useState(character.experiencePoints || 0);
  const [hp, setHp] = useState(character.hp || 10);
  const [maxHp, setMaxHp] = useState(character.maxHp || 10);
  const [tempHp, setTempHp] = useState(character.tempHp || 0);
  const [ac, setAc] = useState(character.ac || 10);
  const [initiative, setInitiative] = useState(character.initiative || abilityModifier(initialStats.dex ?? 10));
  const [speed, setSpeed] = useState(character.speed || 30);
  const [pb, setPb] = useState(character.proficiencyBonus || 2);
  const [inspiration, setInspiration] = useState(character.inspiration || false);
  const [hitDice, setHitDice] = useState(character.hitDice || "d10");
  const [hitDiceTotal, setHitDiceTotal] = useState(character.hitDiceTotal || 1);
  const [deathSaveSuccesses, setDeathSaveSuccesses] = useState(sheet.deathSaveSuccesses ?? 0);
  const [deathSaveFailures, setDeathSaveFailures] = useState(sheet.deathSaveFailures ?? 0);
  const [passivePerception, setPassivePerception] = useState(
    sheet.passivePerception ?? (10 + abilityModifier(initialStats.wis ?? 10))
  );
  const [personalityTraits, setPersonalityTraits] = useState(sheet.personalityTraits || "");
  const [ideals, setIdeals] = useState(sheet.ideals || "");
  const [bonds, setBonds] = useState(sheet.bonds || "");
  const [flaws, setFlaws] = useState(sheet.flaws || "");
  const [featuresAndTraits, setFeaturesAndTraits] = useState(sheet.featuresAndTraits || "");
  const [spellcastingAbility, setSpellcastingAbility] = useState(sheet.spellcastingAbility || "");
  const [spellSaveDc, setSpellSaveDc] = useState(sheet.spellSaveDc ?? 0);
  const [spellAttackBonus, setSpellAttackBonus] = useState(sheet.spellAttackBonus || "");
  const [equipment, setEquipment] = useState(character.equipment || "");
  const [backstory, setBackstory] = useState(character.backstory || "");
  const [notes, setNotes] = useState(character.notes || "");
  function spellList(level: number): string[] {
    return spells["level_" + level] || [];
  }

  function setSpellList(level: number, list: string[]) {
    setSpells((prev) => ({ ...prev, ["level_" + level]: list }));
  }

  function addAttack() {
    setAttacks([...attacks, { name: "", atkBonus: "", damage: "", type: "" }]);
  }

  function updateAttack(i: number, field: string, value: string) {
    const updated = [...attacks];
    updated[i] = { ...updated[i], [field]: value };
    setAttacks(updated);
  }

  function removeAttack(i: number) {
    setAttacks(attacks.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("race", race);
    fd.set("class", charClass);
    fd.set("level", String(level));
    fd.set("background", background);
    fd.set("alignment", alignment);
    fd.set("experiencePoints", String(xp));
    fd.set("str", String(stats.str));
    fd.set("dex", String(stats.dex));
    fd.set("con", String(stats.con));
    fd.set("int", String(stats.int));
    fd.set("wis", String(stats.wis));
    fd.set("cha", String(stats.cha));
    fd.set("savingThrows", JSON.stringify(savingThrows));
    fd.set("skills", JSON.stringify(skills));
    fd.set("attacks", JSON.stringify(attacks));
    fd.set("spells", JSON.stringify(spells));
    fd.set("hp", String(hp));
    fd.set("maxHp", String(maxHp));
    fd.set("tempHp", String(tempHp));
    fd.set("ac", String(ac));
    fd.set("initiative", String(initiative));
    fd.set("speed", String(speed));
    fd.set("proficiencyBonus", String(pb));
    if (inspiration) fd.set("inspiration", "on");
    fd.set("hitDice", hitDice);
    fd.set("hitDiceTotal", String(hitDiceTotal));
    fd.set("deathSaveSuccesses", String(deathSaveSuccesses));
    fd.set("deathSaveFailures", String(deathSaveFailures));
    fd.set("passivePerception", String(passivePerception));
    fd.set("personalityTraits", personalityTraits);
    fd.set("ideals", ideals);
    fd.set("bonds", bonds);
    fd.set("flaws", flaws);
    fd.set("featuresAndTraits", featuresAndTraits);
    fd.set("spellcastingAbility", spellcastingAbility);
    fd.set("spellSaveDc", String(spellSaveDc));
    fd.set("spellAttackBonus", String(spellAttackBonus));
    fd.set("equipment", equipment);
    fd.set("backstory", backstory);
    fd.set("notes", notes);

    setError("");
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateCharacter(character.id, fd);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Delete character?")) return;
    startTransition(async () => {
      try {
        await deleteCharacter(character.id);
        router.push("/" + character.campaign.slug);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none text-sm";
  const labelClass = "text-xs text-slate-400 block mb-1";
  const sectionClass = "bg-slate-800/50 rounded-xl p-4 border " + accentBorder;

  function Modifier({ val }: { val: number }) {
    return (
      <span className={"text-lg font-bold " + (val >= 0 ? "text-green-400" : "text-red-400")}>
        {formatMod(val)}
      </span>
    );
  }
  function renderStatsTab() {
    return (
      <div className="space-y-4">
        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Характеристики</h2>
          <div className="grid grid-cols-2 gap-3">
            {ABILITY_KEYS.map((key) => {
              const score = stats[key] ?? 10;
              const mod = abilityModifier(score);
              return (
                <div key={key} className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2">
                  <span className="font-semibold text-slate-300 w-10 text-sm">{ABILITY_NAMES[key]}</span>
                  {canEdit ? (
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={score}
                      onChange={(e) => setStats((s) => ({ ...s, [key]: Number(e.target.value) || 10 }))}
                      className="w-14 text-center text-lg font-bold bg-slate-700 border border-slate-600 rounded-lg text-white outline-none py-1"
                    />
                  ) : (
                    <span className="w-14 text-center text-lg font-bold">{score}</span>
                  )}
                  <span className="w-8 text-center">
                    <Modifier val={mod} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Спасброски</h2>
          <div className="space-y-1">
            {ABILITY_KEYS.map((key) => {
              const score = stats[key] ?? 10;
              const mod = abilityModifier(score);
              const proficient = savingThrows[key];
              const total = proficient ? mod + pb : mod;
              return (
                <div key={key} className="flex items-center gap-3 py-1">
                  {canEdit ? (
                    <button
                      onClick={() => setSavingThrows((s) => ({ ...s, [key]: !s[key] }))}
                      className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition border-2 " + (proficient ? "bg-amber-600 border-amber-500 text-white" : "bg-slate-700 border-slate-600 text-slate-500")}
                    >
                      {proficient ? "B" : "-"}
                    </button>
                  ) : (
                    <span className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold " + (proficient ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-500")}>
                      {proficient ? "B" : "-"}
                    </span>
                  )}
                  <span className={"w-8 text-center font-mono text-sm font-bold " + (total >= 0 ? "text-green-400" : "text-red-400")}>
                    {formatMod(total)}
                  </span>
                  <span className="text-sm text-slate-300">{ABILITY_NAMES[key]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Навыки</h2>
          <div className="space-y-1">
            {SKILL_KEYS.map((key) => {
              const score = stats[SKILL_ABILITY[key]] ?? 10;
              const mod = abilityModifier(score);
              const proficient = skills[key];
              const total = proficient ? mod + pb : mod;
              return (
                <div key={key} className="flex items-center gap-3 py-0.5">
                  {canEdit ? (
                    <button
                      onClick={() => setSkills((s) => ({ ...s, [key]: !s[key] }))}
                      className={"w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition border-2 " + (proficient ? "bg-amber-600 border-amber-500 text-white" : "bg-slate-700 border-slate-600 text-slate-500")}
                    >
                      {proficient ? "B" : ""}
                    </button>
                  ) : (
                    <span className={"w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold " + (proficient ? "bg-amber-600 text-white" : "bg-slate-700")}>
                      {proficient ? "B" : ""}
                    </span>
                  )}
                  <span className={"w-8 text-center font-mono text-sm " + (total >= 0 ? "text-green-400" : "text-red-400")}>
                    {formatMod(total)}
                  </span>
                  <span className="text-sm text-slate-300">{SKILL_LABELS[key]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700">
            <span className="text-sm text-slate-400">Пассивная Внимательность: </span>
            <span className="font-bold text-amber-400">{passivePerception}</span>
          </div>
        </div>
      </div>
    );
  }
  function renderCombatTab() {
    return (
      <div className="space-y-4">
        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Хиты и защита</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Текущие HP</label>
              {canEdit ? (
                <input type="number" min={0} value={hp} onChange={(e) => setHp(Number(e.target.value) || 0)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{hp}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Макс. HP</label>
              {canEdit ? (
                <input type="number" min={1} value={maxHp} onChange={(e) => setMaxHp(Number(e.target.value) || 1)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{maxHp}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Врем. HP</label>
              {canEdit ? (
                <input type="number" min={0} value={tempHp} onChange={(e) => setTempHp(Number(e.target.value) || 0)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{tempHp}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>КД</label>
              {canEdit ? (
                <input type="number" min={1} value={ac} onChange={(e) => setAc(Number(e.target.value) || 1)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{ac}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Инициатива</label>
              {canEdit ? (
                <input type="number" value={initiative} onChange={(e) => setInitiative(Number(e.target.value) || 0)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{formatMod(initiative)}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Скорость</label>
              {canEdit ? (
                <input type="number" min={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value) || 1)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{speed}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Кость хитов</label>
              {canEdit ? (
                <select value={hitDice} onChange={(e) => setHitDice(e.target.value)} className={inputClass}>
                  {["d4", "d6", "d8", "d10", "d12"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="text-lg font-bold">{hitDice}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Кол-во HD</label>
              {canEdit ? (
                <input type="number" min={1} max={20} value={hitDiceTotal} onChange={(e) => setHitDiceTotal(Number(e.target.value) || 1)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{hitDiceTotal}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Бонус мастерства</label>
              {canEdit ? (
                <input type="number" min={1} max={6} value={pb} onChange={(e) => setPb(Number(e.target.value) || 2)} className={inputClass} />
              ) : (
                <div className="text-lg font-bold">{formatMod(pb)}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Вдохновение</label>
              {canEdit ? (
                <button
                  onClick={() => setInspiration(!inspiration)}
                  className={"w-full py-2 rounded-lg text-sm font-semibold transition " + (inspiration ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-400")}
                >
                  {inspiration ? "Yes" : "No"}
                </button>
              ) : (
                <div className="text-lg font-bold">{inspiration ? "Yes" : "No"}</div>
              )}
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Спасброски от смерти</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 w-16">Успехи:</span>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  disabled={!canEdit}
                  onClick={() => setDeathSaveSuccesses(i + 1 === deathSaveSuccesses ? i : deathSaveSuccesses > i ? i : i + 1)}
                  className={"w-8 h-8 rounded-full transition " + (i < deathSaveSuccesses ? "bg-green-600" : "border-2 border-slate-600")}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 w-16">Провалы:</span>
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  disabled={!canEdit}
                  onClick={() => setDeathSaveFailures(i + 1 === deathSaveFailures ? i : deathSaveFailures > i ? i : i + 1)}
                  className={"w-8 h-8 rounded-full transition " + (i < deathSaveFailures ? "bg-red-600" : "border-2 border-slate-600")}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-amber-400">Атаки</h2>
            {canEdit && (
              <button onClick={addAttack} className="text-amber-400 hover:text-amber-300 text-sm font-semibold">
                + Добавить
              </button>
            )}
          </div>
          <div className="space-y-2">
            {attacks.length === 0 && <p className="text-slate-500 text-sm">Нет атак</p>}
            {attacks.map((atk, i) => (
              <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Название</label>
                    <input
                      value={atk.name}
                      onChange={(e) => updateAttack(i, "name", e.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Бонус</label>
                    <input
                      value={atk.atkBonus}
                      onChange={(e) => updateAttack(i, "atkBonus", e.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Урон</label>
                    <input
                      value={atk.damage}
                      onChange={(e) => updateAttack(i, "damage", e.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Тип</label>
                    <input
                      value={atk.type}
                      onChange={(e) => updateAttack(i, "type", e.target.value)}
                      disabled={!canEdit}
                      className={inputClass}
                    />
                  </div>
                </div>
                {canEdit && (
                  <button onClick={() => removeAttack(i)} className="mt-2 text-xs text-red-400 hover:text-red-300">
                    Удалить
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  function renderSpellsTab() {
    const spellLevels = [0, 1, 2, 3, 4, 7];

    return (
      <div className="space-y-4">
        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Магия</h2>
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div>
              <label className={labelClass}>Х-ка</label>
              {canEdit ? (
                <input value={spellcastingAbility} onChange={(e) => setSpellcastingAbility(e.target.value)} className={inputClass} placeholder="INT" />
              ) : (
                <div className="font-bold">{spellcastingAbility}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>DC</label>
              {canEdit ? (
                <input type="number" value={spellSaveDc} onChange={(e) => setSpellSaveDc(Number(e.target.value) || 0)} className={inputClass} />
              ) : (
                <div className="font-bold">{spellSaveDc}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Бонус</label>
              {canEdit ? (
                <input value={spellAttackBonus} onChange={(e) => setSpellAttackBonus(e.target.value)} className={inputClass} />
              ) : (
                <div className="font-bold">{spellAttackBonus}</div>
              )}
            </div>
          </div>
        </div>

        {spellLevels.map((lvl) => {
          const list = spellList(lvl);
          const label = lvl === 0 ? "Заговоры" : lvl + "-й уровень";
          const maxSlots = lvl === 0 ? 8 : lvl === 7 ? 8 : 12;
          if (!canEdit && list.length === 0) return null;
          return (
            <div key={lvl} className={sectionClass}>
              <h2 className="text-base font-bold mb-3 text-amber-400">{label}</h2>
              <div className="space-y-2">
                {Array.from({ length: maxSlots }).map((_, i) => {
                  const val = list[i] || "";
                  if (!canEdit && !val) return null;
                  return (
                    <div key={i}>
                      {canEdit ? (
                        <input
                          value={val}
                          onChange={(e) => {
                            const updated = [...list];
                            updated[i] = e.target.value;
                            setSpellList(lvl, updated);
                          }}
                          className={inputClass}
                          placeholder={"Spell " + (i + 1)}
                        />
                      ) : (
                        <div className="text-sm text-slate-300 py-0.5">{val}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  function renderDetailsTab() {
    const fields = [
      { label: "Черты характера", value: personalityTraits, set: setPersonalityTraits },
      { label: "Идеалы", value: ideals, set: setIdeals },
      { label: "Привязанности", value: bonds, set: setBonds },
      { label: "Слабости", value: flaws, set: setFlaws },
      { label: "Особенности и черты", value: featuresAndTraits, set: setFeaturesAndTraits },
      { label: "Снаряжение", value: equipment, set: setEquipment },
      { label: "Предыстория", value: backstory, set: setBackstory },
      { label: "Заметки", value: notes, set: setNotes },
    ];

    return (
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.label} className={sectionClass}>
            <h2 className="text-base font-bold mb-3 text-amber-400">{f.label}</h2>
            {canEdit ? (
              <textarea
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-amber-400 outline-none text-sm resize-none"
              />
            ) : (
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{f.value || "-"}</p>
            )}
          </div>
        ))}

        <div className={sectionClass}>
          <h2 className="text-base font-bold mb-3 text-amber-400">Основная информация</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className={labelClass}>Раса</label>
              {canEdit ? (
                <input value={race} onChange={(e) => setRace(e.target.value)} className={inputClass} />
              ) : (
                <div className="font-bold">{race}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Класс</label>
              {canEdit ? (
                <input value={charClass} onChange={(e) => setCharClass(e.target.value)} className={inputClass} />
              ) : (
                <div className="font-bold">{charClass}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Уровень</label>
              {canEdit ? (
                <input type="number" min={1} value={level} onChange={(e) => setLevel(Number(e.target.value) || 1)} className={inputClass} />
              ) : (
                <div className="font-bold">{level}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Предыстория</label>
              {canEdit ? (
                <input value={background} onChange={(e) => setBackground(e.target.value)} className={inputClass} />
              ) : (
                <div className="font-bold">{background}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Мировоззрение</label>
              {canEdit ? (
                <input value={alignment} onChange={(e) => setAlignment(e.target.value)} className={inputClass} />
              ) : (
                <div className="font-bold">{alignment}</div>
              )}
            </div>
            <div>
              <label className={labelClass}>Опыт</label>
              {canEdit ? (
                <input type="number" min={0} value={xp} onChange={(e) => setXp(Number(e.target.value) || 0)} className={inputClass} />
              ) : (
                <div className="font-bold">{xp}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col pb-16">
      <div ref={headerRef} className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate">{character.name}</h1>
            <p className="text-xs text-slate-400 truncate">
              {character.race} {character.class} &bull; Lv.{character.level}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={isPending}
                className={
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition " +
                  (success
                    ? "bg-green-600 text-white"
                    : "bg-amber-600 hover:bg-amber-700 text-white") +
                  (isPending ? " opacity-50" : "")
                }
              >
                {isPending ? "..." : "Save"}
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-red-700 hover:bg-red-600 text-white transition disabled:opacity-50"
              >
                X
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
            {error}
          </div>
        )}

        {activeTab === "stats" && renderStatsTab()}
        {activeTab === "combat" && renderCombatTab()}
        {activeTab === "spells" && renderSpellsTab()}
        {activeTab === "details" && renderDetailsTab()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800">
        <div className="flex">
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                "flex-1 py-3 text-center text-xs font-semibold transition " +
                (activeTab === tab
                  ? "text-amber-400 border-t-2 border-amber-400 bg-slate-800/50"
                  : "text-slate-500 hover:text-slate-300")
              }
            >
              <div className="text-base">{TAB_ICONS[tab]}</div>
              <div>{TAB_LABELS[tab]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
