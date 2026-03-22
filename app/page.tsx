'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'next-view-transitions';
import { useSearchParams } from 'next/navigation';
import { 
  Download, 
  Folder, 
  FolderPlus,
  Trash2, 
  Sparkles,
  Loader2,
  Wand2,
  Save,
  Edit3,
  X,
  ChevronLeft,
  ImageIcon,
  Code
} from 'lucide-react';

// Loading fallback for Suspense
function HomeLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
    </div>
  );
}

interface Preset {
  id: number;
  name: string;
  created_at: Date;
}

interface Icon {
  id: number;
  preset_id: number;
  name: string;
  svg_code: string;
  width: number;
  height: number;
  color: string;
  stroke_width: number;
}

// Pre-made icon library
const ICON_LIBRARY = [
  { name: 'heart', label: '❤️ Heart', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  { name: 'star', label: '⭐ Star', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { name: 'home', label: '🏠 Home', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { name: 'user', label: '👤 User', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { name: 'search', label: '🔍 Search', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
  { name: 'settings', label: '⚙️ Settings', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { name: 'mail', label: '✉️ Mail', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  { name: 'phone', label: '📱 Phone', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
  { name: 'check', label: '✓ Check', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' },
  { name: 'close', label: '✕ Close', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' },
  { name: 'menu', label: '☰ Menu', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' },
  { name: 'arrow-right', label: '→ Arrow Right', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' },
  { name: 'arrow-left', label: '← Arrow Left', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' },
  { name: 'bell', label: '🔔 Bell', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { name: 'calendar', label: '📅 Calendar', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { name: 'camera', label: '📷 Camera', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' },
  { name: 'cloud', label: '☁️ Cloud', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>' },
  { name: 'coffee', label: '☕ Coffee', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
  { name: 'download', label: '⬇️ Download', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' },
  { name: 'edit', label: '✏️ Edit', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' },
  { name: 'file', label: '📄 File', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
  { name: 'folder', label: '📁 Folder', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
  { name: 'globe', label: '🌐 Globe', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
  { name: 'image', label: '🖼️ Image', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { name: 'link', label: '🔗 Link', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
  { name: 'lock', label: '🔒 Lock', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  { name: 'map-pin', label: '📍 Map Pin', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { name: 'moon', label: '🌙 Moon', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
  { name: 'music', label: '🎵 Music', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { name: 'play', label: '▶️ Play', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>' },
  { name: 'plus', label: '➕ Plus', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
  { name: 'refresh', label: '🔄 Refresh', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' },
  { name: 'share', label: '↗️ Share', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>' },
  { name: 'shield', label: '🛡️ Shield', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { name: 'shopping-cart', label: '🛒 Shopping Cart', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
  { name: 'sun', label: '☀️ Sun', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' },
  { name: 'tag', label: '🏷️ Tag', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  { name: 'trash', label: '🗑️ Trash', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' },
  { name: 'upload', label: '⬆️ Upload', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' },
  { name: 'video', label: '🎬 Video', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' },
  { name: 'wifi', label: '📶 WiFi', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' },
  { name: 'zoom-in', label: '🔍+ Zoom In', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' },
  { name: 'zoom-out', label: '🔍- Zoom Out', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' }
];

// Main component that uses useSearchParams
function HomeContent() {
  const searchParams = useSearchParams();
  
  // View state
  const [view, setView] = useState<'presets' | 'icons' | 'generator' | 'editor'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);
  
  // Data state
  const [presets, setPresets] = useState<Preset[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generator state
  const [prompt, setPrompt] = useState('');
  const [generatedSvg, setGeneratedSvg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [width, setWidth] = useState(128);
  const [height, setHeight] = useState(128);
  const [color, setColor] = useState('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [iconName, setIconName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editedSvg, setEditedSvg] = useState('');

  // Handle query params - check when presets are loaded
  useEffect(() => {
    if (isLoading || presets.length === 0) return;
    
    const viewParam = searchParams?.get('view');
    const presetParam = searchParams?.get('preset');
    
    if (viewParam === 'generator' && presetParam) {
      const presetId = parseInt(presetParam);
      const foundPreset = presets.find(p => p.id === presetId);
      if (foundPreset) {
        setSelectedPreset(foundPreset);
        setView('generator');
      }
    }
  }, [isLoading, presets, searchParams]);

  // Load presets on mount
  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const response = await fetch('/api/presets');
      const data = await response.json();
      if (data.presets) {
        setPresets(data.presets);
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIcons = async (presetId: number) => {
    try {
      const response = await fetch(`/api/icons?presetId=${presetId}`);
      const data = await response.json();
      if (data.icons) {
        setIcons(data.icons);
      }
    } catch (error) {
      console.error('Error loading icons:', error);
    }
  };

  const createPreset = async (name: string) => {
    try {
      const response = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.preset) {
        setPresets([data.preset, ...presets]);
      }
    } catch (error) {
      console.error('Error creating preset:', error);
    }
  };

  const deletePreset = async (id: number) => {
    try {
      await fetch(`/api/presets?id=${id}`, { method: 'DELETE' });
      setPresets(presets.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  const generateSvg = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });
      
      const data = await response.json();
      if (data.svg) {
        setGeneratedSvg(data.svg);
        setEditedSvg(data.svg);
      }
    } catch (error) {
      console.error('Error generating SVG:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveIcon = async () => {
    if (!selectedPreset || !generatedSvg || !iconName.trim()) return;
    
    const svgToSave = showEditor ? editedSvg : generatedSvg;
    
    try {
      const response = await fetch('/api/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetId: selectedPreset.id,
          name: iconName.trim(),
          svgCode: svgToSave,
          width,
          height,
          color,
          strokeWidth
        })
      });
      
      const data = await response.json();
      if (data.icon) {
        setIcons([data.icon, ...icons]);
        setView('icons');
        setGeneratedSvg('');
        setEditedSvg('');
        setPrompt('');
        setIconName('');
        // Reload icons from DB to ensure sync
        if (selectedPreset) {
          loadIcons(selectedPreset.id);
        }
      }
    } catch (error) {
      console.error('Error saving icon:', error);
    }
  };

  const deleteIcon = async (id: number) => {
    try {
      await fetch(`/api/icons?id=${id}`, { method: 'DELETE' });
      setIcons(icons.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting icon:', error);
    }
  };

  const openEditIcon = (icon: Icon) => {
    setEditingIcon(icon);
    setIconName(icon.name);
    setEditedSvg(icon.svg_code);
    setWidth(icon.width);
    setHeight(icon.height);
    setColor(icon.color);
    setStrokeWidth(icon.stroke_width);
    setView('editor');
  };

  const updateIcon = async () => {
    if (!editingIcon) return;
    
    try {
      const response = await fetch('/api/icons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingIcon.id,
          updates: {
            name: iconName.trim(),
            svg_code: editedSvg,
            width,
            height,
            color,
            stroke_width: strokeWidth
          }
        })
      });
      
      const data = await response.json();
      if (data.icon) {
        setIcons(icons.map(i => i.id === editingIcon.id ? data.icon : i));
        setView('icons');
        setEditingIcon(null);
        setIconName('');
        setEditedSvg('');
      }
    } catch (error) {
      console.error('Error updating icon:', error);
    }
  };

  const downloadSVG = (svgCode: string, name: string, w: number, h: number, c: string, sw: number) => {
    let finalSvg = svgCode;
    
    // Add width and height
    finalSvg = finalSvg.replace(/<svg/, `<svg width="${w}" height="${h}"`);
    
    // Replace currentColor with selected color
    finalSvg = finalSvg.replace(/currentColor/g, c);
    
    // Update stroke-width
    if (finalSvg.includes('stroke-width')) {
      finalSvg = finalSvg.replace(/stroke-width="[^"]*"/g, `stroke-width="${sw}"`);
    }

    const svgBlob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${name}_${w}x${h}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const renderSvg = (svgCode: string, w: number, h: number, c: string, sw: number) => {
    let finalSvg = svgCode;
    finalSvg = finalSvg.replace(/<svg/, `<svg width="${w}" height="${h}"`);
    finalSvg = finalSvg.replace(/currentColor/g, c);
    if (finalSvg.includes('stroke-width')) {
      finalSvg = finalSvg.replace(/stroke-width="[^"]*"/g, `stroke-width="${sw}"`);
    }
    return <div dangerouslySetInnerHTML={{ __html: finalSvg }} />;
  };

  const openPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    loadIcons(preset.id);
    setView('icons');
  };

  const openGenerator = (preset: Preset) => {
    setSelectedPreset(preset);
    setView('generator');
  };

  // Presets List View
  if (view === 'presets') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Мої Пресети
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Створюйте папки для зберігання SVG іконок</p>
        </header>

        {/* Create Preset Form */}
        <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Створити нову папку</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('presetName') as HTMLInputElement;
              if (input.value.trim()) {
                createPreset(input.value.trim());
                input.value = '';
              }
            }}
            className="flex gap-3"
          >
            <input
              name="presetName"
              type="text"
              placeholder="Назва папки (наприклад: Кафе)..."
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <FolderPlus className="w-5 h-5" /> Створити
            </button>
          </form>
        </div>

        {/* Presets Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : presets.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Немає папок. Створіть першу!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presets.map(preset => (
              <Link
                key={preset.id}
                href={`/presets/${preset.id}`}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Folder className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{preset.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {new Date(preset.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Icons Grid View
  if (view === 'icons' && selectedPreset) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('presets')}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Назад
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                {selectedPreset.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Іконки в цій папці</p>
            </div>
          </div>
          <button
            onClick={() => openGenerator(selectedPreset)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            <Wand2 className="w-5 h-5" /> Додати іконку
          </button>
        </header>

        {icons.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">В цій папці ще немає іконок</p>
            <button
              onClick={() => openGenerator(selectedPreset)}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium mx-auto"
            >
              <Sparkles className="w-5 h-5" /> Згенерувати першу іконку
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {icons.map(icon => (
              <div
                key={icon.id}
                className="group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                  {renderSvg(icon.svg_code, 64, 64, icon.color, icon.stroke_width)}
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white truncate">{icon.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{icon.width}x{icon.height}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditIcon(icon)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadSVG(icon.svg_code, icon.name, icon.width, icon.height, icon.color, icon.stroke_width)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteIcon(icon.id)}
                    className="flex items-center justify-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Generator View
  if (view === 'generator' && selectedPreset) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('icons')}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Назад до "{selectedPreset.name}"
            </button>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            AI Генератор
          </h1>
          <div className="w-32"></div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left: Prompt & Editor */}
            <div className="space-y-6">
              {/* Prompt Section */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-purple-500" /> Опис іконки
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Наприклад: червоне серце зі стрілою, мінімалістичний стиль..."
                  className="w-full h-32 p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                />
                <button
                  onClick={generateSvg}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Генерація...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Згенерувати SVG</>
                  )}
                </button>
              </section>

              {/* Pre-made Icon Library */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <ImageIcon className="w-5 h-5 text-purple-500" /> Готова іконка
                </h3>
                <select
                  onChange={(e) => {
                    const selected = ICON_LIBRARY.find(icon => icon.name === e.target.value);
                    if (selected) {
                      setEditedSvg(selected.svg);
                      setIconName(selected.name);
                      setGeneratedSvg(selected.svg);
                    }
                  }}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Оберіть готову іконку...</option>
                  {ICON_LIBRARY.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Або введіть опис і згенеруйте нову іконку
                </p>
              </section>

              {/* SVG Editor */}
              {generatedSvg && (
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Code className="w-5 h-5 text-blue-500" /> Редактор SVG
                    </h3>
                    <button
                      onClick={() => setShowEditor(!showEditor)}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      {showEditor ? 'Сховати редактор' : 'Редагувати код'}
                    </button>
                  </div>

                  {showEditor && (
                    <textarea
                      value={editedSvg}
                      onChange={(e) => setEditedSvg(e.target.value)}
                      className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-mono text-sm bg-white dark:bg-slate-800"
                    />
                  )}
                </section>
              )}
            </div>

            {/* Right: Preview & Settings */}
            <div className="space-y-6">
              {/* Preview */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Попередній перегляд</h3>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    {width} x {height} px
                  </span>
                </div>

                <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl min-h-[250px] border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                  {generatedSvg ? (
                    <div className="transition-all duration-200">
                      {renderSvg(showEditor ? editedSvg : generatedSvg, width, height, color, strokeWidth)}
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>SVG з'явиться тут</p>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Ширина</label>
                      <input
                        type="range" min="16" max="512" value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{width}px</span>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Висота</label>
                      <input
                        type="range" min="16" max="512" value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{height}px</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase block mb-2">Колір</label>
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <input
                            type="color" value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                          />
                        </div>
                        <input
                          type="text" value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1 text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Товщина</label>
                      <input
                        type="range" min="0.5" max="4" step="0.5" value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{strokeWidth}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Save Section */}
              {generatedSvg && (
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Save className="w-5 h-5 text-green-500" /> Зберегти в "{selectedPreset.name}"
                  </h3>
                  <input
                    type="text"
                    placeholder="Назва іконки..."
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={saveIcon}
                      disabled={!iconName.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      <Save className="w-5 h-5" /> Зберегти іконку
                    </button>
                    <button
                      onClick={() => downloadSVG(showEditor ? editedSvg : generatedSvg, iconName || 'icon', width, height, color, strokeWidth)}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Icon Editor View
  if (view === 'editor' && editingIcon && selectedPreset) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setView('icons');
                setEditingIcon(null);
                setIconName('');
                setEditedSvg('');
              }}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Назад до "{selectedPreset.name}"
            </button>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-green-600" />
            Редагування іконки
          </h1>
          <div className="w-32"></div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left: Name & SVG Editor */}
            <div className="space-y-6">
              {/* Name Input */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Назва іконки</h3>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </section>

              {/* Icon Library Select */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <ImageIcon className="w-5 h-5 text-purple-500" /> Готова іконка
                </h3>
                <select
                  onChange={(e) => {
                    const selected = ICON_LIBRARY.find(icon => icon.name === e.target.value);
                    if (selected) {
                      setEditedSvg(selected.svg);
                      setIconName(selected.name);
                    }
                  }}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Оберіть готову іконку...</option>
                  {ICON_LIBRARY.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Або редагуйте SVG код вручну нижче
                </p>
              </section>

              {/* SVG Editor */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Code className="w-5 h-5 text-blue-500" /> Редактор SVG
                </h3>
                <textarea
                  value={editedSvg}
                  onChange={(e) => setEditedSvg(e.target.value)}
                  className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-mono text-sm bg-white dark:bg-slate-800"
                />
              </section>
            </div>

            {/* Right: Preview & Settings */}
            <div className="space-y-6">
              {/* Preview */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Попередній перегляд</h3>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                    {width} x {height} px
                  </span>
                </div>

                <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl min-h-[250px] border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                  <div className="transition-all duration-200">
                    {renderSvg(editedSvg, width, height, color, strokeWidth)}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Ширина</label>
                      <input
                        type="range" min="16" max="512" value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{width}px</span>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Висота</label>
                      <input
                        type="range" min="16" max="512" value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{height}px</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase block mb-2">Колір</label>
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <input
                            type="color" value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                          />
                        </div>
                        <input
                          type="text" value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1 text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Товщина</label>
                      <input
                        type="range" min="0.5" max="4" step="0.5" value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                      />
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{strokeWidth}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Save Changes */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Save className="w-5 h-5 text-green-500" /> Зберегти зміни
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={updateIcon}
                    disabled={!iconName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Save className="w-5 h-5" /> Оновити іконку
                  </button>
                  <button
                    onClick={() => downloadSVG(editedSvg, iconName || 'icon', width, height, color, strokeWidth)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Export wrapped in Suspense
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
