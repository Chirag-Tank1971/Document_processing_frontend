import clsx from "clsx";

import { DocumentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={clsx("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide", {
        "border border-blue-300 bg-blue-50 text-blue-700": status === "queued",
        "border border-amber-300 bg-amber-50 text-amber-700": status === "processing",
        "border border-emerald-300 bg-emerald-50 text-emerald-700": status === "completed",
        "border border-rose-300 bg-rose-50 text-rose-700": status === "failed"
      })}
    >
      {status}
    </span>
  );
}
