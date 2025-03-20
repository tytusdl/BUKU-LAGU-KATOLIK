import { useEffect, useState } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Lakukan panggilan frameworkReady jika ada
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
    
    // Set isReady ke true segera
    setIsReady(true);
    
    return () => {};
  }, []);
  
  return { isReady };
}
