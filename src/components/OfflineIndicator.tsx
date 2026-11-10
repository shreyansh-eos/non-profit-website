import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-[#17243A] text-white px-3.5 py-2 text-xs font-medium shadow-xl border border-[#5B8F8A]/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5 text-[#5B8F8A]" />
      <span>Offline Mode — Aawaaz Run & Cached content active</span>
    </div>
  );
};
