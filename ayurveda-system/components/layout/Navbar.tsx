/**
 * Navbar Component
 * 
 * Provides global navigation for the application with a high-performance 
 * glassmorphism effect (backdrop-blur) and mobile-responsive menu logic.
 * 
 * Features:
 * - Responsive design with mobile-first menu overlay.
 * - Dynamic backdrop filtering for modern aesthetics.
 * - Optimized link transitions for enhanced UX.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Database, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-md dark:bg-[#0a101f]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Leaf className="h-6 w-6 text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
                <Database className="h-3 w-3 text-amber-500 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Bio-Heritage <span className="text-emerald-500">AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-amber-500 transition-colors">Home</Link>
              <Link href="/about" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-amber-500 transition-colors">About</Link>
              <Link href="/research" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-amber-500 transition-colors">Research</Link>
              <Link href="/contact" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-amber-500 transition-colors">Contact</Link>
            </div>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none dark:hover:bg-zinc-800"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-white dark:bg-black">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">Home</Link>
            <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">About</Link>
            <Link href="/research" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">Research</Link>
            <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
