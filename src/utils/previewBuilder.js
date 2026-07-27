/**
 * Universal Multi-Stack Live Preview Builder
 * Converts raw code from Gemini (HTML, Tailwind, React, Vue) into a standalone HTML string ready for an iframe.
 */

export const buildPreviewHtml = (code = '', framework = 'html-css') => {
  if (!code || typeof code !== 'string') {
    return `<html><body style="background:#09090b;color:#a1a1aa;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">No code generated yet.</body></html>`;
  }

  const cleanCode = code.trim();

  // --- 1. REACT + TAILWIND CSS PREVIEW ---
  if (framework === 'react-tailwind' || framework.includes('react')) {
    // Strip ES6 imports which syntax-error in standard browser scripts
    let processedCode = cleanCode
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+function\s+([a-zA-Z0-9_]+)/g, 'window.__MainComp = $1; function $1')
      .replace(/export\s+default\s+class\s+([a-zA-Z0-9_]+)/g, 'window.__MainComp = $1; class $1')
      .replace(/export\s+default\s+([a-zA-Z0-9_]+);?/g, 'window.__MainComp = $1;')
      .replace(/export\s+([const|let|var|function|class]+)/g, '$1');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #09090b;
      color: #f8fafc;
      min-height: 100vh;
    }
    /* Smooth scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #18181b; }
    ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #52525b; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, Fragment } = React;
    
    // Proxy fallback for missing Lucide or React icons so preview never crashes
    const IconFallback = ({ className, size = 20, ...props }) => (
      <span className={\`inline-flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 rounded text-xs font-bold px-1.5 py-0.5 \${className || ''}\`} {...props}>★</span>
    );
    window.LucideIcons = new Proxy({}, { get: () => IconFallback });
    window.ReactIcons = new Proxy({}, { get: () => IconFallback });

    try {
      ${processedCode}

      const TargetComp = window.__MainComp || (typeof App !== 'undefined' ? App : (typeof Component !== 'undefined' ? Component : null));

      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);

      if (TargetComp) {
        root.render(<TargetComp />);
      } else {
        // Look for any function in scope with PascalCase name
        const possibleComp = Object.keys(window).find(key => 
          typeof window[key] === 'function' && /^[A-Z]/.test(key) && key !== 'TargetComp' && !key.startsWith('React')
        );
        if (possibleComp && window[possibleComp]) {
          const Comp = window[possibleComp];
          root.render(<Comp />);
        } else {
          root.render(
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 max-w-lg mx-auto mt-10">
              <h3 className="font-bold text-lg mb-2">⚠️ Component Preview Note</h3>
              <p className="text-sm">Could not automatically detect the exported React component name. Please ensure your code has <code className="bg-red-500/20 px-1 py-0.5 rounded">export default ComponentName</code>.</p>
            </div>
          );
        }
      }
    } catch (err) {
      const rootElement = document.getElementById('root');
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <div className="p-6 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 max-w-2xl mx-auto mt-10 font-mono text-sm">
          <div className="font-bold text-base text-red-400 mb-2 flex items-center gap-2">
            <span>🚨 React Runtime Error:</span>
          </div>
          <pre className="whitespace-pre-wrap bg-black/40 p-4 rounded-lg overflow-x-auto">{err.message}</pre>
        </div>
      );
    }
  </script>
</body>
</html>`;
  }

  // --- 2. VUE + TAILWIND CSS PREVIEW ---
  if (framework === 'vue-tailwind' || framework.includes('vue')) {
    // If SFC template tag exists, extract template and script
    let templateContent = cleanCode;
    let scriptContent = '';

    const tempMatch = cleanCode.match(/<template>([\s\S]*?)<\/template>/i);
    if (tempMatch) {
      templateContent = tempMatch[1];
    }
    const scriptMatch = cleanCode.match(/<script.*?([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      scriptContent = scriptMatch[1]
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
        .replace(/export\s+default\s+/g, 'const vueConfig = ');
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background-color: #09090b; color: #f8fafc; }
  </style>
</head>
<body>
  <div id="app">${templateContent}</div>
  <script>
    const { createApp, ref, reactive, computed, onMounted, watch } = Vue;
    try {
      ${scriptContent}
      const app = createApp(typeof vueConfig !== 'undefined' ? vueConfig : {});
      app.mount('#app');
    } catch (err) {
      document.getElementById('app').innerHTML = \`<div style="color: #ef4444; padding: 20px; background: rgba(239,68,68,0.1); border-radius: 8px;"><b>Vue Error:</b> \${err.message}</div>\`;
    }
  </script>
</body>
</html>`;
  }

  // --- 3. HTML + TAILWIND CSS / PLAIN HTML PREVIEW ---
  const isFullHtml = /<html/i.test(cleanCode) || /<!DOCTYPE/i.test(cleanCode);
  const needsTailwind = framework.includes('tailwind') || /class(Name)?=["'][^"']*?(flex|grid|bg-|text-|p-|m-|rounded|border)/i.test(cleanCode);

  if (isFullHtml) {
    if (needsTailwind && !cleanCode.includes('tailwindcss.com')) {
      return cleanCode.replace(/<head>/i, '<head>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">');
    }
    return cleanCode;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  ${needsTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #09090b;
      color: #f8fafc;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  ${cleanCode}
</body>
</html>`;
};
