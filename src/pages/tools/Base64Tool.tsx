import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import { useToast } from '../../hooks/useToast';
import { formatBytes } from '../../utils/helpers';
import { Type, FileUp, Copy, Check, RefreshCw, AlertCircle, Sparkles, FileText, Download } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  // Mode: Encode vs Decode
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  // Tab: Text converting vs File converting
  const [tab, setTab] = useState<'text' | 'file'>('text');

  // Text converting state variables
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [textError, setTextError] = useState<string | null>(null);

  // File converting state variables
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [fileBase64Output, setFileBase64Output] = useState('');
  const [fileEncodeInProgress, setFileEncodeInProgress] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // File Decoder state variables
  const [decoderBase64Input, setDecoderBase64Input] = useState('');
  const [decoderFilename, setDecoderFilename] = useState('decoded_document.txt');
  const [decoderMime, setDecoderMime] = useState('text/plain');

  const { success, error, info } = useToast();

  // 1. Text converting operations
  const convertTextVal = () => {
    if (!inputText) {
      setOutputText('');
      setTextError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
        setTextError(null);
      } else {
        // Decode logic
        const sanitized = inputText.trim().replace(/\s/g, '');
        const decoded = decodeURIComponent(escape(atob(sanitized)));
        setOutputText(decoded);
        setTextError(null);
      }
    } catch (err: any) {
      setTextError('Invalid character sequence or malformed Base64 structure.');
      setOutputText('');
    }
  };

  useEffect(() => {
    convertTextVal();
  }, [inputText, mode]);

  // 1.1 Action triggers for Text context
  const handleCopyText = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiedText(true);
      success('Copied output to clipboard!');
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      error('Failed to copy values.');
    }
  };

  const handleClearTextWorkspace = () => {
    setInputText('');
    setOutputText('');
    setTextError(null);
    info('Workspace cleared.');
  };

  // 2. File Encoder operations
  const handleFileEncodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLoadedFile(file);
      setFileBase64Output('');
      encodeFileToBase64(file);
    }
  };

  const encodeFileToBase64 = (file: File) => {
    setFileEncodeInProgress(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        // Strip data MIME prefix block: "data:image/png;base64,"
        const base64 = result.split(',')[1];
        setFileBase64Output(base64);
        success('File successfully packed to Base64!');
      } catch (err: any) {
        error('Failed to parse file binaries.');
      } finally {
        setFileEncodeInProgress(false);
      }
    };
    reader.onerror = () => {
      error('FileReader file load error.');
      setFileEncodeInProgress(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyFileBase64 = async () => {
    if (!fileBase64Output) return;
    try {
      await navigator.clipboard.writeText(fileBase64Output);
      success('Base64 string copied!');
    } catch {
      error('Failed to copy encoding output.');
    }
  };

  // 3. File Decoder operations
  const handleDecodeBase64File = () => {
    if (!decoderBase64Input.trim()) {
      error('Base64 input is empty.');
      return;
    }

    try {
      // Remove whitespaces
      const cleanB64 = decoderBase64Input.trim().replace(/\s/g, '');
      const byteCharacters = atob(cleanB64);
      
      // Allocating slice clusters
      const sliceSize = 512;
      const byteArrays = [];
      for (let o = 0; o < byteCharacters.length; o += sliceSize) {
        const cluster = byteCharacters.slice(o, o + sliceSize);
        const byteNumbers = new Array(cluster.length);
        for (let i = 0; i < cluster.length; i++) {
          byteNumbers[i] = cluster.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, { type: decoderMime });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = decoderFilename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success('File decoded and downloaded successfully!');
    } catch (err: any) {
      error('Decoding failed. Please verify that the Base64 input is valid.');
    }
  };

  return (
    <ToolPageWrapper
      title="Base64 Encoder/Decoder"
      icon="🧬"
      description="Encode plain text or assets into Base64 hashes, or decode Base64 back to text strings or downloadable binaries completely on-device."
    >
      <div className="space-y-6">
        
        {/* Top Control panel: Tab Selection (Text vs File) & Mode Toggle (Encode vs Decode) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 px-5 py-4 rounded-2xl shadow-sm">
          
          {/* Encode / Decode Pills */}
          <div className="flex bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/50 p-1 rounded-xl">
            {(['encode', 'decode'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setInputText(''); setOutputText(''); }}
                className={`px-4 py-2.5 rounded-lg font-poppins font-bold text-xs uppercase cursor-pointer transition-all ${
                  mode === m
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-base/80 hover:bg-muted/5'
                }`}
              >
                {m} Plain Text
              </button>
            ))}
          </div>

          {/* Text workspace vs File workspace */}
          <div className="flex bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45]/50 p-1 rounded-xl">
            <button
              onClick={() => setTab('text')}
              className={`px-4 py-2.5 rounded-lg font-poppins font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                tab === 'text'
                  ? 'bg-[#FF6584] text-white shadow-sm'
                  : 'text-text-base/80 hover:bg-muted/5'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Text Mode
            </button>
            <button
              onClick={() => setTab('file')}
              className={`px-4 py-2.5 rounded-lg font-poppins font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                tab === 'file'
                  ? 'bg-[#FF6584] text-white shadow-sm'
                  : 'text-text-base/80 hover:bg-muted/5'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" /> File Mode
            </button>
          </div>

        </div>

        {textError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-inter text-xs sm:text-sm font-semibold">{textError}</span>
          </div>
        )}

        {/* Dynamic Display workspace */}
        {tab === 'text' ? (
          
          /* TEXT WORKSPACE PANEL */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Input Box */}
            <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <label htmlFor="base64-text-input" className="block text-xs font-poppins font-semibold text-muted dark:text-gray-300 pb-2 border-b border-border dark:border-[#2D2D45]/40 mb-4 capitalize">
                  {mode === 'encode' ? 'Normal Plain Text Input' : 'Raw Base64 Input String'}
                </label>
                
                <textarea
                  id="base64-text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? 'Insert plain text characters to generate encoded hash...' : 'Insert Base64 string sequence to execute raw text decryption...'}
                  className="w-full min-h-[220px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4 text-xs font-mono text-text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] font-mono text-muted">{inputText.length} input bytes</span>
                <button
                  onClick={handleClearTextWorkspace}
                  className="px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold border border-border dark:border-[#2D2D45] text-text-base hover:bg-muted/10 cursor-pointer"
                >
                  Clear Tool
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm font-mono text-xs">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-border dark:border-[#2D2D45]/40 mb-4 font-poppins">
                  <span className="text-xs font-semibold text-text-base capitalize">
                    {mode === 'encode' ? 'Base64 Encoded Output' : 'Plain Text Decoded Output'}
                  </span>
                  
                  <button
                    onClick={handleCopyText}
                    disabled={!outputText}
                    className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-[#7C74FF] hover:underline font-semibold cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Output
                  </button>
                </div>

                <textarea
                  value={outputText}
                  readOnly
                  placeholder="Output characters will generate instantly..."
                  className="w-full min-h-[220px] bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-4 text-xs font-mono text-text-base focus:outline-none outline-none leading-relaxed"
                  aria-label="Base64 output viewport"
                />
              </div>

              <div className="pt-4 flex items-center justify-between font-poppins text-[10px] text-muted">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#FF6584]" /> Instant conversion active</span>
                <span className="font-mono">{outputText.length} output characters</span>
              </div>
            </div>
          </div>
          
        ) : (
          
          /* FILE WORKSPACE PANEL */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Box A: Encode File */}
            <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xs font-poppins font-semibold text-text-base pb-2 border-b border-border dark:border-[#2D2D45]/40 mb-4 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" />
                  Encode File to Base64
                </h3>

                <div className="space-y-4">
                  {/* File selection box */}
                  <label className="border-2 border-dashed border-border dark:border-[#2D2D45] rounded-xl p-6 text-center hover:border-primary/55 cursor-pointer block hover:bg-muted/5 transition-all select-none">
                    <input
                      type="file"
                      onChange={handleFileEncodeChange}
                      className="hidden"
                    />
                    <FileUp className="w-6 h-6 text-primary mx-auto mb-2" />
                    <span className="text-xs font-poppins font-semibold text-text-base block">Choose local file</span>
                    <span className="text-[10px] text-muted font-inter">Any document, audio, or picture file under 5MB</span>
                  </label>

                  {/* Metadata display */}
                  {loadedFile && (
                    <div className="p-3 bg-background dark:bg-[#0F0F1A] rounded-xl border border-border dark:border-[#2D2D45]/40 text-xs font-poppins space-y-1">
                      <p className="font-semibold text-text-base truncate">Filename: {loadedFile.name}</p>
                      <p className="text-muted text-[10px] font-mono">Size: {formatBytes(loadedFile.size)}</p>
                      <p className="text-muted text-[10px] font-mono">Format MIME: {loadedFile.type || 'unknown'}</p>
                    </div>
                  )}

                  {/* Output textarea */}
                  {fileBase64Output && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-poppins font-bold text-muted uppercase">Base64 output string</span>
                        <button
                          onClick={handleCopyFileBase64}
                          className="text-[10px] text-primary hover:underline font-semibold font-poppins flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy Base64 String
                        </button>
                      </div>
                      <textarea
                        value={fileBase64Output}
                        readOnly
                        className="w-full h-24 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-3 text-xs font-mono text-text-base focus:outline-none outline-none leading-normal"
                        aria-label="Compiled File Base64 output"
                      />
                    </div>
                  )}
                </div>
              </div>

              {loadedFile && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => { setLoadedFile(null); setFileBase64Output(''); info('File reset.'); }}
                    className="p-2 px-3 rounded-lg text-xs font-semibold text-red-500 border border-red-500/10 hover:bg-red-500/10 cursor-pointer font-poppins"
                  >
                    Reset File input
                  </button>
                </div>
              )}
            </div>

            {/* Box B: Decode Base64 to File */}
            <div className="bg-surface dark:bg-[#1A1A2E] border border-border dark:border-[#2D2D45]/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xs font-poppins font-semibold text-text-base pb-2 border-b border-border dark:border-[#2D2D45]/40 mb-4 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-primary" />
                  Decode Base64 to File
                </h3>

                <div className="space-y-4 font-poppins text-xs">
                  {/* Base64 input string */}
                  <div>
                    <label htmlFor="decoder-textarea" className="block text-[10px] font-bold text-muted uppercase mb-1.5">Paste Base64 code string</label>
                    <textarea
                      id="decoder-textarea"
                      placeholder="Paste clean base64 string (without MIME prefix) here to package binary elements..."
                      value={decoderBase64Input}
                      onChange={(e) => setDecoderBase64Input(e.target.value)}
                      className="w-full h-24 bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl p-3 text-xs font-mono text-text-base focus:outline-none outline-none leading-normal"
                    />
                  </div>

                  {/* Metadata fields config */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="decoder-filename" className="block text-[10px] font-bold text-muted uppercase mb-1">Download Filename</label>
                      <input
                        id="decoder-filename"
                        type="text"
                        value={decoderFilename}
                        onChange={(e) => setDecoderFilename(e.target.value)}
                        className="w-full bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl px-3 py-2 text-xs text-text-base font-medium"
                      />
                    </div>
                    <div>
                      <label htmlFor="decoder-mime" className="block text-[10px] font-bold text-muted uppercase mb-1">MIME Content Type</label>
                      <input
                        id="decoder-mime"
                        type="text"
                        value={decoderMime}
                        onChange={(e) => setDecoderMime(e.target.value)}
                        className="w-full bg-background dark:bg-[#0F0F1A] border border-border dark:border-[#2D2D45] rounded-xl px-3 py-2 text-xs text-text-base font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={handleDecodeBase64File}
                  disabled={!decoderBase64Input.trim()}
                  className="w-full sm:w-auto font-poppins font-bold text-xs py-2.5 px-5 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Download className="w-4 h-4" /> Decode and Download File
                </button>
              </div>
            </div>

          </div>
          
        )}

      </div>
    </ToolPageWrapper>
  );
};

export default Base64Tool;
