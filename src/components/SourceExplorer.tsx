import { useMemo, useState } from 'react';
import { Check, Copy, Download, FileCode2, FolderTree, Search } from 'lucide-react';
import { ANDROID_PROJECT_FILES, type AndroidFileEntry } from '../data/androidProjectFiles';

const CATEGORIES: Array<'All' | AndroidFileEntry['category']> = [
  'All',
  'Kotlin Source',
  'XML Layouts',
  'Gradle & Config',
  'Resources & Values',
  'Drawables',
];

interface SourceExplorerProps {
  onDownloadZip: () => void;
}

export function SourceExplorer({ onDownloadZip }: SourceExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | AndroidFileEntry['category']>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPath, setSelectedPath] = useState<string>(ANDROID_PROJECT_FILES[7].path); // Customer.kt or MainActivity
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return ANDROID_PROJECT_FILES.filter((file) => {
      const categoryMatch = selectedCategory === 'All' || file.category === selectedCategory;
      const queryMatch =
        !query ||
        file.path.toLowerCase().includes(query) ||
        file.summary.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [selectedCategory, searchTerm]);

  const activeFile = useMemo(() => {
    return (
      ANDROID_PROJECT_FILES.find((f) => f.path === selectedPath) ??
      filteredFiles[0] ??
      ANDROID_PROJECT_FILES[0]
    );
  }, [selectedPath, filteredFiles]);

  async function handleCopyFile(file: AndroidFileEntry) {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopiedPath(file.path);
      setTimeout(() => setCopiedPath(null), 1800);
    } catch {
      // Clipboard blocked in restricted headless context
    }
  }

  function handleDownloadSingleFile(file: AndroidFileEntry) {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const lines = activeFile.content.split('\n');

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FolderTree className="w-5 h-5 text-blue-700 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              Android Studio Project Source ({ANDROID_PROJECT_FILES.length} files)
            </h2>
            <p className="text-xs text-slate-600">
              Package: com.printcare.app · Kotlin + XML ViewBinding + Material 3 + Firebase BoM 33.7.0
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDownloadZip}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Android Project (.zip)
        </button>
      </div>

      {/* Category Filter Strip */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === category
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Master-Detail Code Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                aria-label="Filter Android source files"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter files by path..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
            {filteredFiles.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 text-center">No files match "{searchTerm}".</p>
            ) : (
              filteredFiles.map((file) => {
                const isSelected = activeFile.path === file.path;
                const fileName = file.path.split('/').pop();
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedPath(file.path)}
                    className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-start gap-2.5 ${
                      isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <FileCode2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isSelected ? 'text-blue-700' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{fileName}</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate">{file.path}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Code Viewer Pane */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="min-w-0">
              <p className="text-xs font-mono font-semibold text-slate-900 truncate">
                {activeFile.path}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{activeFile.summary}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyFile(activeFile)}
                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {copiedPath === activeFile.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy File
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSingleFile(activeFile)}
                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-100 overflow-x-auto max-h-[590px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index} className="hover:bg-slate-900/70">
                    <td className="select-none pr-4 text-right text-slate-500 tabular-nums align-top w-10">
                      {index + 1}
                    </td>
                    <td className="whitespace-pre text-slate-100">{line || ' '}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
