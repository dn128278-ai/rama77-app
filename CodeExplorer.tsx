import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  FolderTree,
  Search,
  ExternalLink,
  Layers,
  Code2,
} from 'lucide-react';
import { ANDROID_FILES } from '../../data/androidProjectFiles';
import { AndroidFile } from '../../types';
import { downloadAndroidStudioZip } from '../../utils/projectZipGenerator';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_FILES[4]); // activity_login.xml
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'layout' | 'kotlin' | 'manifest' | 'values' | 'gradle'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredFiles = ANDROID_FILES.filter((f) => {
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    const matchesSearch =
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadAndroidStudioZip();
    } catch (e) {
      console.error('Failed to generate ZIP archive:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
      {/* Top Action Bar */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-[#F16521] border border-orange-500/30 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              Android Studio Project Code &amp; Layouts
            </h3>
            <p className="text-xs text-zinc-400">
              Complete source code ready for Android Studio Hedgehog / Iguana / Ladybug
            </p>
          </div>
        </div>

        {/* 1-Click ZIP Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F16521] to-[#E05410] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Packaging ZIP...' : 'Download Android Studio Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'layout', label: 'XML Layouts' },
            { id: 'kotlin', label: 'Kotlin Code' },
            { id: 'manifest', label: 'Manifest' },
            { id: 'values', label: 'Colors & Strings' },
            { id: 'gradle', label: 'Gradle Config' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#F16521] text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search file path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Main Split Body: File List + Code Viewer */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-full md:w-80 border-r border-zinc-800 overflow-y-auto p-2 space-y-1 bg-zinc-950/80">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Files ({filteredFiles.length})</span>
          </div>

          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            const fileName = file.path.split('/').pop();
            const folder = file.path.split('/').slice(0, -1).join('/');

            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/15 border border-orange-500/40 text-orange-400'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-zinc-200 truncate">
                  <span className="truncate flex items-center gap-1.5">
                    <FileCode2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F16521]' : 'text-zinc-500'}`} />
                    {fileName}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {file.language}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 truncate pl-5">
                  {file.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Code Display Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          {/* File Meta Header */}
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between">
            <div className="overflow-hidden pr-3">
              <span className="text-xs font-mono font-bold text-orange-400 truncate block">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-zinc-500 block truncate">
                {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300 leading-relaxed bg-[#0d1117]">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
