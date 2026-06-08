import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { formatBytes } from '../../utils/helpers';
import { Upload, FileCode, Trash2, ArrowUp, ArrowDown, ChevronRight, Loader2, Sparkles, Sliders } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'original' | 'a4' | 'letter'>('original');
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
      addImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(Array.from(e.target.files));
    }
  };

  const addImages = (files: File[]) => {
    const validImages = files.filter(f => f.type.startsWith('image/'));
    
    if (validImages.length < files.length) {
      error('Some files were skipped. Only image files (JPG, PNG, WebP) are supported.');
    }
    
    if (validImages.length > 0) {
      const newItems = validImages.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newItems]);
      success(`Added ${validImages.length} image(s).`);
    }
  };

  const removeImage = (id: string, url: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    URL.revokeObjectURL(url);
    info('Removed image.');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Helper to convert any image file into raw PNG bytes using an offscreen canvas
  const getPngBytes = async (file: File): Promise<{ bytes: Uint8Array; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context could not be created.'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          
          // Get raw base64 PNG data
          const dataUrl = canvas.toDataURL('image/png');
          const base64Str = dataUrl.split(',')[1];
          const binaryStr = atob(base64Str);
          const len = binaryStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          
          resolve({
            bytes,
            width: canvas.width,
            height: canvas.height
          });
        };
        img.onerror = () => reject(new Error('Failed to parse image element.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      error('Please select at least 1 image.');
      return;
    }

    setIsCompiling(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        // Formulate standard on-device png transposition
        const imageResult = await getPngBytes(item.file);
        const embeddedPng = await pdfDoc.embedPng(imageResult.bytes);
        
        let pageWidth = imageResult.width;
        let pageHeight = imageResult.height;

        // Custom dimension matrices: A4 is [595.28, 841.89] pt. Letter is [612, 792] pt.
        if (pageSize === 'a4') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === 'letter') {
          pageWidth = 612.0;
          pageHeight = 792.0;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Smart aspects constraints: scale-to-fit without warps or stretches
        const xRatio = pageWidth / imageResult.width;
        const yRatio = pageHeight / imageResult.height;
        let scale = Math.min(xRatio, yRatio);
        
        // If "original" dimensions, scale is simply 1:1
        if (pageSize === 'original') {
          scale = 1.0;
        }

        const imgWidth = imageResult.width * scale;
        const imgHeight = imageResult.height * scale;

        // Center within pages
        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = (pageHeight - imgHeight) / 2;

        page.drawImage(embeddedPng, {
          x: xOffset,
          y: yOffset,
          width: imgWidth,
          height: imgHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images_converted.pdf';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success('PDF compiled dynamically!');
    } catch (err: any) {
      console.error(err);
      error(`PDF construction failed: ${err.message || 'Check for device memory or corrupt images.'}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleClearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setPageSize('original');
    info('Reset all images.');
  };

  return (
    <ToolPageWrapper
      title="Image to PDF"
      icon="🖼️"
      description="Bundle a list of images into a single vector page layout. Drag, rearrange and specify paper scale limits (A4, US Letter, or Original bounding dimensions) for the output document."
    >
      <div className="bg-surface dark:bg-[#1A1A2E] rounded-2xl border border-border dark:border-[#2D2D45]/60 p-6 shadow-sm transition-all duration-300">
        
        {/* Settings panel */}
        <div className="mb-6 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 p-5 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-primary" />
              <span className="font-poppins font-semibold text-sm text-text-base">Document Scale & Geometry</span>
            </div>
            
            <div className="flex gap-2.5">
              {(['original', 'a4', 'letter'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`px-4 py-2 rounded-xl font-poppins font-semibold text-xs capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    pageSize === size
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45] hover:bg-muted/10 text-text-base/80'
                  }`}
                >
                  {size === 'original' ? 'Image Size' : size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drag n Drop Upload zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 select-none ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 scale-98'
              : 'border-border dark:border-[#2D2D45] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-slate-50 dark:hover:bg-indigo-950/5'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mx-auto">
            <Upload className="w-6 h-6 stroke-[2.25]" />
          </div>
          <div>
            <p className="font-poppins font-semibold text-text-base">Drag & drop images here, or click to choose</p>
            <p className="font-inter text-xs text-muted dark:text-gray-400 mt-1">Accepts multiple PNG, JPG, WebP photos</p>
          </div>
        </div>

        {/* Image Grid Listing */}
        {images.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border dark:border-[#2D2D45]/60 animate-fade-in">
              <span className="font-poppins font-semibold text-sm text-text-base flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-primary" />
                Image Sequence ({images.length})
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:underline cursor-pointer font-semibold font-poppins"
              >
                Clear All
              </button>
            </div>

            {/* Grid of reorderable thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 max-h-[450px] overflow-y-auto pr-1 py-1">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-video w-full flex items-center justify-center p-2.5 bg-black/5 dark:bg-black/25 relative">
                    <img
                      src={item.previewUrl}
                      alt={`Imported asset ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain rounded shadow-sm"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-zinc-900/95 text-white px-2 py-0.5 rounded-md shadow-sm">
                      Page {index + 1}
                    </span>
                  </div>

                  {/* Details + Reorder triggers */}
                  <div className="p-3 bg-surface dark:bg-[#1A1A2E] flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold font-poppins text-text-base truncate max-w-[120px] sm:max-w-[160px]">
                        {item.file.name}
                      </p>
                      <p className="text-[10px] text-muted font-mono">{formatBytes(item.file.size)}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Sort moves */}
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded-md hover:bg-muted/15 disabled:opacity-30 text-text-base"
                        aria-label="Shift sequencing backward"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 rounded-md hover:bg-muted/15 disabled:opacity-30 text-text-base"
                        aria-label="Shift sequencing forward"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      
                      {/* Trash */}
                      <button
                        onClick={() => removeImage(item.id, item.previewUrl)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors ml-1"
                        aria-label="Remove image thumbnail"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compile PDFs trigger */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={convertToPdf}
                disabled={images.length === 0 || isCompiling}
                className="w-full sm:w-auto font-poppins font-bold text-sm py-3 px-6 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow"
              >
                {isCompiling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Packaging Pages...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" />
                    Convert to PDF & Download
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};

export default ImageToPdf;
