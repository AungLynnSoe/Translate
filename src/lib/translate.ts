// Google Cloud Translation API(公式・要APIキー)を使ってミャンマー語訳を取得する
export async function translateToMyanmar(text: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not set");
  }

  const url = new URL("https://translation.googleapis.com/language/translate/v2");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "ja",
      target: "my",
      format: "text",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`translate request failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    data?: { translations?: { translatedText?: string }[] };
  };
  const translated = data.data?.translations?.[0]?.translatedText;
  if (typeof translated !== "string") {
    throw new Error("unexpected translate response shape");
  }

  const cleaned = translated.trim().replace(/[。.]+$/, "");
  if (!cleaned) {
    throw new Error("empty translation result");
  }
  return cleaned;
}
