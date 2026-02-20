import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};

export const OfflineBanner: React.FC = () => {
  const isOffline = useOfflineDetection();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-brand-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium animate-bounce-in">
      <WifiOff size={16} />
      You're offline. Some features may not be available.
    </div>
  );
};
