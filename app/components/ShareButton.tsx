'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = async () => {
    const url = window.location.href;
    
    // Use native Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text || `Check out ${title}`,
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button
      onClick={shareUrl}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
        copied 
          ? 'bg-green-100 text-green-700 border border-green-300' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Скопійовано!' : 'Поділитися'}
    </button>
  );
}
