declare module "kuroshiro" {
  export default class Kuroshiro {
    init(analyzer: unknown): Promise<void>;
    convert(
      text: string,
      options?: { to?: "hiragana" | "katakana" | "romaji"; romajiSystem?: "hepburn" | "nippon" | "passport" },
    ): Promise<string>;
  }
}

declare module "kuroshiro-analyzer-kuromoji" {
  const KuromojiAnalyzer: new () => unknown;
  export default KuromojiAnalyzer;
}
