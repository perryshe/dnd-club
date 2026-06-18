param(
    [string]$Day = "day-01"
)

$BaseDir = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$AudioDir = "$BaseDir\audio"
$TempDir = "$BaseDir\audio\_temp"
$JsonPath = "$BaseDir\scripts\audio-content.json"
$FFmpeg = "C:\Users\perryshe\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

New-Item -ItemType Directory -Path $AudioDir -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -ItemType Directory -Path $TempDir -Force -ErrorAction SilentlyContinue | Out-Null

Add-Type -AssemblyName System.Speech
$allVoices = New-Object System.Speech.Synthesis.SpeechSynthesizer
$enVoice = $allVoices.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like "*Zira*" }
$ruVoice = $allVoices.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like "*Irina*" }
$allVoices.Dispose()

function Speak-ToWav {
    param($Text, $WavPath, $VoiceName, $Rate=0)

    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = $Rate
    try {
        $synth.SelectVoice($VoiceName)
    } catch {}
    $synth.SetOutputToWaveFile($WavPath)
    $synth.Speak($Text)
    $synth.Dispose()
}

function Join-Wav {
    param($InputFiles, $OutputFile)
    # Create a simple concatenation using ffmpeg
    $listFile = "$TempDir\_list.txt"
    $InputFiles | ForEach-Object { "file '$_'" } | Set-Content -Path $listFile -Encoding ASCII
    & $FFmpeg -y -f concat -safe 0 -i $listFile -c copy $OutputFile 2>$null
    Remove-Item $listFile -Force -ErrorAction SilentlyContinue
}

function Generate-Day {
    param($Data, [switch]$IsDigest)

    $id = $Data.id
    $title = $Data.title
    Write-Host "[$id] $title..."

    $parts = @()

    # 1. Intro
    $p1 = "$TempDir\_${id}_01_intro.wav"
    Speak-ToWav -Text "English for Manager. $title." -WavPath $p1 -VoiceName $enVoice.VoiceInfo.Name
    $parts += $p1

    # 2. Section header
    $p2 = "$TempDir\_${id}_02_header.wav"
    if ($IsDigest) {
        Speak-ToWav -Text "Weekend digest. Key phrases from this week. Listen and repeat." -WavPath $p2 -VoiceName $enVoice.VoiceInfo.Name
    } else {
        Speak-ToWav -Text "Part one. Review and new vocabulary. Listen and repeat each phrase." -WavPath $p2 -VoiceName $enVoice.VoiceInfo.Name
    }
    $parts += $p2

    # 3. Phrases (each said twice with silence)
    foreach ($p in $Data.phrases) {
        $pw = "$TempDir\_${id}_phrase_$(Get-Random).wav"
        Speak-ToWav -Text "$p. $p." -WavPath $pw -VoiceName $enVoice.VoiceInfo.Name
        $parts += $pw
    }

    # 4. Dialog
    if ($Data.dialog -and (-not $IsDigest)) {
        $pd = "$TempDir\_${id}_dialog_header.wav"
        Speak-ToWav -Text "Part two. Meeting dialog." -WavPath $pd -VoiceName $enVoice.VoiceInfo.Name
        $parts += $pd

        $lines = $Data.dialog -split "`n"
        foreach ($line in $lines) {
            if (-not $line.Trim()) { continue }
            if ($line -match "^(Manager|All):(.+)$") {
                $pw2 = "$TempDir\_${id}_dialog_$(Get-Random).wav"
                Speak-ToWav -Text $matches[2].Trim() -WavPath $pw2 -VoiceName $enVoice.VoiceInfo.Name
                $parts += $pw2
            } elseif ($line -match "^(.+?):(.+)$") {
                $pw2 = "$TempDir\_${id}_dialog_$(Get-Random).wav"
                Speak-ToWav -Text $matches[2].Trim() -WavPath $pw2 -VoiceName $ruVoice.VoiceInfo.Name
                $parts += $pw2
            } else {
                $pw2 = "$TempDir\_${id}_dialog_$(Get-Random).wav"
                Speak-ToWav -Text $line.Trim() -WavPath $pw2 -VoiceName $enVoice.VoiceInfo.Name
                $parts += $pw2
            }
        }
    }

    # 5. Dictation
    if ($Data.dictation -and (-not $IsDigest)) {
        $pdc = "$TempDir\_${id}_dict_header.wav"
        Speak-ToWav -Text "Part three. Dictation. I will say a phrase. You repeat it out loud." -WavPath $pdc -VoiceName $enVoice.VoiceInfo.Name
        $parts += $pdc

        foreach ($d in $Data.dictation) {
            # Say the phrase (student repeats in the silence)
            $pw3 = "$TempDir\_${id}_dict_$(Get-Random).wav"
            Speak-ToWav -Text "$d. Please repeat." -WavPath $pw3 -VoiceName $enVoice.VoiceInfo.Name
            $parts += $pw3
        }
    }

    # 6. Outro
    $pz = "$TempDir\_${id}_outro.wav"
    Speak-ToWav -Text "End of $title. Well done. Keep practicing." -WavPath $pz -VoiceName $enVoice.VoiceInfo.Name
    $parts += $pz

    # Join all WAVs and convert to MP3
    $wavMerged = "$TempDir\_${id}_merged.wav"
    Join-Wav -InputFiles $parts -OutputFile $wavMerged

    if (Test-Path $wavMerged) {
        $mp3Out = "$AudioDir\$id.mp3"
        & $FFmpeg -y -i $wavMerged -codec:a libmp3lame -b:a 48k $mp3Out 2>$null
        $size = (Get-Item $mp3Out).Length / 1MB
        Write-Host "  -> $mp3Out ($([math]::Round($size,1)) MB)"
        
        # Cleanup
        Remove-Item $wavMerged -Force -ErrorAction SilentlyContinue
        $parts | ForEach-Object { Remove-Item $_ -Force -ErrorAction SilentlyContinue }
    } else {
        Write-Host "  ERROR: Failed to merge WAV files"
    }
}

# Load content
$json = Get-Content $JsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
$allDays = $json.days
$digests = $json.digests

if ($Day -eq "all") {
    foreach ($d in $allDays) { Generate-Day -Data $d }
    foreach ($d in $digests) { Generate-Day -Data $d -IsDigest }
} elseif ($Day -eq "--week" -and $args[0]) {
    $week = [int]$args[0]
    $start = ($week - 1) * 5
    for ($i = $start; $i -lt $start + 5 -and $i -lt $allDays.Count; $i++) {
        Generate-Day -Data $allDays[$i]
    }
} else {
    $found = $allDays | Where-Object { $_.id -eq $Day }
    if ($found) { Generate-Day -Data $found }
    else {
        $found = $digests | Where-Object { $_.id -eq $Day }
        if ($found) { Generate-Day -Data $found -IsDigest }
        else { Write-Host "Day '$Day' not found" }
    }
}

Write-Host "Done!"
