import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300/90">DocFlow</p>
          <h1 className="text-lg font-semibold text-white">Async Document Workflow</h1>
        </div>
        <nav className="flex gap-2 text-sm">
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
