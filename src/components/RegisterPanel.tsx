"use client";

import { useState, useEffect } from "react";
import type { Entry } from "@/types/entry";

export type EntryFormValues = {
  kanji: string;
  reading: string;
  myanmar: string;
  note: string;
};

const EMPTY_FORM: EntryFormValues = { kanji: "", reading: "", myanmar: "", note: "" };

type Props = {
  editingEntry: Entry | null;
  onSubmit: (values: EntryFormValues) => void;
  onCancelEdit: () => void;
};

export default function RegisterPanel({ editingEntry, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState<EntryFormValues>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEntry) {
      setForm({
        kanji: editingEntry.kanji,
        reading: editingEntry.reading,
        myanmar: editingEntry.myanmar,
        note: editingEntry.note,
      });
      setGenerateError(null);
      setValidationError(null);
    }
  }, [editingEntry]);

  function updateField<K extends keyof EntryFormValues>(key: K, value: EntryFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setForm(EMPTY_FORM);
    setGenerateError(null);
    setValidationError(null);
    onCancelEdit();
  }

  async function handleGenerate() {
    if (!form.kanji.trim()) {
      setGenerateError("先に漢字・語句を入力してください");
      return;
    }
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanji: form.kanji.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error ?? "自動生成に失敗しました。手入力してください");
        return;
      }
      setForm((prev) => ({
        ...prev,
        reading: data.reading || prev.reading,
        myanmar: data.myanmar || prev.myanmar,
      }));
      if (data.readingFailed || data.myanmarFailed) {
        const failedFields = [
          data.readingFailed ? "読み方" : null,
          data.myanmarFailed ? "ミャンマー語訳" : null,
        ].filter(Boolean);
        setGenerateError(
          `「${failedFields.join("」「")}」の自動生成に失敗しました。手入力してください`,
        );
      }
    } catch {
      setGenerateError("自動生成に失敗しました。手入力してください");
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kanji.trim() || !form.myanmar.trim()) {
      setValidationError("「漢字・語句」と「ミャンマー語訳」は必須です");
      return;
    }
    setValidationError(null);
    onSubmit({
      kanji: form.kanji.trim(),
      reading: form.reading.trim(),
      myanmar: form.myanmar.trim(),
      note: form.note.trim(),
    });
    setForm(EMPTY_FORM);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4"
    >
      <h2 className="text-sm font-semibold text-slate-500">
        {editingEntry ? "エントリを編集" : "新しい語句を登録"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          漢字・語句 <span className="text-rose-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.kanji}
            onChange={(e) => updateField("kanji", e.target.value)}
            placeholder="例: 推奨"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "生成中…" : "自動生成"}
          </button>
        </div>
        {generateError && <p className="mt-1 text-sm text-rose-600">{generateError}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            読み方（ひらがな／ローマ字）
          </label>
          <input
            type="text"
            value={form.reading}
            onChange={(e) => updateField("reading", e.target.value)}
            placeholder="例: すいしょう (suishou)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ミャンマー語訳 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.myanmar}
            onChange={(e) => updateField("myanmar", e.target.value)}
            placeholder="例: အကြံပြုချက်"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">メモ</label>
        <textarea
          value={form.note}
          onChange={(e) => updateField("note", e.target.value)}
          rows={2}
          placeholder="補足があれば入力"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {validationError && <p className="text-sm text-rose-600">{validationError}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          クリア
        </button>
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          {editingEntry ? "上書き保存" : "追加"}
        </button>
      </div>
    </form>
  );
}
