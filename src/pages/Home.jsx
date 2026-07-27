import React, { useState } from 'react';
import PromptForm from '../components/PromptForm';
import OutputDisplay from '../components/OutputDisplay';
import RefineChat from '../components/RefineChat';
import { toast } from 'react-toastify';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'react-tailwind', label: 'React + Tailwind CSS' },
    { value: 'vue-tailwind', label: 'Vue + Tailwind CSS' },
  ];

  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState(options[1]); // Default to HTML + Tailwind CSS for best out-of-box aesthetics
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [refinements, setRefinements] = useState([]);

  // Helper function to extract code from Markdown fences
  const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  // --- ✅ LIVE Google GenAI API Function ---
  const getResponse = async () => {
    if (!prompt.trim()) {
      return toast.error('Please describe your component first');
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return toast.error("API Key not found. Please add it to your .env.local file.");
    }

    setLoading(true);
    setCode(''); // Clear previous code
    setRefinements([]); // Clear refinement history for new generation

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fullPrompt = `
        You are an expert programmer with deep expertise in modern web development, UI/UX design, and premium aesthetics.
        Your task is to generate a UI component based on the following request: "${prompt}"
        The component should use the following framework/libraries: "${framework.label}".

        REQUIREMENTS:
        - The code must be clean, well-structured, and production-ready.
        - The UI must be modern, aesthetically pleasing, and fully responsive.
        - Incorporate rich aesthetics: smooth gradients, sleek dark/light styling, glassmorphism effects, and hover animations.
        - If generating React or Vue, ensure it is a complete, self-contained component ready for browser rendering.
        - Return ONLY the complete, single-file code inside a single Markdown code block (e.g., \`\`\`html ... \`\`\` or \`\`\`jsx ... \`\`\`).
        - Do not include any explanations, text, or comments outside of the code block.
      `;

      const result = await model.generateContentStream(fullPrompt);
      
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setCode(extractCode(text)); // Update the UI in real-time
      }
      
      toast.success('Component generated successfully! ✨');

    } catch (error) {
      console.error("FULL ERROR:", error);
      toast.error(error.message || "Failed to generate component");
    } finally {
      setLoading(false);
    }
  };

  // --- 🔁 Iterative AI Code Refinement Function ---
  const handleRefine = async (refinementPrompt) => {
    if (!code) return toast.error("No component generated yet to refine.");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return toast.error("API Key not found. Please check your .env.local file.");
    }

    setLoading(true);
    const newRefinements = [...refinements, { prompt: refinementPrompt, timestamp: new Date() }];
    setRefinements(newRefinements);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fullPrompt = `
        You are an expert AI frontend copilot. 
        Here is an existing UI component written in "${framework.label}":
        \`\`\`
        ${code}
        \`\`\`

        The user requested the following modification/refinement: "${refinementPrompt}".

        REQUIREMENTS:
        - Carefully apply the user's requested changes while preserving the existing working functionality and layout.
        - Keep the code clean, responsive, and visually stunning.
        - Return ONLY the updated, complete, single-file code inside a single Markdown code block.
        - Do not include any explanations, text, or comments outside of the code block.
      `;

      const result = await model.generateContentStream(fullPrompt);
      
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setCode(extractCode(text));
      }
      
      toast.success('Component refined successfully! 🎨');
    } catch (error) {
      console.error("REFINE ERROR:", error);
      toast.error("Failed to refine code: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 min-h-[calc(100vh-80px)]">
        {/* Left Column: Prompt Form (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col">
          <PromptForm
            prompt={prompt}
            setPrompt={setPrompt}
            framework={framework}
            setFramework={setFramework}
            options={options}
            loading={loading}
            onSubmit={getResponse}
          />
        </div>

        {/* Right Column: Editor & Preview + Refine Chat (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col">
          <OutputDisplay
            code={code}
            loading={loading}
            framework={framework}
            prompt={prompt}
          />
          <RefineChat
            onRefine={handleRefine}
            loading={loading}
            refinements={refinements}
            disabled={!code}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;