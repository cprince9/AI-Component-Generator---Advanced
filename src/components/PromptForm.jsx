import React from 'react';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { FiZap } from 'react-icons/fi';

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--select-bg, #0c0c0e)',
    borderColor: 'var(--select-border, #27272a)',
    color: 'var(--select-text, #fff)',
    boxShadow: 'none',
    padding: '2px',
    borderRadius: '0.75rem',
    '&:hover': { borderColor: '#a855f7' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--select-menu-bg, #141319)',
    color: 'var(--select-text, #fff)',
    borderRadius: '0.75rem',
    border: '1px solid var(--select-border, #27272a)',
    overflow: 'hidden',
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? 'var(--select-hover, #27272a)' : 'transparent',
    color: state.isSelected ? '#fff' : 'inherit',
    cursor: 'pointer',
    fontSize: '0.875rem',
    '&:active': { backgroundColor: '#7e22ce' },
  }),
  singleValue: (base) => ({ ...base, color: 'inherit', fontSize: '0.875rem', fontWeight: '500' }),
  placeholder: (base) => ({ ...base, color: '#71717a', fontSize: '0.875rem' }),
  input: (base) => ({ ...base, color: 'inherit' }),
};

const PromptForm = ({ prompt, setPrompt, framework, setFramework, options, loading, onSubmit }) => {
  const inspirationPrompts = [
    { label: "💳 SaaS Pricing Card", text: "A sleek SaaS pricing table with 3 tiers (Starter, Pro, Enterprise), popular badge on Pro tier, features checklist, hover animations, and a glow effect button." },
    { label: "📊 Crypto KPI Dashboard", text: "A modern cryptocurrency portfolio dashboard with 4 KPI stat cards (Total Balance, 24h Profit, Bitcoin price, Ethereum price) with green/red trend indicators and responsive grid." },
    { label: "🖼️ Glassmorphism Auth Modal", text: "A premium glassmorphic login modal with blurred background, floating avatar icon, email/password inputs, remember me checkbox, and a gradient sign in button." },
    { label: "🚀 Neo-brutalist Hero", text: "A bold neo-brutalist hero section for an AI startup with high contrast colors, thick black borders, hard shadow effects, large heading, and CTA buttons." },
  ];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#141319] p-6 flex flex-col h-full border border-slate-200 dark:border-gray-800/80 shadow-xl dark:shadow-2xl dark:shadow-purple-950/10 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>✨</span> AI UI Generator
          </h3>
          <p className="text-slate-500 dark:text-gray-400 mt-1 text-xs">Transform natural language into responsive, state-of-the-art web components.</p>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="framework-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2 flex items-center justify-between">
          <span>Target Framework & Stack</span>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 normal-case font-normal bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/40">Multi-stack preview enabled</span>
        </label>
        <div className="dark:text-white text-slate-800">
          <Select
            id="framework-select"
            options={options}
            value={framework}
            styles={selectStyles}
            onChange={setFramework}
            isDisabled={loading}
          />
        </div>
      </div>

      <div className="mt-6 flex-grow flex flex-col">
        <label htmlFor="prompt-textarea" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2 flex items-center justify-between">
          <span>Describe your component</span>
          <span className="text-[10px] text-slate-400 dark:text-gray-500 normal-case font-normal">Be specific with style & layout</span>
        </label>
        <textarea
          id="prompt-textarea"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={loading}
          className="w-full flex-grow min-h-[160px] rounded-xl bg-slate-50 dark:bg-[#0c0c0e] p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 text-sm outline-none border border-slate-200 dark:border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all disabled:opacity-50 font-sans leading-relaxed"
          placeholder="e.g., 'A responsive navigation bar with a glassmorphism effect, logo on the left, navigation links in the center, and a dark mode toggle button on the right'..."
        />
      </div>

      {/* Inspiration Quick Starters */}
      <div className="mt-4">
        <p className="text-[11px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <FiZap className="text-amber-500 dark:text-amber-400" /> Need Inspiration? Try these starters:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {inspirationPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(item.text)}
              disabled={loading}
              className="text-left p-2 rounded-xl bg-slate-50 dark:bg-[#0c0c0e] hover:bg-purple-50 dark:hover:bg-purple-950/30 text-slate-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-gray-800/80 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all text-xs flex flex-col justify-center"
            >
              <span className="font-bold text-[11px] truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200 dark:border-gray-800/80">
        <span className="text-slate-400 dark:text-gray-500 text-xs hidden sm:inline">Powered by Gemini 2.5 Flash</span>
        <button
          onClick={onSubmit}
          disabled={loading || !prompt.trim()}
          className="w-full sm:w-auto flex items-center justify-center py-3.5 px-8 rounded-xl border-0 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm gap-2.5 transition-all shadow-lg shadow-purple-900/40 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? (
            <>
              <ClipLoader color="white" size={16} />
              <span>Generating Code...</span>
            </>
          ) : (
            <>
              <BsStars size={16} />
              <span>Generate Component</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptForm;