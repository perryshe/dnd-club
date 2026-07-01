"""Export days.json for Next.js + dialogs for read pages"""
import json, ast, os

with open("generate-days.py", encoding="utf-8") as f:
    src = f.read()

tree = ast.parse(src)

def ast_val(v):
    if isinstance(v, ast.Constant):
        return v.value
    if isinstance(v, ast.List):
        return [ast_val(el) for el in v.elts]
    if isinstance(v, ast.Tuple):
        return tuple(ast_val(el) for el in v.elts)
    return None

def ast_str(v):
    """Safely get string value from AST node"""
    if isinstance(v, ast.Constant) and isinstance(v.value, str):
        return v.value
    return ""

# Collect all gen_day calls
calls = []
for node in ast.walk(tree):
    if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
        call = node.value
        if isinstance(call.func, ast.Name) and call.func.id == "gen_day":
            kw = {"day": ast_val(call.args[0]) if call.args else 0}
            for k in call.keywords:
                kw[k.arg] = k.value
            calls.append(kw)

days = []
all_words_cumulative = []
all_phrases_cumulative = []

for kw in calls:
    day_num = kw.get("day", 0)
    title = ast_str(kw.get("title", ""))
    focus = ast_str(kw.get("focus", ""))
    date = ast_str(kw.get("date", ""))
    week_label = ast_str(kw.get("week_label", ""))
    review = ast_str(kw.get("review", ""))
    reading_title = ast_str(kw.get("reading_title", ""))

    phrases_raw = ast_val(kw.get("phrases", []))
    phrases = [{"en": p[0], "ru": p[1]} for p in phrases_raw]

    words_raw = ast_val(kw.get("words", []))
    words = [{"en": w[0], "ru": w[1]} for w in words_raw]

    checks_raw = ast_val(kw.get("checks", []))
    checks = [str(c) for c in checks_raw]

    all_phrases_cumulative.extend(phrases)
    all_words_cumulative.extend(words)

    week_num = 1 if day_num <= 5 else 2 if day_num <= 10 else 3

    days.append({
        "id": day_num,
        "day_str": f"{day_num:02d}",
        "title": title,
        "focus": focus,
        "date": date,
        "week_label": week_label,
        "week_num": week_num,
        "week_folder": f"week-0{week_num}",
        "review": review,
        "phrases": phrases,
        "words": words,
        "words_cumulative": list(all_words_cumulative),
        "phrases_cumulative": list(all_phrases_cumulative),
        "checks": checks,
        "reading_title": reading_title,
    })

# --- Build dialogs for read pages ---
# Each dialog: 5-6 rounds of Customer ↔ Vendor on the day's topic
day_topics = {
    1: ("Opening a Meeting", "introductions and agenda setting"),
    2: ("Assigning Tasks", "regulatory requirement and proposal"),
    3: ("Change Request", "new government regulation"),
    4: ("Q&A and Clarifying", "clarifying technical terms"),
    5: ("Closing Meeting", "summarizing action items"),
    6: ("Small Talk", "before-meeting casual conversation"),
    7: ("Handling Complaints", "quality and timeline concerns"),
    8: ("Scope Disputes", "contract scope interpretation"),
    9: ("Summarizing", "structuring a chaotic discussion"),
    10: ("Follow-up", "action items from last meeting"),
    11: ("SAP Requirement", "new Mercury VSD integration"),
    12: ("Critical Incident", "DataMatrix printing stopped"),
    13: ("Two Regulatory Changes", "Chestny Znak and Mercury updates"),
    14: ("SAP Access & Security", "user permissions and audit"),
    15: ("Unprepared Meeting", "urgent regulatory clarification"),
}

for d in days:
    dn = d["id"]
    topic, context = day_topics.get(dn, ("", ""))
    en_phrases = [p["en"] for p in d["phrases"]]

    dialog_lines = []

    # Build a natural dialog from the phrases
    pairs = [
        ("Customer", 0),
        ("Vendor", None),
        ("Customer", 2),
        ("Vendor", None),
        ("Customer", 4),
        ("Vendor", None),
        ("Customer", 6 if len(en_phrases) > 6 else 1),
    ]

    vendor_responses = [
        "Thank you, I understand the requirement. Let me check with my team and get back to you with a proposal.",
        "That makes sense. We've seen similar requests from other clients and have a standard approach for this.",
        "Good question. Let me explain how we typically handle this in our implementation methodology.",
        "I appreciate you raising this. Let me propose a solution that should address your concerns.",
        "Understood. We'll prioritize this and provide a timeline by end of week.",
        "I see your point. Let me suggest a compromise that could work for both sides.",
        "Thank you for the clarification. Based on what you've said, I recommend we take a phased approach.",
        "Absolutely. We'll document everything and send you a formal update by tomorrow.",
        "That's a valid concern. Here's what we can do to mitigate the risk.",
        "Perfect. Let me summarize what I've heard and confirm our next steps.",
    ]

    for i, (role, phrase_idx) in enumerate(pairs):
        if phrase_idx is not None and phrase_idx < len(en_phrases):
            text = en_phrases[phrase_idx]
        elif role == "Vendor":
            text = vendor_responses[i % len(vendor_responses)]
        else:
            text = en_phrases[0]
        dialog_lines.append({"role": role, "text": text})

    d["dialog"] = dialog_lines

# --- Common pages data ---
# We'll keep the existing HTML common pages as-is for now
# and just reference them via the common/[slug] route

output = {
    "meta": {
        "title": "English for Manager",
        "subtitle": "15 дней · 22 июн – 10 июл 2026",
        "total_days": 15,
        "version": "2.0",
    },
    "weeks": [
        {"id": 1, "label": "Week 1 — База встреч", "folder": "week-01", "days": [d for d in range(1, 6)],
         "digest_label": "⛅ Дайджест"},
        {"id": 2, "label": "Week 2 — Заказчик → Подрядчик", "folder": "week-02", "days": [d for d in range(6, 11)],
         "digest_label": "⛅ Дайджест"},
        {"id": 3, "label": "Week 3 — Сквозная практика", "folder": "week-03", "days": [d for d in range(11, 16)],
         "digest_label": "⛅ Дайджест"},
    ],
    "days": days,
}

out_dir = "site/src/data"
os.makedirs(out_dir, exist_ok=True)
with open(f"{out_dir}/days.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Exported {len(days)} days to {out_dir}/days.json")
print(f"Total cumulative words at day 15: {len(all_words_cumulative)}")
print(f"Total cumulative phrases at day 15: {len(all_phrases_cumulative)}")
