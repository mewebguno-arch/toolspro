import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { Download, Sliders, Hash, RefreshCcw, Palette } from 'lucide-react';

export const QrGenerator: React.FC = () => {
  const [text, setText] = useState('https://toolkitpro.app');
  const [size, setSize] = useState<128 | 256 | 512>(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { success, error } = useToast();

  const generateQr = async () => {
    if (!canvasRef.current || !text) return;

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
    } catch (err: any) {
      console.error(err);
      error(`Failed to redraw QR: ${err.message || 'Check for excessive text length.'}`);
    }
  };

  useEffect(() => {
    generateQr();
  }, [text, size, fgColor, bgColor]);

  const downloadQr = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qr_code_${size}x${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('QR Code downloaded as high-resolution PNG!');
    } catch (err: any) {
      console.error(err);
      error('Failed to export. Verify canvas status.');
    }
  };

  const handleResetColors = () => {
    setFgColor('#000000');
    setBgColor('#FFFFFF');
    success('Colors restored to default black and white!');
  };

  return (
    <ToolPageWrapper
      title="QR Code Generator"
      icon="🔳"
      description="Design customized vector QR codes in real-time. Code input URLs, Wi-Fi keys, or texts, and personalize visual color properties for easy sharing."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Generator Controls (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
            <h2 className="font-poppins font-semibold text-base text-text-base mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Configuration Parameters
            </h2>

            {/* Input Content block */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="qr-content" className="text-xs font-poppins font-semibold text-muted dark:text-gray-300">
                    QR Payload (URL or Plain Text)
                  </label>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${text.length > 500 ? 'bg-red-500/10 text-red-500' : 'bg-muted/10 text-muted'}`}>
                    {text.length} / 1200 chars
                  </span>
                </div>
                
                <textarea
                  id="qr-content"
                  placeholder="Enter link, text, contact details, or Wi-Fi parameters..."
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 1200))}
                  className="w-full min-h-[110px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-3.5 text-sm text-text-base placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-inter leading-relaxed"
                />
              </div>

              {/* Size segmented switches */}
              <div>
                <label className="block text-xs font-poppins font-semibold text-muted dark:text-gray-300 mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  QR Resolution Dimension
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([128, 256, 512] as const).map((dim) => (
                    <button
                      key={dim}
                      onClick={() => setSize(dim)}
                      className={`py-2 rounded-xl font-poppins font-bold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        size === dim
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] text-text-base/80 hover:bg-muted/10'
                      }`}
                    >
                      {dim} × {dim} px
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Wheel Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-poppins font-semibold text-muted dark:text-gray-300 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                    Color Personalization
                  </label>
                  <button
                    onClick={handleResetColors}
                    className="text-[10px] text-primary hover:underline font-poppins font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCcw className="w-3 h-3" /> Reset Colors
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Fg color picker */}
                  <div className="p-3 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/50 rounded-xl flex items-center justify-between">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-poppins text-muted">Core Pixels (Foreground)</p>
                      <p className="text-xs font-mono font-bold text-text-base truncate">{fgColor.toUpperCase()}</p>
                    </div>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent shrink-0 outline-none"
                      aria-label="Select Foreground QR Code pixel color"
                    />
                  </div>

                  {/* Bg color picker */}
                  <div className="p-3 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/50 rounded-xl flex items-center justify-between">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-poppins text-muted">Canvas Back (Background)</p>
                      <p className="text-xs font-mono font-bold text-text-base truncate">{bgColor.toUpperCase()}</p>
                    </div>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent shrink-0 outline-none"
                      aria-label="Select Background QR Code canvas color"
                    />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: QR Code Live Preview Card (5 cols) */}
        <div className="md:col-span-5">
          <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-6 text-center shadow-sm transition-all duration-300 flex flex-col items-center justify-between min-h-[350px]">
            <h2 className="font-poppins font-bold text-sm text-text-base text-left w-full mb-4 pb-2 border-b border-border dark:border-[#2D2D45]/40 uppercase tracking-widest text-primary">
              Live Preview
            </h2>

            {/* QR Bounding Canvas */}
            <div className="flex-grow flex items-center justify-center p-6 bg-slate-100 dark:bg-[#0F0F1A] rounded-xl border border-border dark:border-[#2D2D45]/40 shadow-inner mb-6 max-w-full overflow-hidden">
              {text ? (
                <div className="bg-white p-2.5 rounded-lg shadow-sm border border-black/5 flex-shrink">
                  <canvas 
                    ref={canvasRef} 
                    className="mx-auto block" 
                    style={{ 
                      width: '200px', 
                      height: '200px',
                      imageRendering: 'pixelated'
                    }} 
                  />
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs font-poppins font-semibold text-muted">Grid is currently offline</p>
                  <p className="text-[10px] text-muted font-inter mt-1">Please insert payload text on the left to activate.</p>
                </div>
              )}
            </div>

            {/* Download and Save CTA */}
            <button
              onClick={downloadQr}
              disabled={!text}
              className="w-full font-poppins font-bold text-sm py-3 px-6 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-auto shadow"
            >
              <Download className="w-4.5 h-4.5" />
              Export QR Code as PNG
            </button>
          </div>
        </div>

      </div>
    </ToolPageWrapper>
  );
};

export default QrGenerator;
