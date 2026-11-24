import { useState } from 'react';
import { BookOpen, Download, Printer } from 'lucide-react';
import { PROJECT_REPORT_CHAPTERS } from '../data/projectReport';

export function ProjectReportView() {
  const [activeChapter, setActiveChapter] = useState<number>(1);

  function handleDownloadMarkdown() {
    const markdown = PROJECT_REPORT_CHAPTERS.map(
      (ch) => `## Chapter ${ch.number}. ${ch.title}\n\n${ch.body}\n`
    ).join('\n---\n\n');

    const fullDoc = `# PrintCare – Printing Shop Customer Management System\n\nCollege Mini-Project Report\n\n---\n\n${markdown}`;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PrintCare_Mini_Project_Report.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-700 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              College Mini-Project Report (21 Chapters)
            </h2>
            <p className="text-xs text-slate-600">
              Complete formal academic documentation ready for review, printing, or Markdown export.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            Export Markdown
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chapter Index */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden no-print">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-xs font-bold text-slate-700">Table of Contents</p>
          </div>
          <nav aria-label="Project Report Chapters" className="max-h-[620px] overflow-y-auto divide-y divide-slate-100">
            {PROJECT_REPORT_CHAPTERS.map((chapter) => {
              const isCurrent = activeChapter === chapter.number;
              return (
                <button
                  key={chapter.number}
                  type="button"
                  onClick={() => {
                    setActiveChapter(chapter.number);
                    const el = document.getElementById(`chapter-${chapter.number}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums w-5 shrink-0">
                    {String(chapter.number).padStart(2, '0')}
                  </span>
                  <span className="truncate">{chapter.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Full Report Document */}
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
          <header className="pb-6 border-b border-slate-200">
            <p className="text-xs font-semibold text-blue-700">Academic Mini-Project Documentation</p>
            <h1 className="mt-1.5 text-2xl font-bold text-slate-900 text-balance">
              PrintCare – Printing Shop Customer Management System
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              Native Android (Kotlin) · Material Design 3 · Firebase Authentication &amp; Cloud Firestore
            </p>
          </header>

          {PROJECT_REPORT_CHAPTERS.map((chapter) => (
            <section
              key={chapter.number}
              id={`chapter-${chapter.number}`}
              className="scroll-mt-6 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
            >
              <h3 className="text-base font-bold text-slate-900">
                {String(chapter.number).padStart(2, '0')}. {chapter.title}
              </h3>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                {chapter.body}
              </pre>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
