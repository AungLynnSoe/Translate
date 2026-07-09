import type { Entry } from "@/types/entry";
import { createSeedEntries } from "@/lib/seedEntries";

const STORAGE_KEY = "kanjicho-entries";

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = createSeedEntries();
    saveEntries(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid entries data");
    return parsed as Entry[];
  } catch {
    throw new Error("保存データの読み込みに失敗しました");
  }
}

export function saveEntries(entries: Entry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
