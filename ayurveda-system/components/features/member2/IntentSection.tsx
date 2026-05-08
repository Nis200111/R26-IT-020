export default function IntentSection() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Intent Classifier Interface</h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Member 2: Integrate your Natural Language Understanding and Intent Classification UI here.
        </p>
        <div className="mt-4 rounded-lg bg-zinc-50 p-6 dark:bg-black/40">
          <p className="text-sm italic text-zinc-500">Add your intent analysis or classification visualizers...</p>
        </div>
      </div>
    </section>
  );
}
