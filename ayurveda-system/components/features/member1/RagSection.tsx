import Link from 'next/link';

export default function AncientScriptDigitization() {
  return (
    <Link href="/research/member1" className="block outline-none">
      <section 
        tabIndex={0}
        className="group relative cursor-pointer rounded-xl border border-zinc-800/50 bg-[#0a101f] p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-amber-500/30 hover:bg-[#0d1526] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-1 focus:ring-amber-500/50 h-full"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:border-amber-500/50 group-hover:text-amber-500 transition-all duration-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2V10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100 group-hover:text-amber-500 transition-colors duration-500">
              Ancient Script Digitization & Interpretation
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300">
            Specialized AI framework for digitizing ancient Ola leaf manuscripts and providing semantic retrieval of indigenous medical knowledge.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">OLA LEAF MANUSCRIPT OCR</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">SEMANTIC KNOWLEDGE RETRIEVAL</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
            LAUNCH RESEARCH MODULE
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </section>
    </Link>
  );
}
