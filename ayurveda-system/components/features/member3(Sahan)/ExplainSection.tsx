export default function ExplainSection() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Explainability Interface</h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Member 3: Integrate your AI Decision Explainability and Logic Visualization UI here.
        </p>
        <div className="mt-4 rounded-lg bg-zinc-50 p-6 dark:bg-black/40">
          <p className="text-sm italic text-zinc-500">Add your explanation charts or heatmaps...</p>
        </div>
      </div>
    </section>
  );
}
