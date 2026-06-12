"use client";

import { useState } from "react";
import { AVATARS, type User } from "@/lib/storage";

export function UserMenu({
  user,
  onClose,
  onRename,
  onAvatar,
  onDelete,
}: {
  user: User;
  onClose: () => void;
  onRename: (name: string) => void;
  onAvatar: (avatar: string) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(user.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-3"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background)] w-full sm:max-w-sm rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold mb-4">Edit {user.name}</h2>

        <label className="block text-xs uppercase tracking-widest opacity-60 mb-1">Name</label>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={20}
          className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/15 bg-transparent text-lg mb-4"
        />

        <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Avatar</label>
        <div className="grid grid-cols-6 gap-2 mb-5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => onAvatar(a)}
              className={[
                "aspect-square rounded-2xl text-2xl ring-2 transition flex items-center justify-center",
                user.avatar === a
                  ? "ring-[var(--primary)] bg-[var(--primary-soft)]"
                  : "ring-transparent bg-black/5 dark:bg-white/10",
              ].join(" ")}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (draft.trim()) onRename(draft.trim());
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold"
          >
            Save
          </button>
        </div>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-2.5 text-sm opacity-60 hover:opacity-100 rounded-2xl"
          >
            Delete user…
          </button>
        ) : (
          <div className="rounded-2xl bg-rose-100 dark:bg-rose-950/40 ring-1 ring-rose-300 p-3">
            <p className="text-sm text-rose-900 dark:text-rose-200 mb-2">
              Delete <b>{user.name}</b>? All streaks and progress will be lost.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl bg-white/70 dark:bg-white/10 text-sm font-semibold"
              >
                Keep
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
