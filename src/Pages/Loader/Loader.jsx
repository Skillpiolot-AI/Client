import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';

const LoadingSpinner = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prevOpacity) => (prevOpacity === 1 ? 0 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fadeAnimation = keyframes`
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `;

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="w-16 h-16 bg-contain bg-no-repeat bg-center animate-[${fadeAnimation} 1s ease-in-out infinite]"
        style={{ backgroundImage: `url('/zap.png')`, opacity }}
      />
    </div>
  );
};

export default LoadingSpinner;