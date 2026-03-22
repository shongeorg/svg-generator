```javascript
import React, { useState, useEffect } from 'react';
import { 
  Pizza, 
  Coffee, 
  Cpu, 
  Download, 
  Settings, 
  Save, 
  Trash2, 
  Smartphone, 
  Laptop, 
  Utensils, 
  Croissant,
  Tv,
  Camera,
  Maximize2
} from 'lucide-react';

const App = () => {
  // Категорії та іконки
  const categories = {
    pizzeria: [
      { id: 'pizza', component: Pizza, name: 'Піца' },
      { id: 'utensils', component: Utensils, name: 'Прибори' },
      { id: 'croissant', component: Croissant, name: 'Випічка' }
    ],
    coffee: [
      { id: 'coffee', component: Coffee, name: 'Кава' },
      { id: 'croissant_alt', component: Croissant, name: 'Десерт' },
      { id: 'mug', component: Coffee, name: 'Горнятко' }
    ],
    electronics: [
      { id: 'cpu', component: Cpu, name: 'Процесор' },
      { id: 'smartphone', component: Smartphone, name: 'Смартфон' },
      { id: 'laptop', component: Laptop, name: 'Ноутбук' },
      { id: 'tv', component: Tv, name: 'Телевізор' },
      { id: 'camera', component: Camera, name: 'Камера' }
    ]
  };

  // Стан додатка
  const [activeCategory, setActiveCategory] = useState('pizzeria');
  const [selectedIcon, setSelectedIcon] = useState(categories.pizzeria[0]);
  const [width, setWidth] = useState(128);
  const [height, setHeight] = useState(128);
  const [color, setColor] = useState('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [presets, setPresets] = useState([]);

  // Завантаження пресетів з localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('icon_presets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  // Збереження пресету
  const savePreset = () => {
    const newPreset = {
      id: Date.now(),
      width,
      height,
      color,
      strokeWidth,
      name: `Пресет ${presets.length + 1} (${width}x${height})`
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('icon_presets', JSON.stringify(updatedPresets));
  };

  const deletePreset = (id) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem('icon_presets', JSON.stringify(updatedPresets));
  };

  const applyPreset = (preset) => {
    setWidth(preset.width || preset.size || 128);
    setHeight(preset.height || preset.size || 128);
    setColor(preset.color);
    setStrokeWidth(preset.strokeWidth);
  };

  // Функція завантаження SVG
  const downloadSVG = () => {
    const svgElement = document.getElementById('preview-svg');
    if (!svgElement) return;

    // Створюємо копію для експорту з фіксованими розмірами
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${selectedIcon.id}_${width}x${height}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Ліва панель: Категорії */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-lg z-10">
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Категорії
          </h2>
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveCategory('pizzeria')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeCategory === 'pizzeria' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100'}`}
            >
              <Pizza className="w-5 h-5" /> Піцерія
            </button>
            <button 
              onClick={() => setActiveCategory('coffee')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeCategory === 'coffee' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100'}`}
            >
              <Coffee className="w-5 h-5" /> Кава
            </button>
            <button 
              onClick={() => setActiveCategory('electronics')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeCategory === 'electronics' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100'}`}
            >
              <Cpu className="w-5 h-5" /> Електроніка
            </button>
          </nav>
        </div>

        <div className="mt-auto">
          <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-4">Ваші пресети</h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {presets.length === 0 && <p className="text-xs text-slate-400 italic">Немає збережених пресетів</p>}
            {presets.map(p => (
              <div key={p.id} className="group flex items-center justify-between bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition-colors">
                <button 
                  onClick={() => applyPreset(p)}
                  className="text-xs font-medium truncate flex-1 text-left"
                >
                  {p.name}
                </button>
                <button onClick={() => deletePreset(p.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity p-1">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={savePreset}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 text-white p-3 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium shadow-md"
          >
            <Save className="w-4 h-4" /> Зберегти налаштування
          </button>
        </div>
      </aside>

      {/* Основна область */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Генератор SVG Іконок</h1>
          <p className="text-slate-500 mt-1">Налаштовуйте розміри, кольори та завантажуйте результат</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Вибір іконки */}
          <section className="xl:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-blue-500" /> Оберіть іконку
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {categories[activeCategory].map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedIcon.id === icon.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                >
                  <icon.component className="w-8 h-8 mb-2" strokeWidth={1.5} />
                  <span className="text-[10px] uppercase font-bold tracking-tight text-slate-500">{icon.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Прев'ю та Налаштування */}
          <section className="xl:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Попередній перегляд & Конфігурація</h3>
              <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                {width} x {height} px
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl w-full min-h-[300px] mb-8 border border-dashed border-slate-300 relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', size: '20px 20px' }}></div>
               <selectedIcon.component 
                  id="preview-svg"
                  width={width} 
                  height={height} 
                  color={color} 
                  strokeWidth={strokeWidth}
                  className="transition-all duration-200 drop-shadow-sm"
               />
            </div>

            <div className="w-full space-y-8">
              {/* Налаштування розмірів */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Ширина</label>
                    <span className="text-sm font-mono text-blue-600">{width}px</span>
                  </div>
                  <input 
                    type="range" min="16" max="512" value={width} 
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Висота</label>
                    <span className="text-sm font-mono text-blue-600">{height}px</span>
                  </div>
                  <input 
                    type="range" min="16" max="512" value={height} 
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Колір та Товщина */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide block">Колір іконки</label>
                  <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      <input 
                        type="color" value={color} 
                        onChange={(e) => setColor(e.target.value)}
                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                      />
                    </div>
                    <input 
                      type="text" value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Товщина ліній</label>
                    <span className="text-sm font-mono text-blue-600">{strokeWidth}</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="4" step="0.5" value={strokeWidth} 
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                  />
                </div>
              </div>

              <button 
                onClick={downloadSVG}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
              >
                <Download className="w-6 h-6" /> СКАЧАТИ SVG ({width}x{height})
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;

```