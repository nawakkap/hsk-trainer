"use client";

import { useState } from "react";
import { speakChinese } from "@/lib/speech";

export function SentenceCard({
  hanzi,
  pinyin,
  meaning,
  onNext,
}: {
  hanzi: string;
  pinyin: string;
  meaning: string;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="text-center text-xs uppercase tracking-widest opacity-50">Sentence of the day</div>
      <div
        onClick={() => {
          setRevealed(true);
          speakChinese(hanzi, { rate: 0.8 });
        }}
        className="rounded-3xl bg-white dark:bg-white/5 shadow-xl ring-1 ring-black/5 p-6 cursor-pointer active:scale-[0.99] transition"
      >
        <div className="hanzi text-3xl sm:text-4xl leading-relaxed text-center">{hanzi}</div>
        <div className="mt-3 text-center text-base opacity-70">{pinyin}</div>
        {revealed ? (
          <div className="mt-2 text-center text-lg font-medium">{meaning}</div>
        ) : (
          <div className="mt-3 text-center text-xs opacity-50">tap to hear & translate</div>
        )}
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/30"
      >
        Finish lesson →
      </button>
    </div>
  );
}
