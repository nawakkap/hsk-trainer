"use client";

import type { Level } from "./curriculum/types";

export type User = {
  id: string;
  name: string;
  avatar: string;
  level: Level;
  currentLesson: number;
  totalStars: number;
  streak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  completedLessonIds: number[];
  badges: string[];
  createdAt: number;
};

export type AppState = {
  users: User[];
  activeUserId: string | null;
};

const KEY = "hsk-trainer-v2";
const LEGACY_KEY = "hsk-trainer-v1";

const empty: AppState = { users: [], activeUserId: null };

export const AVATARS = ["🐣", "🐉", "🐼", "🦊", "🐯", "🦄", "🐨", "🐧", "🦋", "🐙", "🦖", "🦁"];

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function migrateLegacy(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<
      Level,
      {
        level: Level;
        name: string;
        currentLesson: number;
        totalStars: number;
        streak: number;
        longestStreak: number;
        lastCompletedDate: string | null;
        completedLessonIds: number[];
        badges: string[];
      }
    >;
    const users: User[] = [];
    for (const lvl of ["hsk1", "hsk3"] as const) {
      const p = parsed[lvl];
      if (!p) continue;
      if (
        p.streak === 0 &&
        p.totalStars === 0 &&
        p.completedLessonIds.length === 0 &&
        (p.name === "Little Dragon" || p.name === "Big Dragon")
      ) {
        continue; // skip untouched defaults
      }
      users.push({
        id: uid(),
        name: p.name,
        avatar: lvl === "hsk1" ? "🐣" : "🐉",
        level: lvl,
        currentLesson: p.currentLesson,
        totalStars: p.totalStars,
        streak: p.streak,
        longestStreak: p.longestStreak,
        lastCompletedDate: p.lastCompletedDate,
        completedLessonIds: p.completedLessonIds,
        badges: p.badges,
        createdAt: Date.now(),
      });
    }
    return users;
  } catch {
    return [];
  }
}

export function loadState(): AppState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (Array.isArray(parsed.users)) {
        return { users: parsed.users, activeUserId: parsed.activeUserId ?? null };
      }
    }
    const migrated = migrateLegacy();
    if (migrated.length > 0) {
      const state: AppState = { users: migrated, activeUserId: migrated[0].id };
      saveState(state);
      return state;
    }
    return empty;
  } catch {
    return empty;
  }
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function createUser(name: string, level: Level, avatar: string): AppState {
  const state = loadState();
  const user: User = {
    id: uid(),
    name: name.trim(),
    avatar,
    level,
    currentLesson: 1,
    totalStars: 0,
    streak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    completedLessonIds: [],
    badges: [],
    createdAt: Date.now(),
  };
  const next: AppState = {
    users: [...state.users, user],
    activeUserId: user.id,
  };
  saveState(next);
  return next;
}

export function deleteUser(userId: string): AppState {
  const state = loadState();
  const users = state.users.filter((u) => u.id !== userId);
  const activeUserId = state.activeUserId === userId ? (users[0]?.id ?? null) : state.activeUserId;
  const next: AppState = { users, activeUserId };
  saveState(next);
  return next;
}

export function renameUser(userId: string, name: string): AppState {
  return updateUser(userId, (u) => ({ ...u, name: name.trim() }));
}

export function setAvatar(userId: string, avatar: string): AppState {
  return updateUser(userId, (u) => ({ ...u, avatar }));
}

export function setActiveUser(userId: string | null): AppState {
  const state = loadState();
  const next: AppState = { ...state, activeUserId: userId };
  saveState(next);
  return next;
}

export function updateUser(userId: string, updater: (u: User) => User): AppState {
  const state = loadState();
  const users = state.users.map((u) => (u.id === userId ? updater(u) : u));
  const next: AppState = { ...state, users };
  saveState(next);
  return next;
}

export function getUser(state: AppState, userId: string): User | undefined {
  return state.users.find((u) => u.id === userId);
}
