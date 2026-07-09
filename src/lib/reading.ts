import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

let kuroshiroPromise: Promise<Kuroshiro> | null = null;

function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroPromise) {
    kuroshiroPromise = (async () => {
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer());
      return kuroshiro;
    })();
  }
  return kuroshiroPromise;
}

// 漢字・語句から「ひらがな (romaji)」形式の読み方を生成する
export async function generateReading(kanji: string): Promise<string> {
  const kuroshiro = await getKuroshiro();
  const hiragana: string = await kuroshiro.convert(kanji, { to: "hiragana" });
  const romaji: string = await kuroshiro.convert(kanji, {
    to: "romaji",
    romajiSystem: "hepburn",
  });
  return `${hiragana} (${romaji})`;
}
