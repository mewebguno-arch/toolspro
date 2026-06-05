import React, { useState } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { FileText, Copy, Trash2, Keyboard, FileLineChart, Sparkles } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const { success, error, info } = useToast();

  const handleClear = () => {
    if (text.length > 30) {
      if (!window.confirm('Are you sure you want to discard your draft characters?')) {
        return;
      }
    }
    setText('');
    info('Editor cleared.');
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      success('Text copied successfully!');
    } catch {
      error('Failed to copy editor content.');
    }
  };

  // Live Metrics calculations (Safe matching with fallbacks)
  const getStats = () => {
    const trimmed = text.trim();
    
    // Character breakdown
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Word counts
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

    // Sentence breakdowns
    const sentences = trimmed ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;

    // Paragraph breakdown
    const paragraphs = trimmed ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

    // Avg reading speed: 200 words per minute -> seconds: (words / 200) * 60
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      totalChars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime: words > 0 ? `${readingTime} min` : '0 min'
    };
  };

  const metrics = getStats();

  // Cards catalog
  const cards = [
    { label: 'Words count', val: metrics.words, icon: '📝', desc: 'Space-delimited blocks' },
    { label: 'Characters', val: metrics.totalChars, icon: '🔤', desc: 'Raw character size' },
    { label: 'Chars (No Space)', val: metrics.charsNoSpaces, icon: '📊', desc: 'Alphanumeric letters' },
    { label: 'Sentences', val: metrics.sentences, icon: '📄', desc: 'Period separators' },
    { label: 'Paragraphs', val: metrics.paragraphs, icon: '¶', desc: 'Return line carriage' },
    { label: 'Vocal Reading Time', val: metrics.readingTime, icon: '⏱️', desc: 'Avg 200 WPM speed' }
  ];

  return (
    <ToolPageWrapper
      title="Word & Text Analyser"
      icon="📝"
      description="Inspect character distributions, paragraphs, space metrics, vocabulary densities, and estimated reading speeds inside an active, responsive textual sandbox."
    >
      <div className="space-y-8 animate-fade-in">
        
        {/* Top Segment: Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group transition-all hover:bg-muted/5 duration-300"
            >
              <span className="text-xl mb-1 select-none">{card.icon}</span>
              <span className="text-2xl font-poppins font-bold text-text-base mb-1 tracking-tight">
                {card.val}
              </span>
              <span className="text-[10px] font-poppins font-medium text-muted dark:text-gray-400 uppercase tracking-widest leading-none">
                {card.label}
              </span>
              <span className="text-[8px] font-mono text-muted/60 dark:text-gray-500 mt-1 select-none">
                {card.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Editor Screen Panel */}
        <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
          
          <div className="flex justify-between items-center pb-2.5 border-b border-border dark:border-[#2D2D45]/40 mb-4">
            <span className="font-poppins font-semibold text-sm text-text-base flex items-center gap-1.5">
              <Keyboard className="w-4.5 h-4.5 text-primary" />
              Editor Workspace
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#7C74FF] hover:underline font-poppins font-semibold cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button
                onClick={handleClear}
                disabled={!text}
                className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:underline font-poppins font-semibold cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear editor
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or copy and paste your document text here to run detailed statistics..."
            className="w-full min-h-[280px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4.5 text-sm sm:text-base text-text-base placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-inter leading-relaxed whitespace-pre-wrap outline-none"
            aria-label="Insert your analysis text payload"
          />

          {/* Prompt footer hint */}
          <div className="pt-3.5 flex items-center justify-between text-xs text-muted font-inter">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {text.length === 0 ? 'Empty editor context' : `${text.split(/\n+/).filter(Boolean).length} Paragraph breaks`}
            </span>
            <span className="flex items-center gap-1 font-semibold text-primary dark:text-[#7C74FF]">
              <FileLineChart className="w-3.5 h-3.5" />
              Auto Analyzing...
            </span>
          </div>

        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default WordCounter;
