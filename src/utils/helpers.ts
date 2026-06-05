/**
 * Helper to split text into words, supporting spaces, camelCase, snake_case, and kebab-case.
 */
export function getWords(text: string): string[] {
  if (!text) return [];
  // First, replace common separators with spaces
  const normalized = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[_\-\.]/g, ' '); // replace snake, kebab, dot-case with spaces
  
  return normalized.trim().split(/\s+/).filter(Boolean);
}

export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return getWords(text)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function toSentenceCase(text: string): string {
  if (!text) return '';
  // Capitalize first non-space character of each sentence
  return text
    .split(/(\.|\?|\!)\s*/)
    .map((part, index, arr) => {
      // If it's a punctuation marker, just return it
      if (['.', '?', '!'].includes(part)) return part;
      // If the index is odd, it's just the trailing space after punctuation from split
      if (index > 0 && ['.', '?', '!'].includes(arr[index - 1])) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      if (index === 0) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      return part;
    })
    .join(' ');
}

export function toCamelCase(text: string): string {
  const words = getWords(text);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + words.slice(1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function toPascalCase(text: string): string {
  return getWords(text)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function toSnakeCase(text: string): string {
  return getWords(text)
    .map(word => word.toLowerCase())
    .join('_');
}

export function toKebabCase(text: string): string {
  return getWords(text)
    .map(word => word.toLowerCase())
    .join('-');
}

export function toDotCase(text: string): string {
  return getWords(text)
    .map(word => word.toLowerCase())
    .join('.');
}

/**
 * Format bytes into human readable file sizes
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * File validation helper
 */
export function validateFileSize(file: File, maxMb: number): boolean {
  return file.size <= maxMb * 1024 * 1024;
}
