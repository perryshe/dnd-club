"use client";

import { useRef, useState, useEffect } from "react";

type Props = {
  src: string;
  label?: string;
};

export function AudioPlayer({ src, label }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => {
      setCurrent(el.currentTime);
      setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    el.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 bg-[#111827] rounded-xl px-4 py-3 border border-[#1f2937]">
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-[#60a5fa] text-[#0a0f1a] flex items-center justify-center hover:bg-[#93c5fd] transition-colors shrink-0"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        )}
      </button>
      {label && <span className="text-sm text-[#9ca3af] min-w-0 truncate">{label}</span>}
      <audio ref={ref} src={src} preload="metadata" className="hidden" />
      <div
        className="flex-1 h-2 rounded-full bg-[#1f2937] overflow-hidden cursor-pointer group relative"
        onClick={seek}
      >
        <div
          className="h-full bg-[#60a5fa] rounded-full transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-[#6b7280] font-mono w-16 text-right tabular-nums shrink-0">
        {fmt(current)} / {fmt(duration)}
      </span>
    </div>
  );
}
