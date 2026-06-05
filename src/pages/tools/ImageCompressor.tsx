import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { formatBytes } from '../../utils/helpers';
import { Upload, ImageIcon, RefreshCw, Download, Sliders, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [quality, setQuality] = useState<number>(70);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, info } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    
    // Revoke old URL if existing
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSelectedFile(file);
    setCompressedFile(null);
    setCompressedUrl('');
    setOriginalUrl(URL.createObjectURL(file));
    success('Original image loaded.');
  };

  // Run Compression on Image select or Quality change
  const doCompress = async () => {
    if (!selectedFile) return;

    setIsCompiling(true);
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
        initialQuality: quality / 100
      };

      const compressed = await imageCompression(selectedFile, options);
      
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
      
      const percent = Math.round(((selectedFile.size - compressed.size) / selectedFile.size) * 100);
      if (percent > 0) {
        success(`Compressed by ${percent}%!`);
      } else {
        info('No further reduction possible at this level.');
      }
    } catch (err: any) {
      console.error(err);
      error(`Compression failed: ${err.message || 'Unknown processing error.'}`);
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      // Debounce compression requests
      const timeOut = setTimeout(() => {
        doCompress();
      }, 500);

      return () => clearTimeout(timeOut);
    }
  }, [selectedFile, quality]);

  // Download Trigger
  const downloadCompressed = () => {
    if (!compressedUrl || !compressedFile) return;
    
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${selectedFile?.name || 'toolkit-pro.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Compressed image downloaded.');
  };

  // Reset Trigger
  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    
    setSelectedFile(null);
    setCompressedFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setQuality(70);
    info('Page cleared.');
  };

  const getSavingsPercentage = () => {
    if (!selectedFile || !compressedFile) return 0;
    const diff = selectedFile.size - compressedFile.size;
    if (diff <= 0) return 0;
    return Math.round((diff / selectedFile.size) * 100);
  };

  return (
    <ToolPageWrapper
      title="Image Compressor"
      icon="🗜️"
      description="Optimize and shrink image elements directly inside your webpage context. Standardize metadata compression levels without compromising visual balance."
    >
      <div className="bg-surface dark:bg-[#1A1A2E] rounded-2xl border border-border dark:border-[#2D2D45]/60 p-6 shadow-sm transition-all duration-300">
        
        {!selectedFile ? (
          /* Upload view */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 select-none ${
              isDragging
                ? 'border-primary bg-primary/5 scale-98'
                : 'border-border dark:border-[#2D2D45] hover:border-primary/50 dark:hover:border-[#7C74FF]/50 hover:bg-muted/5'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="p-3.5 bg-primary/10 dark:bg-[#7C74FF]/10 text-primary dark:text-[#7C74FF] rounded-full">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="font-poppins font-semibold text-text-base">Drag & drop your image, or click to choose</p>
              <p className="font-inter text-xs text-muted dark:text-gray-400 mt-1">Accepts PNG, JPG, JPEG, and WebP assets</p>
            </div>
          </div>
        ) : (
          /* Interactive view */
          <div className="space-y-8">
            
            {/* Control Slider */}
            <div className="bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4.5 h-4.5 text-primary" />
                  <span className="font-poppins font-semibold text-sm text-text-base">Compression Quality Level</span>
                </div>
                
                <div className="flex-1 max-w-md flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-border dark:bg-[#2D2D45] rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Set compression quality ratio"
                  />
                  <span className="font-mono font-bold text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg">
                    {quality}%
                  </span>
                </div>
              </div>
            </div>

            {/* Before / After Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Original Preview card */}
              <div className="border border-border dark:border-[#2D2D45]/60 rounded-xl overflow-hidden bg-background dark:bg-[#0F0F1A]">
                <div className="p-3.5 border-b border-border dark:border-[#2D2D45]/60 flex items-center justify-between bg-surface dark:bg-[#1A1A2E]">
                  <span className="font-poppins font-semibold text-xs text-muted tracking-wide uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-muted" />
                    Original Image
                  </span>
                  <span className="font-mono text-xs font-semibold text-text-base">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
                <div className="aspect-video w-full flex items-center justify-center p-3 bg-[#e2e8f0]/10 border-t border-border/10 dark:bg-black/5">
                  <img
                    src={originalUrl}
                    alt="Original Upload Preview"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded shadow"
                  />
                </div>
              </div>

              {/* Compressed Preview card */}
              <div className="border border-border dark:border-[#2D2D45]/60 rounded-xl overflow-hidden bg-background dark:bg-[#0F0F1A]">
                <div className="p-3.5 border-b border-border dark:border-[#2D2D45]/60 flex items-center justify-between bg-surface dark:bg-[#1A1A2E]">
                  <span className="font-poppins font-semibold text-xs text-primary dark:text-[#7C74FF] tracking-wide uppercase flex items-center gap-1.5">
                    {isCompiling ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    )}
                    Optimized Image
                  </span>
                  <div className="flex gap-2 items-center">
                    {compressedFile && !isCompiling && (
                      <span className="text-xs font-poppins font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg">
                        -{getSavingsPercentage()}% Space Saved
                      </span>
                    )}
                    <span className="font-mono text-xs font-semibold text-primary">
                      {isCompiling ? 'Calculating...' : compressedFile ? formatBytes(compressedFile.size) : 'Calculating...'}
                    </span>
                  </div>
                </div>
                <div className="aspect-video w-full flex items-center justify-center p-3 bg-[#e2e8f0]/10 border-t border-border/10 dark:bg-black/5">
                  {isCompiling ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-7 h-7 animate-spin text-primary" />
                      <span className="text-xs text-muted font-poppins font-medium">Recompiling assets...</span>
                    </div>
                  ) : compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain rounded shadow"
                    />
                  ) : (
                    <div className="text-xs text-muted font-poppins">Ready to compress...</div>
                  )}
                </div>
              </div>

            </div>

            {/* Dynamic Controls Buttons Row */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto font-poppins font-semibold text-sm py-3 px-6 rounded-xl bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] text-text-base/85 hover:bg-muted/10 transition-colors cursor-pointer"
              >
                Clear Tool & Restart
              </button>
              
              <button
                onClick={downloadCompressed}
                disabled={isCompiling || !compressedUrl}
                className="w-full sm:w-auto font-poppins font-bold text-sm py-3 px-6 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow"
              >
                <Download className="w-4.5 h-4.5" />
                Download Optimized Asset
              </button>
            </div>

          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};

export default ImageCompressor;
