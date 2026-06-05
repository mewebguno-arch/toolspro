import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { formatBytes } from '../../utils/helpers';
import { Upload, FileText, Trash2, Layers, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfOnly = newFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfOnly.length < newFiles.length) {
      error('Only PDF files are supported.');
    }
    
    if (pdfOnly.length > 0) {
      setFiles(prev => [...prev, ...pdfOnly]);
      success(`Added ${pdfOnly.length} PDF file(s).`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    info('Removed file from list.');
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      error('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      // Initialize an empty PDF document
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF as an arraybuffer
      const mergedPdfBytes = await mergedPdf.save();
      
      // Generate a download link
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      success('PDFs merged and downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      error(`Merge failed: ${err.message || 'Corrupt or secure PDF file.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageWrapper
      title="PDF Merger"
      icon="🥞"
      description="Select or drag multiple PDF files to stitch them together into a single, cohesive document. Rearrange pages or documents to ensure appropriate layouts."
    >
      <div className="bg-surface dark:bg-[#1A1A2E] rounded-2xl border border-border dark:border-[#2D2D45]/60 p-6 shadow-sm transition-all duration-300">
        
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 select-none ${
            isDragging
              ? 'border-primary bg-primary/5 active:scale-98'
              : 'border-border dark:border-[#2D2D45] hover:border-primary/50 dark:hover:border-[#7C74FF]/50 hover:bg-muted/5'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf"
            className="hidden"
          />
          <div className="p-3.5 bg-primary/10 dark:bg-[#7C74FF]/10 text-primary dark:text-[#7C74FF] rounded-full">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="font-poppins font-semibold text-text-base">Drag & drop files here, or click to choose</p>
            <p className="font-inter text-xs text-muted dark:text-gray-400 mt-1">Accepts multiple standard .pdf files</p>
          </div>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border dark:border-[#2D2D45]/60">
              <span className="font-poppins font-semibold text-sm text-text-base flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                Selected Documents ({files.length})
              </span>
              <button
                onClick={() => { setFiles([]); info('List cleared.'); }}
                className="text-xs text-red-500 hover:underline cursor-pointer font-semibold font-poppins"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3.5 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/40 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xs font-mono font-bold bg-muted/20 text-muted px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-sm font-poppins font-medium text-text-base truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted font-mono">{formatBytes(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Sort triggers */}
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="p-1 px-1.5 rounded-lg hover:bg-muted/15 disabled:opacity-40 transition-colors cursor-pointer text-text-base"
                      aria-label="Move item up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className="p-1 px-1.5 rounded-lg hover:bg-muted/15 disabled:opacity-40 transition-colors cursor-pointer text-text-base"
                      aria-label="Move item down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    {/* Danger trash trigger */}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer ml-1"
                      aria-label="Delete document entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge CTA */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                className="w-full sm:w-auto font-poppins font-bold text-sm py-3 px-6 rounded-xl bg-primary text-white hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Stitching Documents...
                  </>
                ) : (
                  <>
                    <Layers className="w-5 h-5" />
                    Merge and Download
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

export default PdfMerger;
