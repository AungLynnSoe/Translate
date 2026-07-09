// Google翻訳の無料エンドポイント（APIキー不要）を使ってミャンマー語訳を取得する
export async function translateToMyanmar(text: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ja");
  url.searchParams.set("tl", "my");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) {
    throw new Error(`translate request failed: ${res.status}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("unexpected translate response shape");
  }

  const segments = data[0] as unknown[];
  const translated = segments
    .map((segment) => (Array.isArray(segment) ? segment[0] : ""))
    .filter((part): part is string => typeof part === "string")
    .join("");

  const cleaned = translated.trim().replace(/[。.]+$/, "");
  if (!cleaned) {
    throw new Error("empty translation result");
  }
  return cleaned;
}
