import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">DocFlow</p>
          <h1 className="text-lg font-semibold text-slate-900">Async Document Workflow</h1>
        </div>
        <nav className="flex gap-2 text-sm">
          <Link className="btn-muted" href="/">
            Home
          </Link>
          <Link className="btn-muted" href="/upload">
            Upload
          </Link>
          <Link className="btn-primary" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
