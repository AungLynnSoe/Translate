"use client";

import type { Entry } from "@/types/entry";

type Props = {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

export default function EntryCard({ entry, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-semibold text-slate-900">{entry.kanji}</p>
          {entry.reading && <p className="text-sm text-slate-500">{entry.reading}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(entry)}
            className="text-sm text-indigo-600 hover:underline"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-sm text-rose-600 hover:underline"
          >
            削除
          </button>
        </div>
      </div>
      <p className="text-lg text-emerald-700 break-words">{entry.myanmar}</p>
      {entry.note && <p className="text-sm text-slate-500 whitespace-pre-wrap">{entry.note}</p>}
    </div>
  );
}
