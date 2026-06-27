import subprocess, json, re, sys, time, os

CURL = ["curl.exe", "-s", "-L", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "--max-time", "15"]

GAMES = [
    "7 Wonders+Second+Edition",
    "7+Wonders+Duel",
    "7+Wonders+Leaders+Second+Edition",
    "7+Wonders+Armada",
    "Unmatched+Battle+Legends+Volume+1",
    "Unmatched+Battle+Legends+Volume+2",
    "Unmatched+Cobble+Fog",
    "Unmatched+Red+Riding+Hood+Beowulf",
    "Unmatched+Robin+Hood+Bigfoot",
    "Unmatched+Houdini+Genie",
    "Unmatched+Sun+Origin",
    "Unmatched+Witcher+Steel+Silver",
    "Unmatched+Witcher+Realms+Fall",
    "Unmatched+Trials",
    "Munchkin+Deluxe",
    "Munchkin+Princesses",
    "Munchkin+Hipsters",
    "Munchkin+Kittens",
    "Dungeon+Monster+Hideout",
    "Dungeon+Ice+Witch",
    "Dungeon+Serpent+Goddess",
    "Dungeon+Tomb+Dead+Lord",
    "Red+Dragon+Inn+Dwarf+Bard+Mead",
    "Red+Dragon+Inn+Troll",
    "Bang",
    "Bang+Duel",
    "Exploding+Kittens",
    "Zombie+Kittens",
    "Assault",
    "Battle+for+Rokugan",
    "Azul+Summer+Palace",
    "Imaginarium+New+Year",
    "Citadels",
    "Twilight+Imperium+Prophecy+Kings",
    "Tragedy+Looper",
    "Brass+Birmingham",
    "Scythe",
]

RUSSIAN = [
    "7 Чудес (второе издание)",
    "7 Чудес. Дуэль",
    "7 чудес (Второе издание). Лидеры",
    "7 чудес (Второе издание). Армада",
    "Unmatched. Битва легенд. Том первый",
    "Unmatched. Битва Легенд. Том второй",
    "Unmatched. Туман над Мостовой",
    "Unmatched. Красная Шапочка vs. Беовульф",
    "Unmatched. Робин Гуд vs. Бигфут",
    "Unmatched. Гудини и Джинн",
    "Unmatched. Родина Солнца",
    "Unmatched. The Witcher. Сталь и серебро",
    "Unmatched. The Witcher. Гибель Королевств",
    "Unmatched. Удары Судьбы",
    "Манчкин Делюкс",
    "Манчкин. Принцессы",
    "Манчкин. Хипстеры",
    "Манчкин. Котэ",
    "Подземелье. Обитель чудовищ",
    "Подземелье. Царство Ледяной ведьмы",
    "Подземелье. Ярость богини змей",
    "Подземелье. Гробница Повелителя Мертвых",
    "Таверна «Красный Дракон». Дварф, бард и медовуха",
    "Таверна «Красный Дракон». Троллье зелье и чары волчары",
    "Бэнг!",
    "Бэнг! Дуэль",
    "Взрывные котята",
    "Зомби-котята",
    "Натиск!",
    "Битва за Рокуган",
    "Азул. Летний Дворец",
    "Имаджинариум New Year",
    "Цитадели",
    "Сумерки империи. Летопись галактики",
    "Петля трагедии",
    "Брасс. Бирмингем",
    "Серп",
]

def fetch(url):
    try:
        r = subprocess.run(CURL + [url], capture_output=True, timeout=30)
        return r.stdout.decode('utf-8', errors='replace')
    except:
        return ""

def extract_micro2x_url(html, game_name):
    """Extract __micro@2x image URL for the first best-matching game."""
    # Find all boardgame/expansion links and their micro@2x images
    pattern = r'href="/boardgame(?:expansion)?/(\d+)/([^"]+)".*?srcset="([^"]*)"'
    matches = re.findall(pattern, html, re.DOTALL)
    for gid, slug, srcset in matches:
        title = slug.replace('-', ' ').lower()
        search = game_name.replace('+', ' ').lower()
        if search.split('+')[0].lower() in title or any(w in title for w in search.split('+')):
            # Found matching game, extract micro@2x URL
            urls = re.findall(r'(https?://[^\s,]+)', srcset)
            for u in urls:
                if '__micro@2x' in u:
                    return u.split(' ')[0]  # Remove size descriptor
            # Fallback to micro
            for u in urls:
                if '__micro' in u and '@2x' not in u:
                    return u
    return None

count = 0
for eng, rus in zip(GAMES, RUSSIAN):
    count += 1
    sys.stdout.write(f"[{count}/{len(GAMES)}] {rus}... ")
    sys.stdout.flush()
    html = fetch(f"https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q={eng}")
    if len(html) < 2000:
        print("NO RESPONSE")
        time.sleep(2)
        continue
    url = extract_micro2x_url(html, eng)
    if url:
        print(f"OK")
        print(f"  {url}")
    else:
        print("NOT FOUND")
    time.sleep(1.5)
