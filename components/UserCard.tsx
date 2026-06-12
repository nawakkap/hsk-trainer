"use client";

import Link from "next/link";
import type { User } from "@/lib/storage";
import { curricula } from "@/lib/curriculum";

export function UserCard({
  user,
  onMenu,
}: {
  user: User;
  onMenu: () => void;
}) {
  const curriculum = curricula[user.level];
  const total = curriculum.lessons.length;
  const done = user.completedLessonIds.length;
  const pct = Math.min(100, Math.round((done / total) * 100));

  return (
    <div className="relative rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur p-5 shadow-lg ring-1 ring-black/5">
      <Link
        href={`/learn/${user.id}`}
        className="block active:scale-[0.98] transition"
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl shrink-0">{user.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-bold truncate">{user.name}</div>
            <div className="text-xs uppercase tracking-wider opacity-60 mt-0.5">
              {curriculum.label} · Lesson {user.currentLesson} / {total}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold text-[var(--primary)]">🔥 {user.streak}</div>
            <div className="text-[10px] opacity-60 uppercase tracking-wider">streak</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-70 mb-1.5">
            <span>{done} / {total} lessons</span>
            <span>⭐ {user.totalStars}</span>
          </div>
          <div className="h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--primary)] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {user.badges.slice(-6).map((b) => (
              <span key={b} className="text-xl">{badgeEmoji(b)}</span>
            ))}
            {user.badges.length === 0 && (
              <span className="text-xs opacity-50">No badges yet</span>
            )}
          </div>
          <span className="text-sm font-semibold text-[var(--primary)]">Start →</span>
        </div>
      </Link>

      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
        <Link
          href={`/pinyin/${user.id}`}
          className="text-sm font-semibold opacity-80 hover:opacity-100 flex items-center gap-1.5"
        >
          <span>🎵</span> Pinyin practice
        </Link>
        <span className="text-xs opacity-50">+stars, no streak</span>
      </div>

      <button
        onClick={onMenu}
        aria-label="User options"
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 text-lg"
      >
        ⋯
      </button>
    </div>
  );
}

function badgeEmoji(id: string): string {
  return (
    { spark: "✨", fire3: "🔥", week: "🌟", fortnight: "🏮", month: "🐉", "60": "🏯", "100": "👑" }[id] ?? "🎖️"
  );
}
