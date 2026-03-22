import { notFound } from 'next/navigation';
import { getPresetById, getIconsByPreset } from '@/lib/db';
import { Folder, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ShareButton from '@/app/components/ShareButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PresetPage({ params }: PageProps) {
  const { id } = await params;
  const presetId = parseInt(id);

  if (isNaN(presetId)) {
    notFound();
  }

  const preset = await getPresetById(presetId);

  if (!preset) {
    notFound();
  }

  const icons = await getIconsByPreset(presetId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <Link href="/" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Home className="w-4 h-4" />
          Головна
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">{preset.name}</span>
      </nav>

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {preset.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {icons.length} {icons.length === 1 ? 'іконка' : icons.length < 5 ? 'іконки' : 'іконок'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton title={preset.name} text={`Check out ${preset.name} preset`} />
          <Link
            href={`/?view=generator&preset=${presetId}`}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Додати іконку
          </Link>
        </div>
      </header>

      {icons.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-lg mb-4">В цій папці ще немає іконок</p>
          <Link
            href={`/?preset=${presetId}`}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Згенерувати першу іконку
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {icons.map(icon => (
            <Link
              key={icon.id}
              href={`/icons/${icon.id}`}
              className="group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div
                className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700"
                dangerouslySetInnerHTML={{
                  __html: icon.svg_code.replace(/<svg/, `<svg width="64" height="64"`).replace(/currentColor/g, icon.color)
                }}
              />
              <h4 className="font-medium text-slate-900 dark:text-white truncate">{icon.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{icon.width}x{icon.height}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
