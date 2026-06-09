import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  const handleScrollToTools = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('tools');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToAbout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const badgeContent = (
    <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/85 border border-indigo-200/50 dark:border-indigo-800/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-300 font-poppins shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
      100% Client-Side Private Processing
    </div>
  );

  const headingContent = (
    <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-6xl leading-tight tracking-tight text-text-base max-w-3xl mx-auto">
      10 Powerful Tools, <br />
      <span className="text-indigo-600 dark:text-indigo-400">
        Zero Install
      </span>
    </h1>
  );

  const subtitleContent = (
    <p className="font-inter text-sm sm:text-base md:text-lg text-muted dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
      Format, compress, convert, merge, and generate web data in micro-seconds. <strong className="font-semibold text-text-base font-inter">No servers. No registration.</strong> All tasks perform securely directly inside your browser cache.
    </p>
  );

  const buttonsContent = (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-3 w-full sm:w-auto">
      <button
        onClick={handleScrollToTools}
        className="w-full sm:w-auto font-poppins font-semibold text-sm py-3 px-6 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg cursor-pointer"
        aria-label="Explore the online utility tools collection"
      >
        Explore Tools
        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
      </button>
      
      <button
        onClick={handleScrollToAbout}
        className="w-full sm:w-auto font-poppins font-medium text-sm py-3 px-6 rounded-xl border border-border dark:border-[#2D2D45] bg-surface dark:bg-[#1A1A2E] hover:bg-muted/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-text-base"
        aria-label="Learn about ToolKit Pro security and operations"
      >
        Learn More
      </button>
    </div>
  );

  return (
    <section 
      id="hero" 
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background dark:bg-[#0F0F1A] text-text-base px-4 py-12 transition-colors duration-300"
    >
      <div className="relative max-w-4xl mx-auto text-center z-20 w-full">
        <div className="space-y-6 flex flex-col items-center">
          {/* Badge */}
          {badgeContent}

          {/* Heading */}
          {headingContent}

          {/* Subtitle */}
          {subtitleContent}

          {/* Buttons */}
          {buttonsContent}
        </div>
      </div>

      {/* Elegant Curve Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-background pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
    </section>
  );
};

export default Hero;
