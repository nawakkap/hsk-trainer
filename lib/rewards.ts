export type Badge = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  unlockAt: number;
};

export const STREAK_BADGES: Badge[] = [
  { id: "spark", emoji: "✨", label: "Spark", description: "First lesson done!", unlockAt: 1 },
  { id: "fire3", emoji: "🔥", label: "On Fire", description: "3-day streak", unlockAt: 3 },
  { id: "week", emoji: "🌟", label: "One Week Wonder", description: "7-day streak", unlockAt: 7 },
  { id: "fortnight", emoji: "🏮", label: "Lantern Keeper", description: "14-day streak", unlockAt: 14 },
  { id: "month", emoji: "🐉", label: "Dragon Master", description: "30-day streak", unlockAt: 30 },
  { id: "60", emoji: "🏯", label: "Palace Guardian", description: "60-day streak", unlockAt: 60 },
  { id: "100", emoji: "👑", label: "HSK Royalty", description: "100-day streak", unlockAt: 100 },
];

export function newlyUnlockedBadges(prevStreak: number, newStreak: number, owned: string[]): Badge[] {
  return STREAK_BADGES.filter(
    (b) => b.unlockAt > prevStreak && b.unlockAt <= newStreak && !owned.includes(b.id),
  );
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86_400_000);
}

export function nextStreak(lastDate: string | null, currentStreak: number, today = todayKey()): number {
  if (!lastDate) return 1;
  if (lastDate === today) return currentStreak;
  const gap = daysBetween(lastDate, today);
  if (gap === 1) return currentStreak + 1;
  return 1;
}
