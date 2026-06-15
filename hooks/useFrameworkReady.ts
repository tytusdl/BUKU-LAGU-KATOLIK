import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Check if we're on web platform
    if (Platform.OS === 'web') {
      // TypeScript cast untuk window
      const win = global as any;
      if (win.frameworkReady) {
        win.frameworkReady();
      }
    }
    
    // Set isReady ke true segera
    setIsReady(true);
    
    return () => {};
  }, []);
  
  return { isReady };
}
