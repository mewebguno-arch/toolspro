import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Shield, Cpu, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#0C0C14] border-t border-border/60 dark:border-[#2D2D45]/50 text-muted dark:text-gray-400 transition-colors duration-300">
      
      {/* About section / Security Banner (Addresses '/#about' hash navigation) */}
      <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border/60 dark:border-[#2D2D45]/30 scroll-mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-text-base dark:text-white text-base mb-1.5">100% Secure & On-Device</h4>
              <p className="font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Your documents, photographs, passwords, and records never cross the network. All compilation is completed locally.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100/80 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex-shrink-0">
              <Cpu className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-text-base dark:text-white text-base mb-1.5">Hardware Accelerated</h4>
              <p className="font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Leverages modern browser multithreading via Web Workers and local rendering pipelines for instant results.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-[#34D399]" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-text-base dark:text-white text-base mb-1.5">No Subscriptions or Installs</h4>
              <p className="font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Enjoy unlimited bulk processing, merging, formatting, and encoding for free, completely without sign-ups.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <Link 
              to="/" 
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
              aria-label="ToolKit Pro brand logo redirect"
            >
              <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 fill-indigo-600/20 dark:fill-indigo-400/20 animate-pulse" />
              <span className="font-poppins font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-rose-500 dark:from-indigo-400 dark:to-rose-400 bg-clip-text text-transparent">
                ToolKit Pro
              </span>
            </Link>
            <p className="font-inter text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
              The premier client-side toolset designed with high performance, visual polish, and private execution.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-poppins font-bold text-text-base dark:text-white text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 font-inter text-sm">
              <li>
                <Link to="/" onClick={handleScrollToTop} className="text-muted hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">Home Dashboard</Link>
              </li>
              <li>
                <a href="#tools" className="text-muted hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">Explore Tools Grid</a>
              </li>
              <li>
                <a href="#about" className="text-muted hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">How Security Works</a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-poppins font-bold text-text-base dark:text-white text-sm uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] hover:border-indigo-500 dark:hover:border-indigo-400 text-muted dark:text-gray-400 hover:text-primary dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow"
                aria-label="ToolKit Pro on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="text-xs text-muted dark:text-gray-400 leading-normal flex flex-col justify-center">
                <span>Core version: v1.2.0</span>
                <span>Active engine: WASM + Web API</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/60 dark:border-[#2D2D45]/45 text-center flex flex-col sm:flex-row items-center justify-between gap-4 font-inter text-xs text-muted dark:text-gray-500">
          <p>© {currentYear} ToolKit Pro · All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with ❤️ using <span className="text-rose-500 dark:text-rose-400 font-semibold">React + TypeScript</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
