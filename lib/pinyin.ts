// Syllable bank for pinyin practice. Each entry pairs a hanzi (so the browser
// TTS speaks an authentic Mandarin syllable) with its initial, final, and tone.

export type Syllable = {
  hanzi: string;
  pinyin: string; // tone-marked
  initial: string; // empty string for vowel-initial syllables
  final: string;
  tone: 1 | 2 | 3 | 4;
  meaning: string;
};

export const SYLLABLES: Syllable[] = [
  // m + a (4 tones)
  { hanzi: "妈", pinyin: "mā", initial: "m", final: "a", tone: 1, meaning: "mom" },
  { hanzi: "麻", pinyin: "má", initial: "m", final: "a", tone: 2, meaning: "hemp" },
  { hanzi: "马", pinyin: "mǎ", initial: "m", final: "a", tone: 3, meaning: "horse" },
  { hanzi: "骂", pinyin: "mà", initial: "m", final: "a", tone: 4, meaning: "to scold" },
  // b + a
  { hanzi: "八", pinyin: "bā", initial: "b", final: "a", tone: 1, meaning: "eight" },
  { hanzi: "拔", pinyin: "bá", initial: "b", final: "a", tone: 2, meaning: "to pull out" },
  { hanzi: "把", pinyin: "bǎ", initial: "b", final: "a", tone: 3, meaning: "to hold" },
  { hanzi: "爸", pinyin: "bà", initial: "b", final: "a", tone: 4, meaning: "dad" },
  // p + a
  { hanzi: "趴", pinyin: "pā", initial: "p", final: "a", tone: 1, meaning: "to lie prone" },
  { hanzi: "爬", pinyin: "pá", initial: "p", final: "a", tone: 2, meaning: "to climb" },
  { hanzi: "怕", pinyin: "pà", initial: "p", final: "a", tone: 4, meaning: "to fear" },
  // d / t with i and a
  { hanzi: "低", pinyin: "dī", initial: "d", final: "i", tone: 1, meaning: "low" },
  { hanzi: "笛", pinyin: "dí", initial: "d", final: "i", tone: 2, meaning: "flute" },
  { hanzi: "底", pinyin: "dǐ", initial: "d", final: "i", tone: 3, meaning: "bottom" },
  { hanzi: "弟", pinyin: "dì", initial: "d", final: "i", tone: 4, meaning: "younger brother" },
  { hanzi: "踢", pinyin: "tī", initial: "t", final: "i", tone: 1, meaning: "to kick" },
  { hanzi: "提", pinyin: "tí", initial: "t", final: "i", tone: 2, meaning: "to lift" },
  { hanzi: "体", pinyin: "tǐ", initial: "t", final: "i", tone: 3, meaning: "body" },
  { hanzi: "替", pinyin: "tì", initial: "t", final: "i", tone: 4, meaning: "to replace" },
  // n / l
  { hanzi: "你", pinyin: "nǐ", initial: "n", final: "i", tone: 3, meaning: "you" },
  { hanzi: "泥", pinyin: "ní", initial: "n", final: "i", tone: 2, meaning: "mud" },
  { hanzi: "立", pinyin: "lì", initial: "l", final: "i", tone: 4, meaning: "to stand" },
  { hanzi: "梨", pinyin: "lí", initial: "l", final: "i", tone: 2, meaning: "pear" },
  // g / k / h
  { hanzi: "高", pinyin: "gāo", initial: "g", final: "ao", tone: 1, meaning: "tall" },
  { hanzi: "搞", pinyin: "gǎo", initial: "g", final: "ao", tone: 3, meaning: "to do" },
  { hanzi: "靠", pinyin: "kào", initial: "k", final: "ao", tone: 4, meaning: "to lean on" },
  { hanzi: "考", pinyin: "kǎo", initial: "k", final: "ao", tone: 3, meaning: "to test" },
  { hanzi: "好", pinyin: "hǎo", initial: "h", final: "ao", tone: 3, meaning: "good" },
  { hanzi: "号", pinyin: "hào", initial: "h", final: "ao", tone: 4, meaning: "number" },
  // j / q / x with i
  { hanzi: "鸡", pinyin: "jī", initial: "j", final: "i", tone: 1, meaning: "chicken" },
  { hanzi: "急", pinyin: "jí", initial: "j", final: "i", tone: 2, meaning: "urgent" },
  { hanzi: "几", pinyin: "jǐ", initial: "j", final: "i", tone: 3, meaning: "how many" },
  { hanzi: "记", pinyin: "jì", initial: "j", final: "i", tone: 4, meaning: "to remember" },
  { hanzi: "七", pinyin: "qī", initial: "q", final: "i", tone: 1, meaning: "seven" },
  { hanzi: "起", pinyin: "qǐ", initial: "q", final: "i", tone: 3, meaning: "to rise" },
  { hanzi: "气", pinyin: "qì", initial: "q", final: "i", tone: 4, meaning: "air, anger" },
  { hanzi: "西", pinyin: "xī", initial: "x", final: "i", tone: 1, meaning: "west" },
  { hanzi: "习", pinyin: "xí", initial: "x", final: "i", tone: 2, meaning: "to practice" },
  { hanzi: "洗", pinyin: "xǐ", initial: "x", final: "i", tone: 3, meaning: "to wash" },
  { hanzi: "细", pinyin: "xì", initial: "x", final: "i", tone: 4, meaning: "thin" },
  // zh / ch / sh / r
  { hanzi: "知", pinyin: "zhī", initial: "zh", final: "i", tone: 1, meaning: "to know" },
  { hanzi: "纸", pinyin: "zhǐ", initial: "zh", final: "i", tone: 3, meaning: "paper" },
  { hanzi: "吃", pinyin: "chī", initial: "ch", final: "i", tone: 1, meaning: "to eat" },
  { hanzi: "迟", pinyin: "chí", initial: "ch", final: "i", tone: 2, meaning: "late" },
  { hanzi: "诗", pinyin: "shī", initial: "sh", final: "i", tone: 1, meaning: "poem" },
  { hanzi: "十", pinyin: "shí", initial: "sh", final: "i", tone: 2, meaning: "ten" },
  { hanzi: "是", pinyin: "shì", initial: "sh", final: "i", tone: 4, meaning: "to be" },
  { hanzi: "日", pinyin: "rì", initial: "r", final: "i", tone: 4, meaning: "day, sun" },
  // z / c / s
  { hanzi: "字", pinyin: "zì", initial: "z", final: "i", tone: 4, meaning: "character" },
  { hanzi: "次", pinyin: "cì", initial: "c", final: "i", tone: 4, meaning: "time, occasion" },
  { hanzi: "四", pinyin: "sì", initial: "s", final: "i", tone: 4, meaning: "four" },
  // an vs ang (finals practice)
  { hanzi: "看", pinyin: "kàn", initial: "k", final: "an", tone: 4, meaning: "to look" },
  { hanzi: "康", pinyin: "kāng", initial: "k", final: "ang", tone: 1, meaning: "healthy" },
  { hanzi: "山", pinyin: "shān", initial: "sh", final: "an", tone: 1, meaning: "mountain" },
  { hanzi: "上", pinyin: "shàng", initial: "sh", final: "ang", tone: 4, meaning: "above" },
  { hanzi: "万", pinyin: "wàn", initial: "", final: "an", tone: 4, meaning: "ten thousand" },
  { hanzi: "网", pinyin: "wǎng", initial: "", final: "ang", tone: 3, meaning: "net" },
  // en vs eng
  { hanzi: "人", pinyin: "rén", initial: "r", final: "en", tone: 2, meaning: "person" },
  { hanzi: "冷", pinyin: "lěng", initial: "l", final: "eng", tone: 3, meaning: "cold" },
  { hanzi: "门", pinyin: "mén", initial: "m", final: "en", tone: 2, meaning: "door" },
  { hanzi: "梦", pinyin: "mèng", initial: "m", final: "eng", tone: 4, meaning: "dream" },
  // in vs ing
  { hanzi: "心", pinyin: "xīn", initial: "x", final: "in", tone: 1, meaning: "heart" },
  { hanzi: "星", pinyin: "xīng", initial: "x", final: "ing", tone: 1, meaning: "star" },
  { hanzi: "金", pinyin: "jīn", initial: "j", final: "in", tone: 1, meaning: "gold" },
  { hanzi: "京", pinyin: "jīng", initial: "j", final: "ing", tone: 1, meaning: "capital city" },
  // ou vs uo
  { hanzi: "口", pinyin: "kǒu", initial: "k", final: "ou", tone: 3, meaning: "mouth" },
  { hanzi: "过", pinyin: "guò", initial: "g", final: "uo", tone: 4, meaning: "to pass" },
  { hanzi: "走", pinyin: "zǒu", initial: "z", final: "ou", tone: 3, meaning: "to walk" },
  { hanzi: "做", pinyin: "zuò", initial: "z", final: "uo", tone: 4, meaning: "to do" },
];

export type Mode = "tone" | "initial" | "final";

export type Challenge = {
  syllable: Syllable;
  options: string[];
  answer: string;
};

const INITIALS_COMMON = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"];
const FINALS_COMMON = ["a", "o", "e", "i", "u", "ao", "ai", "ou", "ei", "an", "en", "ang", "eng", "in", "ing", "ong", "uo", "uai", "ui", "ian", "iao"];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number, exclude: T): T[] {
  return shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
}

export function buildChallenge(mode: Mode, pool = SYLLABLES): Challenge {
  const syllable = pool[Math.floor(Math.random() * pool.length)];

  if (mode === "tone") {
    return {
      syllable,
      options: ["1", "2", "3", "4"],
      answer: String(syllable.tone),
    };
  }

  if (mode === "initial") {
    // Filter to syllables that have a real initial (some like "wan" don't).
    if (!syllable.initial) {
      // try again with a different syllable
      return buildChallenge(mode, pool.filter((s) => s.initial));
    }
    const distractors = pickN(INITIALS_COMMON, 3, syllable.initial);
    return {
      syllable,
      options: shuffle([syllable.initial, ...distractors]),
      answer: syllable.initial,
    };
  }

  // final
  const distractors = pickN(FINALS_COMMON, 3, syllable.final);
  return {
    syllable,
    options: shuffle([syllable.final, ...distractors]),
    answer: syllable.final,
  };
}

export const MODE_LABELS: Record<Mode, { title: string; emoji: string; description: string }> = {
  tone: { title: "Tones", emoji: "🎵", description: "Hear the syllable, pick the tone (1–4)" },
  initial: { title: "Initials", emoji: "🅱️", description: "Hear it, pick the initial sound" },
  final: { title: "Finals", emoji: "🅾️", description: "Hear it, pick the final sound" },
};

export const SESSION_LENGTH = 10;
export const PINYIN_STARS_REWARD = 3;
