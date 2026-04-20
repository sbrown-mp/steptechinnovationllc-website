"use client";

export function FlyerPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden fixed right-4 top-20 z-50 rounded-lg border border-slate-300/30 bg-slate-900/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-300/40 hover:bg-slate-800"
    >
      Download / Print PDF
    </button>
  );
}
