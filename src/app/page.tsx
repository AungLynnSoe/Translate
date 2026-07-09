"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Entry, SortOrder } from "@/types/entry";
import { loadEntries, saveEntries } from "@/lib/storage";
import RegisterPanel, { type EntryFormValues } from "@/components/RegisterPanel";
import SearchSortBar from "@/components/SearchSortBar";
import EntryList from "@/components/EntryList";
import PrintableEntries from "@/components/PrintableEntries";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setEntries(loadEntries());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "保存データの読み込みに失敗しました");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  function persist(next: Entry[]) {
    setEntries(next);
    try {
      saveEntries(next);
      setSaveError(null);
    } catch {
      setSaveError("保存に失敗しました。ブラウザのストレージ容量を確認してください");
    }
  }

  function handleSubmit(values: EntryFormValues) {
    if (editingEntry) {
      persist(
        entries.map((entry) =>
          entry.id === editingEntry.id ? { ...entry, ...values } : entry,
        ),
      );
      setEditingEntry(null);
      setStatusMessage("更新しました");
    } else {
      const newEntry: Entry = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...values,
      };
      persist([newEntry, ...entries]);
      setStatusMessage("登録しました");
    }
  }

  function handleEdit(entry: Entry) {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingEntry(null);
  }

  function handleDelete(id: string) {
    persist(entries.filter((entry) => entry.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  }

  async function handleDownloadPdf() {
    const node = printRef.current;
    if (!node) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`kanjicho_${dateStr}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      setDownloadError("PDFの作成に失敗しました");
    } finally {
      setDownloading(false);
    }
  }

  const visibleEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (entry) =>
            entry.kanji.toLowerCase().includes(q) ||
            entry.reading.toLowerCase().includes(q) ||
            entry.myanmar.toLowerCase().includes(q),
        )
      : entries;

    const sorted = [...filtered];
    switch (sortOrder) {
      case "oldest":
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "reading":
        sorted.sort((a, b) => a.reading.localeCompare(b.reading, "ja"));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    return sorted;
  }, [entries, query, sortOrder]);

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900">漢字帳</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">登録件数: {entries.length}件</span>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={entries.length === 0 || downloading}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? "作成中…" : "PDFをダウンロード"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 print:hidden">
        {loadError && (
          <p className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2">
            {loadError}
          </p>
        )}
        {saveError && (
          <p className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2">
            {saveError}
          </p>
        )}
        {downloadError && (
          <p className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2">
            {downloadError}
          </p>
        )}
        {statusMessage && (
          <p className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2">
            {statusMessage}
          </p>
        )}

        <RegisterPanel
          editingEntry={editingEntry}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <SearchSortBar
          query={query}
          onQueryChange={setQuery}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {loaded && (
          <EntryList
            entries={visibleEntries}
            hasAnyEntries={entries.length > 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {loaded && <PrintableEntries ref={printRef} entries={entries} />}
    </div>
  );
}
