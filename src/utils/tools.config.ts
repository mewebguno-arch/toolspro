import { ToolConfig } from '../types';

export const TOOLS: ToolConfig[] = [
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document instantly in your browser.',
    icon: '🥞',
    gradient: 'from-[#FF5E62] to-[#FF9966]',
    route: '/tools/pdf-merger'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image file size up to 90% without losing visual quality.',
    icon: '🗜️',
    gradient: 'from-[#4FACFE] to-[#00F2FE]',
    route: '/tools/image-compressor'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, and WebP images into a single clean PDF document.',
    icon: '🖼️',
    gradient: 'from-[#9B51E0] to-[#764BA2]',
    route: '/tools/image-to-pdf'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate customizable, high-resolution QR codes with live color picker controls.',
    icon: '🔳',
    gradient: 'from-[#11998E] to-[#38EF7D]',
    route: '/tools/qr-generator'
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create ultra-secure random passwords with configurable properties and strength indicators.',
    icon: '🔑',
    gradient: 'from-[#FF758C] to-[#FF7EB3]',
    route: '/tools/password-generator'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Analyze word count, characters, sentences, paragraphs, and reading times live.',
    icon: '📝',
    gradient: 'from-[#FBC2EB] to-[#A6C1EE]',
    route: '/tools/word-counter'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, prettify, or minify JSON with full syntax-highlighted results.',
    icon: '🔮',
    gradient: 'from-[#2193B0] to-[#6DD5ED]',
    route: '/tools/json-formatter'
  },
  {
    id: 'base64-tool',
    name: 'Base64 Encoder/Decoder',
    description: 'Securely encode and decode text or files to and from raw Base64 strings.',
    icon: '🧬',
    gradient: 'from-[#CC2B5E] to-[#753A88]',
    route: '/tools/base64-tool'
  },
  {
    id: 'color-picker',
    name: 'Color Wheel & Picker',
    description: 'Inspect hex, rgb, and hsl color codes, evaluate WCAG contrast ratios and historical swatches.',
    icon: '🎨',
    gradient: 'from-[#F21A79] to-[#FF8C00]',
    route: '/tools/color-picker'
  },
  {
    id: 'case-converter',
    name: 'String Case Converter',
    description: 'Convert strings between UPPER, lower, Title, kebab, snake, camel, and dot case formats.',
    icon: '🔤',
    gradient: 'from-[#43C6AC] to-[#191654]',
    route: '/tools/case-converter'
  }
];
