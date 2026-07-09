export type Entry = {
  id: string;
  kanji: string;
  reading: string;
  myanmar: string;
  note: string;
  createdAt: number;
};

export type SortOrder = "newest" | "oldest" | "reading";
