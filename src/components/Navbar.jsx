import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');

  const getLinkClass = (path) => {
    return `text-sm transition-colors ${
      location.pathname === path ? 'font-bold text-purple-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
    }`;
  };

  return (
    <header className='sticky top-0 w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-white/80 dark:bg-primary-bg/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50'>
      <Link to='/' className='text-xl font-bold text-gray-900 dark:text-white'>
        GenU<span className='text-purple-500'>.</span>
      </Link>
      <nav className='flex items-center gap-5'>
        <Link to='/' className={getLinkClass('/')}>Home</Link>
        <Link to='/docs' className={getLinkClass('/docs')}>Docs</Link>
        <Link to='/about' className={getLinkClass('/about')}>About</Link>
        <button
          onClick={toggleTheme}
          aria-label='Toggle theme'
          className='p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary-bg'
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;