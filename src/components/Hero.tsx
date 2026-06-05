import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
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

  // Stagger Container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Children entry
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background dark:bg-[#0F0F1A] text-text-base px-4 py-20 transition-colors duration-300"
    >
      {/* Frosted Glass Blur Blobs */}
      <div className="absolute top-10 left-10 md:top-20 md:left-[15%] w-48 h-48 sm:w-72 sm:h-72 bg-[#6C63FF]/15 dark:bg-[#6C63FF]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-[15%] w-60 h-60 sm:w-80 sm:h-80 bg-[#FF6584]/15 dark:bg-[#FF6584]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] left-[45%] w-36 h-36 bg-[#10B981]/15 dark:bg-[#10B981]/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Floating Badges */}
      <div className="absolute inset-0 select-none overflow-hidden pointer-events-none z-10">
        <div className="absolute top-[18%] left-[5%] md:left-[10%] lg:left-[14%] animate-float-slow hidden sm:flex items-center gap-3 bg-white/70 dark:bg-[#1A1A2E]/50 p-3.5 rounded-2xl shadow-xl border border-border/40 dark:border-[#2D2D45]/30 backdrop-blur-md">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-lg">📄</div>
          <div className="text-left font-poppins">
            <div className="text-xs font-bold text-text-base">PDF Merger</div>
            <div className="text-[10px] text-muted dark:text-gray-400">Combine documents</div>
          </div>
        </div>

        <div className="absolute bottom-[24%] right-[5%] md:right-[10%] lg:right-[14%] animate-float-medium hidden sm:flex items-center gap-3 bg-white/70 dark:bg-[#1A1A2E]/50 p-3.5 rounded-2xl shadow-xl border border-border/40 dark:border-[#2D2D45]/30 backdrop-blur-md" style={{ animationDelay: '-3s' }}>
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/40 rounded-xl flex items-center justify-center text-lg">🔑</div>
          <div className="text-left font-poppins">
            <div className="text-xs font-bold text-text-base">Password Gen</div>
            <div className="text-[10px] text-muted dark:text-gray-400">Secure locks</div>
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase text-primary dark:text-[#9F99FF] font-poppins backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary dark:text-[#9F99FF] shrink-0" />
            100% Client-Side Private Processing
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-poppins font-extrabold text-4xl sm:text-5xl md:text-7xl leading-tight tracking-tight text-text-base max-w-3xl mx-auto"
          >
            10 Powerful Tools, <br />
            <span className="text-gradient">
              Zero Install
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="font-inter text-base sm:text-lg md:text-xl text-muted dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Format, compress, convert, merge, and generate web data in micro-seconds. <strong className="font-semibold text-text-base">No servers. No registration.</strong> All tasks perform securely directly inside your browser cache.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4"
          >
            <button
              onClick={handleScrollToTools}
              className="w-full sm:w-auto font-poppins font-semibold text-base py-3.5 px-8 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 cursor-pointer"
              aria-label="Explore the online utility tools collection"
            >
              Explore Tools
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleScrollToAbout}
              className="w-full sm:w-auto font-poppins font-medium text-base py-3.5 px-8 rounded-xl border border-border dark:border-[#2D2D45] bg-surface/40 dark:bg-[#1A1A2E]/20 backdrop-blur-sm hover:bg-muted/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-text-base"
              aria-label="Learn about ToolKit Pro security and operations"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Curve Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-background pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
    </section>
  );
};

export default Hero;
