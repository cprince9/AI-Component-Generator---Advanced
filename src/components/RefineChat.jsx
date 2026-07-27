import React, { useState } from 'react';
import { BsStars, BsSendFill } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { FiMessageSquare, FiClock } from 'react-icons/fi';

const RefineChat = ({ onRefine, loading, refinements = [], disabled }) => {
  const [refinementInput, setRefinementInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!refinementInput.trim() || loading || disabled) return;
    onRefine(refinementInput);
    setRefinementInput('');
  };

  const quickSuggestions = [
    "🎨 Make the colors more vibrant & modern",
    "🌙 Add a dark mode toggle switch",
    "✨ Add smooth hover micro-animations",
    "📱 Make it fully responsive for mobile cards",
  ];

  return (
    <div className="w-full mt-6 rounded-2xl bg-white dark:bg-[#141319] border border-slate-200 dark:border-gray-800/80 p-5 shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30">
            <BsStars size={16} />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-gray-200">AI Code Refiner (Iterative Copilot)</h4>
        </div>
        <span className="text-xs text-slate-400 dark:text-gray-500 font-mono">Modifies existing code directly</span>
      </div>

      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <input
          type="text"
          value={refinementInput}
          onChange={(e) => setRefinementInput(e.target.value)}
          disabled={loading || disabled}
          placeholder={disabled ? "Generate a component first to unlock AI refiner..." : "Ask AI to modify (e.g. 'Make button emerald green', 'Add shadow effects')..."}
          className="w-full bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3.5 pr-28 outline-none border border-slate-200 dark:border-gray-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-slate-400 dark:placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || disabled || !refinementInput.trim()}
          className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <ClipLoader color="white" size={14} /> : <BsSendFill size={12} />}
          Refine
        </button>
      </form>

      {!disabled && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-gray-500">Quick ideas:</span>
          {quickSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRefinementInput(sug);
              }}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-gray-700/60 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {refinements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800/60">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
            <FiClock size={12} /> Refinement History ({refinements.length})
          </p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {refinements.map((refItem, index) => (
              <div
                key={index}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#09090b] border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span className="truncate max-w-[200px]">{refItem.prompt || refItem}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefineChat;
