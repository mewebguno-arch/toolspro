import React, { useState, useMemo } from 'react';
import { TOOLS } from '../utils/tools.config';
import { ToolCard } from './ToolCard';
import { Search, Sparkles, Filter } from 'lucide-react';

export const ToolsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pdf' | 'image' | 'dev' | 'text'>('all');

  // Categorize our tools for professional organization
  const getToolCategory = (id: string): 'pdf' | 'image' | 'dev' | 'text' => {
    if (['pdf-merger', 'image-to-pdf'].includes(id)) return 'pdf';
    if (['image-compressor', 'color-picker'].includes(id)) return 'image';
    if (['qr-generator', 'password-generator', 'json-formatter', 'base64-tool'].includes(id)) return 'dev';
    return 'text'; // word-counter, case-converter
  };

  const categories = [
    { key: 'all' as const, label: 'All Tools' },
    { key: 'pdf' as const, label: 'PDF Utilities' },
    { key: 'image' as const, label: 'Graphics & Images' },
    { key: 'dev' as const, label: 'Developer Codifiers' },
    { key: 'text' as const, label: 'Text & Strings' }
  ];

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const category = getToolCategory(tool.id);
      const matchCategory = activeCategory === 'all' || category === activeCategory;

      return matchQuery && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="tools" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-10">
      
      {/* Title & Decorative Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl text-text-base tracking-tight mb-4 relative inline-block">
          Explore Our Collection
          <span className="block h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto mt-2.5 rounded-full" />
        </h2>
        <p className="font-inter text-muted dark:text-gray-400 text-base leading-relaxed">
          100% free, high-speed micro-apps that process all values directly within your computer memory for total privacy protection.
        </p>
      </div>

      {/* Search & Filters Controls bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-white/70 dark:bg-slate-800/75 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 p-4 rounded-2xl shadow-sm transition-all duration-300">
        
        {/* Search Field */}
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm dark:text-white"
            aria-label="Search available tools"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 mask-image-gradient w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                activeCategory === cat.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {filteredTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface dark:bg-[#1A1A2E] border border-dashed border-border dark:border-[#2D2D45] rounded-2xl">
          <p className="font-poppins font-medium text-lg text-text-base mb-2">No tools match your query</p>
          <p className="font-inter text-sm text-muted dark:text-gray-400">Try adjusting your search criteria or clearing filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="mt-4 font-poppins font-semibold text-xs py-2 px-4 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default ToolsGrid;
