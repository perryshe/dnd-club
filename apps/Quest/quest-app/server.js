const express = require('express')
const path = require('path')
const crypto = require('crypto')
const { Pool } = require('pg')
const { items, heroes, nodes } = require('./quest-data')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 3000,
})

const heroesCache = new Map()
const heroTraits = new Map()

const featurePool = [
  '+1 к ловкости. Атака из тени: +1к6 урона.',
  '+1 к урону в ближнем бою.',
  'Ярость — 1 раз за квест: +1к4 урона, +2 временных HP.',
  'Меткий выстрел — +2 к дальним атакам.',
  'Подкуп — +1 к харизме при переговорах.',
  'Живучесть — +2 к спасброскам от смерти.',
  'Скрытность — +2 к стелсу в тёмных локациях.',
  'Звериное чутьё — +1 к мудрости при поиске.',
]

const weaknessPool = [
  'Хрупкий — штраф к силе.',
  'Неуклюжий — штраф к ловкости.',
  'Шумный — штраф к скрытности.',
  'Самонадеянный — игнорирует очевидные угрозы.',
  'Боязнь темноты — штраф в тёмных локациях.',
  'Алчный — не может пройти мимо сокровища.',
  'Медлительный — штраф к инициативе.',
  'Слабый желудок — еда восстанавливает меньше HP.',
]

function abilityMod(score) {
  if (score == null) return 0
  return Math.floor((Number(score) - 10) / 2)
}

async function loadHeroesFromDB() {
  try {
    const result = await pool.query(`
      SELECT c.id, c.name, c.race, c.class, c.level, c.hp, c.max_hp, c.ac, c.stats
      FROM characters c
      JOIN campaigns cmp ON cmp.id = c.campaign_id
      WHERE cmp.slug = 'dead-band'
      ORDER BY c.created_at DESC
    `)
    if (result.rows.length === 0) return false
    for (const row of result.rows) {
      const heroId = row.id
      const rawStats = typeof row.stats === 'string' ? JSON.parse(row.stats) : (row.stats || {})
      if (!heroTraits.has(heroId)) {
        const fi = crypto.randomInt(featurePool.length)
        const wi = crypto.randomInt(weaknessPool.length)
        heroTraits.set(heroId, { feature: featurePool[fi], weakness: weaknessPool[wi] })
      }
      const t = heroTraits.get(heroId)
      heroesCache.set(heroId, {
        id: heroId, name: row.name, class: row.class, race: row.race,
        baseHp: row.max_hp || row.hp || 10,
        startHp: Math.max(1, Math.floor((row.max_hp || row.hp || 10) / 4)),
        ac: row.ac || 10,
        stats: {
          str: abilityMod(rawStats.str),
          dex: abilityMod(rawStats.dex),
          con: abilityMod(rawStats.con),
          int: abilityMod(rawStats.int),
          wis: abilityMod(rawStats.wis),
          cha: abilityMod(rawStats.cha),
        },
        desc: `${row.race} ${row.class}, уровень ${row.level}`,
        feature: t.feature,
        weakness: t.weakness,
      })
    }
    return true
  } catch (e) {
    console.error('[Quest] DB load failed:', e.message)
    return false
  }
}

const app = express()
const PORT = process.env.PORT || 3004

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const sessions = new Map()

function rollDice(sides = 20) {
  return Math.floor(Math.random() * sides) + 1
}

function rollDamage(expr) {
  let total = 0
  const parts = expr.split('+')
  for (const part of parts) {
    const m = part.match(/^(\d+)d(\d+)$/)
    if (m) { for (let i = 0; i < parseInt(m[1]); i++) total += rollDice(parseInt(m[2])) }
    else { const n = parseInt(part); if (!isNaN(n)) total += n }
  }
  return total
}

function createSession(heroId, defeatCount = 0) {
  const hero = heroesCache.get(heroId) || heroes.find(h => h.id === heroId)
  if (!hero) return null
  const id = crypto.randomUUID()
  const session = {
    id, heroId: hero.id,
    heroName: hero.name, heroClass: hero.class, heroRace: hero.race,
    heroFeature: hero.feature, heroWeakness: hero.weakness,
    ac: hero.ac || 10,
    hp: hero.startHp || 0, maxHp: hero.baseHp,
    stats: { ...hero.stats },
    currentNode: 1,
    flags: {},
    inventory: { left_hand: null, right_hand: null, body: null, bag: [], ammo: 0 },
    journal: [],
    _debug: [],
    pendingRoll: null,
    pendingGoto: null,
    combat: null,
    finished: false,
    defeated: false,
    defeatCount,
    gameOver: false,
    createdAt: Date.now()
  }
  sessions.set(id, session)
  return session
}

function getItem(id) { return items[id] || null }
function getNode(id) { return nodes.find(n => n.id === id) || null }
function addJournal(s, e) { s.journal.push({ ...e, timestamp: Date.now() }) }
function addDebug(s, e) { if (!s._debug) s._debug = []; s._debug.push({ ...e, timestamp: Date.now() }) }
function sessionHasItem(s, itemId) {
  const inv = s.inventory
  return inv.left_hand === itemId || inv.right_hand === itemId || inv.body === itemId || inv.bag.includes(itemId)
}

function getAC(s) {
  let ac = s.ac
  const body = getItem(s.inventory.body)
  if (body && body.effect && body.effect.ac) ac += body.effect.ac
  return ac
}

const MAX_BAG = 6

function addItem(s, itemId) {
  const item = getItem(itemId)
  if (!item) return 'invalid'
  if (item.type === 'ammo') {
    s.inventory.ammo = (s.inventory.ammo || 0) + (item.ammo || 1)
    return 'ok'
  }
  if (s.inventory.bag.length >= MAX_BAG) return 'dropped'
  s.inventory.bag.push(itemId)
  return 'ok'
}

function applyOutcome(s, o) {
  if (o.items) o.items.forEach(id => {
    const r = addItem(s, id)
    if (r === 'dropped') {
      const item = getItem(id)
      addJournal(s, { step: s.currentNode, text: `Сумка переполнена — ${item ? item.name : 'предмет'} теряется в темноте.` })
    }
  })
  if (o.heal) s.hp = Math.min(s.maxHp, s.hp + o.heal)
  if (o.damage) s.hp = Math.max(0, s.hp - o.damage)
  if (o.flags) {
    const flags = { ...o.flags }
    if (s.heroClass !== 'Плут' && s.heroClass !== 'Монах') delete flags.shadow_strike_ready
    Object.assign(s.flags, flags)
  }
}

function getPatrolMod(s) {
  if (s.heroClass === 'Плут' || s.heroClass === 'Монах') return -2
  if (s.heroClass === 'Варвар') return 2
  return 0
}

function checkPatrol(s) {
  if (s.currentNode === 1 || s.currentNode === 2) { addDebug(s, { step: s.currentNode, text: `patrol: skip (safe node ${s.currentNode})` }); return null }
  const alert = s.flags.alert || 0
  const mod = getPatrolMod(s)
  const roll = rollDice(20) + alert + mod
  addDebug(s, { step: s.currentNode, text: `patrol: d20=${roll} (alert=${alert}, mod=${mod}), threshold=15` })
  if (roll < 15) { addDebug(s, { step: s.currentNode, text: `patrol: no patrol` }); return null }
  let enemies = []
  if (roll >= 25) {
    enemies = [{ name: 'Орк-надзиратель', hp: 15, maxHp: 15, ac: 13, attack: '1d6+2' }]
  } else if (roll >= 20) {
    enemies = [
      { name: 'Гоблин-патрульный', hp: 7, maxHp: 7, ac: 12, attack: '1d4' },
      { name: 'Гоблин-патрульный', hp: 7, maxHp: 7, ac: 12, attack: '1d4' }
    ]
  } else {
    enemies = [{ name: 'Гоблин-патрульный', hp: 7, maxHp: 7, ac: 12, attack: '1d4' }]
  }
  s.patrol = { active: true, roll, enemies, totalEnemies: enemies.length, round: 0 }
  return { roll, enemies }
}

function getStatMod(s, stat) {
  let v = s.stats[stat] || 0
  if ((s.heroClass === 'Воин' || s.heroClass === 'Варвар') && stat === 'dex') v -= 5
  if (s.heroClass === 'Плут' && stat === 'str') v -= 5
  if (stat === 'dex' && s.flags.stealth_bonus) v += s.flags.stealth_bonus
  if (stat === 'cha' && s.flags.deception_penalty) v -= s.flags.deception_penalty
  return v
}

function resolveInv(inv) {
  const lh = inv.left_hand ? getItem(inv.left_hand) : null
  const rh = inv.right_hand ? getItem(inv.right_hand) : null
  const locked = {}
  if (lh && lh.slot === 'both') locked.right_hand = { by: lh.name }
  if (rh && rh.slot === 'both') locked.left_hand = { by: rh.name }
  return {
    left_hand: lh,
    right_hand: rh,
    body: inv.body ? getItem(inv.body) : null,
    bag: (inv.bag || []).map(id => getItem(id)).filter(Boolean),
    ammo: inv.ammo || 0,
    locked
  }
}

function startPatrolCombat(s, patrol) {
  s.flags.crossbow_used = false
  const onWin = { target: s.currentNode, text: 'Патруль повержен. Можно двигаться дальше.', items: [], heal: 0, flags: {} }
  const onLose = { target: 0, heal: 2, flags: { died_to_patrol: true } }
  const enemies = patrol.enemies.map(e => ({ ...e }))
  let patrolText
  if (enemies.length === 1 && enemies[0].hp >= 15) {
    patrolText = 'Громкий топот сотрясает каменный пол — из-за угла выходит орк-надзиратель. Он явно услышал шум и вышел проверить.'
  } else if (enemies.length === 2) {
    patrolText = 'Из темноты доносятся приглушённые голоса — двое гоблинов-патрульных выходят на шум, переругиваясь и зевая.'
  } else {
    patrolText = 'Из тени выскакивает гоблин-патрульный — видимо, его насторожил какой-то звук. Он замечает вас и хватается за дубинку.'
  }
  s.combat = { active: true, choiceId: 'patrol', enemies, totalEnemies: enemies.length, round: 0, onWin, onLose, lastRound: null, surprisePassed: false, isPatrol: true, startText: patrolText }
  s.patrol = null
  addJournal(s, { step: s.currentNode, text: patrolText, patrol: patrol.roll })
}

function getSessionState(s) {
  if (s.gameOver) {
    return {
      id: s.id, heroName: s.heroName, heroClass: s.heroClass, heroRace: s.heroRace,
      gameOver: true,
      gameOverText: 'Вы избиты, обессилели и провалились в забытьё. Три попытки исчерпаны — тюрьма оказалась сильнее.'
    }
  }
  const state = {
    id: s.id,
    heroId: s.heroId,
    heroName: s.heroName, heroClass: s.heroClass, heroRace: s.heroRace,
    heroFeature: s.heroFeature, heroWeakness: s.heroWeakness,
    ac: getAC(s),
    baseAc: s.ac,
    hp: s.hp, maxHp: s.maxHp,
    currentNode: s.currentNode,
    node: getNode(s.currentNode),
    inventory: resolveInv(s.inventory),
    flags: s.flags,
    journal: s.journal.slice(-30),
    finished: s.finished,
    defeated: s.defeated
  }
  if (state.node) {
    if (state.node.id === 1 && s.flags.neighbor_talked) {
      state.node = { ...state.node, text: 'Холодный каменный пол отдаёт сыростью. Единственный источник света — щель в стене, где когда-то была дверь.\n\nРешётка заперта на тяжёлый замок. Из соседней камеры доносится чей-то кашель.' }
    }
    state.node = { ...state.node, choices: state.node.choices.flatMap(c => {
      const reasons = []
      if (c.forbiddenFlags && c.forbiddenFlags.some(f => s.flags[f])) reasons.push('forbiddenFlag: ' + c.forbiddenFlags.filter(f => s.flags[f]).join(','))
      if (c.requiredItems && !c.requiredItems.every(i => sessionHasItem(s, i))) reasons.push('need items: ' + c.requiredItems.filter(i => !sessionHasItem(s, i)).join(','))
      if (c.requiredOr && !c.requiredOr.some(i => sessionHasItem(s, i))) reasons.push('need one of: ' + c.requiredOr.join(','))
      if (reasons.length) addDebug(s, { step: s.currentNode, text: `disabled [${c.id}]: ${reasons.join('; ')}` })
      if (c.replaceOnDisabled && reasons.length && reasons.some(r => r.startsWith('forbiddenFlag'))) {
        const emptyTarget = c.action === 'goto' ? s.currentNode : (c.success?.target ?? c.target ?? s.currentNode)
        return { id: c.id + '_empty', text: 'Пусто — здесь больше ничего нет.', action: 'goto', target: emptyTarget, result: null }
      }
      return { ...c, disabled: reasons.length > 0 }
    }) }
  }
  if (s.combat && s.combat.active) {
    state.combat = {
      round: s.combat.round,
      enemiesLeft: s.combat.enemies.filter(e => e.hp > 0).map(e => ({ name: e.name, hp: e.hp, maxHp: e.maxHp, ac: e.ac })),
      totalEnemies: s.combat.totalEnemies,
      lastRound: s.combat.lastRound,
      surprisePassed: s.combat.surprisePassed,
      startText: s.combat.startText,
      crossbowUsed: !!s.flags.crossbow_used
    }
  }
  if (s.combat && !s.combat.active && s.combat.surprisePassed) {
    state.combat = { surprisePassed: true }
  }
  if (s.patrol && s.patrol.active) {
    state.patrol = { roll: s.patrol.roll, enemies: s.patrol.enemies.map(e => ({ name: e.name, hp: e.hp, maxHp: e.maxHp, ac: e.ac })) }
  }
  return state
}

// ── Combat engine ───────────────────────────────────────────────┤

function startCombat(s, choice) {
  delete s.combat
  const enemies = []
  choice.enemies.forEach(t => {
    for (let i = 0; i < t.count; i++) {
      enemies.push({ name: t.name, hp: t.hp, maxHp: t.hp, ac: t.ac, attack: t.attack })
    }
  })
  let surprisePassed = false
  if (choice.surprise_dc) {
    if ((s.heroClass === 'Плут' || s.heroClass === 'Монах') && !s.flags.shadow_strike_ready) s.flags.shadow_strike_ready = true
    const mod = getStatMod(s, 'dex')
    const roll = rollDice(20) + mod
    surprisePassed = roll >= choice.surprise_dc
    if (surprisePassed && enemies.length > 0) {
      enemies[0].hp = 0
    }
  }
  if (enemies.every(e => e.hp <= 0)) {
    applyOutcome(s, choice.onWin)
    s.currentNode = choice.onWin.target
    addJournal(s, { step: s.currentNode, text: choice.onWin.text || 'Победа!', combat: { surprisePassed, round: 0, victory: true } })
    return { victory: true }
  }
  s.flags.crossbow_used = false
  s.combat = {
    active: true,
    choiceId: choice.id,
    enemies,
    totalEnemies: enemies.length,
    round: 0,
    onWin: choice.onWin,
    onLose: choice.onLose,
    lastRound: null,
    surprisePassed,
    startText: choice.combatStartText || null
  }
  return { victory: false }
}

function getWeaponDamage(s) {
  const lh = getItem(s.inventory.left_hand)
  const rh = getItem(s.inventory.right_hand)
  const lhDmg = lh && lh.type === 'weapon' && lh.dice ? lh.dice : null
  const rhDmg = rh && rh.type === 'weapon' && rh.dice ? rh.dice : null
  if (lhDmg && rhDmg) return lhDmg + '+' + rhDmg
  return lhDmg || rhDmg || '1d2'
}

function isCrossbowEquipped(s) {
  const lh = getItem(s.inventory.left_hand)
  const rh = getItem(s.inventory.right_hand)
  return (lh && lh.id === 'crossbow') || (rh && rh.id === 'crossbow')
}

function resolveCombatRound(s, passTurn = false) {
  const c = s.combat
  if (!c || !c.active) { console.log(`[COMBAT] ${s.id} round skip: combat inactive`); return null }

  c.round++
  const alive = c.enemies.filter(e => e.hp > 0)
  if (alive.length === 0) { console.log(`[COMBAT] ${s.id} round ${c.round} skip: no alive enemies at start`); return null }
  console.log(`[COMBAT] ${s.id} round ${c.round}: ${alive.length} alive, hp=${s.hp}/${s.maxHp}`)

  const report = { round: c.round, hits: [], damage: 0, enemyHits: [], enemyDamage: 0, crossbowShot: false, passed: false }

  // ── Player action ──
  let targetKilled = false
  if (passTurn) {
    report.passed = true
    s.flags.crossbow_used = false
  } else {
    const target = alive[0]
    let atkBonus, weaponDice
    if (isCrossbowEquipped(s) && !s.flags.crossbow_used && (s.inventory.ammo || 0) >= 1) {
      atkBonus = s.stats.dex || 0
      weaponDice = '2d4'
      s.inventory.ammo = Math.max(0, (s.inventory.ammo || 0) - 1)
      s.flags.crossbow_used = true
      report.crossbowShot = true
    } else {
      atkBonus = s.stats.str || 0
      if (isCrossbowEquipped(s)) {
        atkBonus -= 2
        weaponDice = '1d2'
      } else {
        const lh = getItem(s.inventory.left_hand)
        const rh = getItem(s.inventory.right_hand)
        const dualWielding = lh && rh && lh.type === 'weapon' && rh.type === 'weapon'
        if (dualWielding && s.heroId !== 'fess') atkBonus -= 3
        weaponDice = getWeaponDamage(s)
      }
    }
    const atkRoll = rollDice(20) + atkBonus
    const hit = atkRoll >= target.ac
    if (hit) {
      let dmg = rollDamage(weaponDice)
      if (s.heroClass === 'Воин' || s.heroClass === 'Варвар') dmg += 1
      report.rageTriggered = !!s.flags.rage_active
      if (s.flags.rage_active) { dmg += rollDice(4); s.flags.rage_active = false }
      report.shadowStrikeTriggered = !!(s.flags.shadow_strike_ready && (s.heroClass === 'Плут' || s.heroClass === 'Монах'))
      if (s.flags.shadow_strike_ready && (s.heroClass === 'Плут' || s.heroClass === 'Монах')) { dmg += rollDice(6); s.flags.shadow_strike_ready = false }
      target.hp -= dmg
      targetKilled = target.hp <= 0
      report.hits.push({ target: target.name, roll: atkRoll, dmg, killed: targetKilled })
      report.damage += dmg
    } else {
      report.hits.push({ target: target.name, roll: atkRoll, dmg: 0, killed: false })
    }
  }

  // Build combat log
  let logParts = []
  if (report.passed) {
    logParts.push('Смена оружия — ход пропущен')
  } else {
    if (report.crossbowShot) logParts.push('Выстрел из арбалета!')
    const pHit = report.hits[0]
    if (pHit && pHit.dmg > 0) {
      let line = `Атака по ${pHit.target}: ${pHit.dmg} ед. урона`
      if (report.rageTriggered) line += ' (ярость +1к4)'
      if (report.shadowStrikeTriggered) line += ' (атака из тени +1к6)'
      if (pHit.killed) line += ' — цель уничтожена!'
      logParts.push(line)
    } else if (pHit) {
      logParts.push(`Атака по ${pHit.target}: промах`)
    }
  }

  // Enemy attacks (unless player killed the target)
  if (!targetKilled) {
    const ac = getAC(s)
    c.enemies.filter(e => e.hp > 0).forEach(attacker => {
      const eRoll = rollDice(20)
      const eHit = eRoll >= ac
      if (eHit) {
        const eDmg = rollDamage(attacker.attack)
        s.hp = Math.max(0, s.hp - eDmg)
        report.enemyHits.push({ attacker: attacker.name, roll: eRoll, dmg: eDmg })
        report.enemyDamage += eDmg
        logParts.push(`${attacker.name} атакует вас: ${eDmg} ед. урона`)
      } else {
        report.enemyHits.push({ attacker: attacker.name, roll: eRoll, dmg: 0 })
        logParts.push(`${attacker.name} атакует вас: промах`)
      }
    })
  }

  addJournal(s, { step: s.currentNode, text: logParts.join('. '), combat: report })

  c.lastRound = report
  const aliveNow = c.enemies.filter(e => e.hp > 0)

  if (aliveNow.length === 0) {
    c.active = false; report.victory = true
    console.log(`[COMBAT] ${s.id} round ${c.round}: VICTORY, node→${c.onWin.target}`)
    applyOutcome(s, c.onWin)
    s.currentNode = c.onWin.target
    addJournal(s, { step: s.currentNode, text: c.onWin.text || 'Победа!', combat: report })
    return report
  }

  if (s.hp <= 0) {
    c.active = false
    s.defeatCount = (s.defeatCount || 0) + 1
    console.log(`[COMBAT] ${s.id} round ${c.round}: DEFEAT #${s.defeatCount}, hp=${s.hp}`)
    const lose = c.onLose
    if (lose) applyOutcome(s, lose)
    // Confiscate all items on defeat
    s.inventory = { left_hand: null, right_hand: null, body: null, bag: [], ammo: 0 }
    addDebug(s, { step: s.currentNode, text: `defeat count: ${s.defeatCount}` })
    if (s.defeatCount >= 3) {
      s.gameOver = true
      report.defeat = true
      report.gameOver = true
      return report
    }
    s.currentNode = 1
    const defeatText = 'Вас избили до полусмерти, обыскали и отволокли обратно в камеру. Все вещи конфискованы. Но вы живы — чудом держитесь на ногах. Придётся начинать заново, на этот раз — осторожнее.'
    s.pendingDefeat = defeatText
    report.defeat = true
    report.defeatText = defeatText
    return report
  }

  return report
}

// ── API ─────────────────────────────────────────────────────────

app.get('/api/heroes', async (req, res) => {
  let list
  if (heroesCache.size > 0) {
    list = Array.from(heroesCache.values())
  } else {
    const dbOk = await loadHeroesFromDB()
    if (dbOk && heroesCache.size > 0) {
      list = Array.from(heroesCache.values())
    }
  }
  if (!list) {
    list = heroes
  }
  res.json(list.map(h => ({
    id: h.id, name: h.name, class: h.class, race: h.race,
    baseHp: h.baseHp, ac: h.ac,
    desc: h.desc, feature: h.feature, weakness: h.weakness
  })))
})

app.post('/api/sessions', (req, res) => {
  const { heroId } = req.body
  if (!heroId) return res.status(400).json({ error: 'heroId required' })
  const session = createSession(heroId)
  if (!session) return res.status(404).json({ error: 'Hero not found' })
  addJournal(session, { step: 1, text: 'Квест начат. Пробуждение в темнице.' })
  res.json(getSessionState(session))
})

app.get('/api/sessions/:id', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  res.json(getSessionState(session))
})

app.post('/api/sessions/:id/action', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.finished) return res.status(400).json({ error: 'Quest finished' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })

  const { choiceId } = req.body
  if (!choiceId) return res.status(400).json({ error: 'choiceId required' })
  if (session.combat && session.combat.active) return res.status(400).json({ error: 'Combat in progress' })

  const node = getNode(session.currentNode)
  if (!node) return res.status(500).json({ error: 'Invalid node' })

  const choice = node.choices.find(c => c.id === choiceId)
  if (!choice) return res.status(400).json({ error: 'Invalid choice' })

  if (choice.forbiddenFlags && choice.forbiddenFlags.some(f => session.flags[f])) return res.status(400).json({ error: 'Choice no longer available' })
  if (choice.requiredItems && !choice.requiredItems.every(i => sessionHasItem(session, i))) return res.status(400).json({ error: 'Required items not met' })
  if (choice.requiredOr && !choice.requiredOr.some(i => sessionHasItem(session, i))) return res.status(400).json({ error: 'Required items not met' })

  addJournal(session, { step: node.id, text: `[${node.id}:${choice.id}] ${choice.text}`, choice: true })

  if (choice.action === 'end') {
    session.finished = true
    const endText = choice.result?.text || 'Квест завершён.'
    addJournal(session, { step: node.id, text: endText })
    const state = getSessionState(session)
    if (choice.url) state.exitUrl = choice.url
    return res.json(state)
  }

  if (choice.action === 'roll') {
    const modifier = getStatMod(session, choice.stat)
    session.pendingRoll = { choiceId, stat: choice.stat, dc: choice.dc, modifier, success: choice.success, fail: choice.fail }
    return res.json({ type: 'roll', rollInfo: { stat: choice.stat, dc: choice.dc, modifier }, ...getSessionState(session) })
  }

  if (choice.action === 'combat') {
    const result = startCombat(session, choice)
    if (result && result.victory) {
      return res.json({ type: 'result', victory: true, ...getSessionState(session) })
    }
    addJournal(session, { step: node.id, text: 'Бой начат!' })
    const state = getSessionState(session)
    return res.json({ type: 'combat', ...state })
  }

  if (choice.action === 'goto') {
    if (choice.target === 0) {
      session.defeatCount = (session.defeatCount || 0) + 1
      addDebug(session, { step: session.currentNode, text: `defeat count: ${session.defeatCount}` })
      if (session.defeatCount >= 3) {
        session.gameOver = true
        addJournal(session, { step: -1, text: 'Вы избиты, обессилели и провалились в забытьё. Три попытки исчерпаны.' })
        return res.json({ type: 'game_over', ...getSessionState(session) })
      }
      session.defeated = true
      session.currentNode = 'defeat'
      if (choice.result) applyOutcome(session, choice.result)
      addJournal(session, { step: -1, text: 'Вы потерпели поражение.' })
      return res.json({ type: 'result', ...getSessionState(session) })
    }
    // If there's result.text, show it as dialog before proceeding
    if (choice.result && choice.result.text) {
      session.pendingGoto = { target: choice.target, result: choice.result, choiceText: choice.text }
      const state = getSessionState(session)
      state.dialogText = choice.result.text
      return res.json({ type: 'dialog', ...state })
    }
    addDebug(session, { step: node.id, text: `goto: ${node.id}→${choice.target} | flags: ${JSON.stringify(Object.fromEntries(Object.entries(session.flags).filter(([k]) => !k.startsWith('_'))))} | hp: ${session.hp}/${session.maxHp}` })
    session.currentNode = choice.target
    if (choice.result) applyOutcome(session, choice.result)
    addJournal(session, { step: node.id, text: choice.result?.text || choice.text })

    if (choice.result?.forceCombat) {
      const targetNode = getNode(session.currentNode)
      if (targetNode) {
        const combatChoice = targetNode.choices.find(c => c.action === 'combat')
        if (combatChoice) {
          startCombat(session, combatChoice)
          return res.json({ type: 'combat', ...getSessionState(session) })
        }
      }
    }

    const stealthy = choice.result?.flags?.shadow_strike_ready
    const tn = getNode(session.currentNode)
    const hasScriptedCombat = tn && tn.choices && tn.choices.some(c => c.action === 'combat')
    if (!stealthy && !hasScriptedCombat) {
      const patrol = checkPatrol(session)
      if (patrol) { startPatrolCombat(session, patrol); return res.json({ type: 'patrol', ...getSessionState(session) }) }
    }
    return res.json({ type: 'result', ...getSessionState(session) })
  }

  res.status(400).json({ error: 'Unknown action' })
})

app.post('/api/sessions/:id/continue-dialog', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  if (!session.pendingGoto) return res.status(400).json({ error: 'No pending dialog' })
  if (session.combat && session.combat.active) return res.status(400).json({ error: 'Combat in progress' })

  const pg = session.pendingGoto
  session.pendingGoto = null
  session.currentNode = pg.target
  if (pg.result) {
    applyOutcome(session, pg.result)
  }
  if (pg.result?.text || pg.choiceText) {
    addJournal(session, { step: session.currentNode, text: pg.result?.text || pg.choiceText })
  }
  if (pg.result?.forceCombat) {
    const targetNode = getNode(session.currentNode)
    if (targetNode) {
      const combatChoice = targetNode.choices.find(c => c.action === 'combat')
      if (combatChoice) {
        startCombat(session, combatChoice)
        return res.json({ type: 'combat', ...getSessionState(session) })
      }
    }
  }
  const stealthy = pg.result?.flags?.shadow_strike_ready
  const tnC = getNode(session.currentNode)
  const hasScriptedCombatC = tnC && tnC.choices && tnC.choices.some(c => c.action === 'combat')
  if (!stealthy && !hasScriptedCombatC) {
    const patrol = checkPatrol(session)
    if (patrol) { startPatrolCombat(session, patrol); return res.json({ type: 'patrol', ...getSessionState(session) }) }
  }
  res.json({ type: 'result', ...getSessionState(session) })
})

app.post('/api/sessions/:id/roll', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  if (!session.pendingRoll) return res.status(400).json({ error: 'No pending roll' })
  if (session.combat && session.combat.active) return res.status(400).json({ error: 'Combat in progress' })

  const { choiceId } = req.body
  if (session.pendingRoll.choiceId !== choiceId) return res.status(400).json({ error: 'Choice mismatch' })

  const { stat, dc, modifier, success, fail } = session.pendingRoll
  const d20 = rollDice(20)
  const total = d20 + modifier
  const crit = d20 === 20
  const fumble = d20 === 1
  const passed = crit ? true : fumble ? false : total >= dc
  const outcome = passed ? success : fail

  addJournal(session, { step: 0, text: `[roll ${choiceId}] d20=${d20}${modifier>=0?'+':''}${modifier}=${total} vs DC${dc}: ${passed?'✓':'✗'}`, roll: true })

  if (outcome.target === 0) {
    session.defeatCount = (session.defeatCount || 0) + 1
    addDebug(session, { step: session.currentNode, text: `defeat count: ${session.defeatCount}` })
    if (session.defeatCount >= 3) {
      session.gameOver = true
      session.pendingRoll = null
      addJournal(session, { step: -1, text: 'Вы избиты, обессилели и провалились в забытьё. Три попытки исчерпаны.', roll: { d20, modifier, total, dc, passed, stat } })
      return res.json({ type: 'game_over', ...getSessionState(session) })
    }
    session.defeated = true
    session.currentNode = 'defeat'
    if (outcome.heal) session.hp = Math.min(session.maxHp, session.hp + outcome.heal)
    if (outcome.flags) Object.assign(session.flags, outcome.flags)
    addJournal(session, { step: -1, text: outcome.text || 'Вы потерпели поражение.', roll: { d20, modifier, total, dc, passed, stat } })
    session.pendingRoll = null
    return res.json({ type: 'result', defeat: true, roll: { d20, modifier, total, dc, passed, crit, fumble }, outcomeText: outcome.text, ...getSessionState(session) })
  }

  session.currentNode = outcome.target
  applyOutcome(session, outcome)
  addJournal(session, { step: session.currentNode, text: outcome.text || 'Вы сделали выбор и бросили кости.', roll: { d20, modifier, total, dc, passed, stat } })
  session.pendingRoll = null

  if (outcome.autoCombat) {
    const ac = outcome.autoCombat
    startCombat(session, { id: 'forced', enemies: ac.enemies, onWin: ac.onWin, onLose: ac.onLose, combatStartText: outcome.text })
    return res.json({ type: 'combat', ...getSessionState(session) })
  }

  const tnR = getNode(session.currentNode)
  const hasScriptedCombatR = tnR && tnR.choices && tnR.choices.some(c => c.action === 'combat')
  const patrol = checkPatrol(session)
  const stealthy = outcome.flags?.shadow_strike_ready
  if (!stealthy && !hasScriptedCombatR && patrol) { startPatrolCombat(session, patrol); return res.json({ type: 'patrol', roll: { d20, modifier, total, dc, passed, crit, fumble }, outcomeText: outcome.text, ...getSessionState(session) }) }

  res.json({ type: 'result', roll: { d20, modifier, total, dc, passed, crit, fumble }, outcomeText: outcome.text, ...getSessionState(session) })
})

app.post('/api/sessions/:id/attack', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (!session.combat || !session.combat.active) return res.status(400).json({ error: 'No active combat' })

  addJournal(session, { step: session.combat?.round || 0, text: `[combat] Атака (раунд ${(session.combat?.round||0)+1})`, action: true })
  const report = resolveCombatRound(session)
  if (!report) return res.status(400).json({ error: 'Combat already resolved' })

  if (session.gameOver) return res.json({ type: 'game_over', ...getSessionState(session) })

  if (report.defeat && session.pendingDefeat) {
    const defeatText = session.pendingDefeat
    session.pendingDefeat = null
    session.pendingGoto = { target: session.currentNode, result: null, choiceText: defeatText }
    const state = getSessionState(session)
    state.dialogText = defeatText
    return res.json({ type: 'dialog', ...state })
  }

  res.json({ type: 'combat_round', report, ...getSessionState(session) })
})

app.post('/api/sessions/:id/combat-pass', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (!session.combat || !session.combat.active) return res.status(400).json({ error: 'No active combat' })
  addJournal(session, { step: session.combat?.round || 0, text: `[combat] Смена/пропуск хода (раунд ${(session.combat?.round||0)+1})`, action: true })
  const report = resolveCombatRound(session, true)
  if (!report) return res.status(400).json({ error: 'Combat already resolved' })
  if (session.gameOver) return res.json({ type: 'game_over', ...getSessionState(session) })
  if (report.defeat && session.pendingDefeat) {
    const defeatText = session.pendingDefeat; session.pendingDefeat = null
    session.pendingGoto = { target: session.currentNode, result: null, choiceText: defeatText }
    const state = getSessionState(session); state.dialogText = defeatText
    return res.json({ type: 'dialog', ...state })
  }
  res.json({ type: 'combat_round', report, ...getSessionState(session) })
})

app.post('/api/sessions/:id/use', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  const { itemId } = req.body
  if (!itemId) return res.status(400).json({ error: 'itemId required' })
  const item = getItem(itemId)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  const bag = session.inventory.bag
  const idx = bag.indexOf(itemId)
  if (idx === -1) return res.status(400).json({ error: 'Item not in inventory' })
  if (item.type !== 'consumable') return res.status(400).json({ error: 'Item is not usable' })
  bag.splice(idx, 1)
  if (item.heal) session.hp = Math.min(session.maxHp, session.hp + item.heal)
  addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: `Использовано: ${item.name}.` })
  res.json(getSessionState(session))
})

app.post('/api/sessions/:id/equip', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  const { itemId, toSlot } = req.body
  if (!itemId || !toSlot) return res.status(400).json({ error: 'itemId and toSlot required' })
  if (!['left_hand', 'right_hand', 'body', 'bag'].includes(toSlot)) return res.status(400).json({ error: 'Invalid slot' })
  const inv = session.inventory
  const bagIdx = inv.bag.indexOf(itemId)
  if (bagIdx === -1) return res.status(400).json({ error: 'Item not in bag' })
  const item = getItem(itemId)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  if ((toSlot === 'left_hand' || toSlot === 'right_hand') && item.slot !== 'hand' && item.slot !== 'both') return res.status(400).json({ error: 'Item cannot be equipped in hand' })
  if (toSlot === 'body' && item.slot !== 'body') return res.status(400).json({ error: 'Item cannot be equipped on body' })
  // If equipping a one-handed weapon and the other hand has a two-handed item, block it
  if (item.slot === 'hand' && (toSlot === 'left_hand' || toSlot === 'right_hand')) {
    const otherSlot = toSlot === 'left_hand' ? 'right_hand' : 'left_hand'
    const otherItem = getItem(inv[otherSlot])
    if (otherItem && otherItem.slot === 'both') return res.status(400).json({ error: 'Нельзя — другая рука занята двуручным оружием' })
  }
  const itemName = item.name
  inv.bag.splice(bagIdx, 1)

  if (toSlot === 'bag') {
    if (inv.bag.length >= MAX_BAG) return res.status(400).json({ error: 'Сумка переполнена' })
    inv.bag.push(itemId)
  } else {
    // Crossbow occupies both hands — clear the other hand
    if (item.slot === 'both') {
      const otherSlot = toSlot === 'left_hand' ? 'right_hand' : 'left_hand'
      if (inv[otherSlot]) { inv.bag.push(inv[otherSlot]); inv[otherSlot] = null }
    }
    if (inv[toSlot]) {
      if (inv.bag.length >= MAX_BAG) return res.status(400).json({ error: 'Сумка переполнена — освободите место' })
      inv.bag.push(inv[toSlot])
    }
    inv[toSlot] = itemId
    addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: `Снаряжено: ${itemName} → ${toSlot}` })
  }

  // If in combat, equipment change costs a turn
  if (session.combat && session.combat.active) {
    const report = resolveCombatRound(session, true)
    if (!report) return res.status(400).json({ error: 'Combat already resolved' })
    if (session.gameOver) return res.json({ type: 'game_over', ...getSessionState(session) })
    addJournal(session, { step: session.currentNode, text: `Снаряжение изменено в бою.`, combat: report })
    if (report.defeat && session.pendingDefeat) {
      const defeatText = session.pendingDefeat; session.pendingDefeat = null
      session.pendingGoto = { target: session.currentNode, result: null, choiceText: defeatText }
      const state = getSessionState(session); state.dialogText = defeatText
      return res.json({ type: 'dialog', ...state })
    }
    return res.json({ type: 'combat_round', report, ...getSessionState(session) })
  }
  res.json(getSessionState(session))
})

app.post('/api/sessions/:id/unequip', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  const { slot } = req.body
  if (!slot || !['left_hand', 'right_hand', 'body'].includes(slot)) return res.status(400).json({ error: 'Invalid slot' })
  const inv = session.inventory
  if (!inv[slot]) return res.status(400).json({ error: 'Slot is empty' })
  if (inv.bag.length >= MAX_BAG) return res.status(400).json({ error: 'Сумка переполнена' })
  const unequippedName = getItem(inv[slot])?.name || inv[slot]
  inv.bag.push(inv[slot])
  inv[slot] = null
  addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: `Снято: ${unequippedName} с ${slot}` })
  res.json(getSessionState(session))
})

app.post('/api/sessions/:id/drop', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  const { itemId } = req.body
  if (!itemId) return res.status(400).json({ error: 'itemId required' })
  const inv = session.inventory
  const idx = inv.bag.indexOf(itemId)
  if (idx === -1) return res.status(400).json({ error: 'Item not in bag' })
  const item = getItem(itemId)
  inv.bag.splice(idx, 1)
  addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: `Выброшено: ${item ? item.name : 'предмет'} — потерян в темноте.` })
  res.json(getSessionState(session))
})

app.post('/api/sessions/:id/restart', (req, res) => {
  const old = sessions.get(req.params.id)
  if (!old) return res.status(404).json({ error: 'Session not found' })
  const dc = old.defeatCount || 0
  if (dc >= 3) {
    old.gameOver = true
    return res.json({ type: 'game_over', ...getSessionState(old) })
  }
  const session = createSession(old.heroId, dc)
  if (!session) return res.status(500).json({ error: 'Failed to restart' })
  addJournal(session, { step: 1, text: 'Вас избили до полусмерти и отволокли обратно в камеру. Но вы живы — чудом держитесь на ногах. Придётся начинать заново, на этот раз — осторожнее.' })
  res.json({ type: 'result', ...getSessionState(session) })
})

app.post('/api/sessions/:id/ability', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  const { abilityId } = req.body
  if (!abilityId) return res.status(400).json({ error: 'abilityId required' })

  if (abilityId === 'rage' && session.heroClass === 'Варвар' && !session.flags.rage_used) {
    session.flags.rage_used = true
    session.flags.rage_active = true
    addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: 'Ярость активирована! +1к4 урона на следующий удар.' })
    return res.json({ type: 'ability', abilityId, message: 'Ярость активирована!', ...getSessionState(session) })
  }

  res.status(400).json({ error: 'Ability not available' })
})

app.get('/api/sessions/:id/inventory', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  const inv = session.inventory
  res.json({
    left_hand: inv.left_hand ? getItem(inv.left_hand) : null,
    right_hand: inv.right_hand ? getItem(inv.right_hand) : null,
    body: inv.body ? getItem(inv.body) : null,
    bag: inv.bag.map(id => getItem(id)).filter(Boolean)
  })
})

app.post('/api/sessions/:id/secret', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.gameOver) return res.status(400).json({ error: 'Game over' })
  if (session.flags.secret_used) return res.status(400).json({ error: 'Secret already used this game' })
  session.flags.secret_used = true
  const roll = rollDice(3)
  const secretItems = ['ancient_helm', 'unbreakable_coin', 'exit_key']
  const itemId = secretItems[roll - 1]
  addItem(session, itemId)
  const item = getItem(itemId)
  addJournal(session, { step: typeof session.currentNode === 'number' ? session.currentNode : 0, text: `Секретная находка! Вы нашли: ${item.name}.` })
  res.json({ type: 'secret', roll, item: item ? { id: item.id, name: item.name, desc: item.desc } : null, ...getSessionState(session) })
})

app.get('/api/items', (req, res) => { res.json(items) })

app.get('/api/sessions/:id/debug', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  res.json(session._debug || [])
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

loadHeroesFromDB().then(ok => {
  if (ok) console.log(`[Quest] Loaded ${heroesCache.size} heroes from DB`)
  else console.log('[Quest] Using static heroes (DB unavailable)')
}).catch(() => {})

app.listen(PORT, () => {
  console.log(`[Quest] Dead Band: Cage in the Clouds`)
  console.log(`[Quest] Server running on http://localhost:${PORT}`)
})
