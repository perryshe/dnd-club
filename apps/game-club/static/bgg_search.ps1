function Search-BGG($name) {
    $url = "https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=$([System.Uri]::EscapeDataString($name))"
    $response = curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" $url
    
    $pattern = 'boardgame/(\d+)/([^"''\s]+)'
    $matches = [regex]::Matches($response, $pattern)
    
    $titlePattern = "class='primary'[^>]*>([^<]+)<"
    $titleMatches = [regex]::Matches($response, $titlePattern)
    
    $imgPattern = '<img alt="Board Game:[^"]*"[^>]*src="([^"]+)"'
    $imgMatches = [regex]::Matches($response, $imgPattern)
    
    $results = @()
    $seen = @{}
    for ($i = 0; $i -lt $matches.Count; $i++) {
        $id = $matches[$i].Groups[1].Value
        if ($seen.ContainsKey($id)) { continue }
        $seen[$id] = $true
        $title = ""
        if ($i -lt $titleMatches.Count) {
            $title = $titleMatches[$i].Groups[1].Value.Trim()
        }
        $img = ""
        if ($i -lt $imgMatches.Count) {
            $img = $imgMatches[$i].Groups[1].Value
        }
        $results += @{Id=$id; Title=$title; Image=$img}
    }
    return $results
}

$games = @(
    @{Name="7 Wonders Second Edition"; R="7 Чудес (второе издание)"},
    @{Name="7 Wonders Duel"; R="7 Чудес. Дуэль"},
    @{Name="7 Wonders Leaders"; R="7 чудес (Второе издание). Лидеры"},
    @{Name="7 Wonders Armada"; R="7 чудес (Второе издание). Армада"},
    @{Name="Unmatched Battle of Legends Volume 1"; R="Unmatched. Битва легенд. Том первый"},
    @{Name="Unmatched Battle of Legends Volume 2"; R="Unmatched. Битва Легенд. Том второй"},
    @{Name="Unmatched Cobble Fog"; R="Unmatched. Туман над Мостовой"},
    @{Name="Unmatched Red Riding Hood vs Beowulf"; R="Unmatched. Красная Шапочка vs. Беовульф"},
    @{Name="Unmatched Robin Hood vs Bigfoot"; R="Unmatched. Робин Гуд vs. Бигфут"},
    @{Name="Unmatched Houdini vs The Genie"; R="Unmatched. Гудини и Джинн"},
    @{Name="Unmatched Sun Origin"; R="Unmatched. Родина Солнца"},
    @{Name="Unmatched Witcher Steel and Silver"; R="Unmatched. The Witcher. Сталь и серебро"},
    @{Name="Unmatched Witcher"; R="Unmatched. The Witcher. Гибель Королевств"},
    @{Name="Unmatched Trials"; R="Unmatched. Удары Судьбы"},
    @{Name="Munchkin Deluxe"; R="Манчкин Делюкс"},
    @{Name="Munchkin Princesses"; R="Манчкин. Принцессы"},
    @{Name="Munchkin Hipsters"; R="Манчкин. Хипстеры"},
    @{Name="Munchkin Kittens"; R="Манчкин. Котэ"},
    @{Name="Dungeon Monster Hideout"; R="Подземелье. Обитель чудовищ"},
    @{Name="Dungeon Ice Witch"; R="Подземелье. Царство Ледяной ведьмы"},
    @{Name="Dungeon Serpent Goddess"; R="Подземелье. Ярость богини змей"},
    @{Name="Dungeon Tomb Dead Lord"; R="Подземелье. Гробница Повелителя Мертвых"},
    @{Name="Red Dragon Inn Dwarf Bard Mead"; R="Таверна Красный Дракон Дварф бард и медовуха"},
    @{Name="Red Dragon Inn Troll"; R="Таверна Красный Дракон Троллье зелье"},
    @{Name="Bang!"; R="Бэнг!"},
    @{Name="Bang! Duel"; R="Бэнг! Дуэль"},
    @{Name="Exploding Kittens"; R="Взрывные котята"},
    @{Name="Zombie Kittens"; R="Зомби-котята"},
    @{Name="Assault"; R="Натиск! (Assault!)"},
    @{Name="Battle for Rokugan"; R="Битва за Рокуган"},
    @{Name="Azul Summer Palace"; R="Азул. Летний Дворец"},
    @{Name="Imaginarium New Year"; R="Имаджинариум New Year"},
    @{Name="Citadels"; R="Цитадели"},
    @{Name="Twilight Imperium"; R="Сумерки империи. Летопись галактики"},
    @{Name="Tragedy Looper"; R="Петля трагедии"},
    @{Name="Brass Birmingham"; R="Брасс. Бирмингем"},
    @{Name="Scythe"; R="Серп"}
)

$results = @{}
$i = 0
$total = $games.Count
foreach ($game in $games) {
    $i++
    $tag = "($i/$total)"
    $searchResults = Search-BGG $game.Name
    
    $bestMatch = $searchResults | Select-Object -First 1
    
    if ($bestMatch) {
        $results[$game.R] = $bestMatch.Image
        Write-Output "$tag $($game.R) : $($bestMatch.Title) | $($bestMatch.Image)"
    } else {
        $results[$game.R] = $null
        Write-Output "$tag $($game.R) : NOT FOUND"
    }
    
    Start-Sleep -Seconds 1
}

Write-Output "`n=== JSON ==="
$results | ConvertTo-Json -Depth 3
