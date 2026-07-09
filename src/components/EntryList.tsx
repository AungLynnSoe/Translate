"use client";

import type { Entry } from "@/types/entry";
import EntryCard from "@/components/EntryCard";

type Props = {
  entries: Entry[];
  hasAnyEntries: boolean;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

export default function EntryList({ entries, hasAnyEntries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center text-slate-500 py-12 bg-white rounded-xl border border-dashed border-slate-300">
        {hasAnyEntries ? "検索条件に一致するエントリがありません" : "登録されている語句がありません"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
