import React, { useState, useEffect, useMemo } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { Palette, Copy, Sparkles, Check, CheckCircle2, XCircle, Info, History } from 'lucide-react';

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#6C63FF');
  const [history, setHistory] = useState<string[]>([]);
  const { success, error } = useToast();

  const rgb = useMemo(() => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 108, g: 99, b: 255 };
  }, [color]);

  const hsl = useMemo(() => {
    let { r, g, b } = rgb;
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, [rgb]);

  useEffect(() => {
    // Append to picker history
    setHistory(prev => {
      if (prev.includes(color)) return prev;
      return [color, ...prev].slice(0, 8);
    });
  }, [color]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success(`${label} code copied!`);
    } catch {
      error('Failed to copy value.');
    }
  };

  // Contrast checking calculations
  // Luminance: 0.2126 * R + 0.7152 * G + 0.0722 * B
  const relativeLuminance = useMemo(() => {
    const { r, g, b } = rgb;
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }, [rgb]);

  const contrastRatios = useMemo(() => {
    const lBg = relativeLuminance;
    // Luminance of White is 1.0, Black is 0.0
    const ratioWithWhite = (1.0 + 0.05) / (lBg + 0.05);
    const ratioWithBlack = (lBg + 0.05) / (0.0 + 0.05);

    // Double checker for inverse scaling
    const finalWhite = ratioWithWhite < 1 ? 1 / ratioWithWhite : ratioWithWhite;
    const finalBlack = ratioWithBlack < 1 ? 1 / ratioWithBlack : ratioWithBlack;

    return {
      white: parseFloat(finalWhite.toFixed(2)),
      black: parseFloat(finalBlack.toFixed(2))
    };
  }, [relativeLuminance]);

  const getPassCheck = (ratio: number) => {
    // WCAG AA standard threshold is 4.5:1
    return ratio >= 4.5;
  };

  const getPassAAA = (ratio: number) => {
    // WCAG AAA standard threshold is 7.0:1
    return ratio >= 7.0;
  };

  return (
    <ToolPageWrapper
      title="Color Wheel & Contrast Checker"
      icon="🎨"
      description="Inspect precise color channels, evaluate relative luminance ratios, check WCAG text contrasts on-device, and manage sample history codes."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-in">
        
        {/* Left Side: Color Pick & swatch selectors (7 cols) */}
        <div className="md:col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
            
            <h2 className="font-poppins font-semibold text-base text-text-base pb-3 border-b border-border dark:border-[#2D2D45]/40 mb-5 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Palette Workbench
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
              {/* Giant color input preview block */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-32 h-32 rounded-3xl cursor-pointer border border-border bg-transparent shadow p-1.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  aria-label="Pick background swatch color value"
                />
                <span className="text-xs font-mono font-bold text-muted mt-2.5">Click to customize</span>
              </div>

              {/* Swatch info values list */}
              <div className="flex-grow space-y-3 font-mono text-xs">
                
                {/* Hex code */}
                <div className="bg-background dark:bg-[#0F0F1A] p-2.5 rounded-xl border border-border dark:border-[#2D2D45]/50 flex justify-between items-center px-4">
                  <div>
                    <span className="text-[10px] font-poppins font-bold text-muted">HEX</span>
                    <p className="font-bold text-sm text-text-base">{color.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(color.toUpperCase(), 'HEX')}
                    className="p-1.5 rounded-lg hover:bg-muted/15 text-muted hover:text-text-base transition-colors cursor-pointer"
                    aria-label="Copy Hex value"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* RGB code */}
                <div className="bg-background dark:bg-[#0F0F1A] p-2.5 rounded-xl border border-border dark:border-[#2D2D45]/50 flex justify-between items-center px-4">
                  <div>
                    <span className="text-[10px] font-poppins font-bold text-muted">RGB</span>
                    <p className="font-bold text-sm text-text-base">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                  </div>
                  <button
                    onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                    className="p-1.5 rounded-lg hover:bg-muted/15 text-muted hover:text-text-base transition-colors cursor-pointer"
                    aria-label="Copy RGB value"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* HSL code */}
                <div className="bg-background dark:bg-[#0F0F1A] p-2.5 rounded-xl border border-border dark:border-[#2D2D45]/50 flex justify-between items-center px-4">
                  <div>
                    <span className="text-[10px] font-poppins font-bold text-muted">HSL</span>
                    <p className="font-bold text-sm text-text-base">hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)</p>
                  </div>
                  <button
                    onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                    className="p-1.5 rounded-lg hover:bg-muted/15 text-muted hover:text-text-base transition-colors cursor-pointer"
                    aria-label="Copy HSL value"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Swatch history color chips */}
            <div className="mt-6 pt-5 border-t border-border dark:border-[#2D2D45]/40">
              <h3 className="text-xs font-poppins font-semibold text-muted mb-3 flex items-center gap-1.5">
                <History className="w-4 h-4 text-muted" /> Swatches Palette History
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                {history.map((hist, index) => (
                  <button
                    key={`${hist}-${index}`}
                    onClick={() => setColor(hist)}
                    className="w-10 h-10 rounded-full border border-border dark:border-white/10 hover:scale-110 shadow-sm transition-all cursor-pointer relative group flex items-center justify-center"
                    style={{ backgroundColor: hist }}
                    aria-label={`Restore history color ${hist}`}
                  >
                    {color === hist && <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />}
                    {/* Hover text label */}
                    <span className="absolute -top-7 hidden group-hover:block bg-text-base text-background p-1 px-1.5 rounded text-[10px] whitespace-nowrap font-mono z-25">
                      {hist.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: WCAG AA/AAA audit dashboard (5 cols) */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
            
            <h3 className="font-poppins font-bold text-xs uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border dark:border-[#2D2D45]/40 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> WCAG Contrast Audit
            </h3>

            {/* Typography Swatch Demo Canvas Box */}
            <div
              className="w-full rounded-xl p-4.5 mb-5 flex flex-col justify-between h-36 font-poppins select-none shadow-inner border border-black/5"
              style={{ backgroundColor: color }}
            >
              <div className="text-white text-left">
                <p className="text-xs font-semibold">White Typography Demo</p>
                <p className="text-[10px] opacity-80">This is visual preview body copy.</p>
              </div>
              <div className="text-black text-right mt-auto">
                <p className="text-xs font-semibold">Black Typography Demo</p>
                <p className="text-[10px] opacity-80">This is visual preview body copy.</p>
              </div>
            </div>

            {/* Read Audit Results parameters */}
            <div className="space-y-4">
              
              {/* White contrast evaluation */}
              <div className="p-3 bg-background dark:bg-[#0F0F1A] rounded-xl border border-border dark:border-[#2D2D45]/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-poppins font-semibold text-text-base">Contrast against White text</p>
                  <p className="text-[10px] font-mono text-muted">Contrast ratio: <span className="font-bold text-text-base">{contrastRatios.white}:1</span></p>
                </div>
                
                <div className="flex gap-1">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-poppins font-bold uppercase flex items-center gap-1 ${
                    getPassCheck(contrastRatios.white)
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {getPassCheck(contrastRatios.white) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    AA Pass
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-poppins font-bold uppercase flex items-center gap-1 ${
                    getPassAAA(contrastRatios.white)
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    AAA Pass
                  </span>
                </div>
              </div>

              {/* Black contrast evaluation */}
              <div className="p-3 bg-background dark:bg-[#0F0F1A] rounded-xl border border-border dark:border-[#2D2D45]/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-poppins font-semibold text-text-base">Contrast against Black text</p>
                  <p className="text-[10px] font-mono text-muted">Contrast ratio: <span className="font-bold text-text-base">{contrastRatios.black}:1</span></p>
                </div>
                
                <div className="flex gap-1">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-poppins font-bold uppercase flex items-center gap-1 ${
                    getPassCheck(contrastRatios.black)
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {getPassCheck(contrastRatios.black) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    AA Pass
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-poppins font-bold uppercase flex items-center gap-1 ${
                    getPassAAA(contrastRatios.black)
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    AAA Pass
                  </span>
                </div>
              </div>

            </div>

            {/* Informational tip */}
            <div className="mt-4 p-3 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/30 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted leading-relaxed font-inter">
                WCAG AA requires contrast of at least <code className="font-mono text-primary font-bold">4.5:1</code> for reading, while high-tier AAA standard is <code className="font-mono text-primary font-bold">7.0:1</code>. Best ratio will show as the top pass score.
              </p>
            </div>

          </div>
        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default ColorPicker;
