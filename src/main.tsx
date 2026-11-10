import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker safely for offline functionality
try {
  registerSW({ immediate: true });
} catch (swError) {
  console.warn('Service worker registration error:', swError);
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App runtime render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F3] p-6 text-[#17243A]">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#17243A]/10 shadow-lg text-center">
            <h2 className="font-serif text-2xl font-bold mb-3">Aawaaz Setu</h2>
            <p className="text-sm text-[#687385] mb-6">
              An unexpected error occurred while rendering the page. Please reload the website to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#17243A] text-white rounded-xl text-sm font-semibold hover:bg-[#252B35] transition-colors cursor-pointer"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
