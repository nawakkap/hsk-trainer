"use client";

import { useEffect, useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { loadProfiles, setProfileName, type Profiles } from "@/lib/storage";
import { curricula } from "@/lib/curriculum";
import { primeVoices } from "@/lib/speech";

export default function Home() {
  const [profiles, setProfiles] = useState<Profiles | null>(null);
  const [editing, setEditing] = useState<"hsk1" | "hsk3" | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setProfiles(loadProfiles());
    primeVoices();
  }, []);

  if (!profiles) {
    return <div className="flex-1 flex items-center justify-center text-2xl">加载中…</div>;
  }

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 py-8 flex flex-col gap-6">
      <header className="text-center mt-2">
        <div className="text-5xl mb-2">汉语</div>
        <h1 className="text-2xl font-extrabold tracking-tight">HSK Trainer</h1>
        <p className="text-sm opacity-70 mt-1">Pick your dragon · 15 min today</p>
      </header>

      <section className="flex flex-col gap-4">
        {(["hsk1", "hsk3"] as const).map((lvl) => (
          <div key={lvl} className="flex flex-col gap-1">
            <ProfileCard profile={profiles[lvl]} curriculum={curricula[lvl]} />
            <button
              onClick={() => {
                setEditing(lvl);
                setDraft(profiles[lvl].name);
              }}
              className="self-end text-xs opacity-40 hover:opacity-90 px-2 py-1"
            >
              ✎ rename
            </button>
          </div>
        ))}
      </section>

      <footer className="text-center text-xs opacity-50 mt-auto pt-8">
        Tap audio buttons to hear native pronunciation 🔊
      </footer>

      {editing && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-[var(--background)] w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3">Name your dragon</h2>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/15 bg-transparent text-lg"
              maxLength={20}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-3 rounded-2xl bg-black/5 dark:bg-white/10 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (draft.trim()) {
                    setProfiles(setProfileName(editing, draft.trim()));
                  }
                  setEditing(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-[var(--primary)] text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
