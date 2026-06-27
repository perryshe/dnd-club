import subprocess
import json
import time
import re
import sys

def search_bgg(name):
    url = f"https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q={name.replace(' ', '+')}"
    cmd = ["curl.exe", "-s", "-L", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", url]
    try:
        result = subprocess.run(cmd, capture_output=True, timeout=30)
        html = result.stdout.decode('utf-8', errors='replace')
        
        # Debug: check if html has content
        if len(html) < 100:
            return []
            
        ids = re.findall(r'boardgame/(\d+)/([^"\s]+)', html)
        titles = re.findall(r"class='primary'[^>]*>([^<]+)<", html)
        imgs = re.findall(r'<img alt="Board Game:[^"]*"[^>]*src="([^"]+)"', html)
        
        results = []
        seen = set()
        max_len = min(len(ids), len(titles), len(imgs))
        for i in range(max_len):
            gid = ids[i][0]
            if gid in seen:
                continue
            seen.add(gid)
            results.append({"id": gid, "title": titles[i].strip(), "image": imgs[i]})
        
        return results
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return []

def p(text):
    sys.stdout.buffer.write((text + "\n").encode('utf-8'))
    sys.stdout.buffer.flush()

games = [
    ("7 Wonders", "7 Чудес (второе издание)", "Second Edition"),
    ("7 Wonders Duel", "7 Чудес. Дуэль", ""),
    ("7 Wonders Leaders", "7 чудес (Второе издание). Лидеры", ""),
    ("7 Wonders Armada", "7 чудес (Второе издание). Армада", ""),
    ("Unmatched Battle of Legends Volume 1", "Unmatched. Битва легенд. Том первый", ""),
    ("Unmatched Battle of Legends Volume 2", "Unmatched. Битва Легенд. Том второй", ""),
    ("Unmatched Cobble and Fog", "Unmatched. Туман над Мостовой", ""),
    ("Unmatched Red Riding Hood vs Beowulf", "Unmatched. Красная Шапочка vs. Беовульф", ""),
    ("Unmatched Robin Hood vs Bigfoot", "Unmatched. Робин Гуд vs. Бигфут", ""),
    ("Unmatched Houdini vs The Genie", "Unmatched. Гудини и Джинн", ""),
    ("Unmatched Sun Origin", "Unmatched. Родина Солнца", ""),
    ("Unmatched Witcher Steel and Silver", "Unmatched. The Witcher. Сталь и серебро", ""),
    ("Unmatched Witcher", "Unmatched. The Witcher. Гибель Королевств", ""),
    ("Unmatched Trials", "Unmatched. Удары Судьбы", ""),
    ("Munchkin Deluxe", "Манчкин Делюкс", ""),
    ("Munchkin Princesses", "Манчкин. Принцессы", ""),
    ("Munchkin Hipsters", "Манчкин. Хипстеры", ""),
    ("Munchkin Kittens", "Манчкин. Котэ", ""),
    ("Dungeon Monster Hideout", "Подземелье. Обитель чудовищ", ""),
    ("Dungeon Ice Witch", "Подземелье. Царство Ледяной ведьмы", ""),
    ("Dungeon Serpent Goddess", "Подземелье. Ярость богини змей", ""),
    ("Dungeon Tomb Dead Lord", "Подземелье. Гробница Повелителя Мертвых", ""),
    ("Red Dragon Inn Dwarf Bard", "Таверна Красный Дракон. Дварф, бард и медовуха", ""),
    ("Red Dragon Inn Troll", "Таверна Красный Дракон. Троллье зелье и чары волчары", ""),
    ("Bang", "Бэнг!", ""),
    ("Bang Duel", "Бэнг! Дуэль", ""),
    ("Exploding Kittens", "Взрывные котята", ""),
    ("Zombie Kittens", "Зомби-котята", ""),
    ("Assault", "Натиск! (Assault!)", ""),
    ("Battle for Rokugan", "Битва за Рокуган", ""),
    ("Azul Summer Palace", "Азул. Летний Дворец", ""),
    ("Imaginarium", "Имаджинариум New Year", ""),
    ("Citadels", "Цитадели", ""),
    ("Twilight Imperium", "Сумерки империи. Летопись галактики", ""),
    ("Tragedy Looper", "Петля трагедии", ""),
    ("Brass Birmingham", "Брасс. Бирмингем", ""),
    ("Scythe", "Серп", ""),
]

results = {}
total = len(games)
for i, (search_name, russian_name, filter_word) in enumerate(games, 1):
    p(f"[{i}/{total}] {russian_name}...")
    
    # Try primary search
    search_results = search_bgg(search_name)
    
    # If not found, try to filter
    if filter_word and search_results:
        filtered = [r for r in search_results if filter_word.lower() in r["title"].lower()]
        if filtered:
            search_results = filtered
    
    if search_results:
        best = search_results[0]
        results[russian_name] = best["image"]
        p(f"  -> {best['title']} (ID: {best['id']})")
    else:
        results[russian_name] = None
        p("  -> NOT FOUND")
    
    time.sleep(1.5)

p("\n=== JSON OUTPUT ===")
print(json.dumps(results, ensure_ascii=False, indent=2))
