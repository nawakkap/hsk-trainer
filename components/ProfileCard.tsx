"use client";

import Link from "next/link";
import type { Profile } from "@/lib/storage";
import type { Curriculum } from "@/lib/curriculum/types";

export function ProfileCard({ profile, curriculum }: { profile: Profile; curriculum: Curriculum }) {
  const total = curriculum.lessons.length;
  const done = profile.completedLessonIds.length;
  const pct = Math.min(100, Math.round((done / total) * 100));

  return (
    <Link
      href={`/learn/${profile.level}`}
      className="block rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur p-6 shadow-lg ring-1 ring-black/5 active:scale-[0.98] transition"
    >
      <div className="flex items-center gap-4">
        <div className="text-5xl">{curriculum.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm uppercase tracking-wider opacity-60">{curriculum.label}</div>
          <div className="text-2xl font-bold truncate">{profile.name}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-[var(--primary)]">🔥 {profile.streak}</div>
          <div className="text-xs opacity-60">day streak</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs opacity-70 mb-1.5">
          <span>Lesson {profile.currentLesson} / {total}</span>
          <span>⭐ {profile.totalStars}</span>
        </div>
        <div className="h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {profile.badges.slice(-5).map((b) => (
            <span key={b} className="text-2xl">{badgeEmoji(b)}</span>
          ))}
          {profile.badges.length === 0 && (
            <span className="text-xs opacity-50">No badges yet — start today!</span>
          )}
        </div>
        <span className="text-sm font-semibold text-[var(--primary)]">Start →</span>
      </div>
    </Link>
  );
}

function badgeEmoji(id: string): string {
  return (
    { spark: "✨", fire3: "🔥", week: "🌟", fortnight: "🏮", month: "🐉", "60": "🏯", "100": "👑" }[id] ?? "🎖️"
  );
}
