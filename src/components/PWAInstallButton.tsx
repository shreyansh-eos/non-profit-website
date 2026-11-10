import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#5B8F8A]/15 hover:bg-[#5B8F8A]/25 text-[#17243A] border border-[#5B8F8A]/30 transition-all duration-200 cursor-pointer shadow-2xs"
        title="Install Aawaaz Setu App for offline access"
      >
        <Download className="w-3.5 h-3.5 text-[#5B8F8A]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#5B8F8A]/15 hover:bg-[#5B8F8A]/25 text-[#17243A] border border-[#5B8F8A]/30 transition-all duration-200 cursor-pointer shadow-2xs"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#5B8F8A]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#17243A]/10 text-[#252B35]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg font-bold text-[#17243A]">
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#687385] hover:text-[#17243A] hover:bg-[#EEF3F8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#252B35]/80 leading-relaxed mb-4">
                To play <strong>Aawaaz Run</strong> offline and install Aawaaz Setu to your home screen:
              </p>
              <ol className="text-xs text-[#252B35]/90 space-y-2 list-decimal list-inside bg-[#F8F7F3] p-3.5 rounded-xl border border-[#17243A]/10 mb-4 font-medium">
                <li>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</li>
                <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> at top right to complete.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#17243A] text-white text-xs font-semibold hover:bg-[#252B35] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
