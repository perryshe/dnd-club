"""
generate-audio.py — Generate mp3 for English for Manager
Uses Windows SAPI (built-in, no internet) + ffmpeg
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
    print("pywin32 not found. Install: pip install pywin32")
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = BASE_DIR / "audio"
TEMP_DIR = AUDIO_DIR / "_temp"
JSON_PATH = BASE_DIR / "scripts" / "audio-content.json"

FFMPEG = r"C:\Users\perryshe\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

AUDIO_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

BYTES_PER_SEC_SILENCE = 32000


def speak_wait(speaker, text):
    """Speak and block until done."""
    speaker.Speak(text)
    while speaker.Status.RunningState == 2:
        time.sleep(0.05)


def write_silence(stream, seconds):
    if seconds <= 0:
        return
    stream.Write(b"\x00" * int(BYTES_PER_SEC_SILENCE * seconds))


def set_voice(speaker, name_fragment, voices):
    for v in voices:
        if name_fragment in v.GetDescription():
            speaker.Voice = v
            return True
    return False


def has_cyrillic(text):
    return any('\u0400' <= c <= '\u04FF' for c in text)


def wav_to_mp3(wav_path, mp3_path, label):
    if not os.path.exists(wav_path):
        print(f"  Error: WAV not created at {wav_path}")
        return
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

    # --- Phrases (always English) ---
    for p in phrases:
        speak_wait(speaker, p)
        write_silence(wav_stream, 7.5)
        speak_wait(speaker, p)
        write_silence(wav_stream, 7.5)

    # --- Dialog ---
    # Both Customer and Vendor use English voice (Zira).
    # The dialog text is always in English.
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
                # Both Customer and Vendor use English voice
                if en_voice:
                    speaker.Voice = en_voice
                speak_wait(speaker, text)
                write_silence(wav_stream, 0.5)
            else:
                speak_wait(speaker, line)
                write_silence(wav_stream, 0.3)

        if en_voice:
            speaker.Voice = en_voice

    # --- Dictation ---
    # Dictation text is in Russian — use Russian voice (Irina)
    if dictation and not is_digest:
        write_silence(wav_stream, 0.5)
        speak_wait(speaker, "Part three. Dictation. Listen to the Russian phrase, translate it to English, and say it out loud.")
        write_silence(wav_stream, 1)

        for d_text in dictation:
            if has_cyrillic(d_text) and ru_voice:
                speaker.Voice = ru_voice
            elif en_voice:
                speaker.Voice = en_voice
            speak_wait(speaker, d_text)
            write_silence(wav_stream, 7.5)
            speak_wait(speaker, d_text)
            write_silence(wav_stream, 7.5)

    # --- Outro ---
    if en_voice:
        speaker.Voice = en_voice
    speak_wait(speaker, f"End of {title}. Well done. Keep practicing.")
    write_silence(wav_stream, 1)

    wav_stream.Close()
    del speaker

    wav_to_mp3(wav_path, mp3_path, day_id)


def generate_reading_audio(data):
    day_id = data["id"]  # e.g. "day-01"
    read_id = day_id.replace("day-", "read-")
    text = data.get("reading", {}).get("text", "")
    title = data.get("title", "")

    if not text:
        print(f"  [{read_id}] No reading text, skipping")
        return

    print(f"[{read_id}] Generating reading audio...")

    wav_path = str(TEMP_DIR / f"{read_id}.wav")
    mp3_path = str(AUDIO_DIR / f"{read_id}.mp3")

    speaker = win32com.client.Dispatch("SAPI.SpVoice")
    voices = speaker.GetVoices()
    en_voice = None
    for v in voices:
        if "Zira" in v.GetDescription():
            en_voice = v

    if en_voice:
        speaker.Voice = en_voice
    else:
        print("  Warning: Zira voice not found, using default")

    wav_stream = win32com.client.Dispatch("SAPI.SpFileStream")
    wav_stream.Open(wav_path, 3, False)
    speaker.AudioOutputStream = wav_stream
    speaker.Rate = 0
    speaker.Volume = 100

    # Reading topic name from title, strip "Day XX - " prefix
    reading_topic = title.split(" - ", 1)[-1] if " - " in title else title
    speak_wait(speaker, f"Reading. {reading_topic}.")
    write_silence(wav_stream, 1)

    # Read the full English text
    speak_wait(speaker, text)
    write_silence(wav_stream, 0.5)

    speak_wait(speaker, f"End of reading. Well done.")
    write_silence(wav_stream, 1)

    wav_stream.Close()
    del speaker

    wav_to_mp3(wav_path, mp3_path, read_id)


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
                generate_reading_audio(d)
            for d in digests:
                generate_audio(d, is_digest=True)
        elif arg == "--week" and len(sys.argv) > 2:
            week = int(sys.argv[2])
            start = (week - 1) * 5
            for d in days[start:start + 5]:
                generate_audio(d)
                generate_reading_audio(d)
        elif arg == "--reading":
            for d in days:
                generate_reading_audio(d)
        elif arg.startswith("day-") or arg.startswith("read-"):
            found = False
            # Try day match
            for d in days:
                if d["id"] == arg:
                    generate_audio(d)
                    found = True
                    break
            # Try reading match
            if not found and arg.startswith("read-"):
                day_id = arg.replace("read-", "day-")
                for d in days:
                    if d["id"] == day_id:
                        generate_reading_audio(d)
                        found = True
                        break
            # Try digest match
            if not found:
                for d in digests:
                    if d["id"] == arg:
                        generate_audio(d, is_digest=True)
                        found = True
                        break
            if not found:
                print(f"ID '{arg}' not found")
        else:
            print(f"Unknown argument: {arg}")
            print("Usage: python generate-audio.py [day-id|read-id|--week N|--reading|--all]")
    else:
        generate_audio(days[0])
        generate_reading_audio(days[0])

    print("\nDone!")


if __name__ == "__main__":
    main()
