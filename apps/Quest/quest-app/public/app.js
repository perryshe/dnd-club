function questApp() {
  return {
    phase: 'loading',
    heroes: [],
    heroId: '', heroName: '', heroClass: '', heroRace: '', heroFeature: '', heroWeakness: '',
    ac: 10,
    hp: 0, maxHp: 12,
    sessionId: null,
    node: null,
    inv: { left_hand: null, right_hand: null, body: null, bag: [] },
    journal: [], flags: {}, finished: false, defeated: false,
    gameOver: false, gameOverText: '',
    rollPending: null, rollResult: null, outcomeText: '',
    attackPending: false,
    combatActive: false, combatRound: 0, enemiesLeft: [],
    combatLastRound: null, victory: false, victoryText: '',
    combatStartText: '', crossbowUsed: false,
    dialogText: '',
    statusMessage: '', statusMessageTimer: null,
    exitUrl: null,
    showJournal: false, showWeakness: false,

    async init() {
      this.phase = 'loading'
      try {
        const res = await fetch('/api/heroes')
        this.heroes = await res.json()
        this.phase = 'intro'
      } catch (_) {
        this.phase = 'select'
        this.heroes = []
      }
    },

    startGame() {
      this.phase = 'select'
    },

    async startQuest(heroId) {
      this.phase = 'loading'
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heroId })
        })
        this.applyState(await res.json())
        this.phase = 'play'
      } catch (_) { this.phase = 'select' }
    },

    async makeChoice(choiceId) {
      if (this.rollPending || this.combatActive || this.finished || this.defeated) return
      const ch = this.node?.choices?.find(c => c.id === choiceId)
      if (ch?.disabled) return
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/action`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ choiceId })
        })
        const data = await res.json()

        if (data.error) return

        if (data.type === 'dialog') {
          this.applyState(data)
          this.dialogText = data.dialogText
        } else if (data.type === 'roll') {
          this.rollPending = { choiceId, stat: data.rollInfo.stat, dc: data.rollInfo.dc, modifier: data.rollInfo.modifier }
          this.rollResult = null; this.outcomeText = ''
        } else if (data.type === 'combat' || data.type === 'patrol') {
          this.applyState(data)
          this.startCombatState(data)
        } else {
          this.applyState(data)
        }
      } catch (_) {}
    },

    startCombatState(data) {
      this.combatActive = true
      this.combatRound = data.combat?.round || 1
      this.enemiesLeft = data.combat?.enemiesLeft || []
      this.combatLastRound = null
      this.victory = false
      this.victoryText = ''
      this.combatStartText = data.combat?.startText || ''
      this.crossbowUsed = data.combat?.crossbowUsed || false
    },

    async doRoll() {
      if (!this.rollPending) return
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/roll`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ choiceId: this.rollPending.choiceId })
        })
        const data = await res.json()
        if (data.error) { this.rollPending = null; return }
        if (data.type === 'combat' || data.type === 'patrol') {
          this.rollPending = null
          this.applyState(data)
          this.startCombatState(data)
          return
        }
        this.rollResult = data.roll
        this.outcomeText = data.outcomeText
        if (data.defeated) { this.defeated = true }
        this.applyState(data)
      } catch (_) {}
    },

    continueAfterRoll() {
      this.rollPending = null; this.rollResult = null; this.outcomeText = ''
    },

    async doAttack() {
      if (this.attackPending) return
      this.attackPending = true
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/attack`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        if (data.error) { this.showStatusMessage('⛔ ' + data.error); return }

        if (data.type === 'game_over' || data.gameOver) {
          this.combatActive = false
          this.applyState(data)
          return
        }

        if (data.type === 'dialog') {
          this.combatActive = false
          this.dialogText = data.dialogText
          this.applyState(data)
          return
        }

        const r = data.report
        if (!r) { this.showStatusMessage('⛔ Ошибка боя: пустой ответ'); return }
        this.combatRound = r.round
        this.combatLastRound = r
        this.enemiesLeft = data.combat?.enemiesLeft || []

        if (r.victory) {
          this.victory = true
          this.victoryText = 'Победа!'
          this.combatActive = false
        }
        this.applyState(data)
      } catch (_) { this.showStatusMessage('⛔ Ошибка сети') }
      finally { this.attackPending = false }
    },

    continueAfterCombat() {
      this.combatActive = false; this.combatLastRound = null; this.combatStartText = ''; this.crossbowUsed = false
    },


    showStatusMessage(msg) {
      this.statusMessage = msg
      if (this.statusMessageTimer) clearTimeout(this.statusMessageTimer)
      this.statusMessageTimer = setTimeout(() => { this.statusMessage = '' }, 3000)
    },

    async continueDialog() {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/continue-dialog`, { method: 'POST' })
        const data = await res.json()
        if (data.error) { this.dialogText = ''; return }
        this.dialogText = ''
        this.applyState(data)
        if (data.type === 'combat' || data.type === 'patrol') this.startCombatState(data)
      } catch (_) { this.dialogText = '' }
    },

    async useAbility(abilityId) {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/ability`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ abilityId })
        })
        const data = await res.json()
        if (data.error) return
        if (data.message) this.showStatusMessage(data.message)
        this.applyState(data)
      } catch (_) {}
    },

    async useItem(itemId) {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/use`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId })
        })
        const data = await res.json()
        if (data.error) return
        this.applyState(data)
      } catch (_) {}
    },

    async equipItem(itemId, toSlot) {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/equip`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, toSlot })
        })
        const data = await res.json()
        if (data.error) { this.showStatusMessage('⛔ ' + data.error); return }
        this.applyState(data)
        if (data.type === 'combat_round') {
          this.combatRound = data.report?.round || this.combatRound
          this.combatLastRound = data.report || null
          this.crossbowUsed = false
        }
      } catch (_) {}
    },

    async unequipItem(slot) {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/unequip`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slot })
        })
        const data = await res.json()
        if (data.error) { this.showStatusMessage('⛔ ' + data.error); return }
        this.applyState(data)
      } catch (_) {}
    },

    async dropItem(itemId) {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/drop`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId })
        })
        const data = await res.json()
        if (data.error) { this.showStatusMessage('⛔ ' + data.error); return }
        this.applyState(data)
      } catch (_) {}
    },

    async passCombatTurn() {
      if (this.attackPending) return
      this.attackPending = true
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/combat-pass`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        if (data.error) { this.showStatusMessage('⛔ ' + data.error); return }

        if (data.type === 'game_over' || data.gameOver) {
          this.combatActive = false
          this.applyState(data)
          return
        }

        if (data.type === 'dialog') {
          this.combatActive = false
          this.dialogText = data.dialogText
          this.applyState(data)
          return
        }

        this.combatRound = data.report?.round || this.combatRound
        this.combatLastRound = data.report || null
        this.enemiesLeft = data.combat?.enemiesLeft || []
        this.crossbowUsed = false

        if (data.report?.victory) {
          this.victory = true
          this.victoryText = 'Победа!'
          this.combatActive = false
        }
        this.applyState(data)
      } catch (_) { this.showStatusMessage('⛔ Ошибка сети') }
      finally { this.attackPending = false }
    },

    async restartQuest() {
      try {
        const res = await fetch(`/api/sessions/${this.sessionId}/restart`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        if (data.error) return
        if (data.type === 'game_over' || data.gameOver) {
          this.defeated = false
          this.applyState(data)
          return
        }
        this.defeated = false
        this.combatActive = false
        this.applyState(data)
      } catch (_) {}
    },

    applyState(data) {
      if (data.gameOver) {
        this.gameOver = true
        this.gameOverText = data.gameOverText
        return
      }
      if (data.redirectUrl) { window.location.href = data.redirectUrl; return }
      if (data.id) this.sessionId = data.id
      if (data.heroName !== undefined) { this.heroId = data.heroId; this.heroName = data.heroName; this.heroClass = data.heroClass; this.heroRace = data.heroRace; this.heroFeature = data.heroFeature; this.heroWeakness = data.heroWeakness }
      if (data.ac !== undefined) { this.ac = data.ac; this.hp = data.hp; this.maxHp = data.maxHp }
      if (data.node) this.node = data.node
      if (data.flags) this.flags = data.flags
      if (data.inventory) this.inv = data.inventory
      if (data.journal) this.journal = data.journal
      if (data.finished !== undefined) this.finished = data.finished
      if (data.exitUrl !== undefined) this.exitUrl = data.exitUrl
      if (data.defeated !== undefined) this.defeated = data.defeated
      if (this.defeated) { this.combatActive = false }
    },

    statName(s) {
      return { str:'Сила', dex:'Ловкость', con:'Стойкость', int:'Интеллект', wis:'Мудрость', cha:'Харизма' }[s] || s
    },

    resetQuest() {
      this.phase = 'select'; this.sessionId = null; this.node = null
      this.hp = 0; this.maxHp = 12
      this.inv = { left_hand: null, right_hand: null, body: null, bag: [] }
      this.journal = []; this.flags = {}; this.finished = false; this.defeated = false
      this.rollPending = null; this.rollResult = null; this.outcomeText = ''
      this.combatActive = false; this.combatRound = 0; this.enemiesLeft = []
      this.combatLastRound = null; this.victory = false; this.victoryText = ''
      this.combatStartText = ''; this.crossbowUsed = false
      this.dialogText = ''
      this.statusMessage = ''; this.exitUrl = null
      this.showJournal = false; this.showWeakness = false
      this.gameOver = false; this.gameOverText = ''
    }
  }
}
