"use client";

import type { Level } from "./curriculum/types";

export type Profile = {
  level: Level;
  name: string;
  currentLesson: number;
  totalStars: number;
  streak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completedLessonIds: number[];
  badges: string[];
};

export type Profiles = Record<Level, Profile>;

const KEY = "hsk-trainer-v1";

const defaultProfiles: Profiles = {
  hsk1: {
    level: "hsk1",
    name: "Little Dragon",
    currentLesson: 1,
    totalStars: 0,
    streak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    completedLessonIds: [],
    badges: [],
  },
  hsk3: {
    level: "hsk3",
    name: "Big Dragon",
    currentLesson: 1,
    totalStars: 0,
    streak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    completedLessonIds: [],
    badges: [],
  },
};

export function loadProfiles(): Profiles {
  if (typeof window === "undefined") return defaultProfiles;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultProfiles;
    const parsed = JSON.parse(raw) as Partial<Profiles>;
    return {
      hsk1: { ...defaultProfiles.hsk1, ...parsed.hsk1 },
      hsk3: { ...defaultProfiles.hsk3, ...parsed.hsk3 },
    };
  } catch {
    return defaultProfiles;
  }
}

export function saveProfiles(p: Profiles) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function updateProfile(level: Level, updater: (p: Profile) => Profile): Profiles {
  const profiles = loadProfiles();
  profiles[level] = updater(profiles[level]);
  saveProfiles(profiles);
  return profiles;
}

export function setProfileName(level: Level, name: string): Profiles {
  return updateProfile(level, (p) => ({ ...p, name }));
}
