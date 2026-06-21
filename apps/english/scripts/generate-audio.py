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

FFMPEG = r"C:\Users\perryshe\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

AUDIO_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

# SAPI default format: 16kHz, 16-bit, mono → 2 bytes/sample, 32000 bytes/sec
BYTES_PER_SEC_SILENCE = 32000


def speak_wait(speaker, text):
    """Speak and block until done."""
    speaker.Speak(text)
    while speaker.Status.RunningState == 2:
        time.sleep(0.05)


def write_silence(stream, seconds):
    """Write N seconds of silence (zero PCM samples) to the stream."""
    if seconds <= 0:
        return
    stream.Write(b"\x00" * int(BYTES_PER_SEC_SILENCE * seconds))


def set_voice(speaker, name_fragment, voices):
    """Set voice by name fragment. Returns True if found."""
    for v in voices:
        if name_fragment in v.GetDescription():
            speaker.Voice = v
            return True
    return False


def generate_audio(data, is_digest=False):
    day_id = data["id"]
    title = data["title"]
    phrases = data.get("phrases", [])
    dialog = data.get("dialog", "")
    dictation = data.get("dictation", [])

    print(f"[{day_id}] Generating {title}...")

    wav_path = str(TEMP_DIR / f"{day_id}.wav")
    mp3_path = str(AUDIO_DIR / f"{day_id}.mp3")

    speaker = win32com.client.Dispatch("SAPI.SpVoice")
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

    wav_stream = win32com.client.Dispatch("SAPI.SpFileStream")
    wav_stream.Open(wav_path, 3, False)
    speaker.AudioOutputStream = wav_stream
    speaker.Rate = 0
    speaker.Volume = 100

    # --- Intro ---
    speak_wait(speaker, f"English for Manager. {title}.")
    write_silence(wav_stream, 1)

    if is_digest:
        speak_wait(speaker, "Weekend digest. Key phrases from this week. Listen and repeat.")
    else:
        speak_wait(speaker, "Part one. New vocabulary and phrases. Listen and repeat each phrase after me.")
    write_silence(wav_stream, 1)

    # --- Phrases ---
    for p in phrases:
        speak_wait(speaker, p)
        write_silence(wav_stream, 5)
        speak_wait(speaker, p)
        write_silence(wav_stream, 5)

    # --- Dialog ---
    if dialog and not is_digest:
        write_silence(wav_stream, 0.5)
        speak_wait(speaker, "Part two. Meeting dialog.")
        write_silence(wav_stream, 1)

        lines = dialog.split("\n")
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if ":" in line:
                role, text = line.split(":", 1)
                role = role.strip()
                text = text.strip()
                # Customer uses English voice, vendor uses Russian voice
                if role == "Customer":
                    if en_voice:
                        speaker.Voice = en_voice
                else:
                    if ru_voice:
                        speaker.Voice = ru_voice
                speak_wait(speaker, text)
                write_silence(wav_stream, 0.5)
            else:
                speak_wait(speaker, line)
                write_silence(wav_stream, 0.3)

        if en_voice:
            speaker.Voice = en_voice

    # --- Dictation ---
    if dictation and not is_digest:
        write_silence(wav_stream, 0.5)
        speak_wait(speaker, "Part three. Dictation. Listen to the Russian phrase, translate it to English, and say it out loud.")
        write_silence(wav_stream, 1)

        for d in dictation:
            speak_wait(speaker, d)
            write_silence(wav_stream, 5)
            speak_wait(speaker, d)
            write_silence(wav_stream, 5)

    # --- Outro ---
    speak_wait(speaker, f"End of {title}. Well done. Keep practicing.")
    write_silence(wav_stream, 1)

    wav_stream.Close()
    del speaker

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
        generate_audio(days[0])

    print("\nDone!")


if __name__ == "__main__":
    main()
