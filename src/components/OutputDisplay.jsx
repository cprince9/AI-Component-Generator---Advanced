import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { HiOutlineCode } from 'react-icons/hi';
import { toast } from 'react-toastify';

const OutputDisplay = ({ code, loading }) => {
  const [tab, setTab] = useState('code');
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const copyCode = async () => { /* ... (code from previous turn) */ };
  const downloadFile = () => { /* ... (code from previous turn) */ };

  const Toolbar = () => (
    <div className="bg-tertiary-bg w-full h-[50px] flex items-center justify-between px-4 border-b border-gray-800">
      <p className="font-bold text-gray-200">{tab === 'code' ? 'Code Editor' : 'Live Preview'}</p>
      <div className="flex items-center gap-2">
        {tab === 'code' ? (
          <>
            <button onClick={copyCode} title="Copy Code" className="icon"><IoCopy /></button>
            <button onClick={downloadFile} title="Download File" className="icon"><PiExportBold /></button>
          </>
        ) : (
          <>
            <button onClick={() => setIsNewTabOpen(true)} title="Open in new tab" className="icon"><ImNewTab /></button>
            <button onClick={() => setRefreshKey(prev => prev + 1)} title="Refresh Preview" className="icon"><FiRefreshCcw /></button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative w-full min-h-[85vh] bg-secondary-bg rounded-xl overflow-hidden border border-gray-800 flex flex-col">
        {!code && !loading ? (
          <div className="w-full h-full flex items-center flex-col justify-center text-center p-4">
            <div className="p-5 w-[70px] flex items-center justify-center text-3xl h-[70px] rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"><HiOutlineCode /></div>
            <p className="text-base text-gray-400 mt-4">Your generated component will appear here.</p>
          </div>
        ) : (
          <>
            <div className="bg-tertiary-bg w-full h-[50px] flex items-center gap-3 px-3 border-b border-gray-800">
              <button onClick={() => setTab('code')} className={`w-1/2 py-2 rounded-lg transition-all ${tab === 'code' ? 'bg-purple-600 text-white' : 'hover:bg-zinc-800 text-gray-300'}`}>Code</button>
              <button onClick={() => setTab('preview')} className={`w-1/2 py-2 rounded-lg transition-all ${tab === 'preview' ? 'bg-purple-600 text-white' : 'hover:bg-zinc-800 text-gray-300'}`}>Preview</button>
            </div>
            <Toolbar />
            <div className="flex-grow h-0">
              {tab === 'code' ? (
                <Editor value={code} height="100%" theme="vs-dark" language="html" options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }} />
              ) : (
                <iframe key={refreshKey} srcDoc={code} title="Preview" className="w-full h-full bg-white text-black" sandbox="allow-scripts allow-same-origin"></iframe>
              )}
            </div>
          </>
        )}
      </div>
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
            <p className="font-bold">Fullscreen Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="p-2 rounded-full hover:bg-gray-200"><IoCloseSharp size={24} /></button>
          </div>
          <iframe srcDoc={code} title="Fullscreen Preview" className="w-full h-[calc(100vh-60px)]" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
      )}
    </>
  );
};

export default OutputDisplay;