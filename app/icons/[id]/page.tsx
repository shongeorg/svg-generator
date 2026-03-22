'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Download, 
  Edit3, 
  Folder,
  Home,
  Trash2,
  Save
} from 'lucide-react';
import ShareButton from '@/app/components/ShareButton';

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

interface Preset {
  id: number;
  name: string;
}

export default function IconPage() {
  const params = useParams();
  const iconId = parseInt(params.id as string);
  
  const [icon, setIcon] = useState<Icon | null>(null);
  const [preset, setPreset] = useState<Preset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSvg, setEditedSvg] = useState('');
  const [editedName, setEditedName] = useState('');
  const [width, setWidth] = useState(128);
  const [height, setHeight] = useState(128);
  const [color, setColor] = useState('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    if (isNaN(iconId)) {
      notFound();
      return;
    }
    loadIcon();
  }, [iconId]);

  const loadIcon = async () => {
    try {
      const response = await fetch(`/api/icons/${iconId}`);
      if (!response.ok) {
        notFound();
        return;
      }
      const data = await response.json();
      setIcon(data.icon);
      setPreset(data.preset);
      setEditedSvg(data.icon.svg_code);
      setEditedName(data.icon.name);
      setWidth(data.icon.width);
      setHeight(data.icon.height);
      setColor(data.icon.color);
      setStrokeWidth(data.icon.stroke_width);
    } catch (error) {
      console.error('Error loading icon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateIcon = async () => {
    try {
      const response = await fetch('/api/icons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: iconId,
          updates: {
            name: editedName.trim(),
            svg_code: editedSvg,
            width,
            height,
            color,
            stroke_width: strokeWidth
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIcon(data.icon);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating icon:', error);
    }
  };

  const deleteIcon = async () => {
    if (!confirm('Ви впевнені що хочете видалити цю іконку?')) return;
    
    try {
      await fetch(`/api/icons?id=${iconId}`, { method: 'DELETE' });
      window.location.href = preset ? `/presets/${preset.id}` : '/';
    } catch (error) {
      console.error('Error deleting icon:', error);
    }
  };

  const downloadSVG = () => {
    if (!icon) return;
    
    let finalSvg = isEditing ? editedSvg : icon.svg_code;
    finalSvg = finalSvg.replace(/<svg/, `<svg width="${width}" height="${height}"`);
    finalSvg = finalSvg.replace(/currentColor/g, color);
    if (finalSvg.includes('stroke-width')) {
      finalSvg = finalSvg.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    }

    const svgBlob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${icon.name}_${width}x${height}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!icon || !preset) {
    notFound();
    return null;
  }

  const renderSvg = (svgCode: string) => {
    let finalSvg = svgCode;
    finalSvg = finalSvg.replace(/<svg/, `<svg width="${width}" height="${height}"`);
    finalSvg = finalSvg.replace(/currentColor/g, color);
    if (finalSvg.includes('stroke-width')) {
      finalSvg = finalSvg.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    }
    return <div dangerouslySetInnerHTML={{ __html: finalSvg }} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
          <Home className="w-4 h-4" />
          Головна
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link 
          href={`/presets/${preset.id}`}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          <Folder className="w-4 h-4" />
          {preset.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium">{icon.name}</span>
      </nav>

      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Скасувати' : 'Редагувати'}
          </button>
          {icon && <ShareButton title={icon.name} text={`Check out this ${icon.name} icon`} />}
          <button
            onClick={deleteIcon}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{icon.name}</h1>
            <p className="text-slate-500 mb-6">
              в папці <Link href={`/presets/${preset.id}`} className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"><Folder className="w-4 h-4"/> {preset.name}</Link>
            </p>
            
            <div className="flex items-center justify-center bg-slate-50 rounded-xl min-h-[300px] border border-dashed border-slate-300 relative overflow-hidden mb-6">
              <div className="absolute inset-0 opacity-[0.03]" style={{ 
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }}></div>
              <div className="transition-all duration-200">
                {renderSvg(isEditing ? editedSvg : icon.svg_code)}
              </div>
            </div>

            <button
              onClick={downloadSVG}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              <Download className="w-5 h-5" /> Скачати SVG ({width}x{height})
            </button>
          </div>

          {/* Settings & Editor */}
          <div className="space-y-6">
            {isEditing && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#0f172a' }}>Назва</h3>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none mb-4"
                  style={{ color: '#0f172a' }}
                />
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#0f172a' }}>SVG Код</h3>
                <textarea
                  value={editedSvg}
                  onChange={(e) => setEditedSvg(e.target.value)}
                  className="w-full h-48 p-4 border border-slate-200 bg-white rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  style={{ color: '#334155' }}
                />
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#0f172a' }}>Налаштування</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 uppercase">Ширина</label>
                    <input 
                      type="range" min="16" max="512" value={width} 
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                    />
                    <span className="text-sm font-mono text-blue-600">{width}px</span>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 uppercase">Висота</label>
                    <input 
                      type="range" min="16" max="512" value={height} 
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                    />
                    <span className="text-sm font-mono text-blue-600">{height}px</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 uppercase block mb-2">Колір</label>
                    <div className="flex gap-2">
                      <div className="relative w-10 h-10 rounded-lg border border-slate-200 overflow-hidden">
                        <input 
                          type="color" value={color} 
                          onChange={(e) => setColor(e.target.value)}
                          className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                        />
                      </div>
                      <input 
                        type="text" value={color} 
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-1 text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                        style={{ color: '#0f172a' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 uppercase">Товщина</label>
                    <input 
                      type="range" min="0.5" max="4" step="0.5" value={strokeWidth} 
                      onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                    />
                    <span className="text-sm font-mono text-blue-600">{strokeWidth}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={updateIcon}
                  disabled={!editedName.trim()}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
                >
                  <Save className="w-5 h-5" /> Зберегти зміни
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
