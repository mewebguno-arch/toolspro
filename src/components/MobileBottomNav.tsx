import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isHome = location.pathname === '/' && !location.hash;
  const isTools = location.pathname.startsWith('/tools') || location.hash === '#tools';

  const handleToolsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Send a custom event to tell Navbar to open/toggle the mobile menu
    window.dispatchEvent(new CustomEvent('open-mobile-menu'));

    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById('tools');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without causing a page jump
        window.history.pushState(null, '', '#tools');
      }
    }
  };

  return (
    <div className="only-mobile-nav fixed bottom-0 left-0 right-0 z-50 h-[68px] bg-surface border-t border-border shadow-[0_-8px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.2)] items-center justify-around px-4 pb-safe-bottom transition-all duration-300">
      
      {/* Home Tab */}
      <Link
        to="/"
        className="relative flex flex-col items-center justify-center w-20 h-12 rounded-xl focus:outline-none transition-colors"
        aria-label="Home Dashboard"
      >
        <div className={`p-1 flex items-center justify-center transition-colors duration-200 ${
          isHome ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500'
        }`}>
          <Home className="w-5 h-5 stroke-[2.25]" />
        </div>
        <span className={`text-[10px] font-poppins font-medium tracking-tight transition-colors duration-200 ${
          isHome ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400 dark:text-gray-500'
        }`}>
          Home
        </span>
        {isHome && (
          <div
            className="absolute -top-1 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-200"
          />
        )}
      </Link>

      {/* Tools Tab */}
      <Link
        to="/#tools"
        state={{ openToolsMenu: true }}
        onClick={handleToolsClick}
        className="relative flex flex-col items-center justify-center w-20 h-12 rounded-xl focus:outline-none transition-colors"
        aria-label="Tools List"
      >
        <div className={`p-1 flex items-center justify-center transition-colors duration-200 ${
          isTools ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500'
        }`}>
          <Grid className="w-5 h-5 stroke-[2.25]" />
        </div>
        <span className={`text-[10px] font-poppins font-medium tracking-tight transition-colors duration-200 ${
          isTools ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400 dark:text-gray-500'
        }`}>
          Tools
        </span>
        {isTools && (
          <div
            className="absolute -top-1 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300"
          />
        )}
      </Link>

      {/* Theme Toggle Tab */}
      <button
        onClick={toggleTheme}
        className="relative flex flex-col items-center justify-center w-20 h-12 rounded-xl focus:outline-none transition-colors cursor-pointer"
        aria-label="Toggle Theme"
      >
        <div className="p-1 flex items-center justify-center text-slate-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
          <div className="transition-transform duration-300">
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-500 stroke-[2.25] rotate-0" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 stroke-[2.25] rotate-0" />
            )}
          </div>
        </div>
        <span className="text-[10px] font-poppins font-medium tracking-tight text-slate-400 dark:text-gray-500">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </button>

    </div>
  );
};

export default MobileBottomNav;
