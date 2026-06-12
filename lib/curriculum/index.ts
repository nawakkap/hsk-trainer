import { hsk1 } from "./hsk1";
import { hsk3 } from "./hsk3";
import type { Curriculum, Level } from "./types";

export const curricula: Record<Level, Curriculum> = {
  hsk1,
  hsk3,
};

export function getCurriculum(level: Level): Curriculum {
  return curricula[level];
}

export type { Curriculum, Lesson, Level, Vocab } from "./types";
