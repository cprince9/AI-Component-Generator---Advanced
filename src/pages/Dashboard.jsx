import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiExternalLink, FiCode, FiPlus, FiClock, FiLayers } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { buildPreviewHtml } from '../utils/previewBuilder';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComp, setSelectedComp] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchComponents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/components', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setComponents(data);
        } else {
          throw new Error(data.message || 'Failed to fetch library');
        }
      } catch (err) {
        console.error(err);
        toast.error('Could not connect to MongoDB library backend');
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [user, token, navigate]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this component from MongoDB?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/components/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setComponents(components.filter((c) => c._id !== id));
        if (selectedComp?._id === id) setSelectedComp(null);
        toast.success('Component deleted from database');
      } else {
        toast.error('Failed to delete component');
      }
    } catch (err) {
      toast.error('Error deleting component');
    }
  };

  const copyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-80px)] transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>🗂️</span> My MongoDB Component Library
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Welcome back, <span className="text-purple-600 dark:text-purple-400 font-semibold">{user?.name}</span>! All your AI-generated components saved to MongoDB are here.
          </p>
        </div>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
        >
          <FiPlus size={16} /> Create New Component
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-gray-400">
          <ClipLoader color="#a855f7" size={40} />
          <p className="mt-4 text-sm font-mono">Loading saved components from MongoDB...</p>
        </div>
      ) : components.length === 0 ? (
        <div className="w-full py-20 rounded-3xl bg-white dark:bg-[#141319] border border-slate-200 dark:border-gray-800/80 text-center p-6 flex flex-col items-center justify-center shadow-xl transition-colors duration-300">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl mb-4 border border-purple-300 dark:border-purple-500/30">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Library is Empty</h3>
          <p className="text-slate-500 dark:text-gray-400 text-sm max-w-md mb-6">
            You haven't saved any AI components to MongoDB yet. Go to the generator, describe a UI component, and click "Save to DB"!
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
          >
            Go to Generator ✨
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((comp) => (
            <div
              key={comp._id}
              onClick={() => setSelectedComp(comp)}
              className="group bg-white dark:bg-[#141319] border border-slate-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-950/20 transition-all cursor-pointer flex flex-col"
            >
              {/* Mini Preview Thumbnail */}
              <div className="w-full h-44 bg-slate-100 dark:bg-[#09090b] relative overflow-hidden border-b border-slate-200 dark:border-gray-800/80">
                <iframe
                  srcDoc={buildPreviewHtml(comp.code, comp.framework)}
                  title={comp.title}
                  className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#141319] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-gray-700 text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <FiLayers size={10} /> {comp.framework}
                </span>
              </div>

              {/* Card Info */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {comp.title || 'Untitled Component'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1.5 line-clamp-2 font-mono bg-slate-50 dark:bg-[#09090b] p-2 rounded-lg border border-slate-200 dark:border-gray-800/60">
                    "{comp.prompt}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> {new Date(comp.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => copyCode(comp.code, e)}
                      title="Copy Code"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                      <FiCode size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(comp._id, e)}
                      title="Delete from DB"
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all border border-red-200 dark:border-red-900/30"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal View for Selected Component */}
      {selectedComp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141319] border border-slate-200 dark:border-gray-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
            <div className="p-4 px-6 bg-slate-100 dark:bg-[#181820] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedComp.title}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">Framework: {selectedComp.framework}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedComp.code);
                    toast.success('Code copied!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <FiCode /> Copy Code
                </button>
                <button
                  onClick={() => setSelectedComp(null)}
                  className="p-2 rounded-full bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-grow bg-white relative overflow-hidden">
              <iframe
                srcDoc={buildPreviewHtml(selectedComp.code, selectedComp.framework)}
                title="Modal Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-modals"
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#101015] border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs text-slate-600 dark:text-gray-400">
              <span>Prompt: "{selectedComp.prompt}"</span>
              <button
                onClick={() => setSelectedComp(null)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
