import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Folder, Wand2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI SVG Generator",
  description: "Generate SVG icons with AI",
};

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-blue-600 transition-colors">
          <Wand2 className="w-6 h-6 text-purple-600" />
          AI SVG Generator
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
          >
            <Folder className="w-4 h-4" />
            Пресети
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900" style={{ color: '#0f172a' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
