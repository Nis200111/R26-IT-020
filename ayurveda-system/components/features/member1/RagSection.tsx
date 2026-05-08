export default function Member1Section() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">RAG Service Interface</h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Member 1: Integrate your AI Retrieval-Augmented Generation UI here.
        </p>
        <div className="mt-4 rounded-lg bg-zinc-50 p-6 dark:bg-black/40">
          <p className="text-sm italic text-zinc-500">Add your AI chat or search interface components...</p>
        </div>
      </div>
    </section>
  );
}
