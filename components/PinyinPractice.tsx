"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  buildChallenge,
  MODE_LABELS,
  SESSION_LENGTH,
  PINYIN_STARS_REWARD,
  type Challenge,
  type Mode,
} from "@/lib/pinyin";
import { primeVoices, speakChinese } from "@/lib/speech";
import { getUser, loadState, updateUser, type User } from "@/lib/storage";
import { Confetti } from "./Confetti";

type Stage = "menu" | "playing" | "done";

export function PinyinPractice({ userId }: { userId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<Mode>("tone");
  const [stage, setStage] = useState<Stage>("menu");
  const [qIdx, setQIdx] = useState(0);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);

  useEffect(() => {
    primeVoices();
    const state = loadState();
    const u = getUser(state, userId);
    if (!u) setNotFound(true);
    else setUser(u);
  }, [userId]);

  function startSession(m: Mode) {
    setMode(m);
    setQIdx(0);
    setCorrectCount(0);
    const c = buildChallenge(m);
    setChallenge(c);
    setPicked(null);
    setLocked(false);
    setStage("playing");
    setTimeout(() => speakChinese(c.syllable.hanzi), 250);
  }

  function pick(opt: string) {
    if (locked || !challenge) return;
    setPicked(opt);
    setLocked(true);
    const correct = opt === challenge.answer;
    if (correct) {
      setCorrectCount((n) => n + 1);
      speakChinese(challenge.syllable.hanzi);
    }
    setTimeout(() => {
      if (qIdx + 1 < SESSION_LENGTH) {
        const next = buildChallenge(mode);
        setQIdx(qIdx + 1);
        setChallenge(next);
        setPicked(null);
        setLocked(false);
        setTimeout(() => speakChinese(next.syllable.hanzi), 250);
      } else {
        finishSession(correct ? correctCount + 1 : correctCount);
      }
    }, correct ? 750 : 1200);
  }

  function finishSession(finalCorrect: number) {
    if (!user) return;
    const stars =
      finalCorrect === SESSION_LENGTH ? PINYIN_STARS_REWARD * 2 : PINYIN_STARS_REWARD;
    setEarnedStars(stars);
    const next = updateUser(user.id, (u) => ({ ...u, totalStars: u.totalStars + stars }));
    const updated = next.users.find((u) => u.id === user.id);
    if (updated) setUser(updated);
    setStage("done");
  }

  if (notFound) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="text-5xl">🤔</div>
        <p className="opacity-70">That learner doesn't exist on this device.</p>
        <button
          onClick={() => router.replace("/")}
          className="px-5 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold"
        >
          Back home
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="flex-1 flex items-center justify-center text-2xl">加载中…</div>;
  }

  const progress = stage === "playing" ? Math.round(((qIdx + (locked ? 1 : 0)) / SESSION_LENGTH) * 100) : 0;

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-5 py-5 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm opacity-60 hover:opacity-100">← Switch</Link>
        <div className="text-sm font-semibold opacity-80 flex items-center gap-1.5">
          <span>{user.avatar}</span>
          <span className="truncate max-w-[140px]">{user.name}</span>
          <span className="opacity-50">·</span>
          <span>Pinyin</span>
        </div>
        <div className="text-sm font-semibold">⭐ {user.totalStars}</div>
      </header>

      {stage === "playing" && (
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--jade)] to-[var(--primary)] transition-all"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        {stage === "menu" && <ModeMenu onPick={startSession} />}

        {stage === "playing" && challenge && (
          <PlayCard
            mode={mode}
            challenge={challenge}
            picked={picked}
            locked={locked}
            qIdx={qIdx}
            onPick={pick}
            onReplay={() => speakChinese(challenge.syllable.hanzi)}
          />
        )}

        {stage === "done" && (
          <DoneCard
            user={user}
            mode={mode}
            correctCount={correctCount}
            earnedStars={earnedStars}
            onAgain={() => startSession(mode)}
            onChangeMode={() => setStage("menu")}
          />
        )}
      </div>
    </div>
  );
}

function ModeMenu({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-center mb-2">
        <div className="text-6xl mb-1">🎵</div>
        <h1 className="text-2xl font-extrabold">Pinyin practice</h1>
        <p className="text-sm opacity-70 mt-1">
          Train your ear. Earn ⭐ {3} per round (×2 if perfect).
        </p>
      </div>

      {(["tone", "initial", "final"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onPick(m)}
          className="text-left rounded-2xl bg-white dark:bg-white/5 p-5 ring-1 ring-black/5 active:scale-[0.98] transition shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{MODE_LABELS[m].emoji}</div>
            <div className="flex-1">
              <div className="text-lg font-bold">{MODE_LABELS[m].title}</div>
              <div className="text-xs opacity-70">{MODE_LABELS[m].description}</div>
            </div>
            <span className="text-[var(--primary)] font-bold">→</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function PlayCard({
  mode,
  challenge,
  picked,
  locked,
  qIdx,
  onPick,
  onReplay,
}: {
  mode: Mode;
  challenge: Challenge;
  picked: string | null;
  locked: boolean;
  qIdx: number;
  onPick: (opt: string) => void;
  onReplay: () => void;
}) {
  const promptLabel = useMemo(() => {
    if (mode === "tone") return "Which tone did you hear?";
    if (mode === "initial") return "Which initial sound starts it?";
    return "Which final sound ends it?";
  }, [mode]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="text-center text-xs uppercase tracking-widest opacity-50">
        {MODE_LABELS[mode].title} · {qIdx + 1} / {SESSION_LENGTH}
      </div>

      <div className="text-center flex flex-col items-center gap-3">
        <button
          onClick={onReplay}
          className="text-6xl w-32 h-32 rounded-full bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/30 active:scale-95 transition"
          aria-label="Play audio"
        >
          🔊
        </button>
        <div className="text-sm opacity-60">tap to replay</div>
        <div className="text-base font-semibold mt-1">{promptLabel}</div>
      </div>

      <div
        className={[
          "grid gap-3",
          mode === "tone" ? "grid-cols-2" : challenge.options.length === 4 ? "grid-cols-2" : "grid-cols-3",
        ].join(" ")}
      >
        {challenge.options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = opt === challenge.answer;
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
              key={opt}
              onClick={() => onPick(opt)}
              disabled={locked}
              className={[
                "py-5 rounded-2xl text-xl font-bold shadow-md ring-1 transition",
                state === "default" && "bg-white dark:bg-white/5 ring-black/5 active:scale-[0.98]",
                state === "correct" && "bg-emerald-100 ring-emerald-400 text-emerald-900 animate-pop",
                state === "correct-reveal" && "bg-emerald-50 ring-emerald-300 text-emerald-800",
                state === "wrong" && "bg-rose-100 ring-rose-400 text-rose-900 animate-shake",
                state === "dim" && "bg-white/50 dark:bg-white/5 opacity-50 ring-transparent",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {mode === "tone" ? <ToneFace n={Number(opt) as 1 | 2 | 3 | 4} /> : opt}
            </button>
          );
        })}
      </div>

      {locked && (
        <div className="text-center mt-1 opacity-90 animate-pop">
          <span className="hanzi text-4xl">{challenge.syllable.hanzi}</span>
          <span className="ml-3 text-xl font-semibold">{challenge.syllable.pinyin}</span>
          <span className="ml-2 text-sm opacity-70">— {challenge.syllable.meaning}</span>
        </div>
      )}
    </div>
  );
}

function ToneFace({ n }: { n: 1 | 2 | 3 | 4 }) {
  const arrow = { 1: "—", 2: "ˊ", 3: "ˇ", 4: "ˋ" }[n];
  return (
    <span className="flex flex-col items-center gap-1">
      <span className="text-3xl leading-none">{arrow}</span>
      <span className="text-base">Tone {n}</span>
    </span>
  );
}

function DoneCard({
  user,
  mode,
  correctCount,
  earnedStars,
  onAgain,
  onChangeMode,
}: {
  user: User;
  mode: Mode;
  correctCount: number;
  earnedStars: number;
  onAgain: () => void;
  onChangeMode: () => void;
}) {
  const perfect = correctCount === SESSION_LENGTH;
  return (
    <div className="text-center flex flex-col items-center gap-5 w-full relative">
      <Confetti count={perfect ? 50 : 24} />
      <div className="text-7xl animate-pop">{perfect ? "🌟" : "🎉"}</div>
      <div>
        <h2 className="text-3xl font-extrabold">
          {perfect ? "Perfect ear!" : "Nice round!"}
        </h2>
        <p className="opacity-70 mt-1">
          {correctCount} / {SESSION_LENGTH} correct — {MODE_LABELS[mode].title.toLowerCase()}.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 w-full">
        <div className="text-3xl font-extrabold text-[var(--gold)]">+{earnedStars}</div>
        <div className="text-xs opacity-60">stars earned</div>
        <div className="text-xs opacity-50 mt-1">Total: ⭐ {user.totalStars}</div>
      </div>

      <button
        onClick={onAgain}
        className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white text-lg font-bold shadow-lg shadow-[var(--primary)]/30"
      >
        Play again
      </button>
      <button
        onClick={onChangeMode}
        className="w-full py-3 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold"
      >
        Try another mode
      </button>
      <Link href="/" className="text-sm opacity-60 hover:opacity-100 mt-1">
        Back home
      </Link>
    </div>
  );
}
