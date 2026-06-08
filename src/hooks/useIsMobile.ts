import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile (width < 768px).
 * Safely handles server-side / build environments.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Explicit initial check
    checkMobile();

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
