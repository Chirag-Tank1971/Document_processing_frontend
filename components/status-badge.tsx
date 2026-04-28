import clsx from "clsx";

import { DocumentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={clsx("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide", {
        "border border-blue-500/30 bg-blue-500/15 text-blue-200": status === "queued",
        "border border-amber-500/30 bg-amber-500/15 text-amber-200": status === "processing",
        "border border-emerald-500/30 bg-emerald-500/15 text-emerald-200": status === "completed",
        "border border-rose-500/30 bg-rose-500/15 text-rose-200": status === "failed"
      })}
    >
      {status}
    </span>
  );
}
