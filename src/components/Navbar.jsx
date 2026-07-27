import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiLogOut, FiFolder, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

  const getLinkClass = (path) => {
    return `text-sm font-medium transition-all ${
      location.pathname === path
        ? 'text-purple-600 dark:text-purple-500 font-bold'
        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
    }`;
  };

  return (
    <header className="sticky top-0 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between bg-white/80 dark:bg-[#0c0c0e]/90 backdrop-blur-md border-b border-slate-200 dark:border-gray-800/80 z-50 shadow-md dark:shadow-lg transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-base shadow-md shadow-purple-500/20">
          ⚡
        </div>
        <span>GenU<span className="text-purple-600 dark:text-purple-500">.</span></span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/" className={getLinkClass('/')}>Generator</Link>
        <Link to="/docs" className={getLinkClass('/docs')}>Docs</Link>
        <Link to="/about" className={getLinkClass('/about')}>About</Link>
        
        {user && (
          <Link to="/dashboard" className={`flex items-center gap-1.5 ${getLinkClass('/dashboard')}`}>
            <FiFolder size={15} /> My Library
          </Link>
        )}

        <div className="h-4 w-px bg-slate-300 dark:bg-gray-800 hidden sm:block"></div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
            >
              <FiUser className="text-purple-600 dark:text-purple-400" size={13} />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800/80 hover:bg-red-50 dark:hover:bg-red-950/60 text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-gray-800 transition-all text-xs flex items-center gap-1"
            >
              <FiLogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-gray-700/60"
            >
              <FiLogIn size={13} /> Sign In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-900/30"
            >
              <FiUserPlus size={13} /> Sign Up
            </Link>
          </div>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 border border-transparent hover:border-slate-200 dark:hover:border-gray-800 transition-all"
        >
          {theme === 'dark' ? <FiSun size={17} className="text-amber-400" /> : <FiMoon size={17} className="text-slate-700" />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;