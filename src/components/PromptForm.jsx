import React from 'react';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';

const selectStyles = {
  control: (base) => ({ ...base, backgroundColor: '#09090B', borderColor: '#333', color: '#fff', boxShadow: 'none', '&:hover': { borderColor: '#555' } }),
  menu: (base) => ({ ...base, backgroundColor: '#141319', color: '#fff' }),
  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#17171C' : '#141319', color: '#fff', '&:active': { backgroundColor: '#333' } }),
  singleValue: (base) => ({ ...base, color: '#fff' }),
  placeholder: (base) => ({ ...base, color: '#aaa' }),
  input: (base) => ({ ...base, color: '#fff' }),
};

const PromptForm = ({ prompt, setPrompt, framework, setFramework, options, loading, onSubmit }) => {
  return (
    <div className="w-full py-6 rounded-xl bg-secondary-bg p-5 flex flex-col h-full border border-gray-800">
      <h3 className="text-2xl font-semibold sp-text">AI Component Generator</h3>
      <p className="text-gray-400 mt-2 text-base">Describe your desired component and let AI code it for you.</p>

      <label htmlFor="framework-select" className="text-base font-bold mt-5 mb-2">Framework</label>
      <Select id="framework-select" options={options} value={framework} styles={selectStyles} onChange={setFramework} />

      <label htmlFor="prompt-textarea" className="text-base font-bold mt-5 mb-2">Describe your component</label>
      <textarea id="prompt-textarea" onChange={(e) => setPrompt(e.target.value)} value={prompt} className="w-full flex-grow rounded-xl bg-[#09090B] mt-1 p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="e.g., 'a responsive pricing card with three tiers'..." ></textarea>

      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-400 text-sm">Click generate to get your code.</p>
        <button onClick={onSubmit} disabled={loading} className="flex items-center justify-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-indigo-600 px-5 gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
          Generate
        </button>
      </div>
    </div>
  );
};

export default PromptForm;