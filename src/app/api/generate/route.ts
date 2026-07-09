import { NextRequest, NextResponse } from "next/server";
import { generateReading } from "@/lib/reading";
import { translateToMyanmar } from "@/lib/translate";

export async function POST(request: NextRequest) {
  let kanji: unknown;
  try {
    const body = await request.json();
    kanji = body?.kanji;
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です" }, { status: 400 });
  }

  if (typeof kanji !== "string" || kanji.trim().length === 0) {
    return NextResponse.json({ error: "漢字・語句を入力してください" }, { status: 400 });
  }
  const word = kanji.trim();

  const [readingResult, myanmarResult] = await Promise.allSettled([
    generateReading(word),
    translateToMyanmar(word),
  ]);

  if (readingResult.status === "rejected" && myanmarResult.status === "rejected") {
    return NextResponse.json(
      { error: "自動生成に失敗しました。手入力してください" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    reading: readingResult.status === "fulfilled" ? readingResult.value : "",
    myanmar: myanmarResult.status === "fulfilled" ? myanmarResult.value : "",
  });
}
