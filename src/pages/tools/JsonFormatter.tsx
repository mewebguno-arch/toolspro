import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { Braces, Code, Copy, Sparkles, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [keyCount, setKeyCount] = useState<number | null>(null);
  const { success, error, info } = useToast();

  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    let count = 0;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        count += countKeys(item);
      });
    } else {
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          count++;
          count += countKeys(obj[k]);
        }
      }
    }
    return count;
  };

  const handleFormat = (minify = false) => {
    if (!inputJson.trim()) {
      setErrorDetails(null);
      setFormattedJson('');
      setKeyCount(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      setKeyCount(countKeys(parsed));
      setErrorDetails(null);

      const result = minify 
        ? JSON.stringify(parsed) 
        : JSON.stringify(parsed, null, 2);

      setFormattedJson(result);
      success(minify ? 'Minified JSON parsed!' : 'Beautified JSON formatted!');
    } catch (err: any) {
      console.error(err);
      setErrorDetails(err.message || 'Syntax error in JSON string.');
      setFormattedJson('');
      setKeyCount(null);
      error('Invalid JSON structure.');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Read pasted value and auto format after brief timeout
    const pasted = e.clipboardData.getData('text');
    setInputJson(pasted);
    setTimeout(() => {
      handleFormat();
    }, 100);
  };

  const handleCopy = async () => {
    if (!formattedJson) return;
    try {
      await navigator.clipboard.writeText(formattedJson);
      success('JSON copied to clipboard!');
    } catch {
      error('Failed to copy JSON.');
    }
  };

  const handleClear = () => {
    setInputJson('');
    setFormattedJson('');
    setErrorDetails(null);
    setKeyCount(null);
    info('Workspace reset.');
  };

  // Perform safe HTML conversion & wrap regex spans for visual formatting
  const highlightedHtmlHtml = useMemo(() => {
    if (!formattedJson) return '';
    
    // Escape standard HTML markings
    let esc = formattedJson
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Match JSON components: keys, strings, integers, floats, booleans, and nulls
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
    
    return esc.replace(regex, (m) => {
      let cls = 'json-number';
      if (/^"/.test(m)) {
        if (/:$/.test(m)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(m)) {
        cls = 'json-boolean';
      } else if (/null/.test(m)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${m}</span>`;
    });
  }, [formattedJson]);

  // Construct vertical list numbering
  const lineCountList = useMemo(() => {
    if (!formattedJson) return [];
    return Array.from({ length: formattedJson.split('\n').length }, (_, i) => i + 1);
  }, [formattedJson]);

  return (
    <ToolPageWrapper
      title="JSON Formatter & Validator"
      icon="🔮"
      description="Validate, beautify, and compress JSON payloads on-device. Read structured color-highlighted outputs, syntax check reports, and deep element metrics."
    >
      <div className="space-y-6">
        
        {/* Banner State Alerts */}
        {errorDetails && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="text-xs sm:text-sm font-inter">
              <span className="font-poppins font-bold">Invalid JSON:</span> {errorDetails}
            </div>
          </div>
        )}

        {keyCount !== null && !errorDetails && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-xs sm:text-sm font-inter">
                <span className="font-poppins font-bold">Valid JSON structure!</span> Passed standard verification checks safely.
              </div>
            </div>
            
            <div className="hidden sm:flex gap-3 text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/5 px-3 py-1 rounded-lg">
              <span>🧬 Keys: {keyCount}</span>
              <span>•</span>
              <span>📄 Lines: {lineCountList.length}</span>
            </div>
          </div>
        )}

        {/* Workspace Panels Grid: 2 columns on desktops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left panel: Raw editor input */}
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            
            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-border dark:border-[#2D2D45]/40 mb-4 font-poppins">
                <span className="text-sm font-semibold text-text-base flex items-center gap-1.5">
                  <Code className="w-4.5 h-4.5 text-primary" />
                  Paste Raw JSON
                </span>
                
                <span className="text-[10px] text-muted dark:text-gray-400 font-medium">Auto-formats on paste</span>
              </div>

              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                onPaste={handlePaste}
                placeholder="Paste code or JSON payload here..."
                className="w-full min-h-[380px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4 text-xs font-mono text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none leading-relaxed"
                aria-label="Raw JSON payload markup"
              />
            </div>

            {/* Formatting Triggers */}
            <div className="pt-4 flex flex-wrap gap-2.5 justify-end">
              <button
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl text-xs font-poppins font-semibold bg-background border border-border dark:border-[#2D2D45] text-text-base hover:bg-muted/10 cursor-pointer"
              >
                Clear Tool
              </button>
              
              <button
                onClick={() => handleFormat(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-poppins font-semibold bg-background border border-border dark:border-[#2D2D45] text-text-base hover:bg-muted/10 cursor-pointer"
              >
                Minify JSON
              </button>

              <button
                onClick={() => handleFormat(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-poppins font-bold bg-primary text-white hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Braces className="w-4 h-4" />
                Format & Beautify
              </button>
            </div>

          </div>

          {/* Right panel: Syntactic output */}
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            
            <div className="w-full">
              <div className="flex justify-between items-center pb-2.5 border-b border-border dark:border-[#2D2D45]/40 mb-4">
                <span className="font-poppins font-semibold text-sm text-text-base flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-[#FF6584]" />
                  Prettified Output
                </span>

                <button
                  onClick={handleCopy}
                  disabled={!formattedJson}
                  className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#7C74FF] hover:underline font-poppins font-semibold cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Output
                </button>
              </div>

              {formattedJson ? (
                /* JSON Display Panel with integrated line numbers */
                <div className="relative flex bg-[#06060F] dark:bg-black p-4 rounded-xl max-h-[380px] overflow-y-auto border border-border/10 select-all font-mono leading-relaxed text-xs">
                  
                  {/* Line Numbers column */}
                  <div className="text-right text-gray-700 dark:text-gray-600 select-none pr-3.5 border-r border-[#2D2D45]/30 flex-shrink-0">
                    {lineCountList.map((num) => (
                      <div key={num} className="h-5">{num}</div>
                    ))}
                  </div>

                  {/* Highlights Code column */}
                  <pre className="pl-3.5 text-gray-300 overflow-x-auto w-full select-all selection:bg-primary/20">
                    <code
                      className="block text-left whitespace-pre hover:bg-transparent"
                      dangerouslySetInnerHTML={{ __html: highlightedHtmlHtml }}
                    />
                  </pre>
                </div>
              ) : (
                /* Static feedback */
                <div className="min-h-[380px] bg-background dark:bg-[#0F0F1A] border border-dashed border-border dark:border-[#2D2D45] rounded-xl flex flex-col items-center justify-center gap-2 text-center p-6">
                  <FileText className="w-6 h-6 text-muted" />
                  <p className="text-xs font-poppins font-semibold text-muted">Formatted JSON output will load here</p>
                  <p className="text-[10px] text-muted font-inter">Specify parameters on the left to activate compilation.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default JsonFormatter;
