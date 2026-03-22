'use client';

import React, { useState, useEffect } from 'react';
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

export default function Home() {
  // View state
  const [view, setView] = useState<'presets' | 'icons' | 'generator'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  
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
      <div className="min-h-screen bg-slate-50 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600" />
            Мої Пресети
          </h1>
          <p className="text-slate-500 mt-2">Створюйте папки для зберігання SVG іконок</p>
        </header>

        {/* Create Preset Form */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <h3 className="text-lg font-semibold mb-4">Створити нову папку</h3>
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
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
          <div className="text-center py-12 text-slate-400">
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Немає папок. Створіть першу!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presets.map(preset => (
              <div 
                key={preset.id} 
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => openPreset(preset)}
              >
                <div className="flex items-start justify-between mb-4">
                  <Folder className="w-12 h-12 text-blue-500" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-slate-900">{preset.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(preset.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Icons Grid View
  if (view === 'icons' && selectedPreset) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('presets')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Назад
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Folder className="w-8 h-8 text-blue-600" />
                {selectedPreset.name}
              </h1>
              <p className="text-slate-500 mt-1">Іконки в цій папці</p>
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
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
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
                className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                  {renderSvg(icon.svg_code, 64, 64, icon.color, icon.stroke_width)}
                </div>
                <h4 className="font-medium text-slate-900 truncate">{icon.name}</h4>
                <p className="text-xs text-slate-500">{icon.width}x{icon.height}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => downloadSVG(icon.svg_code, icon.name, icon.width, icon.height, icon.color, icon.stroke_width)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteIcon(icon.id)}
                    className="flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm"
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
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('icons')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Назад до "{selectedPreset.name}"
            </button>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            AI Генератор
          </h1>
          <div className="w-32"></div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left: Prompt & Editor */}
            <div className="space-y-6">
              {/* Prompt Section */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" /> Опис іконки
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Наприклад: червоне серце зі стрілою, мінімалістичний стиль..."
                  className="w-full h-32 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 outline-none text-slate-700"
                />
                <button
                  onClick={generateSvg}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-purple-200"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Генерація...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Згенерувати SVG</>
                  )}
                </button>
              </section>

              {/* SVG Editor */}
              {generatedSvg && (
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-500" /> Редактор SVG
                    </h3>
                    <button
                      onClick={() => setShowEditor(!showEditor)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      {showEditor ? 'Сховати редактор' : 'Редагувати код'}
                    </button>
                  </div>
                  
                  {showEditor && (
                    <textarea
                      value={editedSvg}
                      onChange={(e) => setEditedSvg(e.target.value)}
                      className="w-full h-48 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-mono text-sm"
                    />
                  )}
                </section>
              )}
            </div>

            {/* Right: Preview & Settings */}
            <div className="space-y-6">
              {/* Preview */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Попередній перегляд</h3>
                  <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                    {width} x {height} px
                  </span>
                </div>
                
                <div className="flex items-center justify-center bg-slate-50 rounded-xl min-h-[250px] border border-dashed border-slate-300 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ 
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                  }}></div>
                  {generatedSvg ? (
                    <div className="transition-all duration-200">
                      {renderSvg(showEditor ? editedSvg : generatedSvg, width, height, color, strokeWidth)}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-center">
                      <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>SVG з'явиться тут</p>
                    </div>
                  )}
                </div>

                {/* Settings */}
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
              </section>

              {/* Save Section */}
              {generatedSvg && (
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Save className="w-5 h-5 text-green-500" /> Зберегти в "{selectedPreset.name}"
                  </h3>
                  <input
                    type="text"
                    placeholder="Назва іконки..."
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none"
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

  return null;
}
