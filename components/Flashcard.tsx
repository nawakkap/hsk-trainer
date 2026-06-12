"use client";

import { useState } from "react";
import type { Vocab } from "@/lib/curriculum/types";
import { speakChinese } from "@/lib/speech";

export function Flashcard({
  vocab,
  onNext,
  autoSpeak = true,
}: {
  vocab: Vocab;
  onNext: () => void;
  autoSpeak?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div
        onClick={() => {
          if (!revealed) {
            setRevealed(true);
            if (autoSpeak) speakChinese(vocab.hanzi);
          } else {
            speakChinese(vocab.hanzi);
          }
        }}
        className="w-full aspect-[5/4] rounded-3xl bg-white dark:bg-white/5 shadow-xl ring-1 ring-black/5 flex flex-col items-center justify-center p-6 cursor-pointer active:scale-[0.98] transition"
      >
        <div className="hanzi text-[26vw] sm:text-[140px] leading-none">{vocab.hanzi}</div>
        {revealed ? (
          <div className="mt-4 text-center">
            <div className="text-2xl font-medium opacity-80">{vocab.pinyin}</div>
            <div className="text-xl opacity-70 mt-1">{vocab.meaning}</div>
          </div>
        ) : (
          <div className="mt-4 text-sm opacity-50">tap to reveal · 🔊</div>
        )}
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => speakChinese(vocab.hanzi)}
          className="flex-1 py-4 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold text-lg"
        >
          🔊 Hear it
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/30"
        >
          {revealed ? "Got it →" : "Skip →"}
        </button>
      </div>
    </div>
  );
}
