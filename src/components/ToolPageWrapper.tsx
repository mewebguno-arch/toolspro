import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ToolPageWrapperProps {
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}

export const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({
  title,
  icon,
  description,
  children
}) => {
  const navigate = useNavigate();

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
      <Navbar />

      {/* Main Tool Content Container */}
      <main className="relative z-10 flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Breadcrumb + Back Button Row */}
        <div id="tool-banner" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
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
            <div className="font-sans text-3xl sm:text-4xl p-2.5 bg-primary/5 rounded-2xl">
              {icon}
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl text-text-base tracking-tight mb-1">{title}</h1>
              <p className="font-inter text-sm text-muted dark:text-gray-400 max-w-xl leading-relaxed">{description}</p>
            </div>
          </div>
          
          {/* On-device Security Stamp */}
          <div className="inline-flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 py-1.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap self-stretch sm:self-auto justify-center">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            Local Sandbox Mode
          </div>
        </div>

        {/* Dynamic Tool Content */}
        <div className="w-full">
          {children}
        </div>

      </main>

      {/* Dynamic Footer */}
      <Footer />

    </div>
  );
};

export default ToolPageWrapper;
