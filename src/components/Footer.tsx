import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-[#0C0C14] border-t border-border/60 dark:border-[#2D2D45]/50 py-6 text-center text-xs text-slate-500 dark:text-gray-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-inter">
        <p>© {currentYear} ToolKit Pro · All rights reserved.</p>
        <p className="font-medium text-indigo-600/80 dark:text-indigo-400/80">100% Offline & Private</p>
      </div>
    </footer>
  );
};

export default Footer;
