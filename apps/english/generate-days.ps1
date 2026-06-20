function Write-DayPage {
    param($Day, $Title, $Focus, $Date, $Week, $ReviewText, $Phrases, $Dialog, $Dictation, $ReadingTitle, $ReadingText, $ReadingRu, $Checks, $PrevDay, $NextDay, $HasReview=$true)

    $n = $Day.ToString("00")
    $readN = $n
    $dayFile = "day-$n.html"
    $readFile = "read-$n.html"

    $phrasesHtml = ""
    foreach ($p in $Phrases) {
        $phrasesHtml += "<div class=`"phrase`"><strong>$($p.en)</strong><span class=`"ru`">$($p.ru)</span></div>`n"
    }

    $checksHtml = ""
    foreach ($c in $Checks) {
        $checksHtml += "<div class=`"checkbox-item`"><input type=`"checkbox`" id=`"sc$(++$script:ci)`"><label for=`"sc$($script:ci)`">$c</label></div>`n"
    }

    $rvHtml = ""
    if ($HasReview -and $ReviewText) {
        $rvHtml = @"
<h2>🔁 Повторение</h2>
<p style="color:#8b949e;font-size:0.9em;">$ReviewText</p>

"@
    }

    $dialogHtml = ""
    if ($Dialog) {
        $dialogHtml = @"
<h2>🗣️ Диалог для отработки</h2>
<p style="font-size:0.88em;color:#8b949e;">Прочитай вслух по ролям (ты — Customer). Потом перескажи от своего лица.</p>

<div class="dialog">
$Dialog
</div>

"@
    }

    $dictationHtml = ""
    if ($Dictation) {
        $items = ""
        foreach ($d in $Dictation) {
            $items += "<li>$d</li>`n"
        }
        $dictationHtml = @"
<h2>📝 Самодиктант</h2>
<p style="font-size:0.88em;color:#8b949e;">Скажи русскую фразу → пауза → скажи по-английски. Потом проверь себя.</p>
<ol>
$items</ol>

"@
    }

    $prevHtml = if ($PrevDay) { "<a href='$PrevDay'>← $PrevDay</a>" } else { "<span style='color:#484f58;'>← Day $n (первый)</span>" }
    $nextHtml = if ($NextDay) { "<a href='$NextDay'>$NextDay →</a>" } else { "<span style='color:#484f58;'>Day $n (последний) →</span>" }

    $readingHtml = ""
    if ($ReadingTitle -and $ReadingText) {
        $readingHtml = @"
<h2>Reading: $ReadingTitle</h2>
<div style="background:#161b22; border:1px solid #21262d; border-radius:8px; padding:12px 14px; margin:10px 0;">
  <p style="color:#c9d1d9;">$ReadingText</p>
  <hr style="border: none; border-top: 1px solid #21262d; margin: 8px 0;">
  <p style="color:#8b949e; font-size:0.9em;">$ReadingRu</p>
</div>

<p><a href="$readFile" style="color:#58a6ff;">📖 Полная страница для чтения →</a></p>

"@
    }

    $html = @"
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Day $n — $Title</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, system-ui, 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; line-height: 1.7; padding: 20px; max-width: 800px; margin: 0 auto; }
h1 { font-size: 1.5em; color: #58a6ff; }
h2 { font-size: 1.15em; color: #f0883e; margin: 24px 0 10px; border-bottom: 1px solid #21262d; padding-bottom: 6px; }
h3 { font-size: 1em; color: #e6edf3; margin: 16px 0 6px; }
p, li { color: #c9d1d9; font-size: 0.95em; }
ul, ol { padding-left: 20px; margin: 6px 0; }
li { margin: 3px 0; }
.back { color: #8b949e; text-decoration: none; font-size: 0.85em; display: inline-block; margin-bottom: 12px; }
.back:hover { color: #58a6ff; }
.phrase { background: #161b22; border: 1px solid #21262d; border-radius: 8px; padding: 10px 14px; margin: 8px 0; }
.phrase strong { color: #58a6ff; font-size: 1.02em; }
.phrase .ru { color: #8b949e; font-size: 0.85em; display: block; margin-top: 3px; }
.phrase .example { color: #3fb950; font-size: 0.85em; display: block; margin-top: 2px; }
.dialog { background: #161b22; border-left: 3px solid #58a6ff; border-radius: 0 8px 8px 0; padding: 12px 14px; margin: 10px 0; }
.dialog .speaker { color: #f0883e; font-weight: 600; }
.dialog .vendor { color: #d29922; font-weight: 600; }
.dialog .you { color: #58a6ff; font-weight: 600; }
.checkbox-item { display: flex; align-items: flex-start; gap: 10px; margin: 8px 0; }
.checkbox-item input { margin-top: 4px; accent-color: #3fb950; width: 18px; min-width: 18px; height: 18px; }
.checkbox-item label { font-size: 0.92em; color: #c9d1d9; }
.prompt-box { background: #0d1117; border: 1px solid #21262d; border-left: 3px solid #d29922; border-radius: 0 8px 8px 0; padding: 10px 14px; margin: 8px 0; font-size: 0.88em; color: #f0c674; white-space: pre-wrap; }
.tag { display: inline-block; padding: 0 8px; border-radius: 10px; font-size: 0.7em; font-weight: 600; margin: 0 4px 4px 0; }
.tag-blue { background: #1f6feb33; color: #58a6ff; }
.tag-green { background: #23863633; color: #3fb950; }
.tag-orange { background: #d2992233; color: #d29922; }
nav { margin-top: 30px; padding-top: 16px; border-top: 1px solid #21262d; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 0.85em; }
nav a { color: #8b949e; text-decoration: none; }
nav a:hover { color: #58a6ff; }
</style>
</head>
<body>

<a class="back" href="../index.html">← На главную</a>
<h1>Day $n · $Title</h1>
<p style="color:#8b949e;font-size:0.9em;">$Date · $Week · Новый материал</p>

<div style="background:#1c2128;border-radius:8px;padding:10px 14px;margin:12px 0;font-size:0.88em;">
  <strong>🎯 Фокус дня:</strong> $Focus
</div>

$rvHtml
<h2>📘 Новые фразы — $Title</h2>

$phrasesHtml
<h2>🎭 AI-практика</h2>
<p style="font-size:0.88em;color:#8b949e;">Запусти ChatGPT Voice Mode и вставь этот промпт (см. <a href="../common/ai-scenarios.html" style="color:#58a6ff;">AI-сценарии</a>):</p>

<div class="prompt-box">You are a SAP consultant / vendor representative. I am a customer (process automation manager) with intermediate English. Speak clearly. Topic: $Title. Context: $Focus. Follow my lead in the conversation.</div>

$dialogHtml
$dictationHtml
$readingHtml
<h2>✅ Self-check</h2>
$checksHtml
<script>
(function() {
  var saved = localStorage.getItem('eng-day$n');
  if (saved) {
    var arr = JSON.parse(saved);
    document.querySelectorAll('.checkbox-item input').forEach(function(c, i) {
      if (arr[i]) c.checked = true;
    });
  }
  document.querySelectorAll('.checkbox-item input').forEach(function(c, i) {
    c.addEventListener('change', function() {
      var all = document.querySelectorAll('.checkbox-item input');
      var arr = Array.from(all).map(function(x) { return x.checked; });
      localStorage.setItem('eng-day$n', JSON.stringify(arr));
    });
  });
})();
</script>

<nav>
  $prevHtml
  <a href="../index.html">Главная</a>
  $nextHtml
</nav>

</body>
</html>
"@

    $path = "D:\YD\General\4_english\$week\day-$n.html"
    Set-Content -LiteralPath $path -Value $html -Encoding UTF8
    Write-Output "Created: $path"
}

$script:ci = 0

# === WEEK 1 ===
$w1 = "week-01"

# Day 01
Write-DayPage -Day 1 -Title "Opening a Meeting with Vendor" -Focus "Научиться уверенно открывать встречу с SAP-подрядчиком — приветствие, agenda, представление участников." -Date "Чт 18 июн 2026" -Week "Week 1 — Заказчик → Подрядчик" -ReviewText "Первый день — повторения нет. Вместо этого прочитай вслух цели курса на английском:
• 'I want to manage vendor meetings in English confidently.'
• 'My goal is to clearly explain requirements to SAP consultants.'
• 'I will practice every day for 15 days.'" -HasReview $true -Phrases @(
    @{en="Good morning / afternoon everyone. Thanks for joining the call."; ru="Доброе утро/день всем. Спасибо, что подключились к звонку."}
    @{en="Thank you for the proposal you sent. We've reviewed it internally."; ru="Спасибо за предложение, которое вы отправили. Мы его внутренне рассмотрели."}
    @{en="Let's start with the agenda. First topic is a new requirement from the regulator."; ru="Давайте начнём с повестки. Первая тема — новое требование от регулятора."}
    @{en="We have participants from both our compliance team and your SAP team today."; ru="Сегодня у нас участники от нашей команды комплаенс и вашей SAP-команды."}
    @{en="Has everyone received the updated requirements document I sent earlier?"; ru="Все получили обновлённый документ с требованиями, который я отправил?"}
    @{en="Could you briefly introduce your team members?"; ru="Можете кратко представить участников вашей команды?"}
    @{en="The main goal of this meeting is to discuss the new regulatory change."; ru="Основная цель этой встречи — обсудить новое изменение регулятора."}
    @{en="I'll keep the meeting to 45 minutes to respect everyone's time."; ru="Я уложу встречу в 45 минут, чтобы уважать время всех."}
    @{en="Feel free to stop me if you have questions at any point."; ru="Не стесняйтесь останавливать меня, если есть вопросы."}
    @{en="Let me share my screen to walk through the requirements."; ru="Позвольте мне показать экран, чтобы пройтись по требованиям."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning everyone, thanks for joining the call. Let's start with the agenda. First topic is the new Chestny Znak requirement for dairy products. Second, the impact on the current SAP interface. John, has your team received the document I sent on Friday?<br><br>

<span class="vendor">SAP PM (John):</span> Yes, we received it. Our team has reviewed the high-level requirements. We have some clarifying questions.<br><br>

<span class="you">Customer:</span> Good. Let's go through the requirements first, then we can discuss your questions. Sarah, you're from our compliance team — could you explain the regulatory background?<br><br>

<span class="speaker">Compliance (Sarah):</span> Sure. The CRPT has mandated that all dairy products must have DataMatrix codes by December 1st. This affects our entire product range...<br><br>

<span class="you">Customer:</span> Thank you, Sarah. So the key point is the December deadline. John, from your side — is this timeline realistic for the SAP implementation?<br><br>

<span class="vendor">John:</span> We'll need to assess the full scope, but based on initial review, December is challenging. We would need to start the development by August.<br><br>

<span class="you">Customer:</span> Understood. Let's discuss the timeline in detail. First, can you give us a quick update on the current SAP-MES interface status?
'@ -Dictation @(
    "Доброе утро всем, спасибо, что подключились к звонку.",
    "Давайте начнём с повестки. Первая тема — новое требование регулятора.",
    "Спасибо за предложение, которое вы отправили. Мы его рассмотрели.",
    "Основная цель этой встречи — обсудить изменение в законодательстве.",
    "Позвольте мне показать экран, чтобы пройтись по требованиям."
) -ReadingTitle "Kickoff Meetings with SAP Vendors" -ReadingText "A kickoff meeting with a new SAP vendor sets the foundation for the entire project. As a customer, your role is to clearly communicate the business requirements, regulatory deadlines, and expectations. Start by introducing all participants from both sides. State the agenda upfront — what topics will be covered and in what order. Share any relevant documents you sent beforehand. Give the vendor a chance to ask clarifying questions early. A good kickoff prevents misunderstandings later. The most important rule: do not assume the vendor knows your internal processes. Explain your compliance requirements, decision-making流程, and key stakeholders. Agree on the communication cadence — weekly calls, email updates, and escalation path. End the kickoff with clear next steps and owners." -ReadingRu "Кик-офф встреча с новым SAP-подрядчиком закладывает основу всего проекта. Как заказчик, ваша роль — чётко сообщить бизнес-требования, регуляторные дедлайны и ожидания. Начните с представления участников с обеих сторон. Объявите повестку заранее. Дайте подрядчику возможность задать уточняющие вопросы в начале. Хороший кик-офф предотвращает недопонимание в будущем. Главное правило: не предполагайте, что подрядчик знает ваши внутренние процессы. Объясните требования комплаенс, процесс принятия решений и ключевых стейкхолдеров. Согласуйте ритм коммуникации." -Checks @(
    "Я могу уверенно открыть встречу с подрядчиком и объявить повестку",
    "Я могу представить участников со своей стороны и попросить представить их команду",
    "Я выучил 10 фраз для открытия встречи с SAP-вендором"
)

# Day 02
Write-DayPage -Day 2 -Title "Assigning Tasks to Vendor" -Focus "Научиться ставить задачи SAP-подрядчику — формулировать требования, запрашивать оценку, обсуждать сроки." -Date "Пт 19 июн 2026" -Week "Week 1 — Заказчик → Подрядчик" -ReviewText "Повторение D01: Открой воображаемую встречу с подрядчиком. Скажи вслух приветствие, agenda с двумя темами, представь участников." -HasReview $true -Phrases @(
    @{en="We have a new business requirement from the regulator."; ru="У нас новое бизнес-требование от регулятора."}
    @{en="Could you assess the impact on the current system and give us an estimate?"; ru="Можете оценить влияние на текущую систему и дать оценку?"}
    @{en="We need a solution for Chestny Znak. Please prepare a proposal."; ru="Нам нужно решение для Честного Знака. Подготовьте, пожалуйста, предложение."}
    @{en="What is the timeline if we want to go live by the regulatory deadline?"; ru="Какие сроки, если мы хотим запуститься к дедлайну регулятора?"}
    @{en="Please provide a rough cost estimate for this change."; ru="Пожалуйста, предоставьте примерную оценку стоимости этого изменения."}
    @{en="Which SAP modules will be affected by this requirement?"; ru="Какие модули SAP будут затронуты этим требованием?"}
    @{en="Do you need any additional information from our side to proceed?"; ru="Вам нужна какая-то дополнительная информация с нашей стороны для продолжения?"}
    @{en="We would like a proposal in two parts: technical solution and project plan."; ru="Мы хотели бы предложение из двух частей: техническое решение и план проекта."}
    @{en="Is this feasible within the current project scope, or is it a change request?"; ru="Это выполнимо в рамках текущего проекта или это change request?"}
    @{en="Please confirm receipt of this requirement and the deadline for the proposal."; ru="Пожалуйста, подтвердите получение этого требования и срок для предложения."}
) -Dialog @'
<span class="you">You (Customer):</span> John, we have a new requirement from the regulator. The CRPT has changed the DataMatrix format for dairy products. We need your team to assess the impact on our SAP system.<br><br>

<span class="vendor">SAP PM (John):</span> Understood. Could you share the official document from the CRPT with us?<br><br>

<span class="you">Customer:</span> Yes, I'll send it after the call. But the key change is that the GTIN format is being extended from 14 to 16 digits. This affects the IDoc structure and the label printing.<br><br>

<span class="vendor">John:</span> That sounds like it will impact both the SAP side and the MES interface. We'll need to involve the MES team as well.<br><br>

<span class="you">Customer:</span> Agreed. Please provide a proposal covering: technical impact assessment, implementation timeline, and cost estimate. We need to go live by October 1st to meet the regulatory deadline. Is that feasible?<br><br>

<span class="vendor">John:</span> October 1st is tight, but we can prepare an initial assessment by next Friday and a full proposal two weeks after that.<br><br>

<span class="you">Customer:</span> That works. Please also note which SAP modules will be affected — we need to inform the other departments. And let us know if you need any input from our compliance or production teams.
'@ -Dictation @(
    "У нас новое требование от регулятора. Нам нужно ваше предложение.",
    "Можете оценить влияние на текущую систему и дать оценку сроков?",
    "Какой модуль SAP будет затронут этим изменением?",
    "Пожалуйста, подготовьте предложение из двух частей.",
    "Подтвердите получение этого требования и срок для предложения."
) -ReadingTitle "How to Write a Clear Requirement" -ReadingText "Writing a clear business requirement is the most important skill when working with an SAP vendor. A vague requirement leads to wrong solutions, delays, and budget overruns. Use the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound. Instead of 'we need Chestny Znak,' write 'we need to print DataMatrix codes on dairy product labels using a SATO printer, with real-time verification, by December 1st.' Include the regulatory document reference. State what systems are affected. Specify any constraints like budget, timeline, or integration with existing processes. Good requirements save everyone time and money." -ReadingRu "Написание чёткого бизнес-требования — самый важный навык при работе с SAP-подрядчиком. Размытое требование ведёт к неправильным решениям, задержкам и перерасходу бюджета. Используйте SMART-подход: Конкретное, Измеримое, Достижимое, Релевантное, Ограниченное по времени. Вместо 'нам нужен Честный Знак' напишите 'нам нужно печатать коды DataMatrix на этикетках молочной продукции через принтер SATO с верификацией в реальном времени до 1 декабря.' Укажите ссылку на документ регулятора. Хорошие требования экономят время и деньги всем." -Checks @(
    "Я могу сформулировать новое требование и запросить предложение у подрядчика",
    "Я умею обсуждать сроки и спрашивать о выполнимости",
    "Я помню фразы с D01 и могу открыть встречу без подсказки"
)

# Day 03
Write-DayPage -Day 3 -Title "Change Request Due to Regulation" -Focus "Научиться сообщать подрядчику об изменениях от госорганов и инициировать Change Request." -Date "Пн 22 июн 2026" -Week "Week 1 — Заказчик → Подрядчик" -ReviewText "Повторение D02: Представь, что подрядчик на встрече. Скажи вслух: 'We have a new requirement...' — объясни требование и запроси оценку." -HasReview $true -Phrases @(
    @{en="The regulator has updated the requirements. We need to change the scope."; ru="Регулятор обновил требования. Нам нужно изменить объём работ."}
    @{en="This is a new requirement from the government. We must implement it by [date]."; ru="Это новое требование от государства. Мы должны внедрить его до [даты]."}
    @{en="How will this change affect the timeline and budget?"; ru="Как это изменение повлияет на сроки и бюджет?"}
    @{en="Please provide a revised proposal with the new scope."; ru="Пожалуйста, предоставьте пересмотренное предложение с новым объёмом."}
    @{en="We need to submit a formal Change Request to update the contract."; ru="Нам нужно подать формальный Change Request для обновления контракта."}
    @{en="Is this change within the current project budget, or do we need additional approval?"; ru="Это изменение в рамках текущего бюджета проекта или нужно дополнительное согласование?"}
    @{en="The deadline from the regulator is firm. There is no extension possible."; ru="Дедлайн от регулятора жёсткий. Продление невозможно."}
    @{en="We need a workaround in the short term while the permanent fix is being developed."; ru="Нам нужно временное решение на короткий срок, пока разрабатывается постоянное."}
    @{en="Can we phase this implementation — MVP by the deadline, full solution later?"; ru="Можем ли мы внедрять поэтапно — MVP к дедлайну, полное решение позже?"}
    @{en="This change is critical for compliance. We cannot miss the deadline."; ru="Это изменение критично для соответствия требованиям. Мы не можем пропустить дедлайн."}
) -Dialog @'
<span class="you">You (Customer):</span> John, I have some difficult news. The CRPT has issued a new regulation that changes the marking requirements for dairy. We need to modify our current project scope.<br><br>

<span class="vendor">SAP PM (John):</span> I see. Can you share the details of what changed?<br><br>

<span class="you">Customer:</span> Yes. Previously we only needed a DataMatrix code on the outer packaging. Now every individual item must be marked. This is a significant change to the production line logic and the SAP-MES interface.<br><br>

<span class="vendor">John:</span> That is a substantial change. This will definitely affect the timeline and budget. We need to submit a formal Change Request.<br><br>

<span class="you">Customer:</span> I understand. Please prepare a revised proposal with the new scope. The regulatory deadline is still December 1st — we cannot miss it. Can we phase the implementation? Maybe MVP for the main product line by December, full rollout later?<br><br>

<span class="vendor">John:</span> That's a good approach. Let me discuss with our technical team and come back with options. We'll have a revised proposal by next Friday.<br><br>

<span class="you">Customer:</span> Thank you. Please also indicate what needs additional budget approval from our side. We'll need to involve our finance team.
'@ -Dictation @(
    "Регулятор обновил требования. Нам нужно изменить объём работ.",
    "Как это изменение повлияет на сроки и бюджет?",
    "Пожалуйста, предоставьте пересмотренное предложение.",
    "Нам нужно временное решение, пока готовится постоянное.",
    "Это изменение критично — дедлайн регулятора жёсткий."
) -ReadingTitle "Government Regulations and SAP" -ReadingText "Government regulations change frequently, and SAP systems must adapt. In Russia, the main regulatory systems affecting manufacturing are Chestny Znak (tracking via DataMatrix codes) and Mercury (veterinary certificates for animal products). Both systems regularly update their formats and requirements. As a customer, you are responsible for monitoring these changes and communicating them to your SAP vendor. When a regulation changes, act fast: read the official document, identify the impact on your systems, estimate the implementation effort, and inform the vendor. The vendor then assesses technical impact and provides a solution. Keeping a regulatory compliance calendar with all deadlines is essential for any manufacturing IT manager." -ReadingRu "Правительственные регуляции меняются часто, и системы SAP должны адаптироваться. В России основные регуляторные системы, влияющие на производство — Честный Знак и Меркурий. Обе регулярно обновляют форматы и требования. Как заказчик, вы отвечаете за мониторинг этих изменений и коммуникацию с SAP-подрядчиком. Когда регуляция меняется, действуйте быстро: прочитайте официальный документ, определите влияние на системы, оцените усилия по внедрению, сообщите подрядчику. Календарь регуляторных дедлайнов обязателен для любого IT-менеджера производства." -Checks @(
    "Я могу сообщить подрядчику об изменении регулятора и инициировать Change Request",
    "Я умею обсуждать поэтапное внедрение (MVP + later)",
    "Я могу чётко сказать, что дедлайн жёсткий и продление невозможно"
)

# Day 04
Write-DayPage -Day 4 -Title "Q&A and Clarifying with Vendor" -Focus "Научиться переспрашивать, уточнять и просить объяснить простыми словами, когда подрядчик говорит сложно или быстро." -Date "Вт 23 июн 2026" -Week "Week 1 — Заказчик → Подрядчик" -ReviewText "Повторение D03: Скажи вслух фразу 'The regulator has updated the requirements...' и продолжи своими словами, объясняя подрядчику ситуацию с изменением." -HasReview $true -Phrases @(
    @{en="Sorry, could you repeat that more slowly, please?"; ru="Извините, не могли бы повторить медленнее?"}
    @{en="I didn't catch the technical term. Could you spell it?"; ru="Я не уловил технический термин. Можете произнести по буквам?"}
    @{en="Could you explain that in simpler terms for me?"; ru="Можете объяснить это проще для меня?"}
    @{en="Just to clarify, do you mean we need to change the IDoc structure?"; ru="Просто уточнить: вы имеете в виду, что нужно изменить структуру IDoc?"}
    @{en="Let me rephrase to check my understanding: you're saying that…"; ru="Позвольте перефразировать, чтобы проверить: вы говорите, что…"}
    @{en="What does this term mean — [term]?"; ru="Что означает этот термин — [термин]?"}
    @{en="Could you give me a concrete example?"; ru="Можете привести конкретный пример?"}
    @{en="So in simple words, this change affects the label printing process?"; ru="То есть простыми словами, это изменение влияет на процесс печати этикеток?"}
    @{en="Sorry, I'm not familiar with that SAP transaction. What is it used for?"; ru="Извините, я не знаком с этой SAP-транзакцией. Для чего она используется?"}
    @{en="Could you draw a simple diagram or share an example file?"; ru="Можете нарисовать простую схему или отправить пример файла?"}
) -Dialog @'
<span class="vendor">SAP Consultant:</span> So the issue is that the RFC destination for the IDoc interface is pointing to the wrong partner profile, which means the message type is not being processed correctly in the outbound queue.<br><br>

<span class="you">You (Customer):</span> Sorry, could you repeat that more slowly, please? I didn't catch the technical details.<br><br>

<span class="vendor">Consultant:</span> Of course. The connection between SAP and MES is configured incorrectly. The system is trying to send the data to the wrong destination.<br><br>

<span class="you">Customer:</span> Thank you. Let me rephrase to check my understanding: the data from SAP is not reaching MES because of a configuration issue. Is that correct?<br><br>

<span class="vendor">Consultant:</span> Exactly. We need to update the RFC destination in the partner profile. It's a quick fix.<br><br>

<span class="you">Customer:</span> Good. And what is an RFC destination? Could you explain in simple terms?<br><br>

<span class="vendor">Consultant:</span> Think of it as an address book entry. SAP needs to know the exact address of the MES system. Currently it has the wrong address.<br><br>

<span class="you">Customer:</span> Now I understand. Thank you for explaining. How long will the fix take?
'@ -Dictation @(
    "Извините, не могли бы повторить медленнее?",
    "Просто уточнить: нужно изменить структуру IDoc?",
    "Можете объяснить это проще для меня?",
    "Позвольте перефразировать, чтобы проверить моё понимание.",
    "Что означает этот термин — RFC destination?"
) -ReadingTitle "Asking Clarifying Questions" -ReadingText "Asking good clarifying questions is essential when working with native-speaking SAP consultants. Do not pretend to understand. Always ask. Good phrases include: 'Could you explain that in simpler terms?' and 'Let me rephrase to check my understanding.' Paraphrasing what the vendor said helps confirm alignment and shows you are engaged. If they speak too fast, say 'Could you repeat that more slowly, please?' — this is completely normal and professionals respect it. Technical terms like RFC, IDoc, BAPI, partner profile can be confusing. Ask the vendor to explain each term. Taking notes during the call helps you track what was said. After the call, review your notes and send a summary to confirm understanding." -ReadingRu "Умение задавать хорошие уточняющие вопросы необходимо при работе с носителями языка — SAP-консультантами. Не притворяйтесь, что понимаете. Всегда спрашивайте. Хорошие фразы: 'Можете объяснить проще?' и 'Позвольте перефразировать'. Перефразирование помогает подтвердить взаимопонимание. Если говорят слишком быстро, скажите 'Повторите медленнее, пожалуйста' — это нормально, профессионалы уважают это. Технические термины вроде RFC, IDoc, BAPI, partner profile могут сбивать с толку. Просите объяснить каждый термин." -Checks @(
    "Я могу попросить подрядчика говорить медленнее или проще",
    "Я умею перефразировать сказанное для проверки понимания",
    "Я могу попросить объяснить незнакомый технический термин"
)

# Day 05
Write-DayPage -Day 5 -Title "Closing Meeting with Vendor" -Focus "Научиться закрывать встречу с подрядчиком — резюмировать решения, назначать задачи, фиксировать дедлайны." -Date "Ср 24 июн 2026" -Week "Week 1 — Заказчик → Подрядчик" -ReviewText "Повторение D04: Представь, что подрядчик только что сказал сложную техническую фразу. Ответь: 'Sorry, could you repeat that more slowly?' — и перефразируй." -HasReview $true -Phrases @(
    @{en="Let me summarize what we've agreed so far."; ru="Позвольте резюмировать, о чём мы договорились."}
    @{en="Action items: your team will deliver [X] by [date], we will provide [Y] by [date]."; ru="Задачи: ваша команда предоставит [X] к [дате], мы предоставим [Y] к [дате]."}
    @{en="To confirm the next steps: we will finalize the requirements, your team will start the analysis."; ru="Подтверждаю следующие шаги: мы финализируем требования, ваша команда начнёт анализ."}
    @{en="Let's reconvene on [date] to review the proposal."; ru="Давайте встретимся [дата] для рассмотрения предложения."}
    @{en="I'll send the meeting minutes within the hour."; ru="Я отправлю протокол встречи в течение часа."}
    @{en="Please confirm that I have captured everything correctly."; ru="Пожалуйста, подтвердите, что я всё правильно записал."}
    @{en="If there are no further questions — thank you everyone for your time."; ru="Если вопросов нет — спасибо всем за уделённое время."}
    @{en="I'll share the updated requirements document after this call."; ru="Я отправлю обновлённый документ с требованиями после звонка."}
    @{en="The deadline for the proposal is [date]. Please let us know if you need an extension."; ru="Дедлайн для предложения — [дата]. Сообщите, если нужно продление."}
    @{en="Action items and deadlines — I'll send the minutes."; ru="Задачи и сроки — я отправлю протокол."}
) -Dialog @'
<span class="you">You (Customer):</span> Good. I think we've covered everything. Let me summarize what we've agreed so far.<br><br>

<span class="you">Customer:</span> First, your team will assess the impact of the new DataMatrix format on our SAP system and provide a proposal by Friday, June 26th.<br><br>

<span class="vendor">John:</span> Correct. We'll include the timeline and cost estimate.<br><br>

<span class="you">Customer:</span> Second, we will send you the official CRPT document and the updated requirements spec by tomorrow.<br><br>

<span class="vendor">John:</span> That works. Please also include the contact details of your compliance team.<br><br>

<span class="you">Customer:</span> Will do. Third, let's reconvene next Tuesday at 10:00 AM to review the proposal.<br><br>

<span class="vendor">John:</span> Tuesday works for us.<br><br>

<span class="you">Customer:</span> Action items and deadlines — I'll send the minutes within the hour. If there are no further questions — thank you everyone for your time. Speak to you next week.<br><br>

<span class="vendor">John:</span> Thank you. Have a good day.
'@ -Dictation @(
    "Позвольте резюмировать, о чём мы договорились.",
    "Задачи: ваша команда предоставит предложение к пятнице.",
    "Давайте встретимся во вторник для рассмотрения предложения.",
    "Я отправлю протокол встречи в течение часа.",
    "Если вопросов нет — спасибо всем за время."
) -ReadingTitle "Closing a Vendor Meeting" -ReadingText "A strong closing is crucial in customer-vendor meetings. It ensures both sides leave with the same understanding of what was decided and what happens next. Structure your closing: 1) Thank everyone for their time. 2) Summarize key decisions made. 3) List action items with clear owners: what the vendor will deliver and by when, and what you (the customer) will provide. 4) Set the next meeting date. 5) Confirm you will send minutes. Do not assume the vendor remembers everything — write it down and send it within an hour. The meeting minutes serve as a legal record of agreements, especially important when dealing with change requests and scope changes. A well-documented meeting prevents disputes later." -ReadingRu "Сильное закрытие критически важно на встречах заказчика с подрядчиком. Оно гарантирует, что обе стороны уходят с одинаковым пониманием решений и следующих шагов. Структура закрытия: 1) Поблагодарите всех. 2) Резюмируйте ключевые решения. 3) Перечислите задачи с чёткими исполнителями: что предоставит подрядчик и когда, что предоставите вы. 4) Назначьте следующую встречу. 5) Подтвердите отправку протокола. Протокол встречи — юридическая запись договорённостей, особенно важная при change request и изменении объёма." -Checks @(
    "Я могу уверенно закрыть встречу с резюме и задачами для подрядчика",
    "Я могу назначить дедлайны и следующую встречу",
    "Я готов к Week 2 — помню основную базу D01–D05"
)

Write-Output "Week 1 done. Proceeding to Week 2..."

# === WEEK 2 ===
$w2 = "week-02"

# Day 06
Write-DayPage -Day 6 -Title "Small Talk with Vendor" -Focus "Научиться делать small talk с SAP-подрядчиком перед началом деловой части." -Date "Чт 25 июн 2026" -Week "Week 2 — Soft Skills" -ReviewText "Повторение D05: Закрой воображаемую встречу. Скажи вслух: 'Let me summarize what we've agreed...' и перечисли 3 пункта." -HasReview $true -Phrases @(
    @{en="How's everyone doing today?"; ru="Как у всех дела сегодня?"}
    @{en="Did you have a good weekend?"; ru="Хорошо прошли выходные?"}
    @{en="How was your trip to [city]?"; ru="Как прошла ваша поездка в [город]?"}
    @{en="Is the time difference working okay for you?"; ru="Нормально переносите разницу во времени?"}
    @{en="It's been a busy week with the new regulatory deadline."; ru="Была напряжённая неделя с новым дедлайном регулятора."}
    @{en="Thanks for making the time for this call."; ru="Спасибо, что нашли время на этот звонок."}
    @{en="How is the weather on your side?"; ru="Какая у вас погода?"}
    @{en="Are you traveling anywhere this summer?"; ru="Путешествуете куда-нибудь этим летом?"}
    @{en="Did you try the new restaurant near the office?"; ru="Пробовали новый ресторан рядом с офисом?"}
    @{en="Well, let's get started with the business agenda."; ru="Что ж, давайте начнём с деловой повестки."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning, John. How are you today?<br><br>

<span class="vendor">John:</span> Good morning! I'm doing well, thanks. How about you?<br><br>

<span class="you">Customer:</span> Busy week — the new CRPT deadline is keeping us on our toes. Did you have a good weekend?<br><br>

<span class="vendor">John:</span> Yes, it was nice. We had some good weather finally. I went hiking with the family.<br><br>

<span class="you">Customer:</span> That sounds great. We had good weather too. Anyway, let's get started with the business agenda. First item is the Mercury interface update...
'@ -Dictation @(
    "Как у всех дела сегодня?",
    "Хорошо прошли выходные?",
    "Спасибо, что нашли время на этот звонок.",
    "Что ж, давайте начнём с деловой повестки.",
    "Напряжённая неделя с новым дедлайном регулятора."
) -ReadingTitle "Small Talk in International Business" -ReadingText "Small talk is an essential business skill when working with international SAP vendors. It builds rapport and trust before discussing business. Safe topics include weather, travel, weekend plans, local food, and sports. Avoid politics, religion, and personal finances. In cross-cultural communication, small talk signals respect and interest in the person beyond their professional role. For non-native speakers, small talk is excellent practice because the vocabulary is everyday and the stakes are low. Use these moments to build confidence. Start meetings one minute early for informal chat. This human connection makes difficult conversations easier later." -ReadingRu "Small talk — важный деловой навык при работе с международными SAP-подрядчиками. Он создаёт взаимопонимание и доверие перед обсуждением дел. Безопасные темы: погода, путешествия, планы на выходные, местная еда, спорт. Избегайте политики, религии и личных финансов. Для не-носителей языка small talk — отличная практика, так как лексика повседневная, а ставки низки. Начинайте встречи на минуту раньше для неформального общения." -Checks @(
    "Я могу поддержать small talk 2-3 минуты с подрядчиком",
    "Я умею плавно переходить от small talk к делу",
    "Я помню базу Week 1 (D01–D05)"
)

# Day 07
Write-DayPage -Day 7 -Title "Handling Complaints to Vendor" -Focus "Научиться выражать недовольство подрядчику конструктивно — срыв сроков, качество, проблемы." -Date "Пт 26 июн 2026" -Week "Week 2 — Soft Skills" -ReviewText "Повторение D06: Начни small talk с воображаемым подрядчиком: спроси про выходные, потом перейди к делу." -HasReview $true -Phrases @(
    @{en="I need to raise a concern about the current timeline."; ru="Мне нужно поднять вопрос о текущих сроках."}
    @{en="We are not satisfied with the quality of the delivered solution."; ru="Мы не удовлетворены качеством поставленного решения."}
    @{en="This delay is impacting our production. We need a recovery plan."; ru="Эта задержка влияет на наше производство. Нам нужен план восстановления."}
    @{en="The delivered solution does not meet the requirements we specified."; ru="Поставленное решение не соответствует требованиям, которые мы указали."}
    @{en="I understand there are challenges, but we agreed on this deadline."; ru="Я понимаю, есть сложности, но мы согласовали этот срок."}
    @{en="We need this fixed by [date]. What can you do to make that happen?"; ru="Нам нужно это исправить к [дате]. Что вы можете сделать для этого?"}
    @{en="Let's focus on finding a solution rather than discussing the cause."; ru="Давайте сфокусируемся на решении, а не на обсуждении причины."}
    @{en="This is not the first time we've had this issue. We need a permanent fix."; ru="Это не первый раз, когда у нас эта проблема. Нам нужно постоянное решение."}
    @{en="I appreciate your team's effort, but the result is not acceptable."; ru="Я ценю усилия вашей команды, но результат неприемлем."}
    @{en="Let's schedule a separate call to discuss the recovery plan in detail."; ru="Давайте назначим отдельный звонок для детального обсуждения плана восстановления."}
) -Dialog @'
<span class="you">You (Customer):</span> John, I need to raise a concern. The Mercury API update was supposed to be delivered last week, but we still haven't received it.<br><br>

<span class="vendor">John:</span> Yes, I apologize for the delay. We had some unexpected technical issues.<br><br>

<span class="you">Customer:</span> I understand there are challenges, but this delay is impacting our production reporting. We need a recovery plan from your side by end of week.<br><br>

<span class="vendor">John:</span> Understood. Let me discuss with the team and I'll have a revised timeline for you by Friday.<br><br>

<span class="you">Customer:</span> Thank you. Also, this is the second delay on this project. We need to understand what's causing these issues and how you will prevent them in the future.<br><br>

<span class="vendor">John:</span> You're right. I'll include a root cause analysis in the recovery plan.
'@ -Dictation @(
    "Мне нужно поднять вопрос о текущих сроках.",
    "Эта задержка влияет на наше производство.",
    "Нам нужен план восстановления с вашей стороны.",
    "Я понимаю, есть сложности, но мы согласовали этот срок.",
    "Давайте сфокусируемся на решении."
) -ReadingTitle "Giving Constructive Feedback to Vendors" -ReadingText "Giving negative feedback to a vendor is uncomfortable but necessary. The key is to be specific, objective, and solution-oriented. Describe the problem using facts: 'The delivery was 5 days late' not 'You're always late.' Explain the business impact. State your expectation clearly: 'We need a recovery plan by Friday.' Listen to their explanation — there may be legitimate issues. Then agree on concrete next steps. Follow up in writing after the call. A professional complaint that is handled well can strengthen the customer-vendor relationship. Document all delays and quality issues — they may be needed for contract reviews or penalties." -ReadingRu "Давать негативную обратную связь подрядчику неприятно, но необходимо. Ключ — быть конкретным, объективным и ориентированным на решение. Описывайте проблему фактами: 'Поставка была на 5 дней позже', а не 'Вы всегда опаздываете'. Объясните бизнес-влияние. Чётко сформулируйте ожидание. Выслушайте их объяснение. Документируйте все задержки — они могут понадобиться при пересмотре контракта." -Checks @(
    "Я могу конструктивно выразить недовольство подрядчику",
    "Я умею требовать план восстановления при срыве сроков",
    "Я могу отделить эмоции от фактов и говорить по делу"
)

# Day 08
Write-DayPage -Day 8 -Title "Scope Disputes with Vendor" -Focus "Научиться обсуждать спорные вопросы с подрядчиком — scope, change order, компромиссы." -Date "Пн 29 июн 2026" -Week "Week 2 — Soft Skills" -ReviewText "Повторение D07: Представь, что подрядчик сорвал срок. Скажи вслух: 'I need to raise a concern...' и объясни ситуацию." -HasReview $true -Phrases @(
    @{en="We believe this is within the current project scope based on our agreement."; ru="Мы считаем, что это в рамках текущего объёма работ согласно нашему соглашению."}
    @{en="I understand your position, but from our side the requirement was clear from the start."; ru="Я понимаю вашу позицию, но с нашей стороны требование было чётким с самого начала."}
    @{en="Let's review the contract together to clarify what was included."; ru="Давайте вместе посмотрим контракт, чтобы прояснить, что было включено."}
    @{en="We are open to discussing a change order if this is truly out of scope."; ru="Мы готовы обсудить change order, если это действительно выходит за рамки."}
    @{en="Can we find a compromise that works for both sides?"; ru="Можем найти компромисс, который устроит обе стороны?"}
    @{en="Let's separate this discussion from the main project and handle it as a separate workstream."; ru="Давайте отделим это обсуждение от основного проекта и обработаем как отдельный поток."}
    @{en="We agreed on this scope in the contract. We expect delivery as promised."; ru="Мы согласовали этот объём в контракте. Мы ожидаем поставки как обещано."}
    @{en="If this is a change, please provide a cost and timeline impact."; ru="Если это изменение, предоставьте влияние на стоимость и сроки."}
    @{en="Let's take this offline and review the contract terms before the next call."; ru="Давайте обсудим это отдельно и пересмотрим условия контракта до следующего звонка."}
    @{en="I propose we move forward with option A and discuss the additional scope separately."; ru="Предлагаю двигаться с вариантом А, а дополнительный объём обсудить отдельно."}
) -Dialog @'
<span class="vendor">John:</span> Regarding the DataMatrix format update — this is actually out of scope. The original contract only covered EAN-13 barcodes, not DataMatrix.<br><br>

<span class="you">You (Customer):</span> I understand your position, but from our side, the requirement for government traceability was discussed during the contract negotiation. Let's review the contract together.<br><br>

<span class="vendor">John:</span> I've checked with my team — the current scope does not include CRPT integration. This would require a change order.<br><br>

<span class="you">Customer:</span> Okay, if this is truly out of scope, please provide a cost and timeline impact for the change order. But I also want to review the original requirements document we signed — I believe traceability was mentioned.<br><br>

<span class="vendor">John:</span> Fair enough. Let's take this offline — I'll send you the relevant section of the contract, and you can share the requirements document. Then we can discuss on the next call.<br><br>

<span class="you">Customer:</span> Agreed. In the meantime, can we start the analysis phase while we clarify the scope? I don't want to lose time.
'@ -Dictation @(
    "Мы считаем, что это в рамках текущего объёма работ.",
    "Давайте вместе посмотрим контракт, чтобы прояснить.",
    "Если это изменение, предоставьте влияние на стоимость и сроки.",
    "Можем найти компромисс, который устроит обе стороны?",
    "Давайте обсудим это отдельно и вернёмся на следующем звонке."
) -ReadingTitle "Managing Scope with Vendors" -ReadingText "Scope disputes are common in SAP implementation projects. As a customer, your best defense is a clear, written scope of work signed by both parties. When a vendor claims something is 'out of scope,' first review the contract together. Ask specific questions: 'Which section of the contract excludes this?' If it is truly out of scope, evaluate the change request: is it essential for compliance? Can it wait? What is the cost and timeline impact? Sometimes it's worth paying extra to keep the project moving. Other times you need to push back. The goal is not to win an argument but to find a solution that meets the business need while respecting both parties' positions. Document every scope discussion in writing." -ReadingRu "Споры об объёме работ — обычное дело в SAP-проектах. Как заказчик, ваша лучшая защита — чёткое, письменное описание объёма, подписанное обеими сторонами. Когда подрядчик говорит, что что-то 'не входит в scope', сначала вместе пересмотрите контракт. Если это действительно выходит за рамки, оцените change request: это критично для комплаенса? Может подождать? Какова стоимость и сроки? Иногда стоит доплатить, чтобы проект двигался. Документируйте все обсуждения scope письменно." -Checks @(
    "Я могу обсудить спор об объёме работ с подрядчиком",
    "Я умею предлагать компромиссные решения",
    "Я знаю, как инициировать change order при необходимости"
)

# Day 09
Write-DayPage -Day 9 -Title "Summarizing Vendor Discussions" -Focus "Научиться структурировать хаотичное обсуждение с подрядчиком и подводить итоги." -Date "Вт 30 июн 2026" -Week "Week 2 — Soft Skills" -ReviewText "Повторение D08: Скажи вслух фразу 'We believe this is within the current project scope...' — отрепетируй спор с подрядчиком." -HasReview $true -Phrases @(
    @{en="Let me stop you there and summarize what we've discussed so far."; ru="Позвольте остановить вас и резюмировать, что мы обсудили."}
    @{en="So if I understand correctly, there are three key points: first..., second..., third..."; ru="Если я правильно понимаю, есть три ключевых момента: во-первых..., во-вторых..., в-третьих..."}
    @{en="Let's structure this discussion topic by topic."; ru="Давайте структурировать это обсуждение по темам."}
    @{en="We seem to be mixing two different issues. Let's handle them separately."; ru="Мы смешиваем два разных вопроса. Давайте обработаем их отдельно."}
    @{en="Let me recap the decisions we've made on this topic."; ru="Позвольте повторить решения, которые мы приняли по этой теме."}
    @{en="Before we move to the next topic, let me confirm what we agreed."; ru="Прежде чем перейти к следующей теме, подтвердите, о чём мы договорились."}
    @{en="So the action items from this discussion are: [vendor] will..., [customer] will..."; ru="Итак, задачи из этого обсуждения: [подрядчик]..., [заказчик]..."}
    @{en="Let's park this topic for now and come back to it after we have more data."; ru="Давайте отложим эту тему и вернёмся, когда будут данные."}
    @{en="To keep the meeting on track, let's focus on the decision items only."; ru="Чтобы не сбиваться, давайте фокусироваться только на вопросах для принятия решений."}
    @{en="I suggest we document this discussion and review it in writing."; ru="Предлагаю задокументировать это обсуждение и пересмотреть в письменном виде."}
) -Dialog @'
<span class="vendor">John (rambling):</span> ...and then the Mercury team said the format is changing, but we're not sure if it affects the IDoc, and also the CRPT might extend the deadline, but our team is busy with another project, and the budget is...<br><br>

<span class="you">You (Customer):</span> John, let me stop you there and summarize. I'm hearing three separate issues. First, the Mercury format change. Second, the CRPT deadline extension. Third, your team's resource constraints. Is that correct?<br><br>

<span class="vendor">John:</span> Yes, that's right. Sorry, I was jumping around.<br><br>

<span class="you">Customer:</span> No problem. Let's handle them one at a time. First topic — Mercury format change. What is the exact change and when does it take effect?<br><br>

<span class="vendor">John:</span> The VSD format is adding a new field for the batch number. It takes effect August 1st.<br><br>

<span class="you">Customer:</span> Good. So on Mercury: we need to update the interface before August 1st. Let's discuss the timeline. We'll come back to the other topics after.
'@ -Dictation @(
    "Позвольте остановить вас и резюмировать, что мы обсудили.",
    "Есть три ключевых момента: первый..., второй..., третий...",
    "Давайте обработаем эти вопросы по отдельности.",
    "Прежде чем перейти к следующей теме, подтвердите договорённости.",
    "Давайте отложим эту тему и вернёмся позже."
) -ReadingTitle "Structuring Meetings with Vendors" -ReadingText "Vendors often jump between topics, especially on technical calls. Your job as a customer is to keep the meeting structured and productive. Use phrases like 'Let me stop you there and summarize.' Break down complex discussions into separate topics. Handle them one at a time. Before moving to the next topic, confirm decisions and action items. Park topics that need more data. At the end, recap all decisions and next steps. This skill is especially important when English is not your first language — summarizing gives you control of the conversation and ensures you understood everything correctly." -ReadingRu "Подрядчики часто прыгают между темами, особенно на технических звонках. Ваша задача как заказчика — поддерживать структуру встречи. Используйте фразы вроде 'Позвольте остановить вас и резюмировать.' Разбивайте сложные обсуждения на отдельные темы. Обрабатывайте их по одной. Перед переходом к следующей теме подтверждайте решения и задачи. Это умение особенно важно, когда английский не ваш родной язык — резюмирование даёт вам контроль над разговором." -Checks @(
    "Я могу остановить хаотичное обсуждение и структурировать его",
    "Я умею обрабатывать темы по одной и фиксировать решения",
    "Я могу вести встречу с подрядчиком в организованном темпе"
)

# Day 10
Write-DayPage -Day 10 -Title "Follow-up with Vendor" -Focus "Научиться проводить follow-up созвон с подрядчиком — контроль задач, напоминание, корректировка сроков." -Date "Ср 1 июл 2026" -Week "Week 2 — Soft Skills" -ReviewText "Повторение D09: Представь, что подрядчик начал хаотично говорить. Останови его: 'Let me stop you there and summarize...' — перечисли 3 пункта." -HasReview $true -Phrases @(
    @{en="Let's review the action items from our last meeting."; ru="Давайте проверим задачи с прошлой встречи."}
    @{en="What is the status of the item assigned to your team?"; ru="Как статус задачи, назначенной вашей команде?"}
    @{en="The deadline for this was last Friday. Can you give us an update?"; ru="Дедлайн по этому был в прошлую пятницу. Можете дать обновление?"}
    @{en="We agreed that your team would deliver [X] by [date]. Has that been done?"; ru="Мы договорились, что ваша команда предоставит [X] к [дате]. Это сделано?"}
    @{en="I'm following up on the proposal we requested two weeks ago."; ru="Я напоминаю о предложении, которое мы запросили две недели назад."}
    @{en="Is there anything blocking your team from completing this?"; ru="Есть что-то, что блокирует вашу команду от завершения?"}
    @{en="We need to adjust the timeline based on the new regulatory date."; ru="Нам нужно скорректировать сроки на основе новой даты регулятора."}
    @{en="Let's update the action item list with new deadlines."; ru="Давайте обновим список задач с новыми сроками."}
    @{en="I'll send an updated action tracker after this call."; ru="Я отправлю обновлённый трекер задач после звонка."}
    @{en="If there are no blockers, let's confirm the current plan and move forward."; ru="Если блокеров нет, давайте подтвердим текущий план и двинемся дальше."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning. Let's review the action items from our last meeting. John, the first item was for your team to provide the impact assessment for the Chestny Znak update. What's the status?<br><br>

<span class="vendor">John:</span> We've completed the assessment. I'll send the document after this call.<br><br>

<span class="you">Customer:</span> Great, thank you. The second item — the IDoc specification for Mercury. Has that been started?<br><br>

<span class="vendor">John:</span> Unfortunately, not yet. Our technical lead was pulled onto an urgent issue for another client. We plan to start next week.<br><br>

<span class="you">Customer:</span> John, the deadline for this was last Friday. This delay affects our Mercury compliance timeline. Can we get a revised completion date?<br><br>

<span class="vendor">John:</span> I understand. Let me check with the team and I'll have an updated date by tomorrow.<br><br>

<span class="you">Customer:</span> Please do. Also, is there anything from our side that's blocking your team?<br><br>

<span class="vendor">John:</span> No, your inputs have been timely. We just need to allocate the resources.<br><br>

<span class="you">Customer:</span> Okay. Let's update the action items: new deadline for the IDoc spec is next Friday. I'll send the updated tracker after the call.
'@ -Dictation @(
    "Давайте проверим задачи с прошлой встречи.",
    "Как статус задачи, назначенной вашей команде?",
    "Дедлайн по этому был в прошлую пятницу.",
    "Есть что-то, что блокирует вашу команду?",
    "Я отправлю обновлённый трекер задач после звонка."
) -ReadingTitle "Follow-up Calls with Vendors" -ReadingText "Follow-up calls are where projects succeed or fail. A good follow-up call starts with reviewing action items from the last meeting. Go through each item one by one: is it done? If not, why not? What is the new deadline? During follow-up calls, listen carefully to excuses. If a vendor repeatedly misses deadlines, escalate. Document everything — missed deadlines, reasons, new commitments. This creates a paper trail. Also ask: 'Is there anything from our side blocking you?' Sometimes the delay is your fault — missing information, slow approvals. A good customer-vendor relationship is built on honest communication about both sides' performance." -ReadingRu "Follow-up звонки — где проекты либо успевают, либо проваливаются. Хороший follow-up начинается с проверки задач с прошлой встречи. Пройдите по каждой задаче: сделано? Если нет, то почему? Какой новый срок? Если подрядчик регулярно срывает дедлайны, эскалируйте. Документируйте всё. Также спрашивайте: 'Есть ли что-то с нашей стороны, что вас блокирует?' Иногда задержка — ваша вина." -Checks @(
    "Я могу провести follow-up созвон по задачам подрядчика",
    "Я умею мягко, но настойчиво напоминать о дедлайнах",
    "Я готов к Week 3 — полные встречи с подрядчиком"
)

Write-Output "Week 2 done. Proceeding to Week 3..."

# === WEEK 3 ===
$w3 = "week-03"

# Day 11
Write-DayPage -Day 11 -Title "Full Meeting: New SAP Requirement" -Focus "Провести полную встречу с подрядчиком: открытие → постановка задачи → обсуждение → резюме → задачи." -Date "Чт 2 июл 2026" -Week "Week 3 — Полные встречи" -ReviewText "Повторение D10: Открой follow-up звонок с подрядчиком. Спроси статус двух задач с прошлой встречи." -HasReview $true -Phrases @(
    @{en="We have a new requirement from the CRPT for dairy marking. We need your assessment."; ru="У нас новое требование от ЦРПТ по маркировке молочной продукции. Нам нужна ваша оценка."}
    @{en="Please provide a technical solution proposal and project plan."; ru="Пожалуйста, предоставьте предложение по техническому решению и план проекта."}
    @{en="What is the impact on the existing SAP-MES interface?"; ru="Какое влияние на существующий интерфейс SAP-MES?"}
    @{en="How many development days do you estimate for this change?"; ru="Сколько дней разработки вы оцениваете для этого изменения?"}
    @{en="We need a timeline that meets the December 1st regulatory deadline."; ru="Нам нужны сроки, которые соответствуют дедлайну регулятора 1 декабря."}
    @{en="Let's discuss the integration points with the current system."; ru="Давайте обсудим точки интеграции с текущей системой."}
    @{en="Please indicate which dependencies require input from our side."; ru="Пожалуйста, укажите, какие зависимости требуют информации с нашей стороны."}
    @{en="What are the risks and how can we mitigate them?"; ru="Какие риски и как мы можем их смягчить?"}
    @{en="Let me summarize: your team will deliver the proposal by Friday with timeline and cost."; ru="Позвольте резюмировать: ваша команда предоставит предложение к пятнице со сроками и стоимостью."}
    @{en="We will review internally and come back with feedback next week."; ru="Мы рассмотрим внутренне и вернёмся с обратной связью на следующей неделе."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning everyone. Thanks for joining. Let's start with the agenda. First topic — new CRPT requirement for dairy marking. Second — impact on the current SAP-MES interface. Third — timeline and resources. John, has your team reviewed the requirements document?<br><br>

<span class="vendor">John:</span> Yes, we have. Our initial assessment is that this will require changes in both SAP ECC and the MES interface.<br><br>

<span class="you">Customer:</span> Thank you. Could you elaborate on the technical impact? Which SAP modules are affected?<br><br>

<span class="vendor">John (Technical Lead):</span> Primarily SAP SD for the master data and SAP PP for the production orders. The MES interface will need a new IDoc type for the DataMatrix codes.<br><br>

<span class="you">Customer:</span> I see. How many development days do you estimate? And can we meet the December 1st deadline?<br><br>

<span class="vendor">John:</span> Rough estimate is 40 development days. December 1st is achievable if we start by August. We'll provide a detailed timeline in the proposal.<br><br>

<span class="you">Customer:</span> Good. Please also indicate what dependencies require input from our side — compliance, production data, etc. Let me summarize: your team will deliver the proposal by Friday with timeline, cost, and dependencies. We will review internally and come back with feedback next week. Action items and deadlines — I'll send the minutes.
'@ -Dictation @(
    "У нас новое требование от ЦРПТ. Нам нужна ваша оценка.",
    "Какое влияние на существующий интерфейс SAP-MES?",
    "Сколько дней разработки вы оцениваете?",
    "Нам нужны сроки, соответствующие дедлайну регулятора.",
    "Ваша команда предоставит предложение к пятнице."
) -ReadingTitle "Running a Full Customer-Vendor Meeting" -ReadingText "A full customer-vendor meeting follows a clear structure: opening, agenda, discussion, and closing. As the customer, you control the meeting. Start with a clear agenda. State each topic. After each topic, confirm understanding and decisions. Before moving to the next topic, summarize what was agreed. At the end, recap all decisions and action items. For non-native speakers, prepare key phrases before the call. Write down the agenda and the main points you want to make. Keep a template for meeting minutes ready. The more structured the meeting, the less language you need — structure does half the communication work for you." -ReadingRu "Полная встреча заказчика с подрядчиком следует чёткой структуре: открытие, повестка, обсуждение и закрытие. Как заказчик, вы управляете встречей. Начните с чёткой повестки. После каждой темы подтверждайте понимание и решения. В конце повторно перечислите все решения и задачи. Для не-носителей языка: подготовьте ключевые фразы до звонка. Чем структурированнее встреча, тем меньше языка нужно — структура делает половину работы за вас." -Checks @(
    "Я провёл полную встречу с подрядчиком: открытие, постановка, обсуждение, закрытие",
    "Я справился с неожиданными ответами AI",
    "Я зафиксировал 1-2 слабых места для улучшения"
)

# Day 12
Write-DayPage -Day 12 -Title "Full Meeting: Critical SAP Incident" -Focus "Провести экстренную встречу с подрядчиком по критическому инциденту — сбор информации, эскалация, план действий." -Date "Пт 3 июл 2026" -Week "Week 3 — Полные встречи" -ReviewText "Повторение D11: Открой встречу с повесткой из двух тем. Скажи вслух: 'Let's start with the agenda. First topic is...'" -HasReview $true -Phrases @(
    @{en="We have a critical incident. The SAP-MES interface is down."; ru="У нас критический инцидент. Интерфейс SAP-MES не работает."}
    @{en="When did this start and what is the impact on production?"; ru="Когда это началось и какое влияние на производство?"}
    @{en="What is the estimated time to fix (ETA)?"; ru="Какое примерное время исправления?"}
    @{en="Do we have a workaround while the fix is being developed?"; ru="У нас есть временное решение, пока разрабатывается исправление?"}
    @{en="We need to escalate this to your senior management."; ru="Нам нужно эскалировать это вашему руководству."}
    @{en="Who is the assigned resource working on this incident?"; ru="Кто назначенный ресурс, работающий над этим инцидентом?"}
    @{en="Please provide updates every 30 minutes until resolved."; ru="Пожалуйста, предоставляйте обновления каждые 30 минут до устранения."}
    @{en="After resolution, we need a root cause analysis report."; ru="После устранения нам нужен отчёт о корневых причинах."}
    @{en="What can we do on our side to support the resolution?"; ru="Что мы можем сделать с нашей стороны для поддержки устранения?"}
    @{en="This is a production-critical issue. We need priority support."; ru="Это проблема, критическая для производства. Нам нужна поддержка с высшим приоритетом."}
) -Dialog @'
<span class="vendor">Operator (urgent):</span> The SAP-MES interface is down! Production on line 3 has stopped. Orders are not reaching the shop floor.<br><br>

<span class="you">You (Customer):</span> Understood. Let me call John from SAP support. (dials) John, we have a critical incident. The SAP-MES interface is down — production stopped on line 3. When did this start?<br><br>

<span class="vendor">John:</span> I'm aware. Our team detected it 15 minutes ago. It looks like an IDoc processing issue. We're investigating.<br><br>

<span class="you">Customer:</span> What is the estimated time to fix?<br><br>

<span class="vendor">John:</span> We estimate 2-3 hours. We've assigned our senior technical lead.<br><br>

<span class="you">Customer:</span> That's too long for a production stop. Do we have a workaround? Can we process orders manually in the meantime?<br><br>

<span class="vendor">John:</span> Yes, we can activate manual order entry in SAP. It's slower but keeps production running. I'll enable it now.<br><br>

<span class="you">Customer:</span> Good. Please enable the workaround immediately. Provide updates every 30 minutes. After resolution, I need a root cause analysis report. We also need to escalate this to your delivery manager.
'@ -Dictation @(
    "У нас критический инцидент. Интерфейс SAP-MES не работает.",
    "Когда это началось и какое влияние на производство?",
    "Какое примерное время исправления?",
    "Нам нужно эскалировать это вашему руководству.",
    "После устранения нам нужен отчёт о корневых причинах."
) -ReadingTitle "Managing Critical Incidents with Vendors" -ReadingText "When a critical SAP incident occurs, every minute counts. As a customer, your role is to triage: understand the business impact, get an ETA from the vendor, decide on workarounds, and escalate if needed. Stay calm — your reaction sets the tone. Ask factual questions: what, when, impact, ETA, workaround. If the vendor's response is too slow, escalate to their management. After resolution, demand a root cause analysis. Track incidents over time. If the same issue happens repeatedly, it's a systemic problem that needs management attention, not just technical fixes." -ReadingRu "Когда происходит критический инцидент в SAP, каждая минута на счету. Как заказчик, ваша роль — провести триаж: понять бизнес-влияние, получить ETA от подрядчика, решить вопрос с временным решением, эскалировать при необходимости. Сохраняйте спокойствие. Задавайте фактические вопросы. Если подрядчик отвечает слишком медленно, эскалируйте руководству. После устранения требуйте анализ корневых причин. Отслеживайте инциденты — если проблема повторяется, это системная проблема." -Checks @(
    "Я справился с инцидентом и сохранил контроль над ситуацией",
    "Я собрал достаточно информации для эскалации",
    "Я назначил чёткие задачи подрядчику в стрессовой ситуации"
)

# Day 13
Write-DayPage -Day 13 -Title "Full Meeting: Two Regulatory Changes" -Focus "Провести встречу по двум регуляторным изменениям одновременно — Честный Знак и Меркурий." -Date "Пн 6 июл 2026" -Week "Week 3 — Полные встречи" -ReviewText "Повторение D12: Скажи вслух фразу для критического инцидента: 'We have a critical incident. The SAP-MES interface is down...'" -HasReview $true -Phrases @(
    @{en="We have two regulatory changes to discuss today: Chestny Znak and Mercury."; ru="У нас два регуляторных изменения для обсуждения: Честный Знак и Меркурий."}
    @{en="Let's start with the Chestny Znak topic first, then move to Mercury."; ru="Давайте начнём с темы Честного Знака, затем перейдём к Меркурию."}
    @{en="What are the cross-system dependencies between these two changes?"; ru="Какие кросс-системные зависимости между этими двумя изменениями?"}
    @{en="Can we implement both changes in parallel or do they need to be sequential?"; ru="Можем внедрить оба изменения параллельно или они должны быть последовательными?"}
    @{en="What is the combined impact on the project timeline and resources?"; ru="Какое совокупное влияние на сроки и ресурсы проекта?"}
    @{en="Let's discuss the Mercury VSD format change. How does this affect our interface?"; ru="Давайте обсудим изменение формата ВСД Меркурия. Как это влияет на наш интерфейс?"}
    @{en="The CRPT compliance date is December 1st. Mercury's date is August 1st."; ru="Дата комплаенса ЦРПТ — 1 декабря. Дата Меркурия — 1 августа."}
    @{en="So Mercury has higher priority due to the earlier deadline."; ru="Значит, у Меркурия выше приоритет из-за более раннего дедлайна."}
    @{en="Let's confirm the action items for each change separately."; ru="Давайте подтвердим задачи для каждого изменения отдельно."}
    @{en="I'll send a combined status document covering both projects."; ru="Я отправлю объединённый статусный документ по обоим проектам."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning. We have two regulatory changes to discuss today. First, the Chestny Znak DataMatrix update. Second, the Mercury VSD format change. Let's start with Chestny Znak. John, what's the status of the impact assessment?<br><br>

<span class="vendor">John:</span> We've completed the assessment. The main impact is on the label printing process and the SAP-MES IDoc for production orders. We estimate 30 development days.<br><br>

<span class="you">Customer:</span> Good. And what about Mercury? The new VSD format takes effect August 1st — that's sooner.<br><br>

<span class="vendor">John:</span> Mercury requires changes to the inbound IDoc processing. We estimate 15 development days. The August 1st deadline is achievable if we start immediately.<br><br>

<span class="you">Customer:</span> So Mercury has higher priority. Can we run both projects in parallel?<br><br>

<span class="vendor">John:</span> Partially. They share the same IDoc interface, so some testing needs to be sequential. But development can be parallel.<br><br>

<span class="you">Customer:</span> Understood. Let's prioritize Mercury for the August deadline. Chestny Znak can follow after. Let me confirm the action items: Mercury development starts this week. Chestny Znak proposal due next Friday. I'll send the combined status document after the call.
'@ -Dictation @(
    "У нас два регуляторных изменения: Честный Знак и Меркурий.",
    "Давайте начнём с Честного Знака, затем перейдём к Меркурию.",
    "Можем внедрить оба изменения параллельно?",
    "У Меркурия выше приоритет из-за более раннего дедлайна.",
    "Я отправлю объединённый статусный документ."
) -ReadingTitle "Managing Multiple Regulatory Changes" -ReadingText "As a process automation manager, you often need to handle multiple regulatory changes simultaneously. The key is prioritization: which deadline comes first? Which change has the biggest business impact? Can changes share the same development resources? Create a simple matrix: system affected, deadline, effort estimate, priority. Share this with your vendor so they can plan resources. In meetings, discuss each change separately. Start with the highest priority. Before moving to the next, summarize decisions and action items for the current topic. At the end, provide a combined status. This keeps both you and the vendor organized." -ReadingRu "Как менеджер по автоматизации, вы часто работаете с несколькими регуляторными изменениями одновременно. Ключ — приоритизация: какой дедлайн раньше? Какое изменение имеет большее бизнес-влияние? Создайте простую матрицу: система, дедлайн, оценка усилий, приоритет. Обсуждайте каждое изменение отдельно на встречах. Начните с наивысшего приоритета. В конце предоставьте объединённый статус." -Checks @(
    "Я могу вести встречу по двум регуляторным темам одновременно",
    "Я умею расставлять приоритеты по дедлайнам",
    "Я могу назначить отдельные задачи для каждого изменения"
)

# Day 14
Write-DayPage -Day 14 -Title "Full Meeting: SAP Access & Security" -Focus "Провести встречу с подрядчиком по SAP-безопасности — права доступа, аудит, новые роли." -Date "Вт 7 июл 2026" -Week "Week 3 — Полные встречи" -ReviewText "Повторение D13: Скажи вслух: 'We have two regulatory changes to discuss today. First..., second...' — назови две темы." -HasReview $true -Phrases @(
    @{en="Our audit found users with excessive SAP permissions. We need to remediate."; ru="Наш аудит выявил пользователей с избыточными правами в SAP. Нужно исправить."}
    @{en="Please provide a report of all users with critical authorizations."; ru="Пожалуйста, предоставьте отчёт по всем пользователям с критическими авторизациями."}
    @{en="We need to create new roles for the production operators."; ru="Нам нужно создать новые роли для операторов производства."}
    @{en="What is the process for requesting new SAP access?"; ru="Какой процесс запроса нового доступа в SAP?"}
    @{en="We need to implement a monthly access review process."; ru="Нам нужно внедрить ежемесячный процесс проверки доступа."}
    @{en="Are there any SOD (Segregation of Duties) conflicts in the current roles?"; ru="Есть конфликты SOD (разделение обязанностей) в текущих ролях?"}
    @{en="Please disable access for users who have left the company."; ru="Пожалуйста, отключите доступ для уволившихся сотрудников."}
    @{en="We need a cleaner role structure based on job functions."; ru="Нам нужна более чистая структура ролей на основе должностных функций."}
    @{en="Let's balance compliance requirements with operational efficiency."; ru="Давайте балансировать требования комплаенса с операционной эффективностью."}
    @{en="Action item: provide a remediation plan for the audit findings by next week."; ru="Задача: предоставить план исправления замечаний аудита к следующей неделе."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning. The topic today is SAP access and security. Our internal audit identified several issues. First — users with excessive permissions. Second — new role requests for production operators. Third — we need a regular access review process. Let's start with the audit findings.<br><br>

<span class="vendor">Security Specialist:</span> We've reviewed the audit report. There are 12 users who have SAP_ALL access — that's full system access. This is a critical finding.<br><br>

<span class="you">Customer:</span> Agreed. We need a remediation plan. Please provide a step-by-step plan to reduce these permissions by the end of next week.<br><br>

<span class="vendor">PM:</span> We can do that. But some of these users are power users who need extensive access. We need to find the right balance.<br><br>

<span class="you">Customer:</span> I understand. Let's create a new role structure: power user roles with controlled authorizations, not SAP_ALL. Also, we need roles for the new production operators — can you prepare the role definitions?<br><br>

<span class="vendor">Security:</span> Yes, we have a template based on job functions. We'll customize it for your operators.<br><br>

<span class="you">Customer:</span> Good. Third item — monthly access review. I want a process where HR notifies us of leavers, and we review all access quarterly. John, can your team set this up?<br><br>

<span class="vendor">PM:</span> Yes, we can configure the SAP GRC module for automated reviews.
'@ -Dictation @(
    "Аудит выявил пользователей с избыточными правами. Нужно исправить.",
    "Пожалуйста, предоставьте отчёт по критическим авторизациям.",
    "Нам нужно создать новые роли для операторов.",
    "Давайте балансировать комплаенс с операционной эффективностью.",
    "Предоставьте план исправления замечаний аудита."
) -ReadingTitle "SAP Security and Access Management" -ReadingText "SAP security is a critical responsibility for any customer. Excessive permissions are a compliance risk and a security vulnerability. As a customer, you need to regularly review who has access to what. Work with your SAP vendor to implement a clean role structure based on job functions, not individual requests. Implement a monthly review process. Ensure leavers' access is disabled immediately. Use Segregation of Duties (SOD) checks to prevent conflicting authorizations. While the vendor handles the technical implementation, you as the customer define the requirements and own the approval process. Document each access request and approval." -ReadingRu "Безопасность SAP — критическая ответственность любого заказчика. Избыточные права — это комплаенс-риск и уязвимость. Регулярно проверяйте, у кого какой доступ. Работайте с SAP-подрядчиком над чистой структурой ролей на основе должностных функций. Внедрите ежемесячный процесс проверки. Используйте проверки SOD для предотвращения конфликтующих авторизаций." -Checks @(
    "Я могу обсудить вопросы SAP-безопасности с подрядчиком",
    "Я понимаю требования SOD и аудита доступа",
    "Я могу сформулировать требования к ролям и процессу проверки"
)

# Day 15
Write-DayPage -Day 15 -Title "FINAL — Unprepared Vendor Meeting" -Focus "Провести неподготовленную встречу с подрядчиком на любую тему — финальный экзамен." -Date "Ср 8 июл 2026" -Week "Week 3 — Полные встречи" -ReviewText "Повторение D14: Скажи вслух фразу о безопасности SAP: 'Our audit found users with excessive permissions...'" -HasReview $true -Phrases @(
    @{en="Let's start with the agenda. What topics do we need to cover today?"; ru="Давайте начнём с повестки. Какие темы нам нужно сегодня обсудить?"}
    @{en="Could you give us a quick update on this?"; ru="Можете дать краткий статус по этому?"}
    @{en="Just to clarify, what exactly is blocking this?"; ru="Просто уточнить: что именно блокирует это?"}
    @{en="Let me summarize what we've agreed so far."; ru="Позвольте резюмировать, о чём мы договорились."}
    @{en="Action items and deadlines — I'll send the minutes."; ru="Задачи и сроки — я отправлю протокол."}
    @{en="We have a new requirement. Please assess and provide a proposal."; ru="У нас новое требование. Пожалуйста, оцените и предоставьте предложение."}
    @{en="How will this affect the timeline and budget?"; ru="Как это повлияет на сроки и бюджет?"}
    @{en="Sorry, could you repeat that more slowly, please?"; ru="Извините, повторите медленнее, пожалуйста."}
    @{en="We need a recovery plan for this delay."; ru="Нам нужен план восстановления по этой задержке."}
    @{en="Let's confirm the next steps and reconvene on [date]."; ru="Давайте подтвердим следующие шаги и встретимся [дата]."}
) -Dialog @'
<span class="you">You (Customer):</span> Good morning everyone. Thanks for joining. I don't have a fixed agenda today — John, what do you have for us?<br><br>

<span class="vendor">John:</span> We have three items. First, the Mercury interface update — we've completed development and are ready for testing. Second, we found an issue with the IDoc partner profile that needs a decision from your side. Third, there's been a change in the CRPT timeline — they've extended the deadline for dairy.<br><br>

<span class="you">Customer:</span> Good, let's go through these one by one. First — Mercury testing. What do you need from our side to start?<br><br>

<span class="vendor">John:</span> We need a test environment and a list of test scenarios from your production team.<br><br>

<span class="you">Customer:</span> We'll provide the test scenarios by end of week. Second — the IDoc issue. What exactly is the problem?<br><br>

<span class="vendor">John:</span> The partner profile is configured for outbound only, but we also need inbound for the new Mercury format. We need your approval to change it.<br><br>

<span class="you">Customer:</span> Approved. Please proceed with the change and include it in the Mercury testing. Third — the CRPT extension. What's the new deadline?<br><br>

<span class="vendor">John:</span> Extended from December 1st to March 1st next year.<br><br>

<span class="you">Customer:</span> That's good news. It gives us more breathing room. Let's adjust the project plan accordingly. Let me summarize: Mercury testing starts next week with our test scenarios. IDoc change approved. CRPT project plan to be updated. I'll send the minutes.
'@ -Dictation @(
    "Давайте начнём с повестки. Какие темы сегодня?",
    "Можете дать краткий статус по каждому пункту?",
    "Просто уточнить: что именно блокирует это?",
    "Позвольте резюмировать, о чём мы договорились.",
    "Задачи и сроки — я отправлю протокол."
) -ReadingTitle "Your 15-Day Journey: Customer Edition" -ReadingText "Over the past 15 days, you have built a complete toolkit for working with SAP vendors in English. From opening a kickoff meeting to handling critical incidents, change requests, and security reviews. The key now is to practice every day. Use the phrases from the cheat sheet. Do the AI voice scenarios. Listen to the audio recordings on your commute. Remember: fluency is a habit, not a destination. Aim for clarity, not perfection. Continue using the emergency card phrases in every vendor meeting. Record yourself weekly and compare. Set a new goal: lead one full vendor meeting entirely in English within the next month. You now have the tools — use them." -ReadingRu "За последние 15 дней вы создали полный инструментарий для работы с SAP-подрядчиками на английском. От кик-оффа до критических инцидентов, change request и проверок безопасности. Ключ — практиковаться каждый день. Используйте фразы из шпаргалки. Делайте AI-сценарии. Слушайте аудио в дороге. Помните: беглость — это привычка. Стремитесь к ясности, а не к идеалу. Продолжайте использовать Emergency Card фразы на каждой встрече. Поставьте новую цель: провести одну встречу с подрядчиком полностью на английском в течение месяца." -Checks @(
    "Я прошёл 15-дневный курс полностью (версия заказчика)",
    "Я провёл финальную неподготовленную встречу с AI-подрядчиком",
    "Я записал себя и проанализировал свои слабые места"
)

Write-Output "All 15 day pages generated successfully."
