import React, { useState } from 'react';
import PromptForm from '../components/PromptForm';
import OutputDisplay from '../components/OutputDisplay';
import { toast } from 'react-toastify';
// Import the official Google GenAI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'react-tailwind', label: 'React + Tailwind CSS' },
    { value: 'vue-tailwind', label: 'Vue + Tailwind CSS' },
  ];

  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

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

    // 1. Securely get the API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return toast.error("API Key not found. Please add it to your .env.local file.");
    }

    setLoading(true);
    setCode(''); // Clear previous code

    try {
      // 2. Initialize the model
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // 3. Construct the detailed prompt
      const fullPrompt = `
        You are an expert programmer with deep expertise in modern web development and UI/UX design.
        Your task is to generate a UI component based on the following request: "${prompt}"
        The component should use the following framework/libraries: "${framework.label}".

        REQUIREMENTS:
        - The code must be clean, well-structured, and production-ready.
        - The UI must be modern, aesthetically pleasing, and fully responsive.
        - Incorporate smooth animations, hover effects, and transitions.
        - Return ONLY the complete, single-file code inside a single Markdown code block (e.g., \`\`\`html ... \`\`\`).
        - Do not include any explanations, text, or comments outside of the code block.
      `;

      // 4. Call the API and stream the response
      const result = await model.generateContentStream(fullPrompt);
      
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setCode(extractCode(text)); // Update the UI in real-time
      }
      
      toast.success('Component generated successfully!');

    } catch (error) {
      console.error("FULL ERROR:", error);
  console.error("MESSAGE:", error.message);
  console.error("STACK:", error.stack);

  toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 min-h-[calc(100vh-80px)]">
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          framework={framework}
          setFramework={setFramework}
          options={options}
          loading={loading}
          // --- 🔁 SWAP THIS LINE ---
          // From: onSubmit={getResponsePlaceholder}
          // To:
          onSubmit={getResponse}
        />
        <OutputDisplay code={code} loading={loading} />
      </div>
    </div>
  );
};

export default Home;