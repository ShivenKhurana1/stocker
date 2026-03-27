"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="glass-panel max-w-6xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl relative bg-slate-900/95 md:bg-black/60 shadow-2xl backdrop-blur-3xl">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-white tracking-tight">Stocker</span>
        </Link>
        <div className="flex gap-2">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/' 
                ? 'bg-white/10 text-white shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Neural Lab
          </Link>
          <Link 
            href="/docs" 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/docs' 
                ? 'bg-white/10 text-white shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Docs
          </Link>
        </div>
      </div>
    </nav>
  );
}
