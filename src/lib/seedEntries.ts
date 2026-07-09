import type { Entry } from "@/types/entry";

// 初回起動時のサンプルデータ（推奨／抽出／対象）
export function createSeedEntries(): Entry[] {
  const now = 1_700_000_000_000; // 固定基準時刻（新しい順に並ぶよう1msずつずらす）
  return [
    {
      id: "seed-1",
      kanji: "推奨",
      reading: "すいしょう (suishou)",
      myanmar: "အကြံပြုချက်",
      note: "",
      createdAt: now,
    },
    {
      id: "seed-2",
      kanji: "抽出",
      reading: "ちゅうしゅつ (chuushutsu)",
      myanmar: "ထုတ်နုတ်ခြင်း",
      note: "",
      createdAt: now + 1,
    },
    {
      id: "seed-3",
      kanji: "対象",
      reading: "たいしょう (taishou)",
      myanmar: "ပစ်မှတ်",
      note: "",
      createdAt: now + 2,
    },
  ];
}
