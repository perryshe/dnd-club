#!/usr/bin/env python3
"""Fill in Russian translations for vocabulary in read-XX.html files."""

import re, json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

WEEKS = {1:"week-01",2:"week-01",3:"week-01",4:"week-01",5:"week-01",
         6:"week-02",7:"week-02",8:"week-02",9:"week-02",10:"week-02",
         11:"week-03",12:"week-03",13:"week-03",14:"week-03",15:"week-03"}

DICT = {
    # general business
    "agenda":"повестка", "meeting":"встреча", "meetings":"встречи",
    "minutes":"протокол встречи", "attendee":"участник", "attendees":"участники",
    "participant":"участник", "participants":"участники",
    "deadline":"крайний срок", "deadlines":"сроки",
    "timeline":"график, сроки", "milestone":"веха, этап",
    "deliverable":"результат работы", "deliverables":"результаты",
    "stakeholder":"заинтересованная сторона", "stakeholders":"заинтересованные стороны",
    "feedback":"обратная связь", "summary":"резюме, сводка",
    "agreement":"соглашение", "proposal":"предложение",
    "budget":"бюджет", "estimate":"оценка",
    "deadline":"дедлайн", "accountability":"ответственность",
    "workspace":"рабочее пространство",
    # communication
    "opening":"открытие", "closing":"закрытие",
    "introduction":"введение", "conclusion":"заключение",
    "discussion":"обсуждение", "conversation":"разговор",
    "question":"вопрос", "questions":"вопросы",
    "clarifying":"уточняющий", "clarification":"уточнение",
    "paraphrasing":"перефразирование", "summarizing":"подведение итогов",
    "summarize":"резюмировать", "summarises":"резюмирует",
    "engage":"вовлекать", "engaged":"вовлечённый",
    "participation":"участие", "participate":"участвовать",
    "warmly":"тепло", "welcome":"приветствовать",
    "greet":"приветствовать", "arrive":"прибывать",
    "purpose":"цель", "review":"обзор, пересмотр",
    "include":"включать", "includes":"включает",
    "prepare":"готовить", "prepared":"подготовленный",
    # writing
    "written":"письменный", "document":"документ",
    "documents":"документы", "email":"письмо",
    "subject":"тема", "structure":"структура",
    "bullet":"маркер списка", "bullets":"маркеры",
    "readability":"читаемость", "reference":"ссылка",
    "follow-up":"последующее действие",
    # management
    "manager":"менеджер", "leadership":"лидерство",
    "delegate":"делегировать", "priority":"приоритет",
    "prioritize":"приоритизировать",
    "escalate":"эскалировать", "escalation":"эскалация",
    "resource":"ресурс", "resources":"ресурсы",
    "assign":"назначать", "assignment":"задание",
    "complete":"завершить", "completed":"завершённый",
    "progress":"прогресс", "status":"статус",
    # issues
    "incident":"инцидент", "incidents":"инциденты",
    "problem":"проблема", "issue":"проблема, вопрос",
    "issues":"проблемы", "blocker":"блокер", "blockers":"блокеры",
    "root cause":"корневая причина",
    "resolution":"устранение", "resolve":"устранить",
    "workaround":"обходное решение",
    "post-mortem":"разбор инцидента",
    # technical
    "integration":"интеграция", "interface":"интерфейс",
    "system":"система", "systems":"системы",
    "production":"производство", "manufacturing":"производство",
    "operation":"операция", "operations":"операции",
    "environment":"среда, окружение",
    "configuration":"конфигурация", "configure":"настраивать",
    "deployment":"развёртывание",
    "implementation":"внедрение", "implement":"внедрять",
    "upgrade":"обновление", "migration":"миграция",
    "regulatory":"регуляторный", "regulation":"регулирование",
    "compliance":"соответствие требованиям",
    "requirement":"требование", "requirements":"требования",
    "specification":"спецификация",
    "certificate":"сертификат", "authorization":"авторизация",
    "authentication":"аутентификация",
    "middleware":"прослойка, middleware",
    # SAP specific
    "transaction":"транзакция", "authorization":"авторизация, полномочие",
    "segregation":"разделение", "conflict":"конфликт",
    "permission":"разрешение, доступ",
    "cleanup":"очистка", "review":"обзор, ревизия",
    # quality
    "quality":"качество", "efficiency":"эффективность",
    "effective":"эффективный", "effectively":"эффективно",
    "productive":"продуктивный", "productivity":"продуктивность",
    "constructive":"конструктивный",
    "outcome":"результат", "output":"результат, выход",
    "performance":"производительность",
    # conflict/scope
    "conflict":"конфликт", "disagreement":"разногласие",
    "compromise":"компромисс", "dispute":"спор",
    "scope":"объём работ",
    # feelings
    "complaint":"жалоба", "complaints":"жалобы",
    "frustrated":"расстроенный",
    "apologize":"извиняться",
    "defensive":"оборонительный, защитный",
    # misc
    "determine":"определять", "determines":"определяет",
    "logistics":"логистика",
    "energy":"энергия",
    "standard":"стандарт", "standards":"стандарты",
    "finish":"заканчивать", "starts":"начинается",
    "expectations":"ожидания",
    "schedule":"расписание, график",
    "update":"обновление", "updates":"обновления",
    "approach":"подход", "technique":"техника, метод",
    "habit":"привычка", "practice":"практика",
    "learning":"обучение",
    "fluency":"беглость",
    "destination":"пункт назначения",
    "journey":"путешествие",
    "toolkit":"инструментарий",
    "scenario":"сценарий", "scenarios":"сценарии",
    "commute":"дорога на работу",
    # Project
    "project":"проект", "program":"программа",
    "portfolio":"портфель",
    "initiative":"инициатива",
    "sponsor":"спонсор",
    "vendor":"подрядчик, вендор",
    "contractor":"подрядчик",
    "consultant":"консультант",
    # Verbs
    "achieve":"достигать", "achieves":"достигает",
    "improve":"улучшать", "improves":"улучшает",
    "strengthen":"укреплять", "strengthens":"укрепляет",
    "maintain":"поддерживать",
    "create":"создавать", "creates":"создаёт",
    "develop":"разрабатывать", "develops":"разрабатывает",
    "provide":"предоставлять", "provides":"предоставляет",
    "support":"поддерживать", "supports":"поддерживает",
    "require":"требовать", "requires":"требует",
    "ensure":"обеспечивать", "ensures":"обеспечивает",
    "prevent":"предотвращать", "prevents":"предотвращает",
    "reduce":"сокращать", "reduces":"сокращает",
    "increase":"увеличивать", "increases":"увеличивает",
    "identify":"определять", "identifies":"определяет",
    "communicate":"общаться, сообщать",
    "collaborate":"сотрудничать",
    "facilitate":"способствовать, облегчать",
    "coordinate":"координировать",
    "summarise":"резюмировать",
    "recognise":"признавать",
    "prioritise":"приоритизировать",
    "apologise":"извиняться",
    "practise":"практиковать",
    "organise":"организовывать",
    "specialise":"специализироваться",
    "summarize":"резюмировать",
    "recognize":"признавать",
    "prioritize":"приоритизировать",
    "apologize":"извиняться",
    "practice":"практиковать",
    "organize":"организовывать",
    "specialize":"специализироваться",
    # Reading specific
    "research":"исследование", "shows":"показывает",
    "confident":"уверенный", "organized":"организованный",
    "statement":"заявление, фраза",
    "natural":"естественный",
    "second":"секунда", "seconds":"секунды",
    "waste":"тратить впустую",
    "purpose":"цель",
    "several":"несколько",
    "clarify":"уточнять",
    "specific":"конкретный",
    "concise":"краткий, ёмкий",
    "briefly":"кратко",
    "completed":"завершённый",
    "moving":"переходящий",
    "logic":"логика",
    "aligned":"согласованный",
    "informed":"информированный",
    "dependencies":"зависимости",
    "reports":"сообщает, докладывает",
    "surface":"выявлять",
    "obstacle":"препятствие",
    "obstacles":"препятствия",
    "status":"статус",
    "heartbeat":"сердце (ритм)",
    "micromanage":"микроменеджмент",
    "blocker":"блокер",
    "blockers":"блокеры",
    "inevitable":"неизбежный",
    "structured":"структурированный",
    "response":"ответ, реагирование",
    "response":"реакция",
    "impact":"влияние",
    "affected":"затронутый",
    "urgent":"срочный",
    "timestamps":"временные метки",
    "stakeholders":"заинтересованные стороны",
    "ownership":"ответственность",
    "escalate":"эскалировать",
    "recurrence":"повторение",
    "calmness":"спокойствие",
    "emotional":"эмоциональный",
    "methodical":"методичный",
    "grounded":"обоснованный",
    "opportunity":"возможность",
    "incident":"инцидент",
    "swift":"быстрый",
    "triage":"триаж, сортировка",
    "expertise":"экспертиза",
    "down":"не работает",
    "backup":"резервный",
    "recovery":"восстановление",
    "sufficient":"достаточный",
    "powerful":"мощный",
    "encourage":"поощрять",
    "probing":"углубляющий",
    "misunderstanding":"недопонимание",
    "critical":"критический",
    "traceability":"прослеживаемость",
    "essential":"обязательный",
    "pharmaceuticals":"фармацевтика",
    "tobacco":"табак",
    "dairy":"молочная продукция",
    "livestock":"животноводство",
    "tracking":"отслеживание",
    "marking":"маркировка",
    "compliance":"комплаенс",
    "penalties":"штрафы",
    "readiness":"готовность",
    # missing words from vocab
    "should":"следует",
    "always":"всегда",
    "entire":"целый",
    "things":"вещи",
    "everyone":"все",
    "saying":"говорение, высказывание",
    "someone":"кто-то",
    "actively":"активно",
    "points":"пункты, моменты",
    "confirm":"подтверждать",
    "through":"через, посредством",
    "phrases":"фразы",
    "follows":"следует",
    "builds":"строит, развивает",
    "better":"лучше",
    "deeper":"глубже",
    "answers":"ответы",
    "closed":"закрытый",
    "critically":"критически",
    "people":"люди",
    "morale":"моральный дух",
    "worthwhile":"стоящий",
    "reinforce":"укреплять",
    "applicable":"применимый",
    "difficult":"сложный",
    "connection":"связь",
    "weather":"погода",
    "around":"вокруг",
    "office":"офис",
    "minute":"минута",
    "persons":"лица, персоны",
    "everyday":"ежедневный",
    "cooler":"кулер",
    "relationships":"отношения",
    "business":"бизнес",
    "occurred":"произошёл",
    "seriously":"серьёзно",
    "understand":"понимать",
    "management":"менеджмент, руководство",
    "attention":"внимание",
    "repeatedly":"многократно",
    "interrupting":"перебивающий",
    "forces":"заставляет",
    "greatest":"величайший",
    "results":"результаты",
    "position":"позиция, положение",
    "reasoning":"рассуждение",
    "explain":"объяснять",
    "listening":"слушание",
    "parties":"стороны",
    "listened":"слушал",
    "showing":"показывающий",
    "correct":"правильный",
    "especially":"особенно",
    "decision":"решение",
    "process":"процесс",
    "ambiguity":"неоднозначность",
    "yourself":"себя, сам",
    "correctly":"правильно",
    "oneline":"одна строка",
    "action":"действие",
    "throughout":"на протяжении",
    "scheduled":"запланированный",
    "bidirectional":"двунаправленный",
    "network":"сеть",
    "errorprone":"подверженный ошибкам",
    "orders":"заказы",
    "technical":"технический",
    "mapping":"сопоставление, маппинг",
    "errors":"ошибки",
    "station":"станция",
    "occurs":"происходит",
    "example":"пример",
    "between":"между",
    "operators":"операторы",
    "honest":"честный",
    "testing":"тестирование",
    "veterinary":"ветеринарный",
    "hardware":"оборудование",
    "crossfunctional":"межфункциональный",
    "reject":"отклонять",
    "translate":"переводить",
    "tickets":"заявки, тикеты",
    "speaks":"говорит",
    "tradeoffs":"компромиссы",
    "solution":"решение",
    "hardest":"самый сложный",
    "reflect":"отражать",
    "confidence":"уверенность",
    "reading":"чтение",
    "endofmeeting":"конец встречи",
}

def has_russian(text):
    return any('\u0400' <= c <= '\u04FF' for c in text)

def patch_vocab(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = 0
    # Find vocabulary table rows and replace ... with translations
    def replace_row(m):
        nonlocal changed
        word = m.group(1)
        trans = DICT.get(word.lower(), "")
        if not trans:
            w = word.lower()
            if w.endswith("ing") and len(w) > 4:
                trans = DICT.get(w[:-3], "")
            elif w.endswith("ed") and len(w) > 3:
                trans = DICT.get(w[:-2], "")
            elif w.endswith("s") and len(w) > 3:
                trans = DICT.get(w[:-1], "")
            elif w.endswith("es") and len(w) > 4:
                trans = DICT.get(w[:-2], "")
        if trans:
            changed += 1
            return m.group(0).replace("...", trans)
        return m.group(0)

    content = re.sub(
        r"<tr><td style='color:#58a6ff;'>([^<]+)</td><td style='color:#8b949e;'>\.\.\.</td></tr>",
        replace_row,
        content
    )
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
    print(f"  {path.name}: {changed} translations filled")
    return changed

total = 0
for day in range(1, 16):
    week = WEEKS[day]
    fname = f"read-{day:02d}.html"
    path = BASE / week / fname
    if path.exists():
        total += patch_vocab(path)
    else:
        print(f"  {fname}: not found")

print(f"\nTotal: {total} translations filled across {15} files")
