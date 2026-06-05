import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/#tools' },
    { name: 'About', path: '/#about' }
  ];

  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path && !location.hash;
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle hash scroll when entering from other pages
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
            aria-label="ToolKit Pro home page"
          >
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center text-white text-base font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <span className="font-poppins font-extrabold text-xl tracking-tight text-gradient">
              ToolKit Pro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative py-1 font-poppins font-medium text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1.5 ${
                    active 
                      ? 'text-primary' 
                      : 'text-text-base/70 hover:text-text-base dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger & Toggle combo */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-base/80 hover:text-text-base focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-surface dark:bg-[#1A1A2E] border-b border-border/80 dark:border-[#2D2D45]"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block py-3 px-4 font-poppins font-medium text-base rounded-xl transition-all cursor-pointer ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-base/70 hover:bg-muted/10 hover:text-text-base dark:text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
