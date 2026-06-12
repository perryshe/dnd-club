# Quest Session Summary

## Goal
Build a compact text-based web quest (dark fantasy, prison escape) with hero selection, choices, roll mechanics, combat, inventory, and replayability — all served from a single Node.js server.

## Constraints & Preferences
- **Language**: Russian (all UI text, descriptions)
- **Single-page app**: Node.js + Express, no client-side framework
- **Docker**: port 3004:3004
- **Design v2** — dark iron/bronze palette (#0a0a0e bg, #cd7f32 bronze accent)
- **Texts exported** to quest-texts.txt (game text only, no code)
- **Starting HP varies by class** (Warrior 2, Rogue 1, Barbarian 4)
- **HP=0 = instant death** (no 3-round bleedout)
- **Class penalties**: Warriors/Barbarians -5 on DEX checks, Rogues -5 on STR checks
- **Dual-wield penalty**: non-Warriors get -1 to hit with two weapons
- **Ability system**: rage (Tagg — +1d4 dmg, 1 use), shadow_strike (Felix — +1d6 dmg round 1)
- **Lock fail = back to cell**, `lock_failed` flag hides 1a choice
- **Surprise = one-hit kill**
- **All enemies attack back** in combat
- **3 defeats = game_over** (back to hero selection)
- **Exit button on all pages**, generic defeat → restart
- **Doors require conscious action** (flavor text updated to prevent "forgetting")
- **Skrip info has consequences** (goblin_ally flag gates 5d, 3a→11→5 sets flag)
- **Min path length ≥ 10** (node 10 added between cell exit and node 5)

## Progress
| Step | Status |
|------|--------|
| Hero selection screen (4 heroes) | Done |
| Node-based quest graph (1→2→3→4→5→6→7→8→9→10→11→12→13→99) | Done |
| Roll mechanics (d20 + stat mod vs DC) | Done |
| Combat (enemy groups, surprise, multi-round) | Done |
| Inventory (weapons, armor, consumables, key items) | Done |
| Equip system (left/right hand, body, bag) | Done |
| Item usage (healing items) | Done |
| Journal (step-by-step log) | Done |
| Defeat/restart (HP=0 → defeat screen → restart or 3× → game_over) | Done |
| Class starting HP | Done |
| Class penalties on stats | Done |
| Ability activation endpoint | Done |
| Dual-wield penalty | Done |
| Cloak gives +1 AC | Done |
| Skrip distraction flow (nodes 11→12→13) | Done |
| Design v2 with dark iron/bronze palette | Done |
| CSS visual enhancements (parchment story panel, hero cards, etc.) | Done |
| Backup of design v1 | Done |
| Texts exported to quest-texts.txt | Done |
| Port mapping fix (3004:3000→3004:3004) | Done |

## Key Decisions
- HP starts at class-specific values (not 0)
- Death is instant at 0 HP (no 3-round bleedout)
- One-shot kills from surprise checks
- All doors require conscious action
- Ability system (active, 1-use abilities) instead of passive only
- Dual-wield: anyone can dual-wield, non-Warriors get -1 penalty
- Class stat penalties affect all relevant skill checks
- Lock failure sends back to cell with `lock_failed` flag

## Critical Context
- Port mapping: `-p 3004:3004` (internal port 3004, not 3000)
- Class penalties in `getStatMod()` in server.js
- `addItem()` auto-equips body/hand slot items from outcomes
- Choice filtering by `requiredFlags` / `forbiddenFlags`
- `defeatCount` tracks defeats; ≥3 → `game_over` response
- Node 10 inserted between node 2 and node 5 (on 2a success path)
- Node 11 (Skrip help) → Node 5 with `goblin_ally` flag
- Node 12 (Skrip distraction) → combat → Node 13 → combat → Node 9
- Design: `--bg: #0a0a0e`, `--accent: #cd7f32`, bronze borders on cards, dark gradients, story panel with parchment feel

## Relevant Files
- `quest-app/server.js` — Express server, all endpoints, game logic
- `quest-app/quest-data.js` — items, heroes, nodes (graph data)
- `quest-app/public/index.html` — SPA shell with inline CSS + JS
- `quest-app/public/style.css` — design v2 styles (bronze palette, dark gradients)
- `quest-app/public/app.js` — client-side logic (rendering, state, combat)
- `quest-app/public/quest-texts.txt` — exported game texts
- `quest-app/Dockerfile` — minimal Node.js container
- `quest-app/package.json` — dependencies
