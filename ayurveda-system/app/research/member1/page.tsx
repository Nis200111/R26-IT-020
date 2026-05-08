'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Upload, FileText, Languages, Search, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ScriptDigitizationPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const simulateProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasResult(true);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#0a101f] text-white">
      <Navbar />
      
      {/* Full-Screen Cinematic Header Section (Text on Left, Image on Right) */}
      <section className="relative min-h-screen flex items-center overflow-hidden border-b border-zinc-800/50">
        <div 
          className="absolute inset-0 z-0 bg-right bg-no-repeat bg-cover" 
          style={{ 
            backgroundImage: 'url("/research-full-bg.png")',
            backgroundPosition: 'right center'
          }}
        ></div>
        {/* Cinematic Gradient Overlays - Faded for Left-side text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a101f] via-[#0a101f]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a101f] via-transparent to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl text-left">
            <div className="mb-6 flex items-center gap-3 justify-start animate-fade-in-down">
              <div className="h-[1px] w-12 bg-amber-500/50"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500/80">The Digital Heritage Project</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-white leading-[1.1] animate-fade-in-down animation-delay-200">
              Ancient <span className="italic text-amber-500 font-light">Script</span> <br />
              Digitization
            </h1>
            <p className="mt-8 text-lg text-zinc-400 leading-relaxed max-w-lg font-light italic animate-fade-in-down animation-delay-400">
              "Preserving the wisdom of centuries. Our AI framework translates ancient Ola leaf manuscripts into modern knowledge systems."
            </p>
            <div className="mt-12 flex items-center gap-6 justify-start animate-fade-in-down animation-delay-400">
              <button className="rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3 text-xs font-bold uppercase tracking-widest text-amber-500 transition-all hover:bg-amber-500 hover:text-black">
                Explore Archives
              </button>
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors">
                What's New <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workbench Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Left Side: Upload & Input */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-[#0d1526]/80 backdrop-blur-md p-6 shadow-2xl transition-all hover:border-amber-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <Upload className="text-amber-500 h-5 w-5" /> 1. Upload Manuscript
              </h3>
              
              <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/30 p-8 transition-all hover:border-amber-500/50 hover:bg-zinc-800/50">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-amber-500/10 transition-colors">
                    <Upload className="h-8 w-8 text-zinc-500 group-hover:text-amber-500" />
                  </div>
                  <p className="text-lg font-medium text-zinc-300">Click or drag image to upload</p>
                  <p className="mt-2 text-sm text-zinc-500">Supports JPG, PNG (Max 10MB)</p>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <button 
                onClick={simulateProcess}
                disabled={isProcessing}
                className="mt-8 w-full rounded-xl bg-amber-500 py-4 font-bold text-black transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing with AI Models...' : 'Start Digitization Process'}
                {!isProcessing && <ChevronRight className="h-5 w-5" />}
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Model Pipeline Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium">Model 01: Script Reader (OCR)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">READY</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium">Model 02: Language Converter</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="space-y-6">
            <div className={`rounded-2xl border border-zinc-800 bg-[#0d1526]/80 backdrop-blur-md p-6 shadow-2xl transition-all duration-700 ${hasResult ? 'opacity-100' : 'opacity-50'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                <FileText className="text-emerald-500 h-5 w-5" /> 2. Interpretation Results
              </h3>

              {!hasResult && !isProcessing && (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-600 border border-zinc-800/50 rounded-xl">
                  <Search className="h-12 w-12 mb-4 opacity-20" />
                  <p>Results will appear here after processing</p>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-6">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
                </div>
              )}

              {hasResult && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-amber-500/50 mb-3 block">Detected Script (Badi Akuru)</label>
                    <div className="p-4 rounded-lg bg-black/40 border border-zinc-800 font-serif text-lg leading-relaxed text-zinc-300 italic">
                      [සූදානම් කළ අකුරු මෙතැන දිස්වේ...]
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-emerald-500/50 mb-3 block flex items-center gap-2">
                        <Languages className="h-3 w-3" /> Modern Sinhala
                      </label>
                      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-zinc-200">
                        මෙය පුරාණ හෙළ වෙදකමට අදාළව ලියවුණු ඖෂධ වට්ටෝරුවක පිටපතකි. මෙහි අන්තර්ගත වන්නේ ශරීර ශක්තිය වර්ධනය කරන ඖෂධීය පානයක් පිළියෙල කරන ආකාරයයි.
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-blue-500/50 mb-3 block flex items-center gap-2">
                        <Languages className="h-3 w-3" /> English Translation
                      </label>
                      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-zinc-200">
                        This is a transcription of an ancient medicinal formula related to traditional Hela medicine. It describes the preparation of a tonic intended to increase physical vitality.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {hasResult && (
              <div className="flex gap-4">
                <button className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-semibold hover:bg-zinc-800 transition-all">
                  Download JSON
                </button>
                <button className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-semibold hover:bg-zinc-800 transition-all">
                  Print Report
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
