import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  FileStack,
  FileImage,
  Images,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Binary,
  Palette,
  Type,
  HelpCircle,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { toolHelpData } from '../data/toolHelpData';

interface ToolPageWrapperProps {
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}

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
  Type,
  // Support both emoji fallbacks and the current names
  '🥞': FileStack,
  '🗜️': FileImage,
  '🖼️': Images,
  '🔳': QrCode,
  '🔑': KeyRound,
  '📝': FileText,
  '🔮': Braces,
  '🧬': Binary,
  '🎨': Palette,
  '🔤': Type
};

export const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({
  title,
  icon,
  description,
  children
}) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon] || FileImage;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const helpInfo = toolHelpData[title];

  const handleGoBack = () => {
    // Navigate back to the tools grid anchor
    navigate('/#tools');
  };

  return (
    <div id="tool-page-layout" className="min-h-screen bg-background dark:bg-[#0F0F1A] flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">
      
      {/* Ambient Blur decorative elements */}
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-[#6C63FF]/10 dark:bg-[#6C63FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-[#FF6584]/15 dark:bg-[#FF6584]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Dynamic Header */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Android-style Mobile Top Header */}
      <header className="sticky top-0 z-50 md:hidden w-full h-14 bg-surface border-b border-border flex items-center justify-between px-3 shadow-sm select-none transition-all duration-300">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="p-2 -ml-1 rounded-full text-slate-700 hover:text-slate-900 dark:text-gray-200 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950/40 active:bg-slate-100 dark:active:bg-slate-950/60 focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.25] text-indigo-600 dark:text-indigo-400" />
          </motion.button>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
              <IconComponent className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-poppins font-bold text-sm tracking-tight text-text-base">
              {title}
            </span>
          </div>
        </div>
      </header>

      {/* Main Tool Content Container */}
      <main className="relative z-10 flex-grow py-5 md:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Breadcrumb + Back Button Row - Hidden on mobile, shown on SM up */}
        <div id="tool-banner" className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted dark:text-gray-400 font-inter">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/#tools" className="hover:text-primary transition-colors">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-base dark:text-gray-200 font-semibold truncate max-w-[150px] sm:max-w-xs">{title}</span>
          </nav>

          {/* Quick Go Back Button */}
          <button
            onClick={handleGoBack}
            className="self-start inline-flex items-center gap-2 font-poppins font-semibold text-xs py-2 px-3.5 rounded-xl glass-card text-text-base/80 hover:bg-muted/15 transition-all cursor-pointer hover:-translate-x-1"
            aria-label="Back to Tools list"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </button>
        </div>

        {/* Intro Banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconComponent className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl text-text-base tracking-tight mb-1">{title}</h1>
              <p className="font-inter text-sm text-muted dark:text-gray-400 max-w-xl leading-relaxed">{description}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Tool Content */}
        <div className="w-full">
          {children}
        </div>

        {/* Detailed Guide & FAQ Section */}
        {helpInfo && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-14 pt-10 border-t border-border/75"
          >
            <div className="flex flex-col gap-8 md:gap-10">
              {/* Header Title */}
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="p-2 bg-indigo-50/80 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-poppins font-bold text-lg text-text-base">Complete Guidelines & FAQ</h2>
                  <p className="text-xs text-muted dark:text-gray-400 font-inter">Step-by-step user manual and answers to frequently asked questions.</p>
                </div>
              </div>

              {/* Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start">
                
                {/* Left Side: Step by step Instructions */}
                <div className="flex flex-col gap-8">
                  <div className="bg-surface border border-border/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
                    <h3 className="font-poppins font-semibold text-sm text-text-base flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      How to Use This Tool
                    </h3>
                    
                    <ol className="space-y-3.5">
                      {helpInfo.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-xs sm:text-sm text-text-base/90 leading-relaxed font-inter">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pro Tips Box */}
                  {helpInfo.tips && helpInfo.tips.length > 0 && (
                    <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-5 flex gap-3.5">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-poppins font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">PRO-TIP:</h4>
                        <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 font-inter leading-relaxed">
                          {helpInfo.tips[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: FAQ Accordion */}
                <div className="bg-surface border border-border/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
                  <h3 className="font-poppins font-semibold text-sm text-text-base flex items-center gap-2 mb-4">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    Frequently Asked Questions
                  </h3>

                  <div className="flex flex-col gap-5">
                    {helpInfo.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div 
                          key={idx}
                          className="border border-border/60 dark:border-border/30 rounded-xl overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleFaq(idx)}
                            className="w-full text-left py-3.5 px-4 flex items-start justify-between gap-3 hover:bg-muted/5 transition-all focus:outline-none cursor-pointer"
                          >
                            <span className="font-poppins font-semibold text-xs sm:text-sm text-text-base/90 pr-2 block leading-snug">
                              {faq.question}
                            </span>
                            <ChevronDown 
                              className={`w-4 h-4 text-muted dark:text-gray-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                            />
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 border-t border-border/40 dark:border-border/10 text-xs sm:text-sm text-muted dark:text-gray-400 font-inter leading-relaxed whitespace-pre-wrap">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </motion.section>
        )}

      </main>

      {/* Dynamic Footer */}
      <Footer />

    </div>
  );
};

export default ToolPageWrapper;
