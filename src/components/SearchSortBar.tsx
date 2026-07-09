"use client";

import type { SortOrder } from "@/types/entry";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
};

export default function SearchSortBar({ query, onQueryChange, sortOrder, onSortOrderChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="漢字・読み方・ミャンマー語で検索"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-48"
      >
        <option value="newest">新しい順</option>
        <option value="oldest">古い順</option>
        <option value="reading">読み方順</option>
      </select>
    </div>
  );
}
