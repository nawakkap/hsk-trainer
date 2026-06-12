"use client";

import { useEffect, useState } from "react";
import type { ExerciseStep } from "@/lib/lesson";
import { speakChinese } from "@/lib/speech";

export function Exercise({
  step,
  onAnswer,
}: {
  step: ExerciseStep;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setPicked(null);
    setLocked(false);
    if (step.type === "listen-to-meaning") {
      const t = setTimeout(() => speakChinese(step.prompt.hanzi), 250);
      return () => clearTimeout(t);
    }
  }, [step]);

  const correctKey = step.prompt.hanzi;

  function pick(choiceHanzi: string) {
    if (locked) return;
    setPicked(choiceHanzi);
    setLocked(true);
    const correct = choiceHanzi === correctKey;
    if (correct) speakChinese(step.prompt.hanzi);
    setTimeout(() => onAnswer(correct), correct ? 700 : 1100);
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <Prompt step={step} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {step.choices.map((c) => {
          const isPicked = picked === c.hanzi;
          const isCorrect = c.hanzi === correctKey;
          const state = !locked
            ? "default"
            : isPicked && isCorrect
              ? "correct"
              : isPicked
                ? "wrong"
                : isCorrect
                  ? "correct-reveal"
                  : "dim";

          return (
            <button
              key={c.hanzi}
              onClick={() => pick(c.hanzi)}
              disabled={locked}
              className={[
                "w-full rounded-2xl px-5 py-5 text-left text-lg shadow-md ring-1 transition",
                state === "default" && "bg-white dark:bg-white/5 ring-black/5 active:scale-[0.98]",
                state === "correct" && "bg-emerald-100 ring-emerald-400 text-emerald-900 animate-pop",
                state === "correct-reveal" && "bg-emerald-50 ring-emerald-300 text-emerald-800",
                state === "wrong" && "bg-rose-100 ring-rose-400 text-rose-900 animate-shake",
                state === "dim" && "bg-white/50 dark:bg-white/5 opacity-50 ring-transparent",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ChoiceContent step={step} choice={c} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Prompt({ step }: { step: ExerciseStep }) {
  switch (step.type) {
    case "hanzi-to-meaning":
      return (
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest opacity-50 mb-2">What does this mean?</div>
          <div className="hanzi text-7xl sm:text-8xl">{step.prompt.hanzi}</div>
          <button
            onClick={() => speakChinese(step.prompt.hanzi)}
            className="mt-3 text-sm opacity-60 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10"
          >
            🔊 say it
          </button>
        </div>
      );
    case "listen-to-meaning":
      return (
        <div className="text-center flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-widest opacity-50">Listen — what did you hear?</div>
          <button
            onClick={() => speakChinese(step.prompt.hanzi)}
            className="text-7xl w-32 h-32 rounded-full bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/30 active:scale-95 transition"
            aria-label="Play audio"
          >
            🔊
          </button>
          <div className="text-xs opacity-50">tap to replay</div>
        </div>
      );
    case "pinyin-to-hanzi":
      return (
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest opacity-50 mb-2">Pick the matching character</div>
          <div className="text-3xl sm:text-4xl font-semibold">{step.prompt.pinyin}</div>
          <div className="text-base opacity-60 mt-1">({step.prompt.meaning})</div>
        </div>
      );
    case "flashcard":
      return null;
  }
}

function ChoiceContent({
  step,
  choice,
}: {
  step: ExerciseStep;
  choice: { hanzi: string; pinyin: string; meaning: string };
}) {
  if (step.type === "pinyin-to-hanzi") {
    return <span className="hanzi text-3xl">{choice.hanzi}</span>;
  }
  return <span className="font-medium">{choice.meaning}</span>;
}
