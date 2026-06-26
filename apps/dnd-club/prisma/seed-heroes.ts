import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: { in: ["admin", "sadmin"] } },
  })
  if (!admin) {
    console.error("No admin user found. Run seed.ts first.")
    process.exit(1)
  }

  const campaign = await prisma.campaign.findUnique({ where: { slug: "dead-band" } })
  if (!campaign) {
    console.error('Campaign "dead-band" not found.')
    process.exit(1)
  }

  const userId = admin.id
  const campaignId = campaign.id

  const characters: {
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
    stats: Record<string, number>
    sheet: Record<string, any>
    equipment: string
    notes: string
    backstory: string
  }[] = [
    {
      name: "Феликс",
      race: "Человек",
      class: "Плут",
      level: 5,
      background: "Моряк",
      alignment: "Хаотично-Злой",
      experiencePoints: 21125,
      hp: 51,
      maxHp: 51,
      tempHp: 0,
      ac: 17,
      initiative: 5,
      speed: 30,
      proficiencyBonus: 3,
      inspiration: false,
      hitDice: "d8",
      hitDiceTotal: 1,
      stats: { str: 9, dex: 21, con: 16, int: 12, wis: 13, cha: 16 },
      sheet: {
        savingThrows: { str: false, dex: false, con: false, int: false, wis: false, cha: false },
        skills: {
          acrobatics: true, animal_handling: false, arcana: true, athletics: false,
          deception: true, history: false, insight: false, intimidation: false,
          investigation: false, medicine: false, nature: false, perception: true,
          performance: false, persuasion: true, religion: false, sleight_of_hand: true,
          stealth: true, survival: false,
        },
        attacks: [
          { name: "Скрытная атака", atkBonus: "+8", damage: "3d6", type: "Хитрость" },
          { name: "Эльфийский лук", atkBonus: "+8", damage: "4d6", type: "Колющий" },
          { name: "Короткий меч", atkBonus: "+8", damage: "1d6", type: "Колющий" },
        ],
        spells: {
          level_0: ["Электрошок", "Волшебная рука", "Меткий удар"],
          level_1: ["Маскировка", "Псевдожизнь", "Искажение цены"],
        },
        featuresAndTraits: "Поездка на корабле\nХитрое действие\nМистический ловкач\nУчастник боев на божественной арене\nНевероятное уклонение\nКомпетентность",
        personalityTraits: "Я готов приврать, чтобы получить хороший рассказ",
        ideals: "Свобода. Море это свобода идти куда угодно",
        bonds: "Я всегда буду помнить свой первый корабль",
        flaws: "Начав пить я не могу остановится",
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        passivePerception: 13,
        spellcastingAbility: "INT",
        spellSaveDc: 14,
        spellAttackBonus: "+6",
      },
      equipment: "Одежда, кожанная броня, кольцо бессмертия, 2 карты, 20 склянок с жижой, 12 зелий здоровья(1d8), 1к21 ЗМ, кольцо капитана.",
      notes: "",
      backstory: "",
    },
    {
      name: "Торин",
      race: "Дварф",
      class: "Воин",
      level: 5,
      background: "Солдат",
      alignment: "",
      experiencePoints: 0,
      hp: 55,
      maxHp: 55,
      tempHp: 0,
      ac: 16,
      initiative: 0,
      speed: 25,
      proficiencyBonus: 3,
      inspiration: false,
      hitDice: "d10",
      hitDiceTotal: 1,
      stats: { str: 19, dex: 11, con: 20, int: 16, wis: 19, cha: 10 },
      sheet: {
        savingThrows: { str: true, dex: false, con: true, int: false, wis: true, cha: false },
        skills: {
          acrobatics: false, animal_handling: false, arcana: false, athletics: true,
          deception: false, history: false, insight: true, intimidation: true,
          investigation: false, medicine: false, nature: false, perception: false,
          performance: false, persuasion: false, religion: false, sleight_of_hand: false,
          stealth: false, survival: true,
        },
        attacks: [
          { name: "Удар топором (х2)", atkBonus: "+7", damage: "1к8 рубящий", type: "Рубящий" },
          { name: "Выстрел из арбалета", atkBonus: "+3", damage: "1к8 колющий", type: "Колющий" },
        ],
        spells: {},
        featuresAndTraits: "Тёмное зрение.\nДварфийская устойчивость. Вы совершаете с преимуществом спасброски от яда, и вы получаете сопротивление урону ядом.\nДварфийская боевая тренировка. Вы владеете боевым топором, ручным топором, лёгким и боевым молотом.\nОбщий и Дварфийский язык.\nВладение доспехами дварфов. Вы владеете лёгкими и средними доспехами.\nВладение инструментами. Вы владеете ремесленными инструментами на ваш выбор: инструменты кузнеца, пивовара или каменщика.\nВсплеск действий (одно использование)\nВторое дыхание - бонусным действием восстановить хиты в размере 1к10 + ваш уровень воина.\nОбезоруживающая атака.",
        personalityTraits: "Атлетичный",
        ideals: "Всё тлен, движение жизнь...",
        bonds: "",
        flaws: "Страх бездействия",
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        passivePerception: 10,
      },
      equipment: "Арбалет, лёгкий 25 зм 1к8 колющий 5 фнт. Боеприпас (дис. 80/320), двуручное, перезарядка\nБоевой топор 10 зм 1к8 рубящий 4 фнт. Универсальное (1к10) 2 шт.",
      notes: "",
      backstory: "Бывший сержант пограничной стражи. Вышел в отставку после травмы колена — не смертельной, но для строевой уже не годится. На гражданке заскучал. Деньги кончились. Согласен на любую работу, где нужно кого-то рубить, а не отчитываться перед штабом.",
    },
    {
      name: "Кассандра Салтивелл",
      race: "Морской эльф",
      class: "Монах",
      level: 5,
      background: "Пират",
      alignment: "Хаотично-доброе",
      experiencePoints: 0,
      hp: 35,
      maxHp: 35,
      tempHp: 0,
      ac: 17,
      initiative: 4,
      speed: 40,
      proficiencyBonus: 3,
      inspiration: false,
      hitDice: "d8",
      hitDiceTotal: 5,
      stats: { str: 8, dex: 19, con: 12, int: 8, wis: 16, cha: 14 },
      sheet: {
        savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
        skills: {
          acrobatics: true, animal_handling: false, arcana: false, athletics: true,
          deception: false, history: false, insight: true, intimidation: false,
          investigation: false, medicine: false, nature: false, perception: true,
          performance: false, persuasion: false, religion: false, sleight_of_hand: false,
          stealth: false, survival: false,
        },
        attacks: [],
        spells: {},
        featuresAndTraits: "Внимательный [Observant]\nВы быстро улавливаете мелкие подробности и получаете следующие преимущества:\nУвеличьте значение Интеллекта или Мудрости на 1 при максимуме 20.\n\nВладение инструментами: Инструменты навигатора, транспорт (водный).\n\nУМЕНИЕ: ДУРНАЯ РЕПУТАЦИЯ\nГде бы вы ни оказались, вас боятся из-за вашей репутации. Находясь в цивилизованном поселении, вы можете безнаказанно совершать небольшие преступления, такие как отказ платить за еду в таверне или выламывание двери в магазине, так как жители боятся сообщать о вас властям",
        personalityTraits: "Я никогда не откажусь от пари",
        ideals: "Свобода. Море это свобода — свобода идти куда угодно и делать что угодно. (Хаотичный)",
        bonds: "Безжалостные пираты убили моего капитана и почти всю команду, разграбили корабль, и оставили меня умирать. Месть будет страшной",
        flaws: "Когда кто-то бросает мне вызов, я никогда не отступлюсь, какой бы опасной не была ситуация",
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        passivePerception: 21,
      },
      equipment: "Кофель-нагель (дубинка)\n50 футов шёлковой верёвки\nталисман (чёрный пиратский флаг с черепом и костями дракона)\nкомплект обычной одежды\nпоясной кошель с 10 зм\nкороткий меч\nнабор путешественника\n10 дротиков\nкружка трезвости\nдубинка\nкапитанская шляпа\nтрезубец",
      notes: "Языки: общий, эльфийский, акване",
      backstory: "Кассандра не всегда была пиратом. Более того, её не всегда звали Кассандрой. Она была дочерью морского эльфа-дипломата, но её корабль был уничтожен во время шторма. Её, единственную выжившую, подобрал пиратский шлюп «Не Время Для Драконов» под командованием старого, уставшего капитана Сайласа Салтивелла.\n\nОн и его разношёрстная команда стали ей новой семьёй. Они не смотрели на её происхождение. Они научи её драться, воровать и выживать. Кассандра отвечала им беззаветной верностью. Она была их талисманом, их «золотой удачей», и её боевые навыки расцвели в жестоких абордажах.\n\nВсё рухнуло в тумане. Не в честном бою, а из-за подлого заговора. Другой пират, капитан «Кровавого Прилива» Виго Вандербильт, притворявшийся другом и товарищем, но завидовавший удаче Сайласа, подстроил всё: он распустил слух, что на борту «Не время Для Драконов» хранится карта к сокровищам Повелителя Глубин. Несколько кораблей одновременно напали на них ночью, у мыса, известного как «Ядовитый риф».\n\nКассандра была на разведке и вернулась к догорающим обломкам. Она нашла тело капитана Сайласа, прижавшее к себе юнгу. Все погибли. Измена, основанная на лжи, забрала у неё всё.\n\nИменно тогда она дала клятву: «Никогда не верить чужим сказкам. Только свои сказки будут править морями. И я найду того, кто это начал».\n\nВо имя вечной памяти Кэс забрала капитанскую шляпу Сайласа и его фамилию, объявив себя новым лидером мертвой команды и поклялась вновь поднять флаг из костей драконов.\n\nЕё мотивация двухслойна, как океан: на поверхности — ярость, в глубине — надежда.\n\n1. Месть слухам и их творцу: Её главная цель — найти капитана Виго. Но убить его — слишком милостиво. Она хочет уничтожить его репутацию, его наследие. Она будет сеять вокруг него такие слухи, которые превратят его из грозного капитана в посмешище, в изгоя, которого боятся и презирают даже его собственные люди.\n\n2. Возрождение «Не Время Для Драконов»: Глубже мести живет желание восстановить свою семью. Она ищет не просто команду, а достойных людей, чтобы снова поднять кровавый флаг над землей и морями.\n\nОна — живое напоминание о том, что самая опасная вещь на море — это не меч, а вовремя рассказанная история.",
    },
    {
      name: "Фесс",
      race: "Человек",
      class: "Воин",
      level: 5,
      background: "Преступник",
      alignment: "Нейтральный",
      experiencePoints: 6500,
      hp: 49,
      maxHp: 49,
      tempHp: 0,
      ac: 15,
      initiative: 2,
      speed: 30,
      proficiencyBonus: 3,
      inspiration: false,
      hitDice: "d10",
      hitDiceTotal: 5,
      stats: { str: 18, dex: 14, con: 16, int: 10, wis: 10, cha: 14 },
      sheet: {
        savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
        skills: {
          acrobatics: true, animal_handling: false, arcana: false, athletics: true,
          deception: true, history: false, insight: false, intimidation: false,
          investigation: false, medicine: false, nature: false, perception: false,
          performance: false, persuasion: false, religion: false, sleight_of_hand: false,
          stealth: true, survival: false,
        },
        attacks: [
          { name: "Глефа", atkBonus: "+7", damage: "1к10 + 4", type: "Рубящий" },
          { name: "Ломик", atkBonus: "+4", damage: "1к4 + 4", type: "Дробящий" },
          { name: "Дротик", atkBonus: "+7", damage: "1к4 + 4", type: "Колющий" },
        ],
        spells: {},
        featuresAndTraits: "Базовые умения Воина:\nВторое дыхание: Бонусное действие, восстановление 1к10 + 5 HP (1 раз в короткий/продолжительный отдых).\nБоевой стиль: СРАЖЕНИЕ БОЛЬШИМ ОРУЖИЕМ: Если при атаке двуручным оружием (глефой) на кубике урона выпадает «1» или «2», вы перебрасываете этот кубик и обязаны использовать новый результат.\nВсплеск действий (Action Surge): Одно дополнительное действие в ход (1 раз в короткий/продолжительный отдых).\nДополнительная атака: При использовании действия Атака вы совершаете две атаки вместо одной.\nМастер боевых искусств (Battle Master):\nКости превосходства: 4 кости к8. Восстанавливаются после короткого или продолжительного отдыха.\nСложность спасброска от приёмов: 15 (8 + 3 бонус мастерства + 4 мод. Силы).\nИзученные приёмы (3):\nОпрокидывающая атака (Trip Attack): При попадании добавьте 1к8 к урону. Цель (Большая или меньше) делает спасбросок Силы (Сл 15). При провале падает ничком.\nТочная атака (Precision Attack): Добавьте 1к8 к броску атаки (d20). Можно использовать после броска кубика, но до объявления результата Мастером.\nУдар командующего (Commander's Strike): Откажитесь от одной своей атаки. Бонусным действием направьте союзника (Феликса). Он реакцией совершает атаку, добавляя вашу кость 1к8 к урону.\n\nУМЕНИЯ ПРЕДЫСТОРИИ (ПРЕСТУПНИК)\nПреступная специализация: Шпион (Прознатчик Серой Лиги).\nКриминальные связи: У вас есть надёжный связной (бывший куратор из Серой Лиги).\nИнструменты: Воровские инструменты, Игровой набор: Кости.",
        personalityTraits: "У меня всегда есть план на случай, если всё пойдёт не так, как задумано\nМне трудно доверять другим. Я привык полагаться только на себя и всегда ищу скрытый смысл или подвох в словах окружающих",
        ideals: "Независимость и Прагматизм. Я сам выбираю свой путь и свои цели. Я не служу абстрактным идеалам или господам, я действую так, как считаю нужным для выживания и защиты тех немногих, кого называю своими",
        bonds: "Я пытаюсь найти способ вернуть себе утраченные воспоминания, в которых, возможно, скрыта правда о моём прошлом и причинах, по которым я оказался в этом мире.",
        flaws: "Иногда я слишком полагаюсь на свою удачу и инстинкты, игнорируя холодный расчёт. А ещё я боюсь, что тёмная сила, текущая во мне, однажды возьмёт верх, и я стану тем монстром (Разрушителем), которого все боятся.",
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        passivePerception: 10,
      },
      equipment: "Доспех: Кольчужная рубаха (50 зм, 20 фн)\nОружие: Глефа (20 зм, 6 фн), 30 Дротиков в кожаной перевязи (1.5 зм, 7.5 фн)\nПоясной кошель с 183 зм 75 мм\nКомплект обычной тёмной одежды с капюшоном\nНабор исследователя подземелий\n2 Зелья лечения (2к4+2 HP)\n2 Фляги святой воды (2к6 урона излучением по нежити/исчадиям)\nБезделушка: Дневник, написанный на неизвестном языке",
      notes: "📖 Непрочитанный дневник\n👁️ «Пробуждающееся проклятие»\n🕸️ Сеть Серой Лиги\nЯзыки: Общий, Инфернальный",
      backstory: "Фесс (настоящее имя Кэр Лаэда) был одним из лучших агентов Серой Лиги. Он умел вскрывать любые замки, добывать любую информацию и устранять цели без лишнего шума. Однако одно задание изменило всё: он завладел могущественными артефактами и, чтобы предотвратить катастрофу, спрятал их в астрале, пожертвовав частью собственной памяти.\n\nТеперь он скитается под именем Неясыть, работая наёмником. Он пытается восстановить утраченные воспоминания, избегая внимания Инквизиции, которая видит в нём пророческого Разрушителя. Его глефа и навыки вора — единственное, что отделяет его от смерти в этом чужом мире.",
    },
    {
      name: "Тагг",
      race: "Полуорк",
      class: "Варвар",
      level: 6,
      background: "Чужеземец",
      alignment: "Тру нейтрал",
      experiencePoints: 18470,
      hp: 68,
      maxHp: 68,
      tempHp: 0,
      ac: 18,
      initiative: 2,
      speed: 40,
      proficiencyBonus: 3,
      inspiration: false,
      hitDice: "d12",
      hitDiceTotal: 6,
      stats: { str: 16, dex: 14, con: 10, int: 9, wis: 12, cha: 9 },
      sheet: {
        savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
        skills: {
          acrobatics: true, animal_handling: true, arcana: false, athletics: true,
          deception: false, history: false, insight: false, intimidation: true,
          investigation: false, medicine: false, nature: false, perception: false,
          performance: false, persuasion: false, religion: false, sleight_of_hand: false,
          stealth: false, survival: true,
        },
        attacks: [],
        spells: {},
        featuresAndTraits: "Языки: Общий, орочий, гоблинский\nИгра на барабанах.\nСтранник - могу находить еду и воду для отряда, если она есть на этой местности.\nТемное зрение.\nНепоколебимая стойкость.(вместо первой смерти за день встаю с 1 хп).\nСвирепые атаки (доп. кость урона при критах)\nДоспехи: Лёгкие доспехи, средние доспехи, щиты\nОружие: Простое оружие, воинское оружие\nЗащита без доспехов (10+ловкость+телосложение)\nЯрость (4 заряда). Активируется бонусным действием, +2 к урону, сопротивление рубящему/колющему/режущему урону, броски силы с преимуществом. Действует минуту, кончается если не ударил или не получил урон.\nБезрассудная атака (могу атаковать с преимуществом, но по мне атаки тоже с преимуществом)\nЧувство опасности (спас броски ловкости с преимуществом)\nДополнительная атака.\nПуть дикости - Бешенство (могу дополнительно атаковать бонусным действием пока в ярости, но будет 1 ранг усталости).\nПуть дикости - Бездумная ярость (не могу быть испуган или очарован в ярости)\nАчивка +1 к кд навсегда.\nМастер большого оружия (если крит или убил, то могу атаковать бонусным действием), Могу взять штраф к атаке -5, чтобы нанести +10 урона.",
        personalityTraits: "",
        ideals: "",
        bonds: "",
        flaws: "",
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
        passivePerception: 11,
      },
      equipment: "Плащ (скрытность с преимуществом)\nШолем (+1кд) Кольцо (+2кд), Медаль (+1 ловкость), Кольцо (+1 сила), Кольцо воскрешения\n1257 золотых, 7 пачек кредитов, 10 кг золота на корабле.\n20 космосухпайков, 10 ушей эльфов, клык медведя\nСвиток огненного урона, свиток с рецептом зелья исцеления.\nЩит, посох, метательное копье, 6 факелов, 19 стрел, 8 стрел против нежити, длинный лук, кожанная броня.\nХилка 1к8 - 18, 1к4 -6, 20 склянок с жижей, яд, противоядие, черное зелье?\nПояс, визор, планшет, скафандр,батарейки, 5 бластеров, чемоданчик\n2 меча 2к12+1, секира 2к12, двуручный меч +3, секира +4 некр урона, ручной топор.",
      notes: "",
      backstory: "",
    },
  ]

  for (const c of characters) {
    const exists = await prisma.character.findFirst({
      where: { name: c.name, campaignId },
    })
    if (exists) {
      console.log(`Character "${c.name}" already exists, skipping.`)
      continue
    }

    await prisma.character.create({
      data: {
        userId,
        campaignId,
        ...c,
      },
    })
    console.log(`Character "${c.name}" created.`)
  }

  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
