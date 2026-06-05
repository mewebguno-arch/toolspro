import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { ShieldAlert, Copy, Check, RefreshCw, Key, Info, History } from 'lucide-react';

interface HistoryItem {
  id: string;
  value: string;
}

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const { success, error, info } = useToast();

  const generatePassword = useCallback(() => {
    let pool = '';
    if (includeUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) pool += '0123456789';
    if (includeSymbols) pool += '!@#$%^&*()_+-=[]{}|;:,./<>?~';

    if (!pool) {
      setPassword('');
      return;
    }

    let generated = '';
    // Safeguard matching random indices
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += pool[array[i] % pool.length];
    }

    setPassword(generated);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  // Handle immediate update on load or parameters alteration
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Capture history once password changes
  useEffect(() => {
    if (password) {
      setHistory(prev => {
        // Prevent duplicate adjacent additions
        if (prev.length > 0 && prev[0].value === password) return prev;
        
        const filterHist = prev.filter(item => item.value !== password);
        return [{ id: Math.random().toString(36).substring(2, 7), value: password }, ...filterHist].slice(0, 5);
      });
    }
  }, [password]);

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error('Failed to copy password.');
    }
  };

  // Metrics: Calculate Password Entropy
  // Entropy = Length * log2(Pool Size)
  const calculateEntropy = (): { val: number; text: string; color: string; widthClass: string } => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 28;

    if (poolSize === 0 || password.length === 0) {
      return { val: 0, text: 'Blank', color: 'bg-red-500', widthClass: 'w-0' };
    }

    const entropy = length * (Math.log(poolSize) / Math.log(2));

    if (entropy < 35) {
      return { val: entropy, text: 'Weak', color: 'bg-red-500', widthClass: 'w-1/4' };
    } else if (entropy < 60) {
      return { val: entropy, text: 'Fair', color: 'bg-amber-500', widthClass: 'w-2/4' };
    } else if (entropy < 85) {
      return { val: entropy, text: 'Strong', color: 'bg-indigo-500', widthClass: 'w-3/4' };
    } else {
      return { val: entropy, text: 'Very Strong', color: 'bg-emerald-500', widthClass: 'w-full' };
    }
  };

  const strength = calculateEntropy();

  return (
    <ToolPageWrapper
      title="Password Generator"
      icon="🔑"
      description="Create strong, randomized cryptographically secure passwords. Customize variables, read direct security entropy levels, and track previous keys."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Generator configuration (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
            
            {/* Display screen */}
            <div className="bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4 flex items-center justify-between gap-3 mb-6 relative group select-all">
              <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-text-base break-all tracking-wider selection:bg-primary/20">
                {password || <span className="text-muted italic select-none">Select options to generate...</span>}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { generatePassword(); info('Rerolled credentials.'); }}
                  className="p-2 sm:p-2.5 rounded-lg hover:bg-muted/10 text-muted hover:text-text-base transition-colors cursor-pointer"
                  aria-label="Regenerate randomized values"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(password)}
                  disabled={!password}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none ${
                    copied 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'hover:bg-muted/10 text-muted hover:text-text-base'
                  }`}
                  aria-label="Copy credential key"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Length parameter */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <label htmlFor="length-slider" className="text-xs font-poppins font-semibold text-muted dark:text-gray-300">
                  Password Length Buffer
                </label>
                <span className="font-mono font-bold text-xs bg-[#6C63FF]/10 text-primary dark:text-[#7C74FF] px-3 py-1 rounded-full">
                  {length} Characters
                </span>
              </div>
              
              <input
                id="length-slider"
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-border dark:bg-[#2D2D45] rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Adjust character length limits"
              />
            </div>

            {/* Checkbox matrices */}
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-poppins font-semibold text-muted dark:text-gray-300 mb-1">
                Character Dictionaries
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* [A-Z] */}
                <button
                  onClick={() => setIncludeUpper(!includeUpper)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    includeUpper
                      ? 'bg-[#6C63FF]/5 border-primary/40 text-primary dark:text-[#7C74FF]'
                      : 'bg-background hover:bg-muted/5 border-border dark:border-[#2D2D45] text-muted'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    includeUpper ? 'bg-primary border-primary text-white' : 'border-border dark:border-gray-600'
                  }`}>
                    {includeUpper && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-poppins font-semibold text-xs text-text-base block">Uppercase Sets [A-Z]</span>
                    <span className="text-[10px] text-muted leading-none">Capital letters</span>
                  </div>
                </button>

                {/* [a-z] */}
                <button
                  onClick={() => setIncludeLower(!includeLower)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    includeLower
                      ? 'bg-[#6C63FF]/5 border-primary/40 text-primary dark:text-[#7C74FF]'
                      : 'bg-background hover:bg-muted/5 border-border dark:border-[#2D2D45] text-muted'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    includeLower ? 'bg-primary border-primary text-white' : 'border-border dark:border-gray-600'
                  }`}>
                    {includeLower && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-poppins font-semibold text-xs text-text-base block">Lowercase Sets [a-z]</span>
                    <span className="text-[10px] text-muted leading-none">Small letter symbols</span>
                  </div>
                </button>

                {/* [0-9] */}
                <button
                  onClick={() => setIncludeNumbers(!includeNumbers)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    includeNumbers
                      ? 'bg-[#6C63FF]/5 border-primary/40 text-primary dark:text-[#7C74FF]'
                      : 'bg-background hover:bg-muted/5 border-border dark:border-[#2D2D45] text-muted'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    includeNumbers ? 'bg-primary border-primary text-white' : 'border-border dark:border-gray-600'
                  }`}>
                    {includeNumbers && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-poppins font-semibold text-xs text-text-base block">Numeric Sets [0-9]</span>
                    <span className="text-[10px] text-muted leading-none">Arabic digits</span>
                  </div>
                </button>

                {/* Symbols */}
                <button
                  onClick={() => setIncludeSymbols(!includeSymbols)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    includeSymbols
                      ? 'bg-[#6C63FF]/5 border-primary/40 text-primary dark:text-[#7C74FF]'
                      : 'bg-background hover:bg-muted/5 border-border dark:border-[#2D2D45] text-muted'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    includeSymbols ? 'bg-primary border-primary text-white' : 'border-border dark:border-gray-600'
                  }`}>
                    {includeSymbols && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-poppins font-semibold text-xs text-text-base block">Symbols Set [%@#]</span>
                    <span className="text-[10px] text-muted leading-none">Special punctuation elements</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Strength meter bar */}
            {password && (
              <div className="bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 p-4.5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-poppins font-semibold text-text-base">Password Threat Defense</span>
                  <span className="text-xs font-mono font-bold capitalize flex items-center gap-1.5 text-text-base">
                    <span className={`w-2 h-2 rounded-full ${strength.color}`} />
                    {strength.text} ({Math.round(strength.val)} bits)
                  </span>
                </div>

                <div className="w-full h-2 bg-border dark:bg-[#2D2D45] rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.widthClass} transition-all duration-500`} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right column: Password history logs (5 cols) */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
            
            <h3 className="font-poppins font-semibold text-sm text-text-base pb-3 border-b border-border dark:border-[#2D2D45]/40 uppercase tracking-widest text-[#FF6584] mb-4 flex items-center gap-2">
              <History className="w-4 h-4" />
              Credentials History
            </h3>

            {history.length > 1 ? (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {history.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 rounded-xl hover:border-primary/20 transition-all font-mono text-xs text-text-base select-all relative group"
                  >
                    <span className="truncate pr-4 break-all max-w-[200px] sm:max-w-xs">{item.value}</span>
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className="p-1 px-1.5 rounded bg-surface border border-b dark:border-[#26263B] dark:bg-[#1A1A2E] text-muted hover:text-text-base transition-colors shrink-0 cursor-pointer"
                      title="Copy previous credential"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-border dark:border-[#2D2D45]/40 rounded-xl">
                <Key className="w-6 h-6 text-muted mx-auto mb-2" />
                <p className="text-xs font-poppins font-semibold text-muted">No historic logs loaded</p>
                <p className="text-[10px] text-muted font-inter mt-0.5">Rerolled keys list as small copy references.</p>
              </div>
            )}

            <div className="mt-5 p-3.5 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/30 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted leading-relaxed font-inter">
                We generate these securely using <code className="font-mono text-primary font-bold">window.crypto.getRandomValues</code>. Your credentials never cross internet pipes.
              </p>
            </div>

          </div>
        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default PasswordGenerator;
