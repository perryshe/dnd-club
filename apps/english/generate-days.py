#!/usr/bin/env python3
"""Generate all 15 day HTML files with Customer->Vendor context"""

WEEKS = {
    1: "week-01", 2: "week-01", 3: "week-01", 4: "week-01", 5: "week-01",
    6: "week-02", 7: "week-02", 8: "week-02", 9: "week-02", 10: "week-02",
    11: "week-03", 12: "week-03", 13: "week-03", 14: "week-03", 15: "week-03"
}

CSS = """* { margin: 0; padding: 0; box-sizing: border-box; }
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
.audio-btn { display: inline-flex; align-items: center; gap: 6px; background: #1f6feb; color: #fff; border: none; border-radius: 20px; padding: 6px 14px; font-size: 0.85em; cursor: pointer; margin-top: 8px; }
.audio-btn:hover { background: #388bfd; }
.audio-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 999; justify-content: center; align-items: center; }
.audio-overlay.open { display: flex; }
.audio-overlay-content { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; max-width: 92%; width: 400px; position: relative; }
.audio-overlay-content audio { width: 100%; display: block; }
.audio-close { position: absolute; top: 8px; right: 12px; background: none; border: none; color: #8b949e; font-size: 1.3em; cursor: pointer; line-height: 1; }
.audio-close:hover { color: #f85149; }
nav { margin-top: 30px; padding-top: 16px; border-top: 1px solid #21262d; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 0.85em; }
nav a { color: #8b949e; text-decoration: none; }
nav a:hover { color: #58a6ff; }"""

def gen_day(day, title, focus, date, week_label, review, phrases, dialog, dictation, checks, reading_title, reading_text, reading_ru):
    n = f"{day:02d}"
    week = WEEKS[day]
    prev = f"day-{(day-1):02d}.html" if day > 1 else None
    next_ = f"day-{(day+1):02d}.html" if day < 15 else None

    nav_prev = f'<a href="{prev}">\u2190 {prev}</a>' if prev else '<span style="color:#484f58;">\u2190 Day {} (\u043f\u0435\u0440\u0432\u044b\u0439)</span>'.format(n)
    nav_next = f'<a href="{next_}">{next_} \u2192</a>' if next_ else '<span style="color:#484f58;">Day {} (\u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439) \u2192</span>'.format(n)

    ph = ""
    for en, ru in phrases:
        ph += '<div class="phrase"><strong>{en}</strong><span class="ru">{ru}</span></div>\n'.format(en=en, ru=ru)

    ch = ""
    for i, c in enumerate(checks, 1):
        ch += '<div class="checkbox-item"><input type="checkbox" id="sc{i}"><label for="sc{i}">{c}</label></div>\n'.format(i=i, c=c)

    dialog_html = ""
    if dialog:
        dialog_html = '<h2>\U0001f5e3\ufe0f \u0414\u0438\u0430\u043b\u043e\u0433 \u0434\u043b\u044f \u043e\u0442\u0440\u0430\u0431\u043e\u0442\u043a\u0438</h2>\n<p style="font-size:0.88em;color:#8b949e;">\u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439 \u0432\u0441\u043b\u0443\u0445 \u043f\u043e \u0440\u043e\u043b\u044f\u043c (\u0442\u044b — Customer). \u041f\u043e\u0442\u043e\u043c \u043f\u0435\u0440\u0435\u0441\u043a\u0430\u0436\u0438 \u043e\u0442 \u0441\u0432\u043e\u0435\u0433\u043e \u043b\u0438\u0446\u0430.</p>\n<div class="dialog">{dialog}</div>'.format(dialog=dialog)

    dict_html = ""
    if dictation:
        items = "\n".join("<li>{d}</li>".format(d=d) for d in dictation)
        dict_html = '<h2>\U0001f4dd \u0421\u0430\u043c\u043e\u0434\u0438\u043a\u0442\u0430\u043d\u0442</h2>\n<p style="font-size:0.88em;color:#8b949e;">\u0421\u043a\u0430\u0436\u0438 \u0440\u0443\u0441\u0441\u043a\u0443\u044e \u0444\u0440\u0430\u0437\u0443 \u2192 \u043f\u0430\u0443\u0437\u0430 \u2192 \u0441\u043a\u0430\u0436\u0438 \u043f\u043e-\u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438. \u041f\u043e\u0442\u043e\u043c \u043f\u0440\u043e\u0432\u0435\u0440\u044c \u0441\u0435\u0431\u044f.</p>\n<ol>\n{items}\n</ol>'.format(items=items)

    reading_html = ""
    if reading_title:
        reading_html = '<h2>Reading: {title}</h2>\n<div style="background:#161b22; border:1px solid #21262d; border-radius:8px; padding:12px 14px; margin:10px 0;">\n  <p style="color:#c9d1d9;">{text}</p>\n  <hr style="border: none; border-top: 1px solid #21262d; margin: 8px 0;">\n  <p style="color:#8b949e; font-size:0.9em;">{ru}</p>\n</div>\n<p><a href="read-{n}.html" style="color:#58a6ff;">\U0001f4d6 \u041f\u043e\u043b\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0434\u043b\u044f \u0447\u0442\u0435\u043d\u0438\u044f \u2192</a></p>'.format(title=reading_title, text=reading_text, ru=reading_ru, n=n)

    html = '<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Day {n} — {title}</title>\n<style>\n{CSS}</style>\n</head>\n<body>\n\n<a class="back" href="../index.html">\u2190 \u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e</a>\n<h1>Day {n} \u00b7 {title}</h1>\n<p style="color:#8b949e;font-size:0.9em;">{date} \u00b7 {week_label} \u00b7 \u041d\u043e\u0432\u044b\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</p>\n\n<div style="background:#1c2128;border-radius:8px;padding:10px 14px;margin:12px 0;font-size:0.88em;">\n  <strong>\U0001f3af \u0424\u043e\u043a\u0443\u0441 \u0434\u043d\u044f:</strong> {focus}<br><button class="audio-btn" onclick="openAudio()">\U0001f3b5 \u0410\u0443\u0434\u0438\u043e \u0434\u043d\u044f</button>\n</div>\n\n<h2>\U0001f501 \u041f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435</h2>\n<p style="color:#8b949e;font-size:0.9em;">{review}</p>\n\n<h2>\U0001f4d8 \u041d\u043e\u0432\u044b\u0435 \u0444\u0440\u0430\u0437\u044b — {title}</h2>\n\n{ph}\n\n<h2>\U0001f3ad AI-\u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0430</h2>\n<p style="font-size:0.88em;color:#8b949e;">\u0417\u0430\u043f\u0443\u0441\u0442\u0438 ChatGPT Voice Mode \u0438 \u0432\u0441\u0442\u0430\u0432\u044c \u044d\u0442\u043e\u0442 \u043f\u0440\u043e\u043c\u043f\u0442 (\u0441\u043c. <a href="../common/ai-scenarios.html" style="color:#58a6ff;">AI-\u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0438</a>):</p>\n<div class="prompt-box">You are a SAP consultant / vendor representative. I am a customer (process automation manager) with intermediate English. Speak clearly. Topic: {title}. Context: {focus}. Follow my lead in the conversation.</div>\n\n{dialog_html}\n\n{dict_html}\n\n{reading_html}\n\n<h2>\u2705 Self-check</h2>\n{ch}\n\n<div class="audio-overlay" id="audioOverlay" onclick="closeAudio()">\n  <div class="audio-overlay-content" onclick="event.stopPropagation()">\n    <button class="audio-close" onclick="closeAudio()">\u2715</button>\n    <audio controls autoplay>\n      <source src="../audio/day-{n}.mp3" type="audio/mpeg">\n    </audio>\n  </div>\n</div>\n\n<script>\nfunction openAudio() {{\n  document.getElementById(&quot;audioOverlay&quot;).classList.add(&quot;open&quot;);\n}}\nfunction closeAudio() {{\n  document.getElementById(&quot;audioOverlay&quot;).classList.remove(&quot;open&quot;);\n  var a = document.querySelector(&quot;#audioOverlay audio&quot;);\n  if (a) a.pause();\n}}\n(function() {{\n  var saved = localStorage.getItem("eng-day{n}");\n  if (saved) {{\n    var arr = JSON.parse(saved);\n    document.querySelectorAll(".checkbox-item input").forEach(function(c, i) {{\n      if (arr[i]) c.checked = true;\n    }});\n  }}\n  document.querySelectorAll(".checkbox-item input").forEach(function(c, i) {{\n    c.addEventListener("change", function() {{\n      var all = document.querySelectorAll(".checkbox-item input");\n      var arr = Array.from(all).map(function(x) {{ return x.checked; }});\n      localStorage.setItem("eng-day{n}", JSON.stringify(arr));\n    }});\n  }});\n}})();\n</script>\n\n<nav>\n  {nav_prev}\n  <a href="../index.html">\u0413\u043b\u0430\u0432\u043d\u0430\u044f</a>\n  {nav_next}\n</nav>\n\n</body>\n</html>'.format(
        n=n, title=title, focus=focus, date=date, week_label=week_label, review=review, ph=ph,
        ch=ch, dialog_html=dialog_html, dict_html=dict_html, reading_html=reading_html,
        nav_prev=nav_prev, nav_next=nav_next, CSS=CSS)

    path = "D:\\YD\\General\\4_english\\{week}\\day-{n}.html".format(week=week, n=n)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Created: " + path)

# === DAY 01 ===
gen_day(1,
    title="Opening a Meeting with Vendor",
    focus="\u041d\u0430\u0443\u0447\u0438\u0442\u044c\u0441\u044f \u0443\u0432\u0435\u0440\u0435\u043d\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u0432\u0441\u0442\u0440\u0435\u0447\u0443 \u0441 SAP-\u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u043e\u043c",
    date="\u0427\u0442 18 \u0438\u044e\u043d 2026",
    week_label="Week 1 \u2014 \u0417\u0430\u043a\u0430\u0437\u0447\u0438\u043a \u2192 \u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a",
    review="\u041f\u0435\u0440\u0432\u044b\u0439 \u0434\u0435\u043d\u044c \u2014 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u044f \u043d\u0435\u0442. \u041f\u0440\u043e\u0447\u0438\u0442\u0430\u0439 \u0432\u0441\u043b\u0443\u0445 \u0446\u0435\u043b\u0438 \u043a\u0443\u0440\u0441\u0430 \u043d\u0430 \u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u043e\u043c: 'I want to manage vendor meetings in English confidently.' / 'My goal is to clearly explain requirements to SAP consultants.' / 'I will practice every day for 15 days.'",
    phrases=[
        ("Good morning / afternoon everyone. Thanks for joining the call.", "\u0414\u043e\u0431\u0440\u043e\u0435 \u0443\u0442\u0440\u043e/\u0434\u0435\u043d\u044c \u0432\u0441\u0435\u043c. \u0421\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u043b\u0438\u0441\u044c \u043a \u0437\u0432\u043e\u043d\u043a\u0443."),
        ("Thank you for the proposal you sent. We've reviewed it internally.", "\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435. \u041c\u044b \u0435\u0433\u043e \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435 \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043b\u0438."),
        ("Let's start with the agenda. First topic is a new requirement from the regulator.", "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043d\u0430\u0447\u043d\u0451\u043c \u0441 \u043f\u043e\u0432\u0435\u0441\u0442\u043a\u0438. \u041f\u0435\u0440\u0432\u0430\u044f \u0442\u0435\u043c\u0430 \u2014 \u043d\u043e\u0432\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0442 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430."),
        ("We have participants from both our compliance team and your SAP team today.", "\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u0443 \u043d\u0430\u0441 \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u0438 \u043e\u0442 \u043d\u0430\u0448\u0435\u0433\u043e \u043a\u043e\u043c\u043f\u043b\u0430\u0435\u043d\u0441\u0430 \u0438 \u0432\u0430\u0448\u0435\u0439 SAP-\u043a\u043e\u043c\u0430\u043d\u0434\u044b."),
        ("Could you briefly introduce your team members?", "\u041c\u043e\u0436\u0435\u0442\u0435 \u043a\u0440\u0430\u0442\u043a\u043e \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432 \u0432\u0430\u0448\u0435\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u044b?"),
        ("The main goal of this meeting is to discuss the new regulatory change.", "\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0446\u0435\u043b\u044c \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u2014 \u043e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043d\u043e\u0432\u043e\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430."),
        ("I'll keep the meeting to 45 minutes to respect everyone's time.", "\u042f \u0443\u043b\u043e\u0436\u0443 \u0432\u0441\u0442\u0440\u0435\u0447\u0443 \u0432 45 \u043c\u0438\u043d\u0443\u0442."),
        ("Has everyone received the updated requirements document I sent earlier?", "\u0412\u0441\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u0438 \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d\u043d\u044b\u0439 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u0441 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u043c\u0438?"),
        ("Feel free to stop me if you have questions at any point.", "\u041d\u0435 \u0441\u0442\u0435\u0441\u043d\u044f\u0439\u0442\u0435\u0441\u044c \u043e\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0442\u044c \u043c\u0435\u043d\u044f \u043f\u0440\u0438 \u0432\u043e\u043f\u0440\u043e\u0441\u0430\u0445."),
        ("Let me share my screen to walk through the requirements.", "\u041f\u043e\u0437\u0432\u043e\u043b\u044c\u0442\u0435 \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u044d\u043a\u0440\u0430\u043d \u0438 \u043f\u0440\u043e\u0439\u0442\u0438\u0441\u044c \u043f\u043e \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u043c."),
    ],
    dialog='<span class="you">You (Customer):</span> Good morning everyone, thanks for joining. Let\'s start with the agenda. First topic is the new Chestny Znak requirement. Second, the impact on the SAP interface. John, has your team received the document I sent on Friday?<br><br><span class="vendor">John:</span> Yes, we received it. We have some clarifying questions.<br><br><span class="you">Customer:</span> Good. Let\'s go through the requirements first. Sarah from our compliance team will explain the regulatory background.',
    dictation=[
        "\u0414\u043e\u0431\u0440\u043e\u0435 \u0443\u0442\u0440\u043e \u0432\u0441\u0435\u043c, \u0441\u043f\u0430\u0441\u0438\u0431\u043e, \u0447\u0442\u043e \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u043b\u0438\u0441\u044c \u043a \u0437\u0432\u043e\u043d\u043a\u0443.",
        "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043d\u0430\u0447\u043d\u0451\u043c \u0441 \u043f\u043e\u0432\u0435\u0441\u0442\u043a\u0438. \u041f\u0435\u0440\u0432\u0430\u044f \u0442\u0435\u043c\u0430 \u2014 \u043d\u043e\u0432\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430.",
        "\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435. \u041c\u044b \u0435\u0433\u043e \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043b\u0438.",
        "\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0446\u0435\u043b\u044c \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u2014 \u043e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0432 \u0437\u0430\u043a\u043e\u043d\u043e\u0434\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0435.",
        "\u041f\u043e\u0437\u0432\u043e\u043b\u044c\u0442\u0435 \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u044d\u043a\u0440\u0430\u043d \u0438 \u043f\u0440\u043e\u0439\u0442\u0438\u0441\u044c \u043f\u043e \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u043c."
    ],
    checks=[
        "\u042f \u043c\u043e\u0433\u0443 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0432\u0441\u0442\u0440\u0435\u0447\u0443 \u0441 \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u043e\u043c \u0438 \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u043f\u043e\u0432\u0435\u0441\u0442\u043a\u0443",
        "\u042f \u043c\u043e\u0433\u0443 \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432 \u0441\u043e \u0441\u0432\u043e\u0435\u0439 \u0441\u0442\u043e\u0440\u043e\u043d\u044b",
        "\u042f \u0432\u044b\u0443\u0447\u0438\u043b 10 \u0444\u0440\u0430\u0437 \u0434\u043b\u044f \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u044f \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u0441 SAP-\u0432\u0435\u043d\u0434\u043e\u0440\u043e\u043c"
    ],
    reading_title="Kickoff Meetings with SAP Vendors",
    reading_text="A kickoff meeting with a new SAP vendor sets the foundation for the entire project. As a customer, your role is to clearly communicate the business requirements, regulatory deadlines, and expectations. Start by introducing all participants from both sides. State the agenda upfront. Share relevant documents. Give the vendor a chance to ask clarifying questions early. A good kickoff prevents misunderstandings later. The most important rule: do not assume the vendor knows your internal processes. Explain your compliance requirements, decision-making process, and key stakeholders. Agree on communication cadence. End with clear next steps and owners.",
    reading_ru="\u041a\u0438\u043a-\u043e\u0444\u0444 \u0441 \u043d\u043e\u0432\u044b\u043c SAP-\u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u043e\u043c \u0437\u0430\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u0442 \u043e\u0441\u043d\u043e\u0432\u0443 \u043f\u0440\u043e\u0435\u043a\u0442\u0430. \u0412\u0430\u0448\u0430 \u0440\u043e\u043b\u044c \u043a\u0430\u043a \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a\u0430 \u2014 \u0447\u0451\u0442\u043a\u043e \u0438\u0437\u043b\u043e\u0436\u0438\u0442\u044c \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f."
)

# === DAY 02 ===
gen_day(2,
    title="Assigning Tasks to Vendor",
    focus="\u0421\u0442\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u0434\u0430\u0447\u0438 SAP-\u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u0443: \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f, \u043e\u0446\u0435\u043d\u043a\u0430, \u0441\u0440\u043e\u043a\u0438",
    date="\u041f\u0442 19 \u0438\u044e\u043d 2026",
    week_label="Week 1 \u2014 \u0417\u0430\u043a\u0430\u0437\u0447\u0438\u043a \u2192 \u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a",
    review="\u041f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435 D01: \u041e\u0442\u043a\u0440\u043e\u0439 \u0432\u0441\u0442\u0440\u0435\u0447\u0443 \u0441 \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u043e\u043c \u0432\u0441\u043b\u0443\u0445: \u043f\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435, 2 \u0442\u0435\u043c\u044b \u0432 agenda.",
    phrases=[
        ("We have a new business requirement from the regulator.", "\u0423 \u043d\u0430\u0441 \u043d\u043e\u0432\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0442 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430."),
        ("Could you assess the impact and give us an estimate?", "\u041e\u0446\u0435\u043d\u0438\u0442\u0435 \u0432\u043b\u0438\u044f\u043d\u0438\u0435 \u0438 \u0434\u0430\u0439\u0442\u0435 \u043e\u0446\u0435\u043d\u043a\u0443?"),
        ("We need a solution for Chestny Znak. Please prepare a proposal.", "\u041d\u0443\u0436\u043d\u043e \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u0427\u0435\u0441\u0442\u043d\u043e\u0433\u043e \u0417\u043d\u0430\u043a\u0430. \u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435."),
        ("What is the timeline for the regulatory deadline?", "\u041a\u0430\u043a\u0438\u0435 \u0441\u0440\u043e\u043a\u0438 \u0434\u043b\u044f \u0434\u0435\u0434\u043b\u0430\u0439\u043d\u0430 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430?"),
        ("Please provide a cost estimate for this change.", "\u0414\u0430\u0439\u0442\u0435 \u043e\u0446\u0435\u043d\u043a\u0443 \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f."),
        ("Which SAP modules will be affected?", "\u041a\u0430\u043a\u0438\u0435 \u043c\u043e\u0434\u0443\u043b\u0438 SAP \u0437\u0430\u0442\u0440\u043e\u043d\u0443\u0442\u044b?"),
        ("Do you need more info from our side to proceed?", "\u041d\u0443\u0436\u043d\u0430 \u0434\u043e\u043f. \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0441 \u043d\u0430\u0448\u0435\u0439 \u0441\u0442\u043e\u0440\u043e\u043d\u044b?"),
        ("We need a proposal in two parts: technical + project plan.", "\u041d\u0443\u0436\u043d\u043e \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0438\u0437 2 \u0447\u0430\u0441\u0442\u0435\u0439: \u0442\u0435\u0445\u043d\u0438\u043a\u0430 + \u043f\u043b\u0430\u043d."),
        ("Is this in scope or a change request?", "\u042d\u0442\u043e \u0432 scope \u0438\u043b\u0438 change request?"),
        ("Please confirm receipt and deadline for proposal.", "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u0438 \u0441\u0440\u043e\u043a \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f."),
    ],
    dialog='<span class="you">You (Customer):</span> John, we have a new requirement from the CRPT. The DataMatrix format for dairy changed. We need your team to assess the impact.<br><br><span class="vendor">John:</span> Understood. Could you share the official document?<br><br><span class="you">Customer:</span> Yes. Please provide: impact assessment, timeline, cost estimate. We need to go live by October 1st.',
    dictation=[
        "\u0423 \u043d\u0430\u0441 \u043d\u043e\u0432\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0442 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430. \u041d\u0443\u0436\u043d\u043e \u0432\u0430\u0448\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435.",
        "\u041e\u0446\u0435\u043d\u0438\u0442\u0435 \u0432\u043b\u0438\u044f\u043d\u0438\u0435 \u043d\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0443 \u0438 \u0441\u0440\u043e\u043a\u0438.",
        "\u041a\u0430\u043a\u043e\u0439 \u043c\u043e\u0434\u0443\u043b\u044c SAP \u0437\u0430\u0442\u0440\u043e\u043d\u0443\u0442?",
        "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0438\u0437 2 \u0447\u0430\u0441\u0442\u0435\u0439.",
        "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u0438 \u0441\u0440\u043e\u043a."
    ],
    checks=[
        "\u042f \u043c\u043e\u0433\u0443 \u0441\u0444\u043e\u0440\u043c\u0443\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435",
        "\u042f \u043c\u043e\u0433\u0443 \u043e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u0441\u0440\u043e\u043a\u0438 \u0438 \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u043c\u043e\u0441\u0442\u044c",
        "\u042f \u043f\u043e\u043c\u043d\u044e \u0444\u0440\u0430\u0437\u044b D01 \u0431\u0435\u0437 \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0438"
    ],
    reading_title="Writing Clear Requirements",
    reading_text="Writing a clear business requirement is the most important skill with an SAP vendor. A vague requirement leads to wrong solutions, delays, and budget overruns. Use SMART: Specific, Measurable, Achievable, Relevant, Time-bound. Instead of 'we need Chestny Znak,' write 'we need to print DataMatrix codes on dairy labels by December 1st.' Include regulatory document references. State affected systems. Specify constraints.",
    reading_ru="\u0427\u0451\u0442\u043a\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u2014 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u043d\u0430\u0432\u044b\u043a \u0432 \u0440\u0430\u0431\u043e\u0442\u0435 \u0441 SAP-\u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u043e\u043c."
)

# === DAY 03 ===
gen_day(3,
    title="Change Request Due to Regulation",
    focus="\u0421\u043e\u043e\u0431\u0449\u0430\u0442\u044c \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u0443 \u043e\u0431 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u0445 \u0433\u043e\u0441\u043e\u0440\u0433\u0430\u043d\u043e\u0432 \u0438 \u0438\u043d\u0438\u0446\u0438\u0438\u0440\u043e\u0432\u0430\u0442\u044c Change Request",
    date="\u041f\u043d 22 \u0438\u044e\u043d 2026",
    week_label="Week 1 \u2014 \u0417\u0430\u043a\u0430\u0437\u0447\u0438\u043a \u2192 \u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a",
    review="\u041f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435 D02: \u0421\u043a\u0430\u0436\u0438 \u0432\u0441\u043b\u0443\u0445: 'We have a new requirement...' \u2014 \u043e\u0431\u044a\u044f\u0441\u043d\u0438 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u0438 \u0437\u0430\u043f\u0440\u043e\u0441\u0438 \u043e\u0446\u0435\u043d\u043a\u0443.",
    phrases=[
        ("The regulator updated the requirements. We need to change the scope.", "\u0420\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440 \u043e\u0431\u043d\u043e\u0432\u0438\u043b \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f. \u041d\u0443\u0436\u043d\u043e \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c scope."),
        ("This is a new government requirement. We must implement by [date].", "\u041d\u043e\u0432\u043e\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0435 \u0433\u043e\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0430. \u0412\u043d\u0435\u0434\u0440\u0438\u0442\u044c \u043a [\u0434\u0430\u0442\u0435]."),
        ("How will this affect the timeline and budget?", "\u041a\u0430\u043a \u044d\u0442\u043e \u043f\u043e\u0432\u043b\u0438\u044f\u0435\u0442 \u043d\u0430 \u0441\u0440\u043e\u043a\u0438 \u0438 \u0431\u044e\u0434\u0436\u0435\u0442?"),
        ("Please provide a revised proposal with the new scope.", "\u0414\u0430\u0439\u0442\u0435 \u043f\u0435\u0440\u0435\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043d\u043e\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435."),
        ("We need a formal Change Request to update the contract.", "\u041d\u0443\u0436\u0435\u043d \u0444\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u044b\u0439 Change Request."),
        ("Is this within the current budget or need additional approval?", "\u042d\u0442\u043e \u0432 \u0431\u044e\u0434\u0436\u0435\u0442\u0435 \u0438\u043b\u0438 \u043d\u0443\u0436\u043d\u043e \u0441\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u043d\u0438\u0435?"),
        ("The regulatory deadline is firm. No extension possible.", "\u0414\u0435\u0434\u043b\u0430\u0439\u043d \u0436\u0451\u0441\u0442\u043a\u0438\u0439. \u041f\u0440\u043e\u0434\u043b\u0435\u043d\u0438\u0435 \u043d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e."),
        ("We need a workaround while the permanent fix is developed.", "\u041d\u0443\u0436\u043d\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435."),
        ("Can we phase this — MVP by deadline, full solution later?", "\u041c\u043e\u0436\u043d\u043e \u043f\u043e\u044d\u0442\u0430\u043f\u043d\u043e: MVP \u043a \u0441\u0440\u043e\u043a\u0443, \u043f\u043e\u0442\u043e\u043c \u043f\u043e\u043b\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435?"),
        ("This change is critical for compliance.", "\u042d\u0442\u043e \u043a\u0440\u0438\u0442\u0438\u0447\u043d\u043e \u0434\u043b\u044f \u0441\u043e\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u044f \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u0439."),
    ],
    dialog='<span class="you">You (Customer):</span> John, the CRPT changed the marking rules for dairy. Every item must now be marked, not just outer packaging. This changes the scope significantly.<br><br><span class="vendor">John:</span> That is substantial. It will affect timeline and budget. We need a formal Change Request.<br><br><span class="you">Customer:</span> I understand. Please prepare a revised proposal. Deadline is still December 1st. Can we do MVP by then and full rollout later?',
    dictation=[
        "\u0420\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440 \u043e\u0431\u043d\u043e\u0432\u0438\u043b \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f. \u041d\u0443\u0436\u043d\u043e \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c scope.",
        "\u041a\u0430\u043a \u044d\u0442\u043e \u043f\u043e\u0432\u043b\u0438\u044f\u0435\u0442 \u043d\u0430 \u0441\u0440\u043e\u043a\u0438 \u0438 \u0431\u044e\u0434\u0436\u0435\u0442?",
        "\u0414\u0430\u0439\u0442\u0435 \u043f\u0435\u0440\u0435\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043d\u043e\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435.",
        "\u041d\u0443\u0436\u043d\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0434\u043e \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u043e\u0433\u043e.",
        "\u0414\u0435\u0434\u043b\u0430\u0439\u043d \u0436\u0451\u0441\u0442\u043a\u0438\u0439. \u041d\u0435\u043b\u044c\u0437\u044f \u043f\u0440\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c."
    ],
    checks=[
        "\u042f \u043c\u043e\u0433\u0443 \u0438\u043d\u0438\u0446\u0438\u0438\u0440\u043e\u0432\u0430\u0442\u044c Change Request \u043f\u0440\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0438 \u0440\u0435\u0433\u0443\u043b\u044f\u0442\u043e\u0440\u0430",
        "\u042f \u043c\u043e\u0433\u0443 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0442\u044c \u043f\u043e\u044d\u0442\u0430\u043f\u043d\u043e\u0435 \u0432\u043d\u0435\u0434\u0440\u0435\u043d\u0438\u0435 (MVP + later)",
        "\u042f \u043c\u043e\u0433\u0443 \u0447\u0451\u0442\u043a\u043e \u0441\u043a\u0430\u0437\u0430\u0442\u044c \u043e \u0436\u0451\u0441\u0442\u043a\u043e\u043c \u0434\u0435\u0434\u043b\u0430\u0439\u043d\u0435"
    ],
    reading_title="Government Regulations and SAP",
    reading_text="Government regulations change frequently, and SAP systems must adapt. In Russia, the main systems are Chestny Znak (DataMatrix tracking) and Mercury (veterinary certificates). Both regularly update formats. As a customer, monitor changes and inform your vendor fast. When a regulation changes: read the document, identify impact, estimate effort, inform the vendor. Keep a regulatory compliance calendar.",
    reading_ru="\u0420\u0435\u0433\u0443\u043b\u044f\u0446\u0438\u0438 \u043c\u0435\u043d\u044f\u044e\u0442\u0441\u044f \u0447\u0430\u0441\u0442\u043e. \u041a\u0430\u043a \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a, \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u0439\u0442\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0438 \u0438\u043d\u0444\u043e\u0440\u043c\u0438\u0440\u0443\u0439\u0442\u0435 \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u0430."
)

# === DAY 04 ===
gen_day(4,
    title="Q&A and Clarifying with Vendor",
    focus="Переспрашивать, уточнять и просить объяснить проще, когда подрядчик говорит сложно или быстро",
    date="Вт 23 июн 2026",
    week_label="Week 1 — Заказчик → Подрядчик",
    review="Повторение D03: Скажи вслух: 'The regulator updated the requirements...' и продолжи.",
    phrases=[
        ("Sorry, could you repeat that more slowly?", "Извините, не могли бы вы повторить помедленнее?"),
        ("Could you explain that in simpler terms?", "Не могли бы вы объяснить проще?"),
        ("I didn't quite catch that. Could you say it again?", "Я не совсем уловил. Повторите, пожалуйста."),
        ("What does 'API endpoint' mean in this context?", "Что значит 'API endpoint' в этом контексте?"),
        ("Could you give me an example?", "Можете привести пример?"),
        ("Let me check if I understood correctly: you mean...", "Давайте проверю, правильно ли я понял: вы имеете в виду..."),
        ("Could you send a summary of what you just explained?", "Можете отправить краткое объяснение?"),
        ("Does this affect the EDI interface or just the API?", "Это влияет на EDI или только на API?"),
        ("Are you talking about production or test environment?", "Вы говорите о промышленной или тестовой среде?"),
        ("Please confirm I understood the tasks correctly in an email.", "Подтвердите в письме, что я правильно понял задачи."),
    ],
    dialog='<span class="you">You (Customer):</span> Sorry, could you repeat that more slowly? I didn\'t quite catch the part about the API endpoint.<br><br><span class="vendor">Vendor:</span> Of course. I said the new CRPT API endpoint requires a different authentication method — OAuth 2.0 instead of the simple token we use now.<br><br><span class="you">Customer:</span> Could you explain that in simpler terms? What does OAuth 2.0 mean for us practically?<br><br><span class="vendor">Vendor:</span> It means we need to implement a token refresh mechanism. The current integration will stop working after August 1st.<br><br><span class="you">Customer:</span> Let me check if I understood correctly: you mean we need to update the SAP PI interface to support the new authentication before August?<br><br><span class="vendor">Vendor:</span> Exactly. The change is on the interface layer, not in the ECC backend.',
    dictation=[
        "Извините, не могли бы вы повторить помедленнее?",
        "Я не совсем уловил. Повторите, пожалуйста.",
        "Не могли бы вы объяснить проще?",
        "Давайте проверю, правильно ли я понял.",
        "Подтвердите в письме, что я правильно понял задачи."
    ],
    checks=[
        "Я могу попросить повторить медленнее и проще",
        "Я могу переспросить, используя 'Let me check if I understood correctly'",
        "Я могу попросить пример или письменное объяснение"
    ],
    reading_title="Clarifying Questions in Vendor Meetings",
    reading_text="Asking clarifying questions is a critical skill for non-native speakers in vendor meetings. When the vendor speaks too fast or uses technical jargon, you must stop them politely. Use phrases like 'Sorry, could you repeat that more slowly?' or 'Could you explain that in simpler terms?' Never pretend you understood when you did not. This leads to misunderstandings and incorrect implementations. After clarification, always paraphrase to confirm: 'Let me check if I understood correctly...' This gives the vendor a chance to correct you. Finally, ask for a written summary in an email. This creates a paper trail and helps you review later.",
    reading_ru="Не стесняйтесь переспрашивать подрядчика. Используйте вежливые фразы, перефразируйте для проверки и просите email-сводку."
)

# === DAY 05 ===
gen_day(5,
    title="Closing Meeting with Vendor",
    focus="Закрывать встречу: резюмировать, назначать задачи, фиксировать дедлайны",
    date="Ср 24 июн 2026",
    week_label="Week 1 — Заказчик → Подрядчик",
    review="Повторение D04: Представь, что подрядчик сказал сложную фразу. Ответь: 'Sorry, could you repeat that more slowly?'",
    phrases=[
        ("Let me summarize what we've agreed on today.", "Давайте подведём итог того, о чём договорились."),
        ("Our main action item is the impact assessment. John, you own this.", "Наш главный пункт — оценка влияния. Джон, вы отвечаете."),
        ("Please send the minutes to everyone by tomorrow.", "Пожалуйста, отправьте протокол всем до завтра."),
        ("The deadline for the proposal is next Friday, July 3rd.", "Дедлайн предложения — следующая пятница, 3 июля."),
        ("Let's schedule a follow-up for next Tuesday to review.", "Давайте назначим follow-up на следующий вторник."),
        ("Does everyone agree on these next steps?", "Все согласны с этими шагами?"),
        ("If there are no questions, we can wrap up here.", "Если вопросов нет, можем заканчивать."),
        ("Thank you all for your time today.", "Спасибо всем за время."),
        ("I'll share the meeting notes in an hour.", "Я отправлю заметки через час."),
        ("Let's confirm the next meeting: Tuesday, July 7th, 10 AM.", "Подтвердим следующую встречу: вторник, 7 июля, 10 утра."),
    ],
    dialog='<span class="you">You (Customer):</span> Let me summarize what we\'ve agreed on today. First, the vendor team will assess the impact of the new CRPT requirement on the SAP interface. Second, you will provide a proposal by July 3rd. Third, we schedule a follow-up on July 7th. Does everyone agree?<br><br><span class="vendor">Vendor:</span> Agreed. We\'ll start the assessment tomorrow.<br><br><span class="you">Customer:</span> John, you own the impact assessment. Please send the minutes to everyone by tomorrow. I\'ll share my notes as well. Thank you all for your time. If there are no questions, we can wrap up here.',
    dictation=[
        "Давайте подведём итог того, о чём договорились.",
        "Наш главный пункт — оценка влияния. Джон, вы отвечаете.",
        "Дедлайн предложения — следующая пятница.",
        "Давайте назначим follow-up на следующий вторник.",
        "Спасибо всем за время."
    ],
    checks=[
        "Я могу подвести итог встречи с 3 пунктами",
        "Я могу назначить ответственного и дедлайн",
        "Я могу вежливо завершить встречу и договориться о следующей"
    ],
    reading_title="Closing Vendor Meetings Effectively",
    reading_text="Closing a vendor meeting properly is as important as opening one. A good closing ensures everyone leaves with the same understanding. Start your closing with 'Let me summarize what we've agreed on today.' List 2-3 key decisions or action items. Assign owners for each task. Set clear deadlines. Agree on a follow-up meeting date and time. Ask 'Does everyone agree on these next steps?' to confirm alignment. Thank the participants. Finally, send meeting notes within a few hours. This practice builds trust and accountability with your vendor and prevents scope creep.",
    reading_ru="Правильное завершение встречи гарантирует, что все поняли задачи. Резюмируйте, назначьте ответственных, дедлайны и отправьте протокол."
)

# === DAY 06 ===
gen_day(6,
    title="Small Talk with Vendor",
    focus="Делать small talk с SAP-подрядчиком перед деловой частью",
    date="Чт 25 июн 2026",
    week_label="Week 2 — Заказчик → Подрядчик",
    review="Повторение D05: Закрой встречу: 'Let me summarize what we\'ve agreed...' — 3 пункта.",
    phrases=[
        ("How was your weekend? Did you do anything nice?", "Как прошли выходные? Делали что-то приятное?"),
        ("How was your trip to Moscow last week?", "Как поездка в Москву на прошлой неделе?"),
        ("The weather is really hot today, isn't it?", "Погода сегодня очень жаркая, не так ли?"),
        ("Are you busy with other projects these days?", "Вы заняты другими проектами сейчас?"),
        ("Okay, let's get down to business.", "Хорошо, давайте перейдём к делу."),
        ("I hope you had a good holiday.", "Надеюсь, у вас был хороший отпуск."),
        ("Did you manage to take some time off this summer?", "Удалось отдохнуть этим летом?"),
        ("That's interesting. How long have you been working in SAP consulting?", "Это интересно. Как давно вы в SAP-консалтинге?"),
        ("By the way, I saw your company won an award. Congratulations!", "Кстати, видел, что ваша компания получила награду. Поздравляю!"),
        ("Let's start with the agenda. First topic is the Mercury integration.", "Давайте начнём с повестки. Первая тема — интеграция с Меркурием."),
    ],
    dialog='<span class="you">You (Customer):</span> Hi John! Good to see you again. How was your weekend? Did you do anything nice?<br><br><span class="vendor">Vendor:</span> It was good, thanks! I took my kids to the park on Saturday. The weather was great.<br><br><span class="you">Customer:</span> That sounds lovely. The weather has been really nice lately. So, shall we get down to business? Let\'s start with the agenda. First topic is the Mercury VSD integration update.',
    dictation=[
        "Как прошли выходные? Делали что-то приятное?",
        "Погода сегодня очень жаркая, не так ли?",
        "Давайте перейдём к делу.",
        "Кстати, видел, что ваша компания получила награду.",
        "Давайте начнём с повестки."
    ],
    checks=[
        "Я могу начать встречу с небольшого small talk",
        "Я могу задать 2-3 непринуждённых вопроса перед делом",
        "Я могу естественно перейти к повестке"
    ],
    reading_title="The Art of Small Talk with Vendors",
    reading_text="Small talk is an important soft skill when working with external vendors. It builds rapport before diving into business. Keep it light: ask about weekends, holidays, weather, or travel. Listen to their answer and show genuine interest. After 2-3 exchanges, transition smoothly: 'Okay, let's get down to business' or 'Shall we start with the agenda?' Good small talk makes the vendor feel comfortable, which leads to more open and productive discussions. Avoid politics, religion, or personal finance. Stick to safe topics like hobbies, food, or the city they live in.",
    reading_ru="Small talk помогает установить хорошие отношения с подрядчиком. Спрашивайте о безопасных темах и плавно переходите к делу."
)

# === DAY 07 ===
gen_day(7,
    title="Handling Complaints to Vendor",
    focus="Выражать недовольство подрядчику конструктивно: срыв сроков, качество",
    date="Пт 26 июн 2026",
    week_label="Week 2 — Заказчик → Подрядчик",
    review="Повторение D06: Начни small talk с подрядчиком, перейди к делу.",
    phrases=[
        ("I need to raise a concern about the timeline.", "Я должен поднять вопрос о сроках."),
        ("The quality of the latest deliverable is not what we expected.", "Качество последнего результата не соответствует ожиданиям."),
        ("We agreed on July 3rd. My team is blocked without this.", "Мы договорились на 3 июля. Моя команда блокирована."),
        ("We found several issues in the test results. Let me walk you through them.", "Мы нашли несколько проблем в результатах тестов."),
        ("What went wrong, and how will you fix it?", "Что пошло не так и как вы это исправите?"),
        ("I expect a revised plan with realistic milestones.", "Я ожидаю обновлённый план с реалистичными вехами."),
        ("This is not the first time we have this issue.", "Это не первый раз, когда у нас эта проблема."),
        ("I want to understand the root cause.", "Я хочу понять первопричину."),
        ("Please escalate this to your project manager.", "Пожалуйста, эскалируйте это своему руководителю."),
        ("Let's schedule a separate call to discuss the issues in detail.", "Давайте назначим отдельный звонок."),
    ],
    dialog='<span class="you">You (Customer):</span> John, I need to raise a concern about the timeline. You were supposed to deliver the impact assessment by last Friday. My team is blocked without it.<br><br><span class="vendor">Vendor:</span> I apologise. We had some resource issues. I can deliver it by Wednesday.<br><br><span class="you">Customer:</span> This is not the first time we have this issue. I want to understand the root cause. Also, the quality of the last deliverable was not what we expected. We found several issues in the test results. What went wrong, and how will you fix it?',
    dictation=[
        "Я должен поднять вопрос о сроках.",
        "Качество последнего результата не соответствует ожиданиям.",
        "Что пошло не так и как вы это исправите?",
        "Я хочу понять первопричину.",
        "Это не первый раз, когда у нас эта проблема."
    ],
    checks=[
        "Я могу вежливо, но твёрдо выразить недовольство",
        "Я могу попросить анализ первопричины и план исправления",
        "Я могу эскалировать проблему при необходимости"
    ],
    reading_title="Constructive Complaints to SAP Vendors",
    reading_text="Raising a complaint with a vendor is uncomfortable but sometimes necessary. The key is to stay professional and constructive. Start with 'I need to raise a concern about...' State the facts: what was promised, what was delivered, and the impact on your team. Ask for root cause analysis: 'I want to understand what went wrong.' Then request a corrective plan: 'I expect a revised plan with realistic milestones.' Avoid emotional language or personal accusations. Focus on the problem, not the person. If this is a repeated issue, mention it calmly. Offer to escalate if needed.",
    reading_ru="Выражайте недовольство конструктивно: факты, причины, план исправления. Избегайте эмоций и личных обвинений."
)

# === DAY 08 ===
gen_day(8,
    title="Scope Disputes with Vendor",
    focus="Обсуждать спорные вопросы: scope, change order, компромиссы",
    date="Пн 29 июн 2026",
    week_label="Week 2 — Заказчик → Подрядчик",
    review="Повторение D07: Скажи: 'I need to raise a concern about the timeline...' — объясни проблему.",
    phrases=[
        ("We believe this is within the current project scope.", "Мы считаем, что это в рамках текущего объёма работ."),
        ("I disagree. This was not part of the original agreement.", "Я не согласен. Это не было частью изначального договора."),
        ("We need to raise a Change Request for this new requirement.", "Нужно оформить Change Request на новое требование."),
        ("Can we find a compromise? Perhaps share the cost 50/50?", "Можем найти компромисс? Например, разделить стоимость 50/50?"),
        ("Let's look at the contract. Section 3.2 covers regulatory changes.", "Давайте посмотрим контракт. Раздел 3.2 описывает регуляторные изменения."),
        ("This change is mandated by law. It's not optional.", "Это изменение обязательно по закону."),
        ("I propose we split the work: MVP in current scope, enhancements as CR.", "Предлагаю разделить: MVP в текущем объёме, улучшения как CR."),
        ("Let's involve the legal team to review the contract.", "Давайте привлечём юристов для анализа контракта."),
        ("I understand your position, but we have a different interpretation.", "Я понимаю вашу позицию, но у нас другая трактовка."),
        ("Let's document our disagreement and escalate if needed.", "Давайте зафиксируем разногласия и эскалируем при необходимости."),
    ],
    dialog='<span class="you">You (Customer):</span> John, my compliance team reviewed the new CRPT requirement. We believe this DataMatrix change is within the current project scope. The contract says SAP interface changes for regulatory updates are included.<br><br><span class="vendor">Vendor:</span> I disagree. This requires a new API endpoint that was not in the original specification. It should be a Change Request.<br><br><span class="you">Customer:</span> Let\'s look at Section 3.2 of the contract together. It clearly states regulatory format changes are in scope. However, I understand your position. Can we find a compromise? Perhaps we cover the PI layer, you cover the backend changes?',
    dictation=[
        "Мы считаем, что это в рамках текущего объёма работ.",
        "Нужно оформить Change Request на новое требование.",
        "Можем найти компромисс?",
        "Давайте посмотрим контракт. Раздел 3.2.",
        "Я понимаю вашу позицию, но у нас другая трактовка."
    ],
    checks=[
        "Я могу обосновать свою позицию по scope со ссылкой на контракт",
        "Я могу предложить компромисс при разногласии",
        "Я могу документировать разногласия и эскалировать"
    ],
    reading_title="Managing Scope Disputes with Your Vendor",
    reading_text="Scope disputes are common in SAP projects. The key is to always refer to the contract. Before the meeting, read the relevant sections. During the dispute, state your interpretation clearly: 'We believe this is within the current project scope.' Listen to the vendor's position. If disagreement persists, propose a compromise: split cost, phase the work, or trade scope items. Document everything. If no agreement is reached, escalate formally. Never accept scope changes verbally without a written Change Request. This protects both sides and maintains a professional relationship.",
    reading_ru="Споры по объёму работ часты. Всегда ссылайтесь на контракт, предлагайте компромиссы и документируйте всё."
)

# === DAY 09 ===
gen_day(9,
    title="Summarizing Vendor Discussions",
    focus="Структурировать хаотичное обсуждение с подрядчиком",
    date="Вт 30 июн 2026",
    week_label="Week 2 — Заказчик → Подрядчик",
    review="Повторение D08: Скажи: 'We believe this is within the current project scope...'",
    phrases=[
        ("Let me stop you there. I want to make sure I understand.", "Позвольте остановить. Я хочу убедиться, что понимаю."),
        ("So if I understand correctly, there are three main issues.", "Итак, если я правильно понимаю, есть три основных проблемы."),
        ("Let's take one topic at a time.", "Давайте рассматривать одну тему за раз."),
        ("I want to capture this. Can you repeat the key point?", "Я хочу записать. Повторите ключевой момент?"),
        ("Let's structure this. First point: the API change. Second: testing.", "Давайте структурируем. Первое: изменение API. Второе: тестирование."),
        ("I'm going to pause you here and summarize what I heard.", "Я остановлю вас и резюмирую, что услышал."),
        ("Did I miss anything?", "Я ничего не упустил?"),
        ("Could you send a bullet-point summary after the call?", "Можете отправить список ключевых пунктов после звонка?"),
        ("Let me take a step back and look at the big picture.", "Позвольте взглянуть шире."),
        ("Okay, I think I have a clear picture now. Let me confirm.", "Хорошо, теперь ясно. Позвольте подтвердить."),
    ],
    dialog='<span class="you">You (Customer):</span> John, let me stop you there. I want to make sure I understand. You mentioned the API change, the testing delay, and the Mercury integration issue. Let\'s take one topic at a time. First point: the API change. What exactly needs to be done?<br><br><span class="vendor">Vendor:</span> We need to update the OAuth token endpoint and add a retry mechanism.<br><br><span class="you">Customer:</span> Got it. Let me capture this. Second point: testing delay. How many days?<br><br><span class="vendor">Vendor:</span> We are 5 days behind schedule due to environment issues.<br><br><span class="you">Customer:</span> I\'m going to pause you here and summarize what I heard. Point one: update OAuth — you\'ll provide a timeline. Point two: testing — you\'ll propose a catch-up plan. Did I miss anything?',
    dictation=[
        "Позвольте остановить. Я хочу убедиться, что понимаю.",
        "Давайте рассматривать одну тему за раз.",
        "Давайте структурируем. Первое: изменение API.",
        "Я ничего не упустил?",
        "Позвольте взглянуть шире."
    ],
    checks=[
        "Я могу вежливо остановить подрядчика и резюмировать",
        "Я могу структурировать хаотичное обсуждение по пунктам",
        "Я могу попросить письменную сводку после звонка"
    ],
    reading_title="Taking Control of Chaotic Vendor Discussions",
    reading_text="SAP vendors sometimes go into long technical explanations that lose the main point. As the customer, you must take control. Use phrases like 'Let me stop you there' or 'Let's take one topic at a time.' Break down the discussion into clear points. Summarize frequently: 'So if I understand correctly, there are three main issues.' Ask for confirmation: 'Did I miss anything?' This keeps the meeting efficient and ensures nothing is forgotten. After the call, always request a bullet-point summary by email. This habit prevents misunderstandings and creates a reliable communication record.",
    reading_ru="Берите контроль над обсуждением: останавливайте, структурируйте, резюмируйте и запрашивайте письменную сводку."
)

# === DAY 10 ===
gen_day(10,
    title="Follow-up with Vendor",
    focus="Проводить follow-up: контроль задач, напоминание, корректировка сроков",
    date="Ср 1 июл 2026",
    week_label="Week 2 — Заказчик → Подрядчик",
    review="Повторение D09: Останови хаотичный рассказ подрядчика: 'Let me stop you there...'",
    phrases=[
        ("Let's do a quick follow-up on our action items from last week.", "Давайте быстро проверим задачи с прошлой недели."),
        ("What's the status of the impact assessment?", "Какой статус оценки влияния?"),
        ("Is it on track for the July 3rd deadline?", "Всё идёт по плану к дедлайну 3 июля?"),
        ("I noticed we didn't receive the document. What happened?", "Я заметил, что мы не получили документ. Что случилось?"),
        ("Just a friendly reminder about the proposal due Friday.", "Просто напоминание о предложении к пятнице."),
        ("We need to adjust the deadline. Can you propose a new date?", "Нужно скорректировать срок. Предложите новую дату?"),
        ("Based on your update, we need to revise the project plan.", "На основе вашего обновления нужно пересмотреть план."),
        ("Do you need any support from our side to unblock the task?", "Нужна помощь с нашей стороны для разблокировки?"),
        ("Great, task one is done. Let's move to task two.", "Отлично, задача выполнена. Переходим ко второй."),
        ("Let's set a new deadline and keep each other updated.", "Давайте поставим новый дедлайн и держать друг друга в курсе."),
    ],
    dialog='<span class="you">You (Customer):</span> Hi John, let\'s do a quick follow-up on our action items from last week. First, what\'s the status of the impact assessment? Is it on track for the July 3rd deadline?<br><br><span class="vendor">Vendor:</span> We\'re 80% done. Should be ready by Friday as planned.<br><br><span class="you">Customer:</span> Great. Second, I noticed we didn\'t receive the API documentation. What happened?<br><br><span class="vendor">Vendor:</span> Our technical writer was on sick leave. I can send a draft by Monday.<br><br><span class="you">Customer:</span> Okay, let\'s set a new deadline: Monday, July 6th. Do you need any support from our side to unblock this?',
    dictation=[
        "Давайте быстро проверим задачи с прошлой недели.",
        "Какой статус оценки влияния?",
        "Просто напоминание о предложении к пятнице.",
        "Нужно скорректировать срок. Предложите новую дату?",
        "Нужна помощь с нашей стороны?"
    ],
    checks=[
        "Я могу провести follow-up: спросить статус, напомнить, скорректировать сроки",
        "Я могу предложить помощь для разблокировки задач",
        "Я могу пересмотреть план на основе обновлений подрядчика"
    ],
    reading_title="Effective Follow-ups with External Vendors",
    reading_text="A follow-up meeting checks progress on agreed action items. Structure it simply: list 3-5 tasks from the last meeting, ask for status on each, and update deadlines if needed. Start with 'Let's do a quick follow-up on our action items from last week.' Ask specific questions: 'What's the status of X?' 'Is it on track for the deadline?' If a task is delayed, ask why, offer support, and agree on a new deadline. End by confirming the updated list. Regular follow-ups build accountability and help catch problems early before they become crises.",
    reading_ru="Регулярные follow-up помогают контролировать задачи и выявлять проблемы на ранней стадии. Спрашивайте статус, корректируйте сроки, предлагайте помощь."
)

# === DAY 11 ===
gen_day(11,
    title="Full Meeting: New SAP Requirement",
    focus="Полная встреча: открытие → постановка задачи → обсуждение → резюме → задачи",
    date="Чт 2 июл 2026",
    week_label="Week 3 — Заказчик → Подрядчик",
    review="Повторение D10: Открой follow-up: спроси статус 2 задач.",
    phrases=[
        ("Good morning everyone. Thanks for joining today's call.", "Доброе утро всем. Спасибо, что присоединились."),
        ("We have a new requirement for the Mercury VSD integration.", "У нас новое требование по интеграции с Меркурием."),
        ("The regulator now requires VSD numbers in the XML format before shipment.", "Регулятор теперь требует номера VSD в XML до отгрузки."),
        ("What is the impact on our current process?", "Какое влияние на нынешний процесс?"),
        ("Which systems need changes — ECC, PI, or both?", "Какие системы нужно менять — ECC, PI или обе?"),
        ("Please provide a proposal with timeline and cost.", "Пожалуйста, дайте предложение с сроками и стоимостью."),
        ("The deadline is September 1st. Is that feasible?", "Дедлайн — 1 сентября. Это выполнимо?"),
        ("Let me summarize: the key action items are impact assessment and proposal.", "Подведём итог: ключевые задачи — оценка и предложение."),
        ("John, you own the assessment. Maria, you handle the proposal.", "Джон, вы отвечаете за оценку. Мария, вы за предложение."),
        ("Let's schedule a follow-up for next Thursday.", "Давайте назначим follow-up на следующий четверг."),
    ],
    dialog='<span class="you">You (Customer):</span> Good morning everyone. Thanks for joining. We have a new requirement for Mercury VSD. The regulator now requires VSD numbers in the XML file before shipment. This changes our current process. John, what is the impact on ECC and PI?<br><br><span class="vendor">Vendor:</span> Both systems need changes. ECC needs a new BADI for VSD generation. PI needs a new mapping.<br><br><span class="you">Customer:</span> I see. Please provide a proposal with timeline and cost. The deadline is September 1st. Is that feasible?<br><br><span class="vendor">Vendor:</span> We\'ll assess and get back to you by next Tuesday.<br><br><span class="you">Customer:</span> Let me summarize: key action items are 1) impact assessment, 2) proposal with timeline and cost. John owns assessment, Maria owns proposal. Let\'s schedule a follow-up for next Thursday at 10 AM.',
    dictation=[
        "У нас новое требование по интеграции с Меркурием.",
        "Какие системы нужно менять — ECC, PI или обе?",
        "Пожалуйста, дайте предложение с сроками и стоимостью.",
        "Дедлайн — 1 сентября. Это выполнимо?",
        "Джон, вы отвечаете за оценку."
    ],
    checks=[
        "Я могу провести полную встречу: открытие → задача → обсуждение → резюме → задачи",
        "Я могу объяснить новое регуляторное требование и его влияние",
        "Я могу назначить ответственных и дедлайны"
    ],
    reading_title="Running a Full Requirement Meeting with a Vendor",
    reading_text="A full requirement meeting follows five stages. First, opening: greet everyone and state the agenda. Second, requirement: explain the new need clearly, referencing the regulatory document. Third, discussion: ask the vendor about impact, affected systems, and feasibility. Listen to their concerns and clarify ambiguities. Fourth, summary: recap the key decisions and action items. Fifth, assignments: name owners for each task with deadlines, and schedule the next follow-up. This structure works for any new requirement and ensures nothing is missed. Practicing this flow makes you a confident meeting leader.",
    reading_ru="Полная встреча из 5 этапов: открытие, задача, обсуждение, резюме, задачи. Этот формат подходит для любого нового требования."
)

# === DAY 12 ===
gen_day(12,
    title="Full Meeting: Critical SAP Incident",
    focus="Экстренная встреча по критическому инциденту с подрядчиком",
    date="Пт 3 июл 2026",
    week_label="Week 3 — Заказчик → Подрядчик",
    review="Повторение D11: Открой встречу с повесткой из 2 тем.",
    phrases=[
        ("We have a critical incident. The SAP interface is down.", "У нас критический инцидент. Интерфейс SAP не работает."),
        ("The DataMatrix label generation stopped at 8 AM this morning.", "Генерация кодов DataMatrix остановилась в 8 утра."),
        ("Our warehouse cannot ship without labels.", "Наш склад не может отгружать без маркировки."),
        ("What is the root cause? How long to fix?", "В чём первопричина? Сколько времени на исправление?"),
        ("Is there a workaround while you fix the root cause?", "Есть временное решение на время починки?"),
        ("Who is working on this right now?", "Кто сейчас этим занимается?"),
        ("Please escalate to your senior engineers immediately.", "Немедленно эскалируйте старшим инженерам."),
        ("I want a status update every hour until resolved.", "Я хочу отчёт каждый час до устранения."),
        ("Document the incident and steps for a post-mortem.", "Задокументируйте инцидент для разбора."),
        ("Once fixed, we need a root cause analysis report.", "После исправления нужен отчёт с анализом первопричин."),
    ],
    dialog='<span class="you">You (Customer):</span> John, we have a critical incident. The SAP interface for DataMatrix label generation is down since 8 AM. Our warehouse cannot ship. What is the root cause? How long to fix?<br><br><span class="vendor">Vendor:</span> We identified a database connection issue on the PI server. Our team is working on it. Estimated fix in 4 hours.<br><br><span class="you">Customer:</span> Is there a workaround while you fix it? Please escalate to your senior engineers. I want a status update every hour until resolved. After the fix, I expect a root cause analysis report.',
    dictation=[
        "У нас критический инцидент. Интерфейс SAP не работает.",
        "Генерация кодов DataMatrix остановилась в 8 утра.",
        "В чём первопричина? Сколько времени на исправление?",
        "Я хочу отчёт каждый час до устранения.",
        "После исправления нужен отчёт с анализом первопричин."
    ],
    checks=[
        "Я могу быстро организовать экстренную встречу по инциденту",
        "Я могу запросить первопричину, время исправления и временное решение",
        "Я могу требовать часовой отчёт и RCA после устранения"
    ],
    reading_title="Handling Critical SAP Incidents with Your Vendor",
    reading_text="Critical incidents happen in SAP projects. The key is response speed. When an incident occurs, call the vendor immediately. Start with: 'We have a critical incident.' Describe the impact on business operations. Ask three questions: root cause, estimated fix time, workaround. Demand hourly updates. Require escalation if needed. After resolution, request a formal root cause analysis report. Keep a calm but firm tone. The vendor should feel the urgency without panic. Document the entire incident timeline for your records and to prevent recurrence.",
    reading_ru="При критическом инциденте звоните подрядчику немедленно. Спрашивайте причину, срок и обходное решение. Требуйте часовой отчёт и RCA."
)

# === DAY 13 ===
gen_day(13,
    title="Full Meeting: Two Regulatory Changes",
    focus="Встреча по двум регуляторным изменениям: ЧЗ и Меркурий",
    date="Пн 6 июл 2026",
    week_label="Week 3 — Заказчик → Подрядчик",
    review="Повторение D12: Скажи: 'We have a critical incident. The SAP interface is down...'",
    phrases=[
        ("Today's agenda has two topics: Chestny Znak and Mercury updates.", "Сегодня две темы: обновления ЧЗ и Меркурия."),
        ("Let's start with Chestny Znak. The CRPT changed the DataMatrix format.", "Начнём с ЧЗ. ЦРПТ изменила формат DataMatrix."),
        ("The new format adds a GS1 application identifier for the batch number.", "Новый формат добавляет GS1-идентификатор номера партии."),
        ("When does this change take effect?", "Когда вступает в силу?"),
        ("Now the second topic: Mercury VSD format update.", "Теперь вторая тема: обновление формата VSD."),
        ("The Mercury system now requires electronic signatures on VSDs.", "Система Меркурий теперь требует ЭЦП на VSD."),
        ("Can we combine both changes into one SAP release?", "Можем объединить оба изменения в один релиз?"),
        ("Both deadlines are in September. We need a combined plan.", "Оба дедлайна в сентябре. Нужен объединённый план."),
        ("Let me summarize both changes and next steps.", "Подведём итог обоих изменений."),
        ("We'll have one combined proposal by July 20th.", "У нас будет одно объединённое предложение к 20 июля."),
    ],
    dialog='<span class="you">You (Customer):</span> Good morning. Today\'s agenda has two topics: Chestny Znak and Mercury updates. Let\'s start with Chestny Znak. The CRPT changed the DataMatrix format — it adds a GS1 identifier for batch number. When does this take effect?<br><br><span class="vendor">Vendor:</span> September 1st for dairy products. We need to update the label layout in ECC and the PI mapping.<br><br><span class="you">Customer:</span> Now the second topic. The Mercury system now requires electronic signatures on VSDs. Can we combine both changes into one SAP release?<br><br><span class="vendor">Vendor:</span> Yes, that makes sense. Both affect the PI layer.<br><br><span class="you">Customer:</span> Let me summarize: both changes, one combined proposal by July 20th. John, you\'ll coordinate.',
    dictation=[
        "Сегодня две темы: обновления ЧЗ и Меркурия.",
        "Начнём с ЧЗ. ЦРПТ изменила формат DataMatrix.",
        "Когда вступает в силу?",
        "Можем объединить оба изменения в один релиз?",
        "Подведём итог обоих изменений."
    ],
    checks=[
        "Я могу вести встречу по двум регуляторным темам одновременно",
        "Я могу предложить объединить изменения в один релиз",
        "Я могу резюмировать обе темы и назначить задачи"
    ],
    reading_title="Managing Multiple Regulatory Changes with a Vendor",
    reading_text="When two regulatory changes happen simultaneously, efficiency is critical. Hold one meeting with a clear two-topic agenda. Start with topic one: explain the change, ask for impact, discuss timeline. Then topic two: same structure. Ask if the vendor can combine both into one release to save cost and time. Request a single combined proposal. Summarize both topics together. This approach saves meeting time, reduces administrative overhead, and helps the vendor plan resources more efficiently across both changes.",
    reading_ru="Когда два регуляторных изменения происходят одновременно, проводите одну встречу. Объедините изменения в один релиз для экономии."
)

# === DAY 14 ===
gen_day(14,
    title="Full Meeting: SAP Access & Security",
    focus="Встреча по SAP-безопасности: права доступа, аудит, роли",
    date="Вт 7 июл 2026",
    week_label="Week 3 — Заказчик → Подрядчик",
    review="Повторение D13: Открой встречу по 2 темам.",
    phrases=[
        ("Our audit found users with excessive permissions in SAP.", "Наш аудит нашёл пользователей с избыточными правами в SAP."),
        ("Several ex-employees still have active accounts.", "Несколько уволенных сотрудников всё ещё имеют активные учётки."),
        ("We need to review and clean up user roles and authorizations.", "Нужно пересмотреть и очистить роли и права пользователей."),
        ("Can you run a report of all users with SAP_ALL access?", "Можете запустить отчёт по всем пользователям с SAP_ALL?"),
        ("Who has access to critical transactions like FI postings?", "У кого доступ к критичным транзакциям, например проводкам в FI?"),
        ("We need a segregation of duties conflict analysis.", "Нужен анализ конфликтов разделения обязанностей."),
        ("Please implement a quarterly access review process.", "Пожалуйста, внедрите ежеквартальный обзор доступа."),
        ("How long will the cleanup take?", "Сколько времени займёт очистка?"),
        ("Let's prioritize: first ex-employees, then SOD conflicts.", "Давайте приоритизируем: сначала уволенные, потом SOD-конфликты."),
        ("I want a security audit report by August 1st.", "Я хочу отчёт по аудиту безопасности к 1 августа."),
    ],
    dialog='<span class="you">You (Customer):</span> John, our audit found users with excessive permissions in SAP. Several ex-employees still have active accounts. We need to review and clean up user roles and authorizations urgently.<br><br><span class="vendor">Vendor:</span> That\'s a serious finding. We can run a full user access report and identify anomalies.<br><br><span class="you">Customer:</span> Please run a report of all users with SAP_ALL access first. Then do a segregation of duties conflict analysis. Let\'s prioritize: first ex-employees, then SOD conflicts. I want a security audit report by August 1st. Can you implement a quarterly access review process?',
    dictation=[
        "Наш аудит нашёл пользователей с избыточными правами в SAP.",
        "Несколько уволенных сотрудников всё ещё имеют активные учётки.",
        "Нужно пересмотреть и очистить роли и права пользователей.",
        "Можете запустить отчёт по всем пользователям с SAP_ALL?",
        "Я хочу отчёт по аудиту безопасности к 1 августа."
    ],
    checks=[
        "Я могу обсудить вопросы SAP-безопасности с подрядчиком",
        "Я могу запросить анализ прав доступа и SOD-конфликтов",
        "Я могу предложить процесс регулярного обзора доступа"
    ],
    reading_title="SAP Access and Security Reviews with Vendors",
    reading_text="SAP security is a critical compliance area. As a customer, you must regularly audit user access with your vendor. Common findings: ex-employees with active accounts, users with SAP_ALL access, segregation of duties conflicts. When discussing with the vendor, start with the audit finding, then request specific reports: user access list, SAP_ALL users, SOD conflict matrix. Prioritize remediation: first remove ex-employees and inactive users, then address SOD conflicts. Implement a quarterly access review process. Ask the vendor to automate user deactivation upon termination.",
    reading_ru="SAP-безопасность — критическая область комплаенса. Регулярно аудируйте доступ, удаляйте уволенных и внедряйте квартальные обзоры."
)

# === DAY 15 ===
gen_day(15,
    title="FINAL — Unprepared Vendor Meeting",
    focus="Неподготовленная встреча с подрядчиком на любую тему",
    date="Ср 8 июл 2026",
    week_label="Week 3 — Заказчик → Подрядчик",
    review="Повторение D14: Скажи: 'Our audit found users with excessive permissions...'",
    phrases=[
        ("Thanks for taking this call on short notice.", "Спасибо, что приняли звонок без подготовки."),
        ("I have a topic I need to discuss with you urgently.", "У меня тема, которую нужно срочно обсудить."),
        ("Can you give me a quick update on the current status?", "Можете дать быстрый апдейт по текущему статусу?"),
        ("We received a new clarification from the regulator.", "Мы получили новое разъяснение от регулятора."),
        ("This changes our approach. Let me explain.", "Это меняет наш подход. Позвольте объяснить."),
        ("Let's think together. What options do we have?", "Давайте подумаем вместе. Какие у нас варианты?"),
        ("I don't have all the details yet, but here's what I know.", "У меня ещё не все детали, но вот что я знаю."),
        ("Can you prepare a quick assessment by end of day?", "Можете подготовить быструю оценку к концу дня?"),
        ("Let me note down the key points from this discussion.", "Давай запишу ключевые моменты обсуждения."),
        ("I'll send a follow-up email with the details. Thanks!", "Я отправлю follow-up письмо с деталями. Спасибо!"),
    ],
    dialog='<span class="you">You (Customer):</span> Hi John, thanks for taking this call on short notice. I have a topic I need to discuss urgently. We received a new clarification from the regulator about the Mercury integration timeline. The deadline moved from September 1st to August 15th.<br><br><span class="vendor">Vendor:</span> That\'s a significant change. We\'ll need to reprioritize resources.<br><br><span class="you">Customer:</span> Let\'s think together. What options do we have to meet the new deadline? Can we do a phased approach? I don\'t have all the details yet, but here\'s what I know. Can you prepare a quick assessment by end of day?<br><br><span class="vendor">Vendor:</span> Yes, I\'ll review the resource plan and get back to you by 5 PM.<br><br><span class="you">Customer:</span> Thanks, John. Let me note down the key points. I\'ll send a follow-up email with the details.',
    dictation=[
        "Спасибо, что приняли звонок без подготовки.",
        "У меня тема, которую нужно срочно обсудить.",
        "Можете дать быстрый апдейт по текущему статусу?",
        "Давайте подумаем вместе. Какие у нас варианты?",
        "Я отправлю follow-up письмо с деталями."
    ],
    checks=[
        "Я могу провести неподготовленную встречу на любую тему",
        "Я могу быстро переключиться и обсудить новую проблему",
        "Я могу собрать ключевые моменты и отправить follow-up"
    ],
    reading_title="The Final Challenge: Unprepared Vendor Meetings",
    reading_text="Day 15 is your final challenge. In real life, vendor meetings often happen without preparation — the regulator calls with an urgent change, a critical issue arises, or management asks for a last-minute status. The key is to stay calm and structured. Start with thanking the vendor for the short-notice call. State what you know and what you don't know. Ask the vendor to think together. Take notes during the call. End with a commitment to send a follow-up email. You have practiced all the skills from previous 14 days. Trust yourself. You are ready.",
    reading_ru="Финальный вызов: встреча без подготовки. Сохраняйте спокойствие, структурируйте обсуждение, записывайте ключевые моменты и отправляйте follow-up. Вы готовы!"
)

print("All 15 days generated.")
