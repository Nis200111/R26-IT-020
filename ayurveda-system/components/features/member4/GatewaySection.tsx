export default function GatewaySection() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">System Gateway Interface</h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Member 4: Integrate your API Management, Logs, or System Health Monitoring UI here.
        </p>
        <div className="mt-4 rounded-lg bg-zinc-50 p-6 dark:bg-black/40">
          <p className="text-sm italic text-zinc-500">Add your system monitoring or gateway status dashboard...</p>
        </div>
      </div>
    </section>
  );
}
