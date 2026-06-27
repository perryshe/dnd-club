function Write-ReadingPage {
    param($Day, $Theme, $EnglishText, $RussianText)

    $n = $Day.ToString("00")
    $week = if ($Day -le 5) {"week-01"} elseif ($Day -le 10) {"week-02"} else {"week-03"}
    $dayFile = "day-$n.html"
    $readFile = "read-$n.html"
    $prevDay = if ($Day -gt 1) {"day-$(($Day-1).ToString('00')).html"} else {""}
    $nextDay = if ($Day -lt 15) {"day-$(($Day+1).ToString('00')).html"} else {""}

    # Generate vocabulary from text (pick ~12 meaningful words)
    $words = @()
    $uniqueWords = @{}
    $EnglishText -split '\s+' | ForEach-Object {
        $w = $_ -replace '[^a-zA-Z]',''
        if ($w.Length -ge 6 -and !$uniqueWords.ContainsKey($w.ToLower())) {
            $uniqueWords[$w.ToLower()] = $true
        }
    }
    $vocabWords = $uniqueWords.Keys | Select-Object -First 12

    $vocabHtml = ""
    $vocabWords | ForEach-Object { $vocabHtml += "<tr><td style='color:#58a6ff;'>$_</td><td style='color:#8b949e;'>...</td></tr>`n" }

    $html = @"
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reading Day $n — $Theme</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, system-ui, 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; line-height: 1.7; padding: 20px; max-width: 800px; margin: 0 auto; }
h1 { font-size: 1.5em; color: #58a6ff; }
h2 { font-size: 1.15em; color: #f0883e; margin: 24px 0 10px; border-bottom: 1px solid #21262d; padding-bottom: 6px; }
h3 { font-size: 1em; color: #e6edf3; margin: 16px 0 6px; }
p { color: #c9d1d9; font-size: 0.95em; margin: 8px 0; }
.back { color: #8b949e; text-decoration: none; font-size: 0.85em; display: inline-block; margin-bottom: 12px; }
.back:hover { color: #58a6ff; }
.card { background: #161b22; border: 1px solid #21262d; border-radius: 8px; padding: 12px 14px; margin: 10px 0; }
.ru { color: #8b949e; font-size: 0.9em; }
.note { color: #8b949e; font-size: 0.85em; margin: 4px 0; }
ul, ol { padding-left: 20px; margin: 6px 0; }
li { color: #c9d1d9; margin: 4px 0; }
table { width: 100%; border-collapse: collapse; margin: 8px 0; }
td, th { padding: 6px 10px; border-bottom: 1px solid #21262d; text-align: left; font-size: 0.9em; }
details { background: #161b22; border: 1px solid #21262d; border-radius: 8px; padding: 10px 14px; margin: 10px 0; }
summary { color: #58a6ff; font-weight: 600; cursor: pointer; padding: 4px 0; }
summary:hover { color: #79c0ff; }
details .answer { color: #3fb950; padding: 4px 0; }
.tag { display: inline-block; padding: 0 8px; border-radius: 10px; font-size: 0.7em; font-weight: 600; margin: 0 4px 4px 0; }
.tag-blue { background: #1f6feb33; color: #58a6ff; }
nav { margin-top: 30px; padding-top: 16px; border-top: 1px solid #21262d; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 0.85em; }
nav a { color: #8b949e; text-decoration: none; }
nav a:hover { color: #58a6ff; }
.audio-btn { display: inline-flex; align-items: center; gap: 6px; background: #1f6feb; color: #fff; border: none; border-radius: 20px; padding: 6px 14px; font-size: 0.85em; cursor: pointer; margin-top: 8px; }
.audio-btn:hover { background: #388bfd; }
.audio-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; justify-content: center; align-items: center; }
.audio-overlay.open { display: flex; }
.audio-overlay-content { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; max-width: 92%; width: 400px; position: relative; }
.audio-overlay-content audio { width: 100%; display: block; }
.audio-close { position: absolute; top: 8px; right: 12px; background: none; border: none; color: #8b949e; font-size: 1.3em; cursor: pointer; line-height: 1; }
.audio-close:hover { color: #f85149; }
</style>
</head>
<body>

<a class="back" href="../index.html">← На главную</a>
<h1>Reading Day $n · $Theme</h1>
<p class="note">Week $(if ($Day -le 5){1}elseif($Day -le 10){2}else{3}) · Чтение и понимание текста</p>
<button class="audio-btn" onclick="openAudio()">🎧 Аудио</button>

<div class="card">
  <p>$EnglishText</p>
</div>

<h2>Перевод</h2>
<div class="card ru">
  <p>$RussianText</p>
</div>

<h2>Словарь</h2>
<table>
  <tr><th style="color:#f0883e;">English</th><th style="color:#f0883e;">Русский</th></tr>
$vocabHtml
</table>

<h2>Вопросы на понимание</h2>
<ol>
  <li>What is the main idea of this text?</li>
  <li>Why is this topic important for a manager?</li>
  <li>What practical advice does the text give?</li>
  <li>How would you apply this in your work?</li>
  <li>What phrase from this text will you use today?</li>
</ol>

<h2>Перевод упражнение</h2>
<p class="note">Переведи на английский:</p>
<ol>
  <li>Это важный навык для менеджера.</li>
  <li>Мы должны практиковаться каждый день.</li>
  <li>Мне нужно улучшить свои коммуникативные навыки.</li>
  <li>Это поможет команде работать эффективнее.</li>
  <li>Я буду использовать эту фразу на следующей встрече.</li>
</ol>

<h2>Ответы</h2>
<details>
  <summary>Показать ответы</summary>
  <div style="margin-top:8px;">
    <p><strong>Вопросы на понимание (примерные ответы):</strong></p>
    <div class="answer">1. The text explains $Theme and its role in meetings.</div>
    <div class="answer">2. It helps a manager communicate more effectively.</div>
    <div class="answer">3. The text advises to practice key phrases and listen actively.</div>
    <div class="answer">4. I will apply this in my weekly status meetings.</div>
    <div class="answer">5. "..." — the specific phrase from this reading.</div>
    <p style="margin-top:8px;"><strong>Перевод:</strong></p>
    <div class="answer">1. This is an important skill for a manager.</div>
    <div class="answer">2. We should practice every day.</div>
    <div class="answer">3. I need to improve my communication skills.</div>
    <div class="answer">4. This will help the team work more efficiently.</div>
    <div class="answer">5. I will use this phrase at the next meeting.</div>
  </div>
</details>

<nav>
$(if ($Day -gt 1) {"  <a href='$prevDay'>← $prevDay</a>`n"})
  <a href="../index.html">Главная</a>
  <a href="$dayFile">→ $dayFile</a>
</nav>

<div class="audio-overlay" id="audioOverlay" onclick="closeAudio()">
  <div class="audio-overlay-content" onclick="event.stopPropagation()">
    <button class="audio-close" onclick="closeAudio()">×</button>
    <audio id="readAudio" controls>
      <source src="../audio/read-$n.mp3" type="audio/mpeg">
    </audio>
  </div>
</div>

<script>
function openAudio() {
  document.getElementById('audioOverlay').classList.add('open');
  document.getElementById('readAudio').play();
}
function closeAudio() {
  document.getElementById('audioOverlay').classList.remove('open');
  document.getElementById('readAudio').pause();
}
</script>

</body>
</html>
"@

    $path = "D:\YD\General\4_english\$week\$readFile"
    Set-Content -LiteralPath $path -Value $html -Encoding UTF8
    Write-Output "Created: $path"
}

# Day 01
Write-ReadingPage -Day 1 -Theme "How Effective Meetings Start" @"
An effective meeting starts before anyone joins. A clear agenda, sent in advance, sets expectations. The host should arrive early, test the audio and screen share, and greet participants warmly as they enter. A strong opening includes stating the purpose, reviewing the agenda, setting time expectations, and inviting participation. Research shows that meetings with a written agenda finish 25% faster and have higher participant satisfaction. As a manager, your opening sets the tone for the entire meeting. If you sound confident and organized, others will follow. Always prepare three things before every meeting: the agenda, the attendee list, and your opening statement. Practice your opening lines until they feel natural. Remember, the first 30 seconds of a meeting determine how engaged participants will be. Don't waste them on logistics — start with purpose and energy.
"@ @"
Эффективная встреча начинается до того, как кто-то подключился. Чёткая повестка, отправленная заранее, задаёт ожидания. Ведущий должен зайти заранее, проверить аудио и демонстрацию экрана и тёпло поприветствовать участников. Сильное открытие включает объявление цели, обзор повестки, обозначение тайминга и приглашение к участию. Исследования показывают, что встречи с письменной повесткой заканчиваются на 25% быстрее и имеют более высокую удовлетворённость участников. Как менеджер, ваше открытие задаёт тон всей встрече. Если вы звучите уверенно и организованно, другие последуют вашему примеру. Всегда готовьте три вещи перед каждой встречей: повестку, список участников и вступительную фразу. Практикуйте свои вступительные фразы, пока они не станут естественными. Помните: первые 30 секунд встречи определяют, насколько вовлечены будут участники. Не тратьте их на логистику — начинайте с цели и энергии.
"@

# Day 02
Write-ReadingPage -Day 2 -Theme "The Weekly Sync" @"
The weekly status sync is the heartbeat of any project. Its goal is not to micromanage but to surface blockers early. Each team member reports briefly on what they completed, what they are working on next, and any obstacles. A good status update is specific and concise. Instead of saying 'working on SAP,' say 'completed IDoc mapping validation, moving to error handling logic.' This keeps the team aligned and the manager informed without wasting time. As a manager, your role is to listen actively, ask clarifying questions, and note dependencies between tasks. If someone reports a blocker, ask: 'What do you need to unblock this?' and 'By when?' Always end the status round with a summary of key points. This confirms everyone heard the same information and prevents misunderstandings later. A well-run weekly sync should take no more than 30 minutes for a team of 8 people.
"@ @"
Еженедельный статус-митинг — это сердце любого проекта. Его цель не микроменеджмент, а раннее выявление блокеров. Каждый участник кратко сообщает: что сделано, что в работе и какие есть препятствия. Хороший статус-апдейт конкретен и краток. Вместо «работаю над SAP» скажите «завершил валидацию маппинга IDoc, перехожу к логике обработки ошибок». Это держит команду синхронизированной. Как менеджер, ваша роль — активно слушать, задавать уточняющие вопросы и отмечать зависимости между задачами. Всегда завершайте раунд статусов резюме ключевых моментов. Хорошо проведённый еженедельный митинг не должен занимать более 30 минут для команды из 8 человек.
"@

# Day 03
Write-ReadingPage -Day 3 -Theme "Incident Response in IT" @"
In manufacturing IT, incidents are inevitable: a batch job fails, an IDoc is stuck, or a label printer stops responding. A structured incident response saves hours. First, confirm the impact: who is affected and how urgent is it? Second, gather data: error messages, timestamps, logs. Third, communicate: inform stakeholders, assign ownership, set a timeline. Fourth, escalate if needed. Finally, after resolution, document the root cause to prevent recurrence. As a manager, your calmness during incidents sets the team's emotional tone. If you panic, the team panics. If you stay methodical, the team follows. Use phrases like 'Let's step through this one by one' and 'What do we know for sure?' to keep the discussion grounded. After the incident, schedule a post-mortem within 48 hours. Invite all involved and ask: What went well? What went wrong? What will we do differently? This turns every incident into a learning opportunity.
"@ @"
В производственном IT инциденты неизбежны: пакетное задание упало, IDoc завис или принтер этикеток перестал отвечать. Структурированная реакция на инцидент экономит часы. Сначала подтвердите влияние: кто пострадал и насколько срочно? Затем соберите данные: сообщения об ошибках, временные метки, логи. Потом коммуницируйте: информируйте заинтересованных, назначьте ответственного, установите сроки. При необходимости эскалируйте. После устранения задокументируйте корневую причину. Как менеджер, ваше спокойствие во время инцидентов задаёт эмоциональный тон команды. Используйте фразы вроде «Давайте пройдёмся по этому шаг за шагом». После инцидента проведите пост-мортем в течение 48 часов.
"@

# Day 04
Write-ReadingPage -Day 4 -Theme "The Art of Q&A" @"
Questions are a manager's most powerful tool. Open-ended questions like 'What do you think?' encourage discussion. Closed questions such as 'Is this ready?' confirm facts. Probing questions dig deeper into issues. Clarifying questions prevent misunderstandings. During Q&A sessions, listen actively, acknowledge each question, and if you don't know the answer, say 'I'll follow up on that after the meeting.' Strong Q&A builds trust between you and your team. It shows you are engaged and value their input. When you ask good questions, you also model curiosity for your team. They learn to think critically and to prepare better for meetings. One technique is the 'five whys' — asking 'why' five times to get to the root cause of any issue. Another is to pause for five seconds after asking a question. This gives people time to think before speaking. Most managers rush the silence; don't. The best answers often come after a pause.
"@ @"
Вопросы — самый мощный инструмент менеджера. Открытые вопросы вроде «Что вы думаете?» поощряют дискуссию. Закрытые вопросы, такие как «Это готово?», подтверждают факты. Углубляющие вопросы копают глубже. Уточняющие предотвращают недопонимание. Во время Q&A активно слушайте, признавайте каждый вопрос, и если не знаете ответа, скажите «Я уточню это после встречи». Хороший Q&A укрепляет доверие. Одна из техник — «пять почему» — задавать «почему» пять раз, чтобы добраться до корня проблемы. Другая — делать паузу в пять секунд после вопроса. Большинство менеджеров торопятся заполнить тишину; не делайте этого. Лучшие ответы часто приходят после паузы.
"@

# Day 05
Write-ReadingPage -Day 5 -Theme "Closing with Impact" @"
A strong closing ensures the meeting was worthwhile. Summarize key decisions and action items with owners and deadlines. Ask 'Does anyone have anything else before we wrap up?' to catch late thoughts. Restate next steps clearly. Thank everyone for their time. A good wrap-up gives clarity and accountability, so no one leaves wondering what happens next. The closing should take no more than five minutes. Structure it as: decisions made, action items (who does what by when), and next meeting date if applicable. Send a follow-up email within two hours with the same structure. This creates a written record people can refer back to. As a manager, the closing is also your chance to reinforce team culture. Thank specific people for their contributions. Recognize good work publicly. This takes 30 seconds but builds motivation for weeks. End with a positive note — even if the meeting was difficult — to keep morale high.
"@ @"
Сильное завершение гарантирует, что встреча прошла не зря. Подытожьте ключевые решения и поручения с исполнителями и сроками. Спросите «Есть ли что-то ещё перед завершением?» Повторите следующие шаги. Поблагодарите всех за время. Закрытие должно занимать не более пяти минут. Структура: принятые решения, поручения (кто, что, когда), дата следующей встречи. Отправьте follow-up письмо в течение двух часов. В роли менеджера закрытие — это также ваш шанс укрепить командную культуру. Поблагодарите конкретных людей за вклад. Завершите на позитивной ноте.
"@

# Day 06
Write-ReadingPage -Day 6 -Theme "The Power of Small Talk" @"
Small talk is the gateway to stronger workplace relationships. In international teams, it builds trust before diving into business. Safe topics include weather, travel, weekend plans, local food, or sports. Avoid politics, religion, or personal finances. Good openers include 'How was your weekend?', 'Are you traveling anywhere this summer?', or 'Did you try the new cafe near the office?' Small talk shows you see colleagues as people, not just roles. In virtual meetings, small talk is even more important because there is no water cooler to gather around. Start the meeting one minute early and use that time for informal chat. Ask about the person's location, time zone, or how their day is going. This creates a human connection before switching to business mode. For non-native speakers, small talk is excellent practice because the stakes are low and the vocabulary is everyday. Use these moments to build your speaking confidence without the pressure of formal meeting language.
"@ @"
Small talk — это ворота к более крепким рабочим отношениям. В международных командах он создаёт доверие до погружения в дела. Безопасные темы: погода, путешествия, планы на выходные, местная еда или спорт. Избегайте политики, религии и личных финансов. Хорошие начала: «Как прошли выходные?», «Путешествуете куда-нибудь этим летом?», «Пробовали новый кафе рядом с офисом?» На виртуальных встречах small talk ещё важнее — нет кулера, вокруг которого можно собраться. Начинайте встречу на минуту раньше и используйте это время для неформального общения. Для не-носителей языка small talk — отличная практика, так как ставки низки, а лексика повседневная.
"@

# Day 07
Write-ReadingPage -Day 7 -Theme "Handling Complaints" @"
A complaint is a gift — it tells you what needs fixing. When someone complains, first listen without interrupting. Acknowledge their feeling: 'I understand why you are frustrated.' Apologize if appropriate. Then focus on solutions. Never get defensive. A well-handled complaint can actually strengthen the relationship more than if the problem never occurred. Follow up after resolving to close the loop. The LAA method helps: Listen, Acknowledge, Act. First, listen fully without planning your response. Second, acknowledge the person's feelings and effort in raising the issue. Third, act by defining a concrete next step. Even if you cannot solve the problem immediately, saying 'I will look into this and get back to you by Friday' shows you take it seriously. Document complaints and track patterns over time. If the same issue appears repeatedly, it is not a one-off — it is a systemic problem that needs management attention. Use complaints as data for process improvement.
"@ @"
Жалоба — это подарок: она говорит о том, что нужно исправить. Когда кто-то жалуется, сначала выслушайте, не перебивая. Признайте его чувства: «Я понимаю, почему вы расстроены». Извинитесь, если уместно. Затем сосредоточьтесь на решениях. Никогда не переходите в защиту. Метод LAA помогает: Listen (Слушай), Acknowledge (Признавай), Act (Действуй). Документируйте жалобы и отслеживайте паттерны. Если одна и та же проблема появляется снова, это не единичный случай — это системная проблема. Используйте жалобы как данные для улучшения процессов.
"@

# Day 08
Write-ReadingPage -Day 8 -Theme "Constructive Conflict" @"
Conflict in meetings is natural when smart people disagree. The manager's job is not to eliminate it but to channel it constructively. First, acknowledge both sides. Second, reframe the goal: 'We all want the best outcome for production.' Third, separate people from the problem. Ask 'What data do we have?' not 'Who is right?' If needed, park the issue for later discussion. A skilled facilitator turns conflict into better decisions. One effective technique is to ask each person to restate the other's position. This forces active listening and often reveals common ground. Another is to frame disagreements as experiments: 'Let's try your approach for two weeks and measure the results.' This removes ego from the equation. As a manager, your neutrality is your greatest asset. Do not take sides unless one option is clearly wrong. When you must decide, explain your reasoning openly so both parties understand why you chose one path over the other. Transparency builds trust even in disagreement.
"@ @"
Конфликт на встречах естественен, когда умные люди расходятся во мнениях. Задача менеджера — не устранить его, а направить в конструктивное русло. Сначала признайте обе стороны. Затем переформулируйте цель: «Мы все хотим лучшего результата для производства». Отделяйте людей от проблемы. Спрашивайте «Какие у нас есть данные?», а не «Кто прав?». Одна эффективная техника — попросить каждого пересказать позицию другого. Другая — представить разногласия как эксперимент. Ваша нейтральность — ваше главное преимущество. Прозрачность укрепляет доверие даже в разногласиях.
"@

# Day 09
Write-ReadingPage -Day 9 -Theme "Summarizing and Paraphrasing" @"
Summarizing is a superpower in meetings. A good summary confirms alignment, catches details people might have missed, and creates a clear record. Use phrases like 'So what I'm hearing is' or 'Let me make sure I've captured this correctly.' Paraphrasing shows you listened. It gives the speaker a chance to confirm or correct. Summarizing every 10-15 minutes keeps meetings focused and productive. There are three types of summaries in meetings. The mid-point summary: after discussing a topic for a while, pause and recap what was said and decided. The end-of-topic summary: before moving to the next agenda item, state the key decision and action items. The end-of-meeting summary: recap all topics, decisions, and next steps. Each type serves a different purpose but all prevent ambiguity. When you paraphrase, you also buy yourself time to process information. This is especially helpful if English is not your first language. Paraphrasing what someone said gives you a moment to think while showing you are engaged.
"@ @"
Умение подводить итог — суперсила на встречах. Хороший итог подтверждает согласованность, ловит детали, которые могли упустить, и создаёт чёткую запись. Используйте фразы вроде «Итак, я слышу, что» или «Позвольте убедиться, что я правильно понял». Перефразирование показывает, что вы слушали. Есть три типа итогов: промежуточный, по завершении темы и в конце встречи. Когда вы перефразируете, вы также даёте себе время на обработку информации. Это особенно полезно, если английский не ваш родной язык.
"@

# Day 10
Write-ReadingPage -Day 10 -Theme "Follow-Up Emails" @"
The meeting is over, but the work is just beginning. A timely follow-up email with meeting minutes, decisions, and action items prevents confusion. Send it within two hours. Structure it with a subject line containing date and topic, key decisions, action items with owners and deadlines, and the next meeting date. Use bullet points for readability. A good follow-up email is a reference document people will return to throughout the week. The subject line should include the project name and date, such as 'Meeting Notes: SAP-MES Status — 18 Jun 2026.' This makes it easy to find later in the inbox. In the body, start with a one-line summary of the meeting purpose. Then list decisions as bullet points. Then action items as a table: Action, Owner, Deadline. End with the next meeting date or a note that no meeting is scheduled. Keep the tone neutral and factual. Avoid emotional language. Copy only those who attended plus one additional stakeholder if needed.
"@ @"
Встреча закончена, но работа только начинается. Своевременное follow-up письмо с протоколом, решениями и поручениями предотвращает путаницу. Отправьте его в течение двух часов. Структура: тема с датой и темой, ключевые решения, поручения с исполнителями и сроками, дата следующей встречи. Используйте маркированные списки для читаемости. Тема письма должна включать название проекта и дату. В теле начните с однострочного резюме цели встречи. Затем решения и поручения. Тон — нейтральный и фактологический.
"@

# Day 11
Write-ReadingPage -Day 11 -Theme "SAP-MES Integration" @"
SAP and MES integration is the backbone of modern manufacturing. SAP ERP handles planning and orders, while MES manages real-time production on the shop floor. The two systems communicate through IDoc messages. When an IDoc fails, orders can be delayed or duplicated. A status meeting for this integration should cover IDoc error rates, batch job health, and pending change requests. The SAP-MES interface is typically bi-directional. SAP sends production orders and master data to MES. MES sends back actual production data, material consumption, and quality results. If the interface goes down, production may continue but reporting becomes manual and error-prone. As a manager leading this meeting, you need to know the key technical terms: IDoc, RFC, BAPI, RFC destination, and middleware. You do not need to be a technical expert, but understanding the high-level data flow helps you ask better questions. Common issues include network interruptions, incorrect mapping, and authorization errors.
"@ @"
Интеграция SAP и MES — это основа современного производства. SAP ERP отвечает за планирование и заказы, а MES управляет производством в реальном времени на цеховом уровне. Две системы обмениваются через IDoc-сообщения. Когда IDoc падает, заказы могут задерживаться или дублироваться. Встреча по статусу интеграции должна охватывать частоту ошибок IDoc, здоровье пакетных заданий и ожидающие запросы на изменения. Интерфейс SAP-MES обычно двунаправленный. Как менеджер, ведущий эту встречу, вам нужно знать ключевые технические термины: IDoc, RFC, BAPI, middleware.
"@

# Day 12
Write-ReadingPage -Day 12 -Theme "MES Incidents" @"
MES incidents disrupt production and require swift action. Common issues include printer failures on the line, label template errors, batch job timeouts, and data sync delays. Your role as a manager is to triage: Is this a production stop? Can we work around it? Who has the expertise to fix it? After resolution, a root cause analysis should be written to prevent recurrence. When an MES incident occurs, the first question is business impact. How many lines are affected? Is any regulatory reporting at risk? Then determine whether a workaround exists. For example, if the label printer is down, can the operator print from a backup station? If MES is completely down, can production continue with manual data entry until recovery? As a manager, you need to escalate appropriately. Not every incident needs to go to senior management, but any incident that stops production for more than 30 minutes should be communicated upward. Always include the estimated fix time and the workaround status in your escalation.
"@ @"
Инциденты MES нарушают производство и требуют быстрых действий. Частые проблемы включают отказ принтера на линии, ошибки шаблонов этикеток, таймауты пакетных заданий и задержки синхронизации данных. Ваша роль как менеджера — провести триаж: Это остановка производства? Можем ли мы обойти это? У кого есть экспертиза для исправления? После устранения напишите анализ корневых причин. Когда происходит инцидент MES, первый вопрос — влияние на бизнес. Как менеджер, вы должны правильно эскалировать.
"@

# Day 13
Write-ReadingPage -Day 13 -Theme "Chestny Znak and Mercury" @"
Chestny Znak (Honest Sign) and Mercury are Russian government traceability systems. Chestny Znak tracks products using DataMatrix codes, essential for pharmaceuticals, tobacco, and dairy. Mercury tracks animal products. Both systems integrate with your ERP and MES. Cross-functional meetings for these projects involve IT, production, logistics, and compliance teams. Each system has different requirements. Chestny Znak requires marking every single item with a unique DataMatrix code. This changes the production line because you need to apply codes at high speed. Mercury requires electronic veterinary certificates for every shipment. Both systems have strict deadlines and heavy fines for non-compliance. A typical status meeting covers: integration timeline, testing progress, production line readiness, and open issues with the system operators. As a manager, you need to track dependencies between IT deployment and production schedule. If the line needs to stop for hardware installation, that must be planned weeks in advance with the production team.
"@ @"
Честный Знак и Меркурий — это российские государственные системы прослеживаемости. Честный Знак отслеживает товары через коды DataMatrix, обязателен для фармацевтики, табака и молочной продукции. Меркурий отслеживает продукты животного происхождения. Обе системы интегрируются с вашими ERP и MES. Кросс-функциональные встречи по этим проектам включают IT, производство, логистику и комплаенс. Честный Знак требует маркировки каждого товара уникальным кодом. Меркурий требует электронных ветсертификатов на каждую поставку. Обе системы имеют строгие сроки и большие штрафы за несоблюдение.
"@

# Day 14
Write-ReadingPage -Day 14 -Theme "Cross-Functional Reviews" @"
Cross-functional review meetings bring together production, budget, and IT teams. Each function speaks a different language: production talks throughput and downtime, budget talks costs and ROI, IT talks systems and tickets. Your job is to translate between them. Let each function present briefly, then facilitate discussion on trade-offs. End with a clear decision: approve, defer, or reject each request. The hardest part of cross-functional meetings is managing different priorities. Production wants maximum uptime. IT wants clean implementations. Budget wants minimum cost. None of these are wrong. Your role is to find the intersection where all three can accept the solution, even if it is not ideal for any single function. Use data to drive decisions when possible. If production requests a system change, ask IT for the implementation cost and timeline, ask budget for the financial impact, and ask production for the expected benefit. Present all three together and let the group decide. This makes the decision objective, not political.
"@ @"
Кросс-функциональные обзорные встречи объединяют производство, бюджетные и IT-команды. У каждого свой язык: производство говорит о пропускной способности и простоях, бюджет — о затратах и ROI, IT — о системах и тикетах. Ваша задача как ведущего — переводить между ними. Дайте каждой функции кратко выступить, затем модерируйте обсуждение компромиссов. Самая сложная часть — управление разными приоритетами. Используйте данные для принятия решений. Это делает решение объективным, а не политическим.
"@

# Day 15
Write-ReadingPage -Day 15 -Theme "Your 15-Day Journey" @"
Over the past 15 days, you have built a complete toolkit for leading meetings in English. From opening and closing to handling conflict and cross-functional reviews. The key is to practice every day. Use the phrases, do the AI voice scenarios, and listen to your audio recordings on the commute. Fluency is a habit, not a destination. Aim for clarity, not perfection. Reflect on your journey. Compare how you spoke on Day 1 versus Day 15. You should notice improvements in confidence, vocabulary recall, and sentence structure. The most important habit to maintain is speaking English out loud every day. Even 10 minutes of speaking practice is more effective than 60 minutes of passive listening or reading. Continue using the emergency card phrases in every meeting you lead. Record yourself weekly and compare. Find a language partner or continue with AI voice mode. The course may be finished, but your learning is not. Set a new goal: lead one meeting entirely in English within the next month.
"@ @"
За последние 15 дней вы построили полный инструментарий для проведения встреч на английском. От открытия и закрытия до управления конфликтами и кросс-функциональных обзоров. Ключ — практиковаться каждый день. Используйте фразы, делайте AI-сценарии и слушайте аудиозаписи в дороге. Беглость — это привычка, а не пункт назначения. Стремитесь к ясности, а не к идеалу. Оглянитесь на свой путь. Сравните, как вы говорили в День 1 и День 15. Самая важная привычка — говорить вслух по-английски каждый день. Продолжайте использовать фразы из аварийной карты на каждой встрече. Записывайте себя еженедельно и сравнивайте. Курс может быть закончен, но ваше обучение — нет.
"@

Write-Output "All 15 reading pages created successfully."
