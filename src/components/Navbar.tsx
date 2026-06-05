import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Zap, 
  ChevronDown, 
  Sparkles,
  FileStack,
  FileImage,
  Images,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Binary,
  Palette,
  Type
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { TOOLS } from '../utils/tools.config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileStack,
  FileImage,
  Images,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Binary,
  Palette,
  Type
};

// Parses string like "from-[#FF5E62] to-[#FF9966]" into standard background image CSS rule
const getGradientStyle = (gradientStr: string) => {
  const fromMatch = gradientStr.match(/from-\[#?([0-9a-fA-F]+)\]/);
  const toMatch = gradientStr.match(/to-\[#?([0-9a-fA-F]+)\]/);
  
  if (fromMatch && toMatch) {
    const fromColor = `#${fromMatch[1]}`;
    const toColor = `#${toMatch[1]}`;
    return {
      backgroundImage: `linear-gradient(135deg, ${fromColor}, ${toColor})`
    };
  }
  return {
    backgroundImage: 'linear-gradient(135deg, #6C63FF, #FF6584)'
  };
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path && !location.hash;
  };

  useEffect(() => {
    setIsOpen(false);
    setShowToolsDropdown(false);
  }, [location]);

  // Handle click outside for dropdown closing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowToolsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
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
          <div className="hidden md:flex items-center gap-6">
            {/* Home Link */}
            <Link
              to="/"
              id="desktop-nav-home"
              className={`relative py-1 font-poppins font-semibold text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 ${
                isActive('/') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
              }`}
            >
              Home
              {isActive('/') && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            {/* Tools Dropdown trigger */}
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                id="desktop-nav-tools-trigger"
                className={`relative py-1 font-poppins font-semibold text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 flex items-center gap-1.5 ${
                  location.pathname.startsWith('/tools/') || showToolsDropdown
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
                }`}
              >
                Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showToolsDropdown ? 'rotate-180' : 'rotate-0'}`} />
                {(location.pathname.startsWith('/tools/') || showToolsDropdown) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              {/* Desktop Mega Dropdown Panel */}
              <AnimatePresence>
                {showToolsDropdown && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-[25%] top-10 z-50 w-[580px] rounded-2xl glass-card border border-border/80 dark:border-[#2D2D45] p-5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-border/40 dark:border-[#2D2D45]/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Quick Access Tools Catalog</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">10 tools fully active on-device</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {TOOLS.map((tool) => {
                        const toolActive = location.pathname === tool.route;
                        const ToolIcon = iconMap[tool.icon] || FileImage;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.route}
                            onClick={() => setShowToolsDropdown(false)}
                            id={`dropdown-tool-${tool.id}`}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 border ${
                              toolActive
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300'
                                : 'border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/45 hover:border-slate-100 dark:hover:border-slate-800'
                            }`}
                          >
                            <div 
                              style={getGradientStyle(tool.gradient)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm text-white flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                            >
                              <ToolIcon className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-poppins font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                {tool.name}
                              </h5>
                              <p className="font-inter text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 leading-normal font-normal">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About Link */}
            <Link
              to="/#about"
              id="desktop-nav-about"
              className={`relative py-1 font-poppins font-semibold text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 ${
                isActive('/#about') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
              }`}
            >
              About
              {isActive('/#about') && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile hamburger & Toggle combo */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
            <div className="px-4 pt-2 pb-6 space-y-4">
              {/* Home & About Links on Mobile */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/"
                  className={`py-2 px-3 text-center font-poppins font-semibold text-xs rounded-xl transition-all cursor-pointer border ${
                    isActive('/')
                      ? 'bg-indigo-50/70 border-indigo-100/80 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                      : 'bg-slate-50/50 border-slate-100/50 hover:bg-slate-50 dark:bg-slate-800/20 dark:border-slate-800/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/#about"
                  className={`py-2 px-3 text-center font-poppins font-semibold text-xs rounded-xl transition-all cursor-pointer border ${
                    isActive('/#about')
                      ? 'bg-indigo-50/70 border-indigo-100/80 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                      : 'bg-slate-50/50 border-slate-100/50 hover:bg-slate-50 dark:bg-slate-800/20 dark:border-slate-800/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  About
                </Link>
              </div>

              {/* Tools Grid title */}
              <div className="pt-2 border-t border-border/50 dark:border-[#2D2D45]/50">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                  Quick Access Tools Dashboard
                </div>
                
                {/* 2-column matrix of mini-tools */}
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {TOOLS.map((tool) => {
                    const toolActive = location.pathname === tool.route;
                    const ToolIcon = iconMap[tool.icon] || FileImage;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.route}
                        id={`mobile-tool-${tool.id}`}
                        className={`group flex items-center gap-2 p-2 rounded-xl transition-all duration-200 border ${
                          toolActive
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                            : 'border-border/40 bg-background/50 dark:bg-[#121220]/60 dark:border-[#2C2C40] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div 
                          style={getGradientStyle(tool.gradient)}
                          className="w-7 h-7 rounded-md flex items-center justify-center shadow-sm text-white flex-shrink-0"
                        >
                          <ToolIcon className="w-4 h-4 text-white stroke-[2.2]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-poppins font-semibold text-[11px] leading-tight truncate">
                            {tool.name}
                          </h6>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
