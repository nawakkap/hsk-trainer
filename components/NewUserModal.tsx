"use client";

import { useState } from "react";
import { AVATARS } from "@/lib/storage";
import type { Level } from "@/lib/curriculum/types";

export function NewUserModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, level: Level, avatar: string) => void;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>("hsk1");
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);

  const valid = name.trim().length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-3"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background)] w-full sm:max-w-sm rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold mb-1">Add a new learner</h2>
        <p className="text-sm opacity-60 mb-4">No password — just pick a name.</p>

        <label className="block text-xs uppercase tracking-widest opacity-60 mb-1">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mia"
          maxLength={20}
          className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/15 bg-transparent text-lg mb-4"
        />

        <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Level</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(
            [
              { id: "hsk1", label: "HSK 1", emoji: "🐣" },
              { id: "hsk2", label: "HSK 2", emoji: "🐼" },
              { id: "hsk3", label: "HSK 3", emoji: "🐉" },
            ] as const
          ).map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={[
                "py-3 rounded-2xl text-sm font-bold ring-2 transition flex flex-col items-center gap-0.5",
                level === l.id
                  ? "ring-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "ring-transparent bg-black/5 dark:bg-white/10 opacity-70",
              ].join(" ")}
            >
              <span className="text-xl leading-none">{l.emoji}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Pick an avatar</label>
        <div className="grid grid-cols-6 gap-2 mb-5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={[
                "aspect-square rounded-2xl text-2xl ring-2 transition flex items-center justify-center",
                avatar === a
                  ? "ring-[var(--primary)] bg-[var(--primary-soft)]"
                  : "ring-transparent bg-black/5 dark:bg-white/10",
              ].join(" ")}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => onCreate(name.trim(), level, avatar)}
            className="flex-1 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
