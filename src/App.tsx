import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import { Loader2, ShieldAlert } from 'lucide-react';

// ScrollToTop implementation
export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash anchor (e.g. #tools)
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Router Fallback Layout Wrapper
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const PdfMerger = lazy(() => import('./pages/tools/PdfMerger'));
const ImageCompressor = lazy(() => import('./pages/tools/ImageCompressor'));
const ImageToPdf = lazy(() => import('./pages/tools/ImageToPdf'));
const QrGenerator = lazy(() => import('./pages/tools/QrGenerator'));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const JsonFormatter = lazy(() => import('./pages/tools/JsonFormatter'));
const Base64Tool = lazy(() => import('./pages/tools/Base64Tool'));
const ColorPicker = lazy(() => import('./pages/tools/ColorPicker'));
const CaseConverter = lazy(() => import('./pages/tools/CaseConverter'));

// Loading fallback component
const PageSpinnerFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#0F0F1A] flex flex-col items-center justify-center gap-3 transition-colors duration-300">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="font-poppins font-semibold text-sm text-text-base">Loading Tool Pro...</p>
    </div>
  );
};

// 404 Component
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#0F0F1A] flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
      <div className="p-4 bg-red-500/10 rounded-2xl mb-4 border border-red-500/10 text-red-500 animate-bounce">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="font-poppins font-extrabold text-3xl text-text-base mb-2">Tool Not Found</h1>
      <p className="font-inter text-sm text-muted dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        The requested micro-utility route does not exist. Check spelling or return back to the general dashboard index.
      </p>
      <Link
        to="/"
        className="font-poppins font-bold text-sm bg-primary hover:bg-opacity-90 text-white py-3 px-6 rounded-xl shadow cursor-pointer"
      >
        Return to Home Dashboard
      </Link>
    </div>
  );
};

// Configuration router mapping
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <Home />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/pdf-merger',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <PdfMerger />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/image-compressor',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <ImageCompressor />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/image-to-pdf',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <ImageToPdf />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/qr-generator',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <QrGenerator />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/password-generator',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <PasswordGenerator />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/word-counter',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <WordCounter />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/json-formatter',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <JsonFormatter />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/base64-tool',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <Base64Tool />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/color-picker',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <ColorPicker />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '/tools/case-converter',
    element: (
      <LayoutWrapper>
        <Suspense fallback={<PageSpinnerFallback />}>
          <CaseConverter />
        </Suspense>
      </LayoutWrapper>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
        {/* Mount physical floating notifications node globally */}
        <Toast />
      </ToastProvider>
    </ThemeProvider>
  );
}
