"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickMandarinVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /zh-CN/i.test(v.lang)) ||
    voices.find((v) => /zh/i.test(v.lang)) ||
    null;
  cachedVoice = preferred;
  return preferred;
}

export function speakChinese(text: string, opts: { rate?: number } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = opts.rate ?? 0.85;
  u.pitch = 1;
  const v = pickMandarinVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function primeVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickMandarinVoice();
  };
}
