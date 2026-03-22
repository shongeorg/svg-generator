'use client';

import { useEffect } from 'react';

export function TransitionSound() {
  useEffect(() => {
    const handleTransition = () => {
      const audio = new Audio('/transtion.mp3');
      audio.volume = 1;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    };

    document.addEventListener('next-view-transition-start', handleTransition);

    return () => {
      document.removeEventListener('next-view-transition-start', handleTransition);
    };
  }, []);

  return null;
}
