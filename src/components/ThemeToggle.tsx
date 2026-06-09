import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ id = 'theme-toggle-btn' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative group">
      <motion.button
        id={id}
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
        className="p-2.5 rounded-full bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45] text-text-base hover:bg-muted/10 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer flex items-center justify-center"
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </motion.div>
      </motion.button>
      
      {/* Tooltip */}
      <div className="absolute right-0 top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-text-base text-background text-xs py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50">
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </div>
    </div>
  );
};

export default ThemeToggle;
