import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };
    const goOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [wasOffline]);

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
        <span className="h-2 w-2 bg-white rounded-full"></span>
        Back online!
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-gray-900 text-white text-sm px-4 py-3 flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span>You're offline. Some features may be unavailable.</span>
      </div>
    );
  }

  return null;
};

export default OfflineBanner;
