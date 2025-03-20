import React from 'react';
import { useRouter } from 'next/router';

const Layout: React.FC = () => {
  const router = useRouter();

  const navigateToSettings = () => {
    router.push('/setting');
  };

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
};

export default Layout; 