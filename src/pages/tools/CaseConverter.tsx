import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toDotCase
} from '../../utils/helpers';
import { Type, Copy, Trash2, Sliders, RefreshCw, FileText, Check } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const { success, error, info } = useToast();

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      success('Converted text copied to clipboard!');
    } catch {
      error('Failed to copy text.');
    }
  };

  const handleClear = () => {
    setText('');
    info('Converted text reset.');
  };

  // Convert handlers
  const handleConvert = (convertFn: (t: string) => string, label: string) => {
    if (!text) {
      error('Please write or paste text first.');
      return;
    }
    const convertedEvent = convertFn(text);
    setText(convertedEvent);
    success(`Text converted to ${label}!`);
  };

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    return {
      chars: text.length,
      words
    };
  }, [text]);

  const buttons = [
    { label: 'UPPERCASE', fn: toUpperCase, color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60' },
    { label: 'lowercase', fn: toLowerCase, color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/40 hover:bg-pink-100 dark:hover:bg-pink-950/60' },
    { label: 'Title Case', fn: toTitleCase, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-950/60' },
    { label: 'Sentence case', fn: toSentenceCase, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60' },
    { label: 'camelCase', fn: toCamelCase, color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40 hover:bg-teal-100 dark:hover:bg-teal-950/60' },
    { label: 'PascalCase', fn: toPascalCase, color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40 hover:bg-cyan-100 dark:hover:bg-cyan-950/60' },
    { label: 'snake_case', fn: toSnakeCase, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-950/60' },
    { label: 'kebab-case', fn: toKebabCase, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-950/60' },
    { label: 'dot.case', fn: toDotCase, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750 hover:bg-slate-200 dark:hover:bg-slate-700' }
  ];

  return (
    <ToolPageWrapper
      title="String Case Converter"
      icon="🔤"
      description="Pivot text casing structures in micromoments. Switch between CamelCase, snake_case, kebab-case, CAPS blocks, and Sentence paragraphs dynamically."
    >
      <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-6">
        
        {/* Header row & copy counters */}
        <div className="flex justify-between items-center pb-2.5 border-b border-border dark:border-[#2D2D45]/40 font-poppins">
          <span className="text-sm font-semibold text-text-base flex items-center gap-1.5">
            <Type className="w-5 h-5 text-primary" />
            Conversion Workspace
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#7C74FF] hover:underline font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button
              onClick={handleClear}
              disabled={!text}
              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:underline font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear editor
            </button>
          </div>
        </div>

        {/* Unified Input/Output workspace */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or copy and paste your plain text string here to run casing operators..."
          className="w-full min-h-[220px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4 text-xs font-mono text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none leading-relaxed"
          aria-label="Text conversion raw content editor"
        />

        {/* Buttons Controls matrices */}
        <div className="space-y-3 pt-5">
          <span className="block text-xs font-poppins font-semibold text-muted dark:text-gray-300 flex items-center gap-1.5 mb-2.5">
            <Sliders className="w-4 h-4 text-primary" /> Select Conversion Case Operator
          </span>

          <div className="flex flex-wrap gap-2.5">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleConvert(btn.fn, btn.label)}
                className={`py-2 px-4 rounded-xl font-poppins font-bold text-xs tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary hover:scale-[1.02] shadow-sm active:scale-98 transition-all ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom statistics dashboard */}
        <div className="mt-8 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/30 p-3.5 rounded-xl flex items-center justify-between text-xs font-poppins text-muted">
          <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-primary shrink-0" /> Word Counting metrics</span>
          <div className="flex gap-4 font-mono font-bold text-text-base">
            <span>🔤 Chars: {stats.chars}</span>
            <span>📝 Words: {stats.words}</span>
          </div>
        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default CaseConverter;
