import type { Curriculum, Lesson, Vocab } from "./curriculum/types";

export type ExerciseType = "flashcard" | "hanzi-to-meaning" | "listen-to-meaning" | "pinyin-to-hanzi";

export type ExerciseStep = {
  type: ExerciseType;
  prompt: Vocab;
  choices: Vocab[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: Vocab[], answer: Vocab, count = 3): Vocab[] {
  const filtered = pool.filter((v) => v.hanzi !== answer.hanzi);
  return shuffle(filtered).slice(0, count);
}

export function buildExercises(lesson: Lesson, allVocab: Vocab[]): ExerciseStep[] {
  const steps: ExerciseStep[] = [];
  const types: ExerciseType[] = ["hanzi-to-meaning", "listen-to-meaning", "pinyin-to-hanzi"];

  for (const type of types) {
    for (const v of shuffle(lesson.vocab)) {
      steps.push({
        type,
        prompt: v,
        choices: shuffle([v, ...pickDistractors(allVocab, v)]),
      });
    }
  }
  return steps;
}

export function reviewVocab(curriculum: Curriculum, currentLessonId: number): Vocab[] {
  const prev = curriculum.lessons.find((l) => l.id === currentLessonId - 1);
  return prev ? prev.vocab.slice(0, 3) : [];
}

export function pickLesson(curriculum: Curriculum, lessonId: number): Lesson {
  return curriculum.lessons.find((l) => l.id === lessonId) ?? curriculum.lessons[0];
}

export function lessonExists(curriculum: Curriculum, lessonId: number): boolean {
  return curriculum.lessons.some((l) => l.id === lessonId);
}

export function totalLessons(curriculum: Curriculum): number {
  return curriculum.lessons.length;
}
