'use client';

import { Link } from "next-view-transitions";
import { Folder, Moon, Sun, Wand2 } from "lucide-react";

function ThemeToggle() {
  return (
    <button
      onClick={() => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
          html.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      }}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 block dark:hidden text-slate-600" />
      <Moon className="w-5 h-5 hidden dark:block text-slate-300" />
    </button>
  );
}

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          AI SVG Generator
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Folder className="w-4 h-4" />
            Пресети
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
