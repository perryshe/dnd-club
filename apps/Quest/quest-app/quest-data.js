const items = {
  rusty_dagger: {
    id: 'rusty_dagger', name: 'Ржавый кинжал', type: 'weapon',
    slot: 'hand', dice: '1d4', damageType: 'колющий',
    desc: 'Ржавый, но всё ещё острый. Колющий урон 1к4.'
  },
  stale_bread: {
    id: 'stale_bread', name: 'Чёрствая краюха', type: 'consumable',
    slot: 'consumable', heal: 2,
    desc: 'Засохшая краюха хлеба. Восстанавливает 2 HP.'
  },
  glass_shard: {
    id: 'glass_shard', name: 'Осколок стекла', type: 'weapon',
    slot: 'hand', dice: '1d1', damageType: 'колющий',
    desc: 'Острый край, можно метнуть на 5 футов. Урон 1к1.'
  },
  club: {
    id: 'club', name: 'Дубинка', type: 'weapon',
    slot: 'hand', dice: '1d4', damageType: 'дробящий',
    desc: 'Тяжёлая деревянная дубинка. Дробящий урон 1к4.'
  },
  chefs_knife: {
    id: 'chefs_knife', name: 'Кухонный нож', type: 'weapon',
    slot: 'hand', dice: '1d4', damageType: 'колющий',
    desc: 'Туповатый, но опасный. Колющий урон 1к4.'
  },
  dried_meat: {
    id: 'dried_meat', name: 'Вяленое мясо', type: 'consumable',
    slot: 'consumable', heal: 4,
    desc: 'Две порции вяленого мяса. Восстанавливает 4 HP.'
  },
  waterskin: {
    id: 'waterskin', name: 'Бурдюк воды', type: 'consumable',
    slot: 'consumable', heal: 3,
    desc: 'Полный бурдюк воды. Восстанавливает 3 HP.'
  },
  short_sword: {
    id: 'short_sword', name: 'Короткий меч', type: 'weapon',
    slot: 'hand', dice: '1d6', damageType: 'колющий',
    desc: 'Стражничий короткий меч. Колющий урон 1к6.'
  },
  crossbow: {
    id: 'crossbow', name: 'Арбалет', type: 'weapon',
    slot: 'both', dice: '2d4', damageType: 'колющий',
    desc: 'Лёгкий арбалет. Занимает обе руки. Урон 2к4, перезарядка.'
  },
  crossbow_bolts: {
    id: 'crossbow_bolts', name: '4 болта', type: 'ammo',
    slot: 'bag', ammo: 4,
    desc: 'Четыре болта для арбалета.'
  },
  keys: {
    id: 'keys', name: 'Связка ключей', type: 'key',
    slot: 'bag',
    desc: 'Ключи от одной двери на этаже выше.'
  },
  dusty_cloak: {
    id: 'dusty_cloak', name: 'Пыльный плащ', type: 'armor',
    slot: 'body', effect: { stealth: 1 },
    desc: 'Скрывает лицо, даёт +1 к Стелсу в тёмных локациях.'
  },
  empty_sack: {
    id: 'empty_sack', name: 'Пустой мешок', type: 'container',
    slot: 'bag',
    desc: 'Можно носить вещи.'
  },
  rusted_buckle: {
    id: 'rusted_buckle', name: 'Ржавая пряжка', type: 'tool',
    slot: 'bag',
    desc: 'Можно использовать как отмычку (Ловк Сл 12).'
  },
  bone: {
    id: 'bone', name: 'Кость', type: 'weapon',
    slot: 'hand', dice: '1d3', damageType: 'дробящий',
    desc: 'Острая кость. Метательное, 1к3.'
  },
  old_coin: {
    id: 'old_coin', name: 'Старая монета', type: 'tool',
    slot: 'bag', effect: { bribe: 1 },
    desc: 'Странная, но блестит. +1 к подкупу гоблинов и повара.'
  },
  note: {
    id: 'note', name: 'Записка', type: 'tool',
    slot: 'bag',
    desc: '«У орка слабость — левое колено». Даёт преимущество при атаке на орка.'
  },
  rusty_bracer: {
    id: 'rusty_bracer', name: 'Ржавый наруч', type: 'weapon',
    slot: 'hand', dice: '1d3', damageType: 'дробящий',
    desc: 'Импровизированный кастет, урон 1к3.'
  },
  flask: {
    id: 'flask', name: 'Фляга с самогоном', type: 'consumable',
    slot: 'consumable', effect: { strength_boost: 1 },
    desc: '+1 к силе на 1 бой, затем −1 на всё до отдыха.'
  },
  glass_eye: {
    id: 'glass_eye', name: 'Стеклянный глаз', type: 'tool',
    slot: 'bag', effect: { intimidate: 1 },
    desc: 'Пугает суеверных гоблинов. +1 к Запугиванию против гоблинов.'
  },
  rotten_rope: {
    id: 'rotten_rope', name: 'Гнилая верёвка', type: 'tool',
    slot: 'bag',
    desc: 'Можно использовать как ловушку (растяжка, минирование).'
  },
  flint_and_steel: {
    id: 'flint_and_steel', name: 'Кремень и огниво', type: 'tool',
    slot: 'bag',
    desc: 'Разжечь огонь. Нужен для поджогов.'
  },
  rat_tail: {
    id: 'rat_tail', name: 'Крысиный хвост', type: 'tool',
    slot: 'bag',
    desc: 'Символ «своего» для крыс. Крысиный рой не нападает.'
  },
  crystal_shard: {
    id: 'crystal_shard', name: 'Осколок кристалла', type: 'tool',
    slot: 'bag', effect: { luck: 1 },
    desc: 'Слабая магия. +1 к любому броску (одноразово).'
  },
  prison_map: {
    id: 'prison_map', name: 'Карта тюрьмы', type: 'tool',
    slot: 'bag', effect: { navigation: 2 },
    desc: 'Схема всех ходов. +2 к ориентированию. Позволяет найти секретный лаз без проверки.'
  },
  ancient_helm: {
    id: 'ancient_helm', name: 'Древний шлем', type: 'armor',
    slot: 'body', effect: { ac: 1 },
    desc: 'Старый ржавый шлем древних стражей. Даёт +1 к КД.'
  },
  unbreakable_coin: {
    id: 'unbreakable_coin', name: 'Неразменная монета', type: 'tool',
    slot: 'bag',
    desc: 'Странная монета, всегда возвращается в карман. Можно использовать для подкупа, не тратится.'
  },
  exit_key: {
    id: 'exit_key', name: 'Ключ от выхода', type: 'key',
    slot: 'bag',
    desc: 'Тяжёлый ключ от главных ворот. Открывает путь наружу.'
  }
}

const heroes = [
  {
    id: 'torin', name: 'Торин', class: 'Воин', race: 'Дварф',
    baseHp: 12, startHp: 2, ac: 14,
    stats: { str: 3, dex: 0, con: 3, int: -1, wis: 1, cha: 0 },
    desc: 'Суровый дварф-воин. Крепок, но оглушён падением.',
    feature: 'Мастер ближнего боя — +1 к урону в ближнем бою.',
    weakness: 'Тяжёлое отравление — все рефлексы притуплены.'
  },
  {
    id: 'felix', name: 'Феликс', class: 'Плут', race: 'Человек',
    baseHp: 10, startHp: 1, ac: 11,
    stats: { str: 0, dex: 3, con: 1, int: 2, wis: 0, cha: 1 },
    desc: 'Ловкий плут. Пальцы помнят отмычки, хотя карманы пусты.',
    feature: 'Скрытность — +1 к Стелсу. Атака из тени: +1к6 урона.',
    weakness: 'Обезвоживание и голод — руки дрожат.'
  },
  {
    id: 'fess', name: 'Фесс', class: 'Воин', race: 'Человек',
    baseHp: 12, startHp: 2, ac: 12,
    stats: { str: 3, dex: 1, con: 2, int: 0, wis: 1, cha: -1 },
    desc: 'Наёмник без меча. Кулаки всё ещё помнят десятки боёв.',
    feature: 'Двуручник — может держать оружие в обеих руках, урон складывается, штрафа нет. Мастер ближнего боя: +1 к урону. Рукопашная: 1к4.',
    weakness: 'Перелом рёбер после падения — каждый вдох с трудом.'
  },
  {
    id: 'tagg', name: 'Тагг', class: 'Варвар', race: 'Полуорк',
    baseHp: 14, startHp: 4, ac: 12,
    stats: { str: 4, dex: 0, con: 3, int: -2, wis: 0, cha: -1 },
    desc: 'Полуорк-берсерк. Когда злится — не помнит ничего, кроме крови.',
    feature: 'Ярость — 1 раз за квест: +1к4 урона на 1 ход. +2 макс HP.',
    weakness: 'Смертельная доза снотворного — тело едва слушается.'
  },
  {
    id: 'cassandra', name: 'Кассандра Салтивелл', class: 'Монах', race: 'Морской эльф',
    baseHp: 10, startHp: 1, ac: 12,
    stats: { str: 0, dex: 3, con: 1, int: -1, wis: 2, cha: 1 },
    desc: 'Морская эльфийка в потрёпанной одежде. Движения точные и быстрые даже после заточения.',
    feature: 'Скрытность — +1 к Стелсу. Атака из тени: +1к6 урона.',
    weakness: 'Ослаблена после шторма — каждый рывок даётся с трудом.'
  }
]

const nodes = [
  {
    id: 1, title: 'Дальняя комната', area: 'Тюремная камера',
    text: 'Холодный каменный пол отдаёт сыростью. Единственный источник света — щель в стене, где когда-то была дверь.\n\nРешётка заперта на тяжёлый замок. Из соседней камеры доносится чей-то кашель, а затем хриплый голос:\n\n— Эй... ты тоже видел зелёную ракету?',
    choices: [
      { id: 'Sa', text: 'Осмотреть камеру', action: 'goto', target: 2, result: { items: [], heal: 0, flags: {} }, forbiddenFlags: ['stash_looted'], replaceOnDisabled: true },
      { id: 'Sb', text: '— Кто ты? Откуда знаешь про ракету?', action: 'goto', target: 2, result: { text: 'Сосед кашляет, откашливается и хрипит: «Меня Корбут зовут. Я старый вор. Зелёную ракету? Я сам её пускал, дурак. Сигнал для Старого Друга... Но меня кинули — вместо награды заперли здесь.»', items: [], heal: 0, flags: { neighbor_talked: true } }, forbiddenFlags: ['neighbor_talked'] },
      { id: 'Sc', text: 'Позвать стражу', action: 'combat', ac: 10, combatStartText: 'Крик эхом разносится по пустым коридорам. Слышны тяжёлые шаги — орк-надзиратель идёт проверить, кто шумит. Он подходит к камере, скалит клыки: «Ах ты, крыса! Проснулся и уже шумишь? Сейчас я тебе помогу уснуть обратно... навсегда!» — он отпирает дверь и входит с дубинкой.',
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 2, text: 'Орк с глухим стуком оседает на пол. Вы обыскиваете тело — на поясе связка ключей.', items: ['keys'], heal: 0, damage: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } }
      },
      { id: 'Sd', text: 'Обшарить камеру', action: 'roll', stat: 'wis', dc: 10,
        success: { target: 2, text: 'Пальцы нащупывают в стене тайник — старая монета, пустой мешок и ржавая пряжка.', items: ['old_coin', 'empty_sack', 'rusted_buckle'], heal: 0, damage: 0, flags: { alert: 1, sd_searched: true } },
        fail: { target: 2, text: 'Только пыль и паутина.', items: [], heal: 0, damage: 0, flags: { alert: 1, sd_searched: true } },
        forbiddenFlags: ['sd_searched'], replaceOnDisabled: true
      },
      { id: 'Sf', text: 'Выбить дверь с разбега', action: 'goto', target: 3, result: { items: [], heal: 0, flags: { alert: 3 }, forceCombat: true } },
      { id: 'Se', text: 'Сломать засов кинжалом', action: 'goto', target: 3, result: { items: [], heal: 0, flags: {} }, requiredItems: ['rusty_dagger'] }
    ]
  },
  {
    id: 2, title: 'Тайник', area: 'Тюремная камера',
    text: 'Один из камней в стене шатается. За ним — небольшая ниша.\n\nВнутри лежит ржавый кинжал с потрескавшейся рукоятью и краюха чёрствого хлеба. Кто-то явно готовился к побегу заранее.',
    choices: [
      { id: 'R1a', text: 'Забрать кинжал и хлеб', action: 'goto', target: 1, forbiddenFlags: ['stash_looted'], result: { text: 'Под нарами — ржавый кинжал и краюха чёрствого хлеба. Кинжал хоть и старый, но лезвие острое — сойдёт. Хлеб черствый, но съедобный — вы чувствуете прилив сил.', items: ['rusty_dagger'], heal: 2, flags: { stash_looted: true } } },
      { id: 'R1b', text: 'Взять только кинжал, хлеб оставить', action: 'goto', target: 1, forbiddenFlags: ['stash_looted'], result: { text: 'Вы берёте только кинжал, оставляя хлеб нетронутым. Меньше шума — меньше риска.', items: ['rusty_dagger'], heal: 0, flags: { stash_looted: true, stealth_bonus: 1 } } },
      { id: 'R1c', text: 'Проверить, нет ли чего глубже', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 1, text: 'За камнем — ещё кость и ржавый наруч. Кто-то прятал здесь целый арсенал.', items: ['bone', 'rusty_bracer'], heal: 0, damage: 0, flags: { alert: 1, r1c_searched: true } },
        fail: { target: 1, text: 'Пусто. Только пыль да мусор.', items: [], heal: 0, damage: 0, flags: { alert: 1, r1c_searched: true } },
        forbiddenFlags: ['r1c_searched'], replaceOnDisabled: true
      }
    ]
  },
  {
    id: 3, title: 'Коридор с камерами', area: 'Тюремный коридор',
    text: 'Узкий коридор со сводчатым потолком. В дальнем конце, привалившись плечом к стене, сидит орк и лениво точит дубинку о каменный пол. Связка ключей позвякивает на поясе при каждом движении.\n\nОн вас ещё не заметил.',
    choices: [
      { id: 'R2a', text: 'Атаковать орка', action: 'combat', ac: 10,
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 4, text: 'Орк заваливается на бок, роняя дубинку. Вы снимаете с его пояса связку ключей.', items: ['keys'], heal: 0, damage: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } }
      },
      { id: 'R2b', text: 'Обмануть — выдать себя за нового стражника', action: 'roll', stat: 'cha', dc: 12,
        success: { target: 4, text: 'Орк недоверчиво щурится, но отворачивается к мешку. Вы незаметно стягиваете ключи.', items: ['keys'], heal: 0, damage: 0, flags: {} },
        fail: { target: 3, text: 'Орк вглядывается в ваше лицо и скалится: «Ты не из наших...» — он поднимается, перехватывая дубинку. Придётся драться.', items: [], heal: 0, damage: 0, flags: { orc_alerted: true },
          autoCombat: { enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
            onWin: { target: 4, text: 'Орк заваливается на бок, роняя дубинку. Вы снимаете с его пояса связку ключей.', items: ['keys'], heal: 0, flags: {} },
            onLose: { target: 0, heal: 2, flags: { died_to_guard: true } }
          }
        },
        forbiddenFlags: ['orc_alerted']
      },
      { id: 'R2c', text: 'Спрятаться и дождаться, пока орк уйдёт', action: 'goto', target: 4, result: { items: [], heal: 0, flags: { shadow_strike_ready: true } }, forbiddenFlags: ['orc_alerted'] },
      { id: 'R2d', text: 'Обшарить коридор', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 3, text: 'В щели между камнями — старая монета и клочок бумаги. Надпись: «левое колено».', items: ['old_coin', 'note'], heal: 0, damage: 0, flags: { alert: 1, r2d_searched: true } },
        fail: { target: 3, text: 'Только пыль.', items: [], heal: 0, damage: 0, flags: { alert: 1, r2d_searched: true } },
        forbiddenFlags: ['r2d_searched'], replaceOnDisabled: true
      }
    ]
  },
  {
    id: 4, title: 'Перекрёсток', area: 'Развилка',
    text: 'Коридор расширяется в небольшой зал. Три пути расходятся в разные стороны.\n\nСлева — запах горелого жира и лука: там кухня.\nСправа — храп и лязг металла: казарма.\nПрямо — чёрный зев туннеля, откуда тянет сыростью и мышиным помётом.',
    choices: [
      { id: 'R3a', text: 'Налево (к кухне)', action: 'goto', target: 5, result: null },
      { id: 'R3b', text: 'Направо (в казарму)', action: 'goto', target: 5, result: null },
      { id: 'R3c', text: 'Прямо (в туннели)', action: 'goto', target: 5, result: null },
      { id: 'R3d', text: 'Обыскать', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 4, text: 'В пыли поблёскивает осколок кристалла.', items: ['crystal_shard'], heal: 0, damage: 0, flags: { alert: 1, r3d_searched: true } },
        fail: { target: 4, text: 'Только пыль да мусор.', items: [], heal: 0, damage: 0, flags: { alert: 1, r3d_searched: true } },
        forbiddenFlags: ['r3d_searched'], replaceOnDisabled: true
      }
    ]
  },
  {
    id: 5, title: 'Развилка трёх путей', area: 'Choice',
    text: 'Небольшая комната, явно служившая когда-то караулкой.\n\nНа стене висит арбалет с парой болтов — ржавый, но, возможно, ещё стреляет. В углу — бочка с дождевой водой. На полу — истлевший тюфяк.\n\nТеперь у вас есть выбор, куда идти дальше.',
    choices: [
      { id: 'Choice1', text: 'Прокрасться через кухню', action: 'goto', target: 7, result: null },
      { id: 'Choice2', text: 'Пробиться через казарму', action: 'goto', target: 11, result: null },
      { id: 'Choice3', text: 'Спуститься в туннели', action: 'goto', target: 15, result: null },
      { id: 'Choice4', text: 'Забрать оружие со стены', action: 'goto', target: 5, result: { items: ['crossbow', 'crossbow_bolts'], heal: 0, flags: { crossbow_taken: true } }, forbiddenFlags: ['crossbow_taken'] },
      { id: 'Choice5', text: 'Обыскать', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 5, text: 'Под тюфяком — старые монеты и кое-что поинтереснее.', items: ['old_coin', 'unbreakable_coin'], heal: 0, damage: 0, flags: { alert: 1, choice5_searched: true } },
        fail: { target: 5, text: 'Только пыль да мусор.', items: [], heal: 0, damage: 0, flags: { alert: 1, choice5_searched: true } },
        forbiddenFlags: ['choice5_searched'], replaceOnDisabled: true
      },
      { id: 'Choice6', text: 'Отдохнуть (восстановить силы, один раз)', action: 'goto', target: 5, result: { items: [], heal: 6, flags: { alert: 1, choice_rested: true } }, forbiddenFlags: ['choice_rested'] }
    ]
  },
  {
    id: 7, title: 'Вход в кухню', area: 'Кухня',
    text: 'Тяжёлый запах гнили и варёного мяса. На полках вдоль стен — банки с приправами, связки трав и... засохшие пальцы?\n\nЗа длинным столом стоит горбатый гоблин-повар, что-то помешивая в котле. На соседней полке — вяленое мясо и бурдюк с водой.',
    choices: [
      { id: 'P1_1a', text: 'Напасть скрытно', action: 'combat', ac: 10, surprise_dc: 8,
        enemies: [{ name: 'Гоблин-повар', count: 1, hp: 6, ac: 11, attack: '1d4' }],
        onWin: { target: 8, text: 'Повар валится на пол. Вы забираете нож, мясо и воду.', items: ['chefs_knife', 'dried_meat', 'waterskin'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_cook: true } }
      },
      { id: 'P1_1b', text: 'Попытаться договориться', action: 'roll', stat: 'cha', dc: 12,
        success: { target: 8, text: 'Повар трясётся, отдаёт мясо и воду, умоляя не убивать.', items: ['dried_meat', 'waterskin'], heal: 0, damage: 0, flags: {} },
        fail: { target: 7, text: 'Повар взвизгивает и кидается на вас с ножом! Придётся защищаться.', items: [], heal: 0, damage: 0, flags: { cook_alerted: true },
          autoCombat: { enemies: [{ name: 'Гоблин-повар', count: 1, hp: 6, ac: 11, attack: '1d4' }],
            onWin: { target: 8, text: 'Повар валится на пол. Вы забираете нож, мясо и воду.', items: ['chefs_knife', 'dried_meat', 'waterskin'], heal: 0, flags: {} },
            onLose: { target: 0, heal: 2, flags: { died_to_cook: true } }
          }
        },
        forbiddenFlags: ['cook_alerted']
      },
      { id: 'P1_1c', text: 'Проскользнуть мимо, пока он отвернулся', action: 'goto', target: 8, result: null, forbiddenFlags: ['cook_alerted'] },
      { id: 'P1_1d', text: 'Осмотреться', action: 'roll', stat: 'wis', dc: 10,
        success: { target: 7, text: 'За банками — кремень и огниво.', items: ['flint_and_steel'], heal: 0, damage: 0, flags: { alert: 1, p1_1d_searched: true } },
        fail: { target: 7, text: 'Только грязная посуда.', items: [], heal: 0, damage: 0, flags: { alert: 1, p1_1d_searched: true } },
        forbiddenFlags: ['p1_1d_searched'], replaceOnDisabled: true
      },
      { id: 'P1_1e', text: 'Вернуться на развилку', action: 'goto', target: 5, result: null }
    ]
  },
  {
    id: 8, title: 'Кладовая', area: 'Подсобное помещение',
    text: 'Небольшая кладовая, заставленная бочонками и ящиками. Пахнет плесенью.\n\nВ одном из бочонков слышен шорох и характерный писк — крысиный рой обосновался внутри.',
    choices: [
      { id: 'P1_2a', text: 'Забрать припасы с полок', action: 'goto', target: 9, result: { items: ['dried_meat', 'waterskin'], heal: 0, flags: {} } },
      { id: 'P1_2b', text: 'Открыть шумящий бочонок', action: 'combat', ac: 10,
        enemies: [{ name: 'Крысиный рой', count: 1, hp: 10, ac: 10, attack: '1d2' }],
        onWin: { target: 9, text: 'Крысы разбегаются во все стороны. В пустом бочонке остаётся только крысиный хвост.', items: ['rat_tail'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { eaten_by_rats: true } }
      },
      { id: 'P1_2c', text: 'Обшарить кладовку', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 9, text: 'За бочкой припрятана фляга самогона.', items: ['flask'], heal: 0, damage: 0, flags: { alert: 1, p1_2c_searched: true } },
        fail: { target: 9, text: 'Ничего ценного.', items: [], heal: 0, damage: 0, flags: { alert: 1, p1_2c_searched: true } },
        forbiddenFlags: ['p1_2c_searched'], replaceOnDisabled: true
      },
      { id: 'P1_2d', text: 'Вернуться на кухню', action: 'goto', target: 7, result: null }
    ]
  },
  {
    id: 9, title: 'Тёмная кладовка', area: 'Тёмная кладовка',
    text: 'Непроглядная тьма. Где-то в углу скребутся крысы.\n\nПриходится двигаться на ощупь, вдоль холодной каменной стены.',
    choices: [
      { id: 'P1_3a', text: 'Красться в темноте', action: 'goto', target: 10, result: { items: [], heal: 0, flags: { shadow_strike_ready: true } } },
      { id: 'P1_3b', text: 'Зажечь свет (нужен кремень и огниво)', action: 'goto', target: 10, result: { items: [], heal: 0, flags: { alert: 1 } }, requiredItems: ['flint_and_steel'] },
      { id: 'P1_3c', text: 'Обшарить на ощупь', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 10, text: 'Пальцы находят в углу осколок кристалла и пыльный плащ, висящий на стене.', items: ['crystal_shard', 'dusty_cloak'], heal: 0, damage: 0, flags: { alert: 1, p1_3c_searched: true } },
        fail: { target: 10, text: 'Темно — ничего не разглядеть.', items: [], heal: 0, damage: 0, flags: { alert: 1, p1_3c_searched: true } },
        forbiddenFlags: ['p1_3c_searched'], replaceOnDisabled: true
      },
      { id: 'P1_3d', text: 'Вернуться в кладовую', action: 'goto', target: 8, result: null }
    ]
  },
  {
    id: 10, title: 'Задний выход', area: 'Задняя дверь кухни',
    text: 'Коридор упирается в старую деревянную дверь, обитую ржавым железом. За ней слышны голоса — пост охраны совсем рядом.',
    choices: [
      { id: 'P1_4a', text: 'Вскрыть замок подручными средствами', action: 'roll', stat: 'dex', dc: 12,
        success: { target: 19, text: 'Замок щёлкает — дверь открыта.', items: [], heal: 0, damage: 0, flags: {} },
        fail: { target: 19, text: 'Замок не поддаётся. Приходится выбивать дверь плечом — больно и шумно.', items: [], heal: 0, damage: 1, flags: { alert: 2 } }
      },
      { id: 'P1_4b', text: 'Выбить дверь с разбега', action: 'goto', target: 19, result: { items: [], heal: 0, flags: { alert: 2 }, forceCombat: true } },
      { id: 'P1_4c', text: 'Обшарить дверь', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 10, text: 'За дверью припрятана гнилая верёвка.', items: ['rotten_rope'], heal: 0, damage: 0, flags: { alert: 1, p1_4c_searched: true } },
        fail: { target: 10, text: 'Пусто.', items: [], heal: 0, damage: 0, flags: { alert: 1, p1_4c_searched: true } },
        forbiddenFlags: ['p1_4c_searched'], replaceOnDisabled: true
      },
      { id: 'P1_4d', text: 'Вернуться в кладовку', action: 'goto', target: 9, result: null }
    ]
  },
  {
    id: 11, title: 'Вход в казарму', area: 'Казарма',
    text: 'В комнате стоит густой запах пота и эля. Вдоль стен — грубые койки. На двух из них, раскинувшись, храпят гоблины-стражи. Их оружие сложено у изголовья: короткий меч и арбалет.\n\nМожно попробовать застать их врасплох.',
    choices: [
      { id: 'P2_1a', text: 'Устранить спящих, пока не проснулись', action: 'combat', ac: 10, surprise_dc: 6,
        enemies: [{ name: 'Гоблин-страж', count: 2, hp: 7, ac: 12, attack: '1d4+1' }],
        onWin: { target: 12, text: 'Гоблины не успевают и пикнуть. Вы забираете меч и арбалет.', items: ['short_sword', 'crossbow', 'crossbow_bolts'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_goblins: true } }
      },
      { id: 'P2_1b', text: 'Разбудить и атаковать в открытую', action: 'combat', ac: 10,
        enemies: [{ name: 'Гоблин-страж', count: 2, hp: 7, ac: 12, attack: '1d4+1' }],
        onWin: { target: 12, text: 'Гоблины повержены. Лязг оружия наверняка привлёк внимание.', items: ['short_sword', 'crossbow', 'crossbow_bolts'], heal: 0, flags: { alarm_raised: true } },
        onLose: { target: 0, heal: 2, flags: { died_to_goblins: true } }
      },
      { id: 'P2_1c', text: 'Обшарить койки', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 11, text: 'Под матрасом — верёвка и фляга.', items: ['rotten_rope', 'flask'], heal: 0, damage: 0, flags: { alert: 1, p2_1c_searched: true } },
        fail: { target: 11, text: 'Только грязные тряпки.', items: [], heal: 0, damage: 0, flags: { alert: 1, p2_1c_searched: true } },
        forbiddenFlags: ['p2_1c_searched'], replaceOnDisabled: true
      },
      { id: 'P2_1d', text: 'Вернуться на развилку', action: 'goto', target: 5, result: null }
    ]
  },
  {
    id: 12, title: 'Комната орка', area: 'Кабинет надзирателя',
    text: 'За следующей дверью — кабинет. За столом сидит орк-надзиратель, мрачно точит дубинку о край столешницы. На поясе у него позвякивает связка ключей.\n\nСпиной к вам. Пока не заметил.',
    choices: [
      { id: 'P2_2a', text: 'Напасть из тени', action: 'combat', ac: 10, surprise_dc: 10,
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 13, text: 'Орк заваливается на пол. Ключи и дубинка ваши.', items: ['keys', 'club'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } }
      },
      { id: 'P2_2b', text: 'Атаковать в лоб', action: 'combat', ac: 10,
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 13, text: 'Орк повержен. Грохот наверняка поднял тревогу.', items: ['keys', 'club'], heal: 0, flags: { alarm_raised: true } },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } }
      },
      { id: 'P2_2c', text: 'Ударить в левое колено (из записки)', action: 'combat', ac: 10,
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 13, text: 'Орк с воем оседает на колено. Вы добиваете его. Ключи у вас.', items: ['keys', 'club'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } },
        requiredItems: ['note']
      },
      { id: 'P2_2d', text: 'Напугать стеклянным глазом', action: 'goto', target: 13, result: { items: ['keys'], heal: 0, flags: {} }, requiredItems: ['glass_eye'] },
      { id: 'P2_2e', text: 'Обшарить кабинет', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 12, text: 'В ящике стола — монета и стеклянный глаз.', items: ['old_coin', 'glass_eye'], heal: 0, damage: 0, flags: { alert: 1, p2_2e_searched: true } },
        fail: { target: 12, text: 'Только бумаги и мусор.', items: [], heal: 0, damage: 0, flags: { alert: 1, p2_2e_searched: true } },
        forbiddenFlags: ['p2_2e_searched'], replaceOnDisabled: true
      },
      { id: 'P2_2f', text: 'Вернуться в казарму', action: 'goto', target: 11, result: null }
    ]
  },
  {
    id: 13, title: 'Оружейная', area: 'Оружейная комната',
    text: 'Небольшая оружейная. На стойках вдоль стен — короткие мечи, арбалеты, колчаны с болтами. В углу стоит старый окованный сундук.\n\nВ комнате тихо, но от сундука исходит странное ощущение — будто он сам смотрит на вас.',
    choices: [
      { id: 'P2_3a', text: 'Забрать оружие со стоек', action: 'goto', target: 14, result: { items: ['short_sword', 'crossbow', 'crossbow_bolts'], heal: 0, flags: {} } },
      { id: 'P2_3b', text: 'Открыть сундук', action: 'combat', ac: 10,
        enemies: [{ name: 'Мимик', count: 1, hp: 18, ac: 12, attack: '1d6+2' }],
        onWin: { target: 14, text: 'Сундук — не сундук, а зубастая тварь! Мимик мёртв. Внутри — древний шлем.', items: ['ancient_helm'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_mimic: true } }
      },
      { id: 'P2_3c', text: 'Обшарить оружейную', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 13, text: 'За стойкой висит карта тюрьмы со всеми ходами.', items: ['prison_map'], heal: 0, damage: 0, flags: { alert: 1, p2_3c_searched: true } },
        fail: { target: 13, text: 'Только оружейная пыль.', items: [], heal: 0, damage: 0, flags: { alert: 1, p2_3c_searched: true } },
        forbiddenFlags: ['p2_3c_searched'], replaceOnDisabled: true
      },
      { id: 'P2_3d', text: 'Вернуться к орку', action: 'goto', target: 12, result: null }
    ]
  },
  {
    id: 14, title: 'Коридор к посту', area: 'Узкий коридор',
    text: 'Длинный узкий коридор. В дальнем конце слышны приглушённые голоса — пост охраны.\n\nСтены здесь глухие, спрятаться негде.',
    choices: [
      { id: 'P2_4a', text: 'Красться вдоль стены', action: 'goto', target: 19, result: { items: [], heal: 0, flags: { shadow_strike_ready: true } } },
      { id: 'P2_4b', text: 'Бежать — быстрее, но шумно', action: 'goto', target: 19, result: { items: [], heal: 0, flags: { alert: 2 } } },
      { id: 'P2_4c', text: 'Поставить верёвочную растяжку (нужна верёвка)', action: 'goto', target: 19, result: { items: [], heal: 0, flags: { rope_trap: true } }, requiredItems: ['rotten_rope'] },
      { id: 'P2_4d', text: 'Обшарить коридор', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 14, text: 'В трещине стены застряла старая монета.', items: ['old_coin'], heal: 0, damage: 0, flags: { alert: 1, p2_4d_searched: true } },
        fail: { target: 14, text: 'Ничего.', items: [], heal: 0, damage: 0, flags: { alert: 1, p2_4d_searched: true } },
        forbiddenFlags: ['p2_4d_searched'], replaceOnDisabled: true
      },
      { id: 'P2_4e', text: 'Вернуться в оружейную', action: 'goto', target: 13, result: null }
    ]
  },
  {
    id: 15, title: 'Вход в туннели', area: 'Туннели',
    text: 'Сырой каменный мешок. Со свода капает вода, в лицо дует холодный сквозняк. В полумраке кто-то шевелится.\n\nЭто гоблин по имени Скрип — местный ворье, промышляющий в туннелях.',
    choices: [
      { id: 'P3_1a', text: 'Поговорить — Скрип знает короткий путь', action: 'goto', target: 16, result: { text: 'Скрип щурится, почесывает грязную морду и кивает: «Пропущу, но ты мне должен. Там, за мостом, пещера с крысами. Не лезь к ним — иди вдоль левой стены, там лаз. Выведешь прямо к посту охраны, минуя половину тюрьмы. Но если крысы тебя учуют — сам виноват.»', items: [], heal: 0, flags: { goblin_friend: true } } },
      { id: 'P3_1b', text: 'Оттолкнуть и пройти самому', action: 'goto', target: 16, result: { items: [], heal: 0, flags: { goblin_betrayed: true } } },
      { id: 'P3_1c', text: 'Обшарить вход', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 15, text: 'В луже валяется стеклянный глаз.', items: ['glass_eye'], heal: 0, damage: 0, flags: { alert: 1, p3_1c_searched: true } },
        fail: { target: 15, text: 'Только грязь и камни.', items: [], heal: 0, damage: 0, flags: { alert: 1, p3_1c_searched: true } },
        forbiddenFlags: ['p3_1c_searched'], replaceOnDisabled: true
      },
      { id: 'P3_1d', text: 'Вернуться на развилку', action: 'goto', target: 5, result: null }
    ]
  },
  {
    id: 16, title: 'Разрушенный мост', area: 'Пропасть',
    text: 'Подземная река пробила себе путь сквозь скалу. Через расщелину когда-то перекинули каменный мост, но часть его обрушилась.\n\nДо противоположной стороны — около пяти футов. Внизу — чёрная вода.',
    choices: [
      { id: 'P3_2a', text: 'Перепрыгнуть', action: 'roll', stat: 'dex', dc: 12,
        success: { target: 17, text: 'Рывок — и вы на той стороне!', items: [], heal: 0, damage: 0, flags: {} },
        fail: { target: 17, text: 'Срыв! Пальцы соскальзывают с мокрого камня. Вы падаете, но успеваете ухватиться за край. Больно, но живы.', items: [], heal: 0, damage: 2, flags: {} }
      },
      { id: 'P3_2b', text: 'Искать обход', action: 'goto', target: 17, result: { items: [], heal: 0, flags: { alert: 1 } } },
      { id: 'P3_2c', text: 'Обшарить мост', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 16, text: 'В груде камней — острая кость.', items: ['bone'], heal: 0, damage: 0, flags: { alert: 1, p3_2c_searched: true } },
        fail: { target: 16, text: 'Только камни.', items: [], heal: 0, damage: 0, flags: { alert: 1, p3_2c_searched: true } },
        forbiddenFlags: ['p3_2c_searched'], replaceOnDisabled: true
      },
      { id: 'P3_2d', text: 'Вернуться ко входу в туннели', action: 'goto', target: 15, result: null }
    ]
  },
  {
    id: 17, title: 'Пещера с крысами', area: 'Пещера',
    text: 'Большая пещера с высоким сводом. В углу — куча мусора и костей, вокруг которой копошится крысиный рой. Десятки красных глаз светятся в темноте.\n\nМожно попробовать пройти незаметно.',
    choices: [
      { id: 'P3_3a', text: 'Пройти тихо, не тревожа', action: 'goto', target: 18, result: { items: [], heal: 0, flags: { shadow_strike_ready: true } } },
      { id: 'P3_3b', text: 'Атаковать крыс', action: 'combat', ac: 10,
        enemies: [{ name: 'Крысиный рой', count: 1, hp: 10, ac: 10, attack: '1d2' }],
        onWin: { target: 18, text: 'Крысы разбегаются. Вы отрезаете хвост на удачу.', items: ['rat_tail'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { eaten_by_rats: true } }
      },
      { id: 'P3_3c', text: 'Показать крысиный хвост — знак «своего»', action: 'goto', target: 18, result: null, requiredItems: ['rat_tail'] },
      { id: 'P3_3d', text: 'Обшарить пещеру', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 17, text: 'В куче костей — монета и кость.', items: ['old_coin', 'bone'], heal: 0, damage: 0, flags: { alert: 1, p3_3d_searched: true } },
        fail: { target: 17, text: 'Только кости и мусор.', items: [], heal: 0, damage: 0, flags: { alert: 1, p3_3d_searched: true } },
        forbiddenFlags: ['p3_3d_searched'], replaceOnDisabled: true
      },
      { id: 'P3_3e', text: 'Вернуться на мост', action: 'goto', target: 16, result: null }
    ]
  },
  {
    id: 18, title: 'Секретный выход', area: 'Люк в полу',
    text: 'В дальнем углу пещеры — старый люк, вделанный в каменный пол. Сквозь щели пробивается тусклый свет. Сверху слышны голоса охраны.\n\nПост охраны прямо над вами.',
    choices: [
      { id: 'P3_4a', text: 'Бесшумно открыть люк', action: 'goto', target: 19, result: null },
      { id: 'P3_4b', text: 'Выбить люк плечом', action: 'goto', target: 19, result: { items: [], heal: 0, flags: { alert: 2 }, forceCombat: true } },
      { id: 'P3_4c', text: 'Обшарить люк', action: 'roll', stat: 'wis', dc: 12,
        success: { target: 18, text: 'В пыли у люка — осколок кристалла.', items: ['crystal_shard'], heal: 0, damage: 0, flags: { alert: 1, p3_4c_searched: true } },
        fail: { target: 18, text: 'Только пыль.', items: [], heal: 0, damage: 0, flags: { alert: 1, p3_4c_searched: true } },
        forbiddenFlags: ['p3_4c_searched'], replaceOnDisabled: true
      },
      { id: 'P3_4d', text: 'Вернуться в пещеру', action: 'goto', target: 17, result: null }
    ]
  },
  {
    id: 19, title: 'Пост охраны', area: 'Финальный пост',
    text: 'Вы выходите прямо к посту охраны. Два гоблина играют в кости, лениво переругиваясь. Чуть поодаль стоит орк, прислонившись к стене и полуприкрыв глаза.\n\nЗа их спинами — массивная дверь. За ней — лестница наверх. Ключ от двери висит на поясе у орка.',
    choices: [
      { id: 'Merge_a', text: 'Атаковать всех', action: 'combat', ac: 10,
        enemies: [
          { name: 'Гоблин-страж', count: 2, hp: 7, ac: 12, attack: '1d4+1' },
          { name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }
        ],
        onWin: { target: 20, text: 'Пост зачищен. Ключ от выхода у вас.', items: ['exit_key'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guards: true } }
      },
      { id: 'Merge_b', text: 'Подкупить гоблинов монетой — орк заметит и нападёт', action: 'combat', ac: 10, combatStartText: 'Гоблины довольно брякают монетой и отходят в сторону, пропуская вас к двери. Но орк замечает это, скалится и идёт на вас с дубинкой — теперь он один против вас.',
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 20, text: 'Гоблины, довольно брякая монетой, уходят. Орк повержен — ключ у вас.', items: ['exit_key'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } },
        requiredOr: ['old_coin', 'unbreakable_coin']
      },
      { id: 'Merge_c', text: 'Напугать гоблинов стеклянным глазом', action: 'combat', ac: 10,
        enemies: [{ name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }],
        onWin: { target: 20, text: 'Гоблины с визгом разбегаются. Орк повержен.', items: ['exit_key'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guard: true } },
        requiredItems: ['glass_eye']
      },
      { id: 'Merge_d', text: 'Бить в левое колено (из записки)', action: 'combat', ac: 10,
        enemies: [
          { name: 'Гоблин-страж', count: 2, hp: 7, ac: 12, attack: '1d4+1' },
          { name: 'Орк-надзиратель', count: 1, hp: 15, ac: 13, attack: '1d6+2' }
        ],
        onWin: { target: 20, text: 'Точный удар в колено — орк рушится. Гоблины в панике. Ключ у вас.', items: ['exit_key'], heal: 0, flags: {} },
        onLose: { target: 0, heal: 2, flags: { died_to_guards: true } },
        requiredItems: ['note']
      },
      { id: 'Merge_e', text: 'Проскользнуть незаметно', action: 'roll', stat: 'dex', dc: 15,
        success: { target: 20, text: 'Вы проскальзываете тенью. Охрана ничего не замечает.', items: [], heal: 0, damage: 0, flags: { shadow_strike_ready: true } },
        fail: { target: 20, text: 'Вас замечают. Орк бьёт дубинкой, но вы успеваете добежать до лестницы.', items: [], heal: 0, damage: 3, flags: {} }
      },
      { id: 'Merge_f', text: 'Обшарить пост', action: 'roll', stat: 'wis', dc: 14,
        success: { target: 19, text: 'В ящике — кристалл и монета.', items: ['crystal_shard', 'old_coin'], heal: 0, damage: 0, flags: { alert: 1, merge_f_searched: true } },
        fail: { target: 19, text: 'Пусто.', items: [], heal: 0, damage: 0, flags: { alert: 1, merge_f_searched: true } },
        forbiddenFlags: ['merge_f_searched'], replaceOnDisabled: true
      }
    ]
  },
  {
    id: 20, title: 'Главная лестница', area: 'Выход',
    text: 'Широкая каменная лестница уходит вверх, теряясь в темноте. Откуда-то сверху доносится гул — будто огромный кристалл поёт на низкой частоте.\n\nСтупени влажные, поросшие мхом. Воздух становится свежее с каждым шагом.',
    choices: [
      { id: 'Exit_a', text: 'Подняться наверх', action: 'end', url: 'https://d21-club.ru/', result: { text: 'Вы поднимаетесь по лестнице. Свежий ветер ударяет в лицо — вы на свободе!', items: [], heal: 0, damage: 0, flags: {} } },
      { id: 'Exit_b', text: 'Обшарить лестницу', action: 'roll', stat: 'wis', dc: 14,
        success: { target: 20, text: 'На ступенях валяется осколок кристалла.', items: ['crystal_shard'], heal: 0, damage: 0, flags: { alert: 1, exit_b_searched: true } },
        fail: { target: 20, text: 'Только мох и пыль.', items: [], heal: 0, damage: 0, flags: { alert: 1, exit_b_searched: true } },
        forbiddenFlags: ['exit_b_searched'], replaceOnDisabled: true
      },
      { id: 'Exit_c', text: 'Задержаться в тени, прислушаться', action: 'goto', target: 20, result: { items: [], heal: 0, flags: { alert: -1 } } }
    ]
  }
]

module.exports = { items, heroes, nodes }
