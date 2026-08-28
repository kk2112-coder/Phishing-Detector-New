import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [effectiveType, setEffectiveType] = useState('4g');
  const [rtt, setRtt] = useState(50);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [simulatedSlow, setSimulatedSlow] = useState(false);

  useEffect(() => {
    const updateConnectionInfo = () => {
      if (typeof navigator === 'undefined') return;

      setIsOnline(navigator.onLine);

      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        const type = conn.effectiveType || '4g';
        const roundTrip = conn.rtt || 50;
        setEffectiveType(type);
        setRtt(roundTrip);

        const slow = !navigator.onLine || type === 'slow-2g' || type === '2g' || type === '3g' || roundTrip > 500;
        setIsSlowConnection(slow);
      } else {
        setIsSlowConnection(!navigator.onLine);
      }
    };

    updateConnectionInfo();

    window.addEventListener('online', updateConnectionInfo);
    window.addEventListener('offline', updateConnectionInfo);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', updateConnectionInfo);
      window.removeEventListener('offline', updateConnectionInfo);
      if (conn) {
        conn.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  const toggleSimulateSlow = () => {
    setSimulatedSlow(prev => !prev);
  };

  const activeSlow = isSlowConnection || simulatedSlow || !isOnline;

  return {
    isOnline,
    effectiveType: simulatedSlow ? '2g (simulated)' : effectiveType,
    rtt: simulatedSlow ? 1200 : rtt,
    isSlowConnection: activeSlow,
    simulatedSlow,
    toggleSimulateSlow
  };
}
