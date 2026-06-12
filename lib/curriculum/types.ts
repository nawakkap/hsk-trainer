export type Vocab = {
  hanzi: string;
  pinyin: string;
  meaning: string;
};

export type Lesson = {
  id: number;
  title: string;
  vocab: Vocab[];
  sentence: { hanzi: string; pinyin: string; meaning: string };
};

export type Level = "hsk1" | "hsk2" | "hsk3";

export type Curriculum = {
  level: Level;
  label: string;
  emoji: string;
  lessons: Lesson[];
};
