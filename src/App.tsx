import { useState } from 'react';
import { Download } from 'lucide-react';
import { AndroidPreview } from './components/AndroidPreview';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { ProjectReportView } from './components/ProjectReportView';
import { SourceExplorer } from './components/SourceExplorer';
import { ANDROID_PROJECT_FILES } from './data/androidProjectFiles';
import { DUMMY_CUSTOMERS } from './data/dummyCustomers';
import { buildZipBytes, type CustomerRecord } from './utils/printcareLogic';

type ActiveTab = 'preview' | 'source' | 'firebase' | 'report';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [customers, setCustomers] = useState<CustomerRecord[]>(DUMMY_CUSTOMERS);

  function handleAddCustomer(newCustomer: CustomerRecord) {
    setCustomers((prev) => [newCustomer, ...prev]);
  }

  function handleDownloadZip() {
    const zipBytes = buildZipBytes(
      ANDROID_PROJECT_FILES.map((file) => ({
        path: `PrintCare/${file.path}`,
        content: file.content,
      }))
    );
    const buffer = new ArrayBuffer(zipBytes.byteLength);
    new Uint8Array(buffer).set(zipBytes);
    const blob = new Blob([buffer], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PrintCare-Android-Project.zip';
    link.click();
    URL.revokeObjectURL(url);
  }

  const navTabs: { id: ActiveTab; label: string; shortLabel: string }[] = [
    { id: 'preview', label: 'App Preview', shortLabel: 'Preview' },
    { id: 'source', label: 'Android Source', shortLabel: 'Source' },
    { id: 'firebase', label: 'Firebase & Data', shortLabel: 'Firebase' },
    { id: 'report', label: 'Project Report', shortLabel: 'Report' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('preview');
            }}
            className="text-base sm:text-lg font-extrabold tracking-tight text-blue-700 whitespace-nowrap shrink-0"
          >
            PrintCare
          </a>

          <nav aria-label="Workspace sections" className="flex items-center gap-3 sm:gap-6">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 sm:py-5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-blue-700 text-blue-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleDownloadZip}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download ZIP
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-slate-200 no-print">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
              Printing Shop Customer Management System
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Native Android (Kotlin) · Material Design 3 · Firebase Auth &amp; Cloud Firestore · {ANDROID_PROJECT_FILES.length} Source Files
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadZip}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download Android ZIP
          </button>
        </div>

        {activeTab === 'preview' && (
          <AndroidPreview customers={customers} onAddCustomer={handleAddCustomer} />
        )}
        {activeTab === 'source' && <SourceExplorer onDownloadZip={handleDownloadZip} />}
        {activeTab === 'firebase' && <FirebaseGuideView />}
        {activeTab === 'report' && <ProjectReportView />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 no-print">
        PrintCare Android Project Package · Package ID <span className="font-mono">com.printcare.app</span>
      </footer>
    </div>
  );
}
