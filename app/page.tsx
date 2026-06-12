"use client";

import { useEffect, useState } from "react";
import { UserCard } from "@/components/UserCard";
import { NewUserModal } from "@/components/NewUserModal";
import { UserMenu } from "@/components/UserMenu";
import {
  createUser,
  deleteUser,
  loadState,
  renameUser,
  setAvatar,
  type AppState,
  type User,
} from "@/lib/storage";
import { primeVoices } from "@/lib/speech";

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [menuFor, setMenuFor] = useState<User | null>(null);

  useEffect(() => {
    setState(loadState());
    primeVoices();
  }, []);

  if (!state) {
    return <div className="flex-1 flex items-center justify-center text-2xl">加载中…</div>;
  }

  const empty = state.users.length === 0;

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 py-8 flex flex-col gap-6">
      <header className="text-center mt-2">
        <div className="text-5xl mb-2">汉语</div>
        <h1 className="text-2xl font-extrabold tracking-tight">HSK Trainer</h1>
        <p className="text-sm opacity-70 mt-1">
          {empty ? "Add a learner to begin" : "Who's practicing today?"}
        </p>
      </header>

      {empty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-10">
          <div className="text-7xl">👋</div>
          <p className="opacity-70 max-w-xs">
            Create a profile for each kid. No password needed — just a name, an avatar, and a level.
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="px-8 py-4 rounded-3xl bg-[var(--primary)] text-white text-lg font-bold shadow-xl shadow-[var(--primary)]/30"
          >
            + Add learner
          </button>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            {state.users.map((u) => (
              <UserCard key={u.id} user={u} onMenu={() => setMenuFor(u)} />
            ))}
          </section>

          <button
            onClick={() => setShowNew(true)}
            className="self-center mt-2 px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold text-sm"
          >
            + Add another learner
          </button>
        </>
      )}

      <footer className="text-center text-xs opacity-50 mt-auto pt-6">
        Progress saved on this device · 🔊 native pronunciation built-in
      </footer>

      {showNew && (
        <NewUserModal
          onClose={() => setShowNew(false)}
          onCreate={(name, level, avatar) => {
            setState(createUser(name, level, avatar));
            setShowNew(false);
          }}
        />
      )}

      {menuFor && (
        <UserMenu
          user={menuFor}
          onClose={() => setMenuFor(null)}
          onRename={(name) => {
            const next = renameUser(menuFor.id, name);
            setState(next);
            const updated = next.users.find((u) => u.id === menuFor.id);
            if (updated) setMenuFor(updated);
          }}
          onAvatar={(a) => {
            const next = setAvatar(menuFor.id, a);
            setState(next);
            const updated = next.users.find((u) => u.id === menuFor.id);
            if (updated) setMenuFor(updated);
          }}
          onDelete={() => {
            setState(deleteUser(menuFor.id));
            setMenuFor(null);
          }}
        />
      )}
    </main>
  );
}
