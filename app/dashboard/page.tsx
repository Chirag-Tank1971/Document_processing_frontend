"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/status-badge";
import { listDocuments } from "@/lib/api";
import { DocumentItem, DocumentStatus } from "@/lib/types";

const RETRY_GRACE_WINDOW_MS = 60_000;

function getDisplayStatus(item: DocumentItem): DocumentStatus {
  if (item.status !== "failed") return item.status;
  const hasError = Boolean(item.error_message && item.error_message.trim().length > 0);
  if (hasError) return "failed";
  const updatedAtMs = new Date(item.updated_at).getTime();
  if (Number.isNaN(updatedAtMs)) return "queued";
  const isRecent = Date.now() - updatedAtMs <= RETRY_GRACE_WINDOW_MS;
  return isRecent ? "queued" : "failed";
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const query = useMemo(() => {
    const params = new URLSearchParams({
      sort_by: sortBy,
      sort_order: sortOrder,
      limit: "50"
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    return params;
  }, [search, sortBy, sortOrder, status]);

  const docs = useQuery({
    queryKey: ["documents", query.toString()],
    queryFn: () => listDocuments(query),
    refetchInterval: 5000
  });

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <p className="kicker">Operations</p>
        <h2 className="title">Documents Dashboard</h2>
        <p className="subtitle">Search, filter, sort, and track every document workflow.</p>
      </div>

      <div className="panel grid gap-3 p-4 md:grid-cols-4">
        <input
          className="input-base"
          placeholder="Search filename/type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-base"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="queued">Queued</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <select
          className="input-base"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by date</option>
          <option value="status">Sort by status</option>
        </select>
        <select
          className="input-base"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="panel overflow-hidden">
        <table className="w-full text-sm text-slate-700">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">File</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.data?.items.length ? (
              docs.data.items.map((item) => {
                const displayStatus = getDisplayStatus(item);
                return (
                <tr className="border-t border-slate-200 transition hover:bg-slate-50" key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{item.filename}</p>
                    <p className="text-xs text-slate-500">{item.content_type}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={displayStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Link className="text-sky-700 transition hover:text-sky-600" href={`/documents/${item.id}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              );
              })
            ) : (
              <tr className="border-t border-slate-200">
                <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                  {docs.isFetching ? "Loading documents..." : "No documents found for this filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        Total results: <span className="font-semibold text-slate-700">{docs.data?.total ?? 0}</span>
      </div>
    </section>
  );
}
