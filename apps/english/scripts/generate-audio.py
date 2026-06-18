"""
generate-audio.py — Генерация mp3 для English for Manager
Использует Windows SAPI (встроенный, без интернета) + ffmpeg
"""

import json
import os
import sys
import time
import subprocess
from pathlib import Path

try:
    import win32com.client
except ImportError:
    print("pywin32 не найден. Установи: pip install pywin32")
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = BASE_DIR / "audio"
TEMP_DIR = AUDIO_DIR / "_temp"
JSON_PATH = BASE_DIR / "scripts" / "audio-content.json"

# Путь к ffmpeg
FFMPEG = r"C:\Users\perryshe\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

AUDIO_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)


def speak_text(speaker, text, wav_path, append=False):
    """Синтезировать текст в WAV-файл через SAPI."""
    mode = 0 if not append else 1  # 0 = create, 1 = append
    try:
        voice = speaker.Speak(text, mode)
        time.sleep(0.05)
    except Exception as e:
        print(f"  TTS error: {e}")


def generate_audio(data, is_digest=False):
    """Сгенерировать mp3 для одного дня."""
    day_id = data["id"]
    title = data["title"]
    phrases = data.get("phrases", [])
    dialog = data.get("dialog", "")
    dictation = data.get("dictation", [])

    print(f"[{day_id}] Generating {title}...")

    wav_path = str(TEMP_DIR / f"{day_id}.wav")
    mp3_path = str(AUDIO_DIR / f"{day_id}.mp3")

    # Создаём WAV
    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    # Выбираем английский голос
    voices = speaker.GetVoices()
    en_voice = None
    ru_voice = None
    for v in voices:
        name = v.GetDescription()
        if "Zira" in name:
            en_voice = v
        elif "Irina" in name:
            ru_voice = v

    if en_voice:
        speaker.Voice = en_voice
    else:
        print("  Warning: Zira voice not found, using default")

    # Настройка вывода в WAV
    from win32com.client import Dispatch
    import pythoncom
    wav_stream = Dispatch("SAPI.SpFileStream")
    # PCM format GUID
    pcm_guid = pythoncom.MakeIID("{00000001-0000-0010-8000-00AA00389B71}")
    fmt = Dispatch("SAPI.SpAudioFormat")
    fmt.Type = pcm_guid
    wav_stream.Format = fmt
    wav_stream.Open(wav_path, 3, False)  # 3 = SSFMCreateForWrite
    speaker.AudioOutputStream = wav_stream

    # --- Intro ---
    speaker.Rate = 0
    speaker.Volume = 100
    speaker.Speak(f"English for Manager. {title}.")
    time.sleep(0.3)

    if is_digest:
        speaker.Speak("Weekend digest. Key phrases from this week. Listen and repeat.")
    else:
        speaker.Speak("Part one. Review and new vocabulary. Listen and repeat each phrase.")
    time.sleep(0.3)

    # --- Phrases ---
    for p in phrases:
        speaker.Speak(p)
        time.sleep(2.5)
        speaker.Speak(p)
        time.sleep(1.5)

    # --- Dialog ---
    if dialog and not is_digest:
        time.sleep(0.5)
        speaker.Speak("Part two. Meeting dialog.")
        time.sleep(0.3)

        # Parse dialog lines
        lines = dialog.split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if ":" in line:
                role, text = line.split(":", 1)
                role = role.strip()
                text = text.strip()
                if role == "Manager" or role == "All":
                    if en_voice:
                        speaker.Voice = en_voice
                else:
                    if ru_voice:
                        speaker.Voice = ru_voice
                speaker.Speak(text)
                time.sleep(0.4)
            else:
                speaker.Speak(line)
                time.sleep(0.3)

        # Переключаем обратно на английский
        if en_voice:
            speaker.Voice = en_voice

    # --- Dictation ---
    if dictation and not is_digest:
        time.sleep(0.5)
        speaker.Speak("Part three. Dictation. I will say a phrase. You repeat it out loud.")
        time.sleep(0.3)
        for d in dictation:
            speaker.Speak(d)
            time.sleep(4.0)
            speaker.Speak(d)
            time.sleep(2.0)

    speaker.Speak(f"End of {title}. Well done. Keep practicing.")
    time.sleep(0.5)

    # Закрываем поток
    wav_stream.Close()
    del speaker

    # Конвертируем WAV в MP3
    if os.path.exists(wav_path):
        size_mb = os.path.getsize(wav_path) / (1024 * 1024)
        print(f"  WAV size: {size_mb:.1f} MB, converting to MP3...")
        result = subprocess.run(
            [FFMPEG, "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "48k", mp3_path],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            mp3_size = os.path.getsize(mp3_path) / (1024 * 1024)
            print(f"  -> MP3: {mp3_path} ({mp3_size:.1f} MB)")
            os.remove(wav_path)
        else:
            print(f"  FFmpeg error: {result.stderr[:200]}")
    else:
        print(f"  Error: WAV not created at {wav_path}")


def main():
    if not JSON_PATH.exists():
        print(f"Content file not found: {JSON_PATH}")
        sys.exit(1)

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        content = json.load(f)

    days = content["days"]
    digests = content["digests"]

    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == "--all":
            for d in days:
                generate_audio(d)
            for d in digests:
                generate_audio(d, is_digest=True)
        elif arg == "--week" and len(sys.argv) > 2:
            week = int(sys.argv[2])
            start = (week - 1) * 5
            for d in days[start:start + 5]:
                generate_audio(d)
        elif arg.startswith("day-") or arg.startswith("weekend-digest"):
            found = False
            for d in days:
                if d["id"] == arg:
                    generate_audio(d)
                    found = True
                    break
            if not found:
                for d in digests:
                    if d["id"] == arg:
                        generate_audio(d, is_digest=True)
                        found = True
                        break
            if not found:
                print(f"Day '{arg}' not found")
        else:
            print(f"Unknown argument: {arg}")
            print("Usage: python generate-audio.py [day-id|--week N|--all]")
    else:
        # Default: generate first day only
        generate_audio(days[0])

    print("\nDone!")


if __name__ == "__main__":
    main()
