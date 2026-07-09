import { forwardRef } from "react";
import type { Entry } from "@/types/entry";

type Props = {
  entries: Entry[];
};

const PrintableEntries = forwardRef<HTMLDivElement, Props>(function PrintableEntries(
  { entries },
  ref,
) {
  return (
    <div
      ref={ref}
      className="fixed left-[-9999px] top-0 w-[800px] bg-white p-8 print:static print:left-auto print:top-auto print:w-auto"
    >
      <h1 className="text-xl font-bold mb-4 text-slate-900">漢字帳</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-slate-400 px-2 py-1 text-left">漢字・語句</th>
            <th className="border border-slate-400 px-2 py-1 text-left">読み方</th>
            <th className="border border-slate-400 px-2 py-1 text-left">ミャンマー語訳</th>
            <th className="border border-slate-400 px-2 py-1 text-left">メモ</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="break-inside-avoid">
              <td className="border border-slate-400 px-2 py-1 align-top text-slate-900">
                {entry.kanji}
              </td>
              <td className="border border-slate-400 px-2 py-1 align-top text-slate-900">
                {entry.reading}
              </td>
              <td className="border border-slate-400 px-2 py-1 align-top text-slate-900">
                {entry.myanmar}
              </td>
              <td className="border border-slate-400 px-2 py-1 align-top whitespace-pre-wrap text-slate-900">
                {entry.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintableEntries;
