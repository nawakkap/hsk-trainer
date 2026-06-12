"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Flashcard } from "./Flashcard";
import { Exercise } from "./Exercise";
import { SentenceCard } from "./SentenceCard";
import { Confetti } from "./Confetti";
import { buildExercises, pickLesson, reviewVocab, totalLessons, type ExerciseStep } from "@/lib/lesson";
import type { Curriculum, Vocab } from "@/lib/curriculum/types";
import { loadProfiles, updateProfile, type Profile } from "@/lib/storage";
import { newlyUnlockedBadges, nextStreak, todayKey, type Badge } from "@/lib/rewards";
import { primeVoices, speakChinese } from "@/lib/speech";

type Stage = "welcome" | "review" | "learn" | "exercise" | "sentence" | "done";

const REWARD_PER_CORRECT = 1;
const PERFECT_BONUS = 5;

export function DailyLesson({ curriculum }: { curriculum: Curriculum }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stage, setStage] = useState<Stage>("welcome");
  const [reviewIdx, setReviewIdx] = useState(0);
  const [learnIdx, setLearnIdx] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [reward, setReward] = useState<{
    stars: number;
    perfect: boolean;
    streak: number;
    newBadges: Badge[];
  } | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    primeVoices();
    setProfile(loadProfiles()[curriculum.level]);
  }, [curriculum.level]);

  const lesson = useMemo(
    () => (profile ? pickLesson(curriculum, profile.currentLesson) : curriculum.lessons[0]),
    [profile, curriculum],
  );
  const review = useMemo(
    () => (profile ? reviewVocab(curriculum, profile.currentLesson) : []),
    [profile, curriculum],
  );
  const allVocabPool = useMemo<Vocab[]>(
    () => curriculum.lessons.flatMap((l) => l.vocab),
    [curriculum],
  );
  const exercises = useMemo<ExerciseStep[]>(
    () => buildExercises(lesson, allVocabPool),
    [lesson, allVocabPool],
  );

  if (!profile) {
    return <div className="flex-1 flex items-center justify-center text-2xl">加载中…</div>;
  }

  const total = totalLessons(curriculum);
  const totalSteps =
    review.length + lesson.vocab.length + exercises.length + 1; // +1 for sentence
  const currentStep =
    (stage === "review" ? reviewIdx : review.length) +
    (stage === "learn" ? learnIdx : stage === "welcome" ? 0 : lesson.vocab.length) +
    (stage === "exercise" ? exIdx : stage === "sentence" || stage === "done" ? exercises.length : 0) +
    (stage === "done" ? 1 : 0);
  const progressPct = Math.round(((currentStep + (stage === "welcome" ? 0 : 0)) / totalSteps) * 100);

  function startLesson() {
    setStage(review.length > 0 ? "review" : "learn");
  }

  function advanceReview() {
    if (reviewIdx + 1 < review.length) setReviewIdx(reviewIdx + 1);
    else setStage("learn");
  }

  function advanceLearn() {
    if (learnIdx + 1 < lesson.vocab.length) setLearnIdx(learnIdx + 1);
    else setStage("exercise");
  }

  function answerExercise(correct: boolean) {
    setTotalAnswered((n) => n + 1);
    if (correct) setCorrectCount((n) => n + 1);
    if (exIdx + 1 < exercises.length) setExIdx(exIdx + 1);
    else setStage("sentence");
  }

  function finishLesson() {
    if (completedRef.current || !profile) return;
    completedRef.current = true;
    const today = todayKey();
    const earned =
      correctCount * REWARD_PER_CORRECT + (correctCount === totalAnswered ? PERFECT_BONUS : 0);
    let nextStreakVal = profile.streak;
    let unlocked: Badge[] = [];

    const updated = updateProfile(curriculum.level, (p) => {
      const ns = nextStreak(p.lastCompletedDate, p.streak, today);
      nextStreakVal = ns;
      const longest = Math.max(p.longestStreak, ns);
      unlocked = newlyUnlockedBadges(p.streak, ns, p.badges);
      const nextBadges = [...p.badges, ...unlocked.map((b) => b.id)];
      const completedIds = p.completedLessonIds.includes(p.currentLesson)
        ? p.completedLessonIds
        : [...p.completedLessonIds, p.currentLesson];
      return {
        ...p,
        totalStars: p.totalStars + earned,
        streak: ns,
        longestStreak: longest,
        lastCompletedDate: today,
        completedLessonIds: completedIds,
        currentLesson: Math.min(total, p.currentLesson + 1),
        badges: nextBadges,
      };
    });
    setProfile(updated[curriculum.level]);
    setReward({
      stars: earned,
      perfect: correctCount === totalAnswered,
      streak: nextStreakVal,
      newBadges: unlocked,
    });
    setStage("done");
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-5 py-5 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm opacity-60 hover:opacity-100">← Back</Link>
        <div className="text-sm font-semibold opacity-80">
          {curriculum.label} · Lesson {profile.currentLesson} / {total}
        </div>
        <div className="text-sm font-semibold">🔥 {profile.streak}</div>
      </header>

      {stage !== "welcome" && stage !== "done" && (
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--primary)] transition-all"
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        {stage === "welcome" && (
          <Welcome
            curriculum={curriculum}
            lessonTitle={lesson.title}
            wordCount={lesson.vocab.length}
            onStart={startLesson}
            onPlayPreview={() => speakChinese(lesson.vocab[0].hanzi)}
          />
        )}

        {stage === "review" && review.length > 0 && (
          <div className="w-full">
            <div className="text-center text-xs uppercase tracking-widest opacity-50 mb-3">
              Quick review · {reviewIdx + 1} / {review.length}
            </div>
            <Flashcard vocab={review[reviewIdx]} onNext={advanceReview} />
          </div>
        )}

        {stage === "learn" && (
          <div className="w-full">
            <div className="text-center text-xs uppercase tracking-widest opacity-50 mb-3">
              New today · {learnIdx + 1} / {lesson.vocab.length}
            </div>
            <Flashcard vocab={lesson.vocab[learnIdx]} onNext={advanceLearn} />
          </div>
        )}

        {stage === "exercise" && (
          <div className="w-full">
            <div className="text-center text-xs uppercase tracking-widest opacity-50 mb-4">
              Practice · {exIdx + 1} / {exercises.length}
            </div>
            <Exercise step={exercises[exIdx]} onAnswer={answerExercise} />
          </div>
        )}

        {stage === "sentence" && (
          <SentenceCard {...lesson.sentence} onNext={finishLesson} />
        )}

        {stage === "done" && reward && (
          <Reward reward={reward} curriculum={curriculum} />
        )}
      </div>
    </div>
  );
}

function Welcome({
  curriculum,
  lessonTitle,
  wordCount,
  onStart,
  onPlayPreview,
}: {
  curriculum: Curriculum;
  lessonTitle: string;
  wordCount: number;
  onStart: () => void;
  onPlayPreview: () => void;
}) {
  return (
    <div className="text-center flex flex-col items-center gap-6">
      <div className="text-7xl">{curriculum.emoji}</div>
      <div>
        <div className="text-xs uppercase tracking-widest opacity-50">Today's lesson</div>
        <h1 className="text-3xl font-extrabold mt-1">{lessonTitle}</h1>
        <div className="text-sm opacity-70 mt-2">
          {wordCount} new words · about 15 minutes
        </div>
      </div>
      <button
        onClick={onPlayPreview}
        className="text-sm opacity-70 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10"
      >
        🔊 sneak peek
      </button>
      <button
        onClick={onStart}
        className="w-full py-5 rounded-3xl bg-[var(--primary)] text-white text-xl font-bold shadow-xl shadow-[var(--primary)]/30 active:scale-[0.98]"
      >
        Start →
      </button>
    </div>
  );
}

function Reward({
  reward,
  curriculum,
}: {
  reward: { stars: number; perfect: boolean; streak: number; newBadges: Badge[] };
  curriculum: Curriculum;
}) {
  return (
    <div className="text-center flex flex-col items-center gap-5 w-full relative">
      <Confetti />
      <div className="text-7xl animate-pop">🎉</div>
      <div>
        <h2 className="text-3xl font-extrabold">{reward.perfect ? "Perfect!" : "Well done!"}</h2>
        <p className="opacity-70 mt-1">
          {reward.perfect ? "Every answer correct — bonus stars!" : "Lesson complete. Keep it up!"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5">
          <div className="text-3xl font-extrabold text-[var(--gold)]">+{reward.stars}</div>
          <div className="text-xs opacity-60">stars earned</div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5">
          <div className="text-3xl font-extrabold text-[var(--primary)]">🔥 {reward.streak}</div>
          <div className="text-xs opacity-60">day streak</div>
        </div>
      </div>

      {reward.newBadges.length > 0 && (
        <div className="w-full rounded-2xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--primary)]/20 p-4 ring-1 ring-[var(--gold)]/40">
          <div className="text-xs uppercase tracking-widest opacity-60 mb-2">New badge!</div>
          {reward.newBadges.map((b) => (
            <div key={b.id} className="flex items-center gap-3 py-1">
              <span className="text-3xl">{b.emoji}</span>
              <div className="text-left">
                <div className="font-bold">{b.label}</div>
                <div className="text-xs opacity-70">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/"
        className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white text-lg font-bold shadow-lg shadow-[var(--primary)]/30 mt-2 text-center"
      >
        Back home
      </Link>
      <Link
        href={`/learn/${curriculum.level}`}
        className="text-sm opacity-60 hover:opacity-100"
      >
        Practice another lesson →
      </Link>
    </div>
  );
}
