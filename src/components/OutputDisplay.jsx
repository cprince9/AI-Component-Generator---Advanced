import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy, IoCheckmarkDone } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw, FiSmartphone, FiTablet, FiMonitor, FiSave } from 'react-icons/fi';
import { HiOutlineCode } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { buildPreviewHtml } from '../utils/previewBuilder';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OutputDisplay = ({ code, loading, framework, prompt }) => {
  const [tab, setTab] = useState('preview');
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewport, setViewport] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isDark = () => !document.documentElement.classList.contains('light') && (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') !== 'light');

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    if (!code) return;
    const extMap = {
      'html-css': 'html',
      'html-tailwind': 'html',
      'react-tailwind': 'jsx',
      'vue-tailwind': 'vue',
    };
    const ext = extMap[framework?.value] || 'html';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `component-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded component.${ext}!`);
  };

  const saveToMongoDB = async () => {
    if (!code) {
      return toast.error('No code to save yet!');
    }
    if (!user || !token) {
      toast.warning('Please login to save components to your MongoDB library!');
      return navigate('/login');
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: prompt ? prompt.slice(0, 40) + '...' : 'AI Component',
          prompt: prompt || 'Generated Component',
          framework: framework?.value || 'html-css',
          code,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save component');
      }

      toast.success('💾 Saved to your MongoDB Library!');
    } catch (error) {
      toast.error(error.message || 'Error saving to MongoDB');
    } finally {
      setSaving(false);
    }
  };

  // Build the universal preview HTML
  const previewDoc = buildPreviewHtml(code, framework?.value || 'html-css');

  // Viewport width styling
  const getViewportWidth = () => {
    if (viewport === 'mobile') return 'max-w-[375px]';
    if (viewport === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  const Toolbar = () => (
    <div className="bg-white dark:bg-[#141319] w-full h-[52px] flex items-center justify-between px-4 border-b border-slate-200 dark:border-gray-800/80 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <span className="font-bold text-sm text-slate-800 dark:text-gray-200 tracking-wide flex items-center gap-2">
          {tab === 'code' ? '💻 Monaco Editor' : '✨ Live Interactive Preview'}
        </span>
        {tab === 'preview' && (
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-black/50 p-1 rounded-lg border border-slate-200 dark:border-gray-800 ml-2">
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${viewport === 'mobile' ? 'bg-purple-600 text-white font-medium' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <FiSmartphone /> Mobile
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${viewport === 'tablet' ? 'bg-purple-600 text-white font-medium' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <FiTablet /> Tablet
            </button>
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View (100%)"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${viewport === 'desktop' ? 'bg-purple-600 text-white font-medium' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <FiMonitor /> Desktop
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {code && (
          <button
            onClick={saveToMongoDB}
            disabled={saving}
            title="Save to MongoDB Library"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            <FiSave size={14} />
            {saving ? 'Saving...' : 'Save to DB'}
          </button>
        )}
        {tab === 'code' ? (
          <>
            <button
              onClick={copyCode}
              title="Copy Code"
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-200 transition-all border border-slate-300 dark:border-gray-700/50 flex items-center gap-1 text-xs"
            >
              {copied ? <IoCheckmarkDone className="text-emerald-500" size={16} /> : <IoCopy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={downloadFile}
              title="Download File"
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-200 transition-all border border-slate-300 dark:border-gray-700/50"
            >
              <PiExportBold size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsNewTabOpen(true)}
              title="Open Fullscreen in New Tab"
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-200 transition-all border border-slate-300 dark:border-gray-700/50"
            >
              <ImNewTab size={15} />
            </button>
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              title="Refresh Preview"
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-200 transition-all border border-slate-300 dark:border-gray-700/50"
            >
              <FiRefreshCcw size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full h-[620px] lg:h-[calc(100vh-120px)] bg-slate-50 dark:bg-[#0c0c0e] rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800/80 flex flex-col shadow-xl dark:shadow-2xl dark:shadow-purple-950/10 transition-colors duration-300">
        {!code && !loading ? (
          <div className="w-full h-full flex items-center flex-col justify-center text-center p-6 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#101015] dark:to-[#09090b]">
            <div className="p-5 w-[80px] h-[80px] flex items-center justify-center text-4xl rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30 shadow-lg shadow-purple-500/10 animate-pulse">
              <HiOutlineCode />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-gray-200 mt-5">No Component Generated Yet</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 max-w-sm">
              Select a framework and describe your component on the left, then let Gemini AI write clean, responsive code for you!
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#141319] w-full h-[52px] flex items-center gap-2 px-3 border-b border-slate-200 dark:border-gray-800/80 transition-colors duration-300">
              <button
                onClick={() => setTab('preview')}
                className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  tab === 'preview'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                }`}
              >
                <span>✨</span> Live Preview
              </button>
              <button
                onClick={() => setTab('code')}
                className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  tab === 'code'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                }`}
              >
                <span>💻</span> Code Editor
              </button>
            </div>
            <Toolbar />
            <div className="flex-grow h-0 relative bg-slate-200 dark:bg-[#09090b] flex justify-center items-center overflow-auto p-0 sm:p-2">
              {tab === 'code' ? (
                <div className="w-full h-full">
                  <Editor
                    value={code}
                    height="100%"
                    theme={isDark() ? 'vs-dark' : 'light'}
                    language={framework?.value === 'react-tailwind' ? 'javascript' : framework?.value === 'vue-tailwind' ? 'html' : 'html'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                    }}
                  />
                </div>
              ) : (
                <div className={`w-full h-full transition-all duration-300 mx-auto border-0 sm:border sm:border-slate-300 sm:dark:border-gray-800 sm:rounded-xl overflow-hidden shadow-2xl bg-white ${getViewportWidth()}`}>
                  <iframe
                    key={refreshKey}
                    srcDoc={previewDoc}
                    title="Preview"
                    className="w-full h-full border-0 bg-transparent"
                    sandbox="allow-scripts allow-same-origin allow-modals"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-slate-900 dark:bg-[#09090b] z-50 flex flex-col">
          <div className="text-white w-full h-[60px] flex items-center justify-between px-6 bg-slate-800 dark:bg-[#141319] border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg text-purple-400">GenU</span>
              <span className="text-gray-300 dark:text-gray-400 text-sm">Fullscreen Live Preview ({framework?.label || 'HTML'})</span>
            </div>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="p-2 rounded-full bg-slate-700 dark:bg-zinc-800 hover:bg-slate-600 dark:hover:bg-zinc-700 text-white transition-all"
            >
              <IoCloseSharp size={24} />
            </button>
          </div>
          <iframe
            srcDoc={previewDoc}
            title="Fullscreen Preview"
            className="w-full flex-grow bg-white"
            sandbox="allow-scripts allow-same-origin allow-modals"
          />
        </div>
      )}
    </>
  );
};

export default OutputDisplay;