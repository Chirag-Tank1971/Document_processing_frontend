import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-8 shadow-2xl shadow-slate-300/30 md:p-12">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-600">AI Document Ops</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Modern async document processing with live status, retries, and exports
        </h2>
        <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
          Upload files, process them in the background, monitor real-time progress, and finalize structured outputs
          from one clean workflow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            href="/upload"
          >
            Start Upload
          </Link>
          <Link
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            href="/dashboard"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <p className="text-sm font-semibold text-slate-900">Async Worker Pipeline</p>
          <p className="mt-2 text-sm text-slate-600">
            Heavy processing runs in workers, keeping API response times fast and reliable.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <p className="text-sm font-semibold text-slate-900">Live Progress Tracking</p>
          <p className="mt-2 text-sm text-slate-600">
            Follow document state transitions in real-time from queued to completed.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
          <p className="text-sm font-semibold text-slate-900">Review and Export</p>
          <p className="mt-2 text-sm text-slate-600">
            Review extracted content, finalize results, and export in JSON or CSV instantly.
          </p>
        </article>
      </div>
    </section>
  );
}
