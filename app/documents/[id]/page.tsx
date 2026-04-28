"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { StatusBadge } from "@/components/status-badge";
import { exportUrl, finalizeDocument, getDocument, progressUrl, retryDocument, updateDocument } from "@/lib/api";
import { DocumentStatus, ProgressEvent } from "@/lib/types";

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [form, setForm] = useState({ title: "", category: "", summary: "", keywords: "" });

  const doc = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocument(id),
    enabled: Boolean(id),
    refetchInterval: 5000
  });

  useEffect(() => {
    if (!id) return;
    const es = new EventSource(progressUrl(id));
    const handleProgressEvent = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as ProgressEvent;
        setProgress(parsed);
        queryClient.invalidateQueries({ queryKey: ["document", id] });
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      } catch {
        // Ignore malformed events
      }
    };
    es.addEventListener("progress", handleProgressEvent as EventListener);
    // Keep default message handler as a compatibility fallback.
    es.onmessage = handleProgressEvent;
    return () => es.close();
  }, [id, queryClient]);

  useEffect(() => {
    if (!doc.data || progress) return;
    if (doc.data.status === "completed") {
      setProgress({
        document_id: doc.data.id,
        job_id: "",
        step: "job_completed",
        progress: 100,
        status: "completed",
        message: "Job completed",
        timestamp: new Date().toISOString()
      });
    } else if (doc.data.status === "processing") {
      setProgress({
        document_id: doc.data.id,
        job_id: "",
        step: "processing",
        progress: 50,
        status: "processing",
        message: "Processing in progress",
        timestamp: new Date().toISOString()
      });
    } else if (doc.data.status === "queued") {
      setProgress({
        document_id: doc.data.id,
        job_id: "",
        step: "queued",
        progress: 5,
        status: "queued",
        message: "Waiting in queue",
        timestamp: new Date().toISOString()
      });
    } else if (doc.data.status === "failed") {
      setProgress({
        document_id: doc.data.id,
        job_id: "",
        step: "failed",
        progress: 100,
        status: "failed",
        message: doc.data.error_message ?? "Job failed",
        error: doc.data.error_message ?? undefined,
        timestamp: new Date().toISOString()
      });
    }
  }, [doc.data, progress]);

  useEffect(() => {
    const result = doc.data?.result;
    if (!result) return;
    setForm({
      title: result.title ?? "",
      category: result.category ?? "",
      summary: result.summary ?? "",
      keywords: (result.keywords ?? []).join(", ")
    });
  }, [doc.data?.result]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateDocument(id, {
        title: form.title,
        category: form.category,
        summary: form.summary,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });

  const finalizeMutation = useMutation({
    mutationFn: () => finalizeDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });

  const retryMutation = useMutation({
    mutationFn: () => retryDocument(id),
    onSuccess: async () => {
      setProgress({
        document_id: id,
        job_id: "",
        step: "queued",
        progress: 5,
        status: "queued",
        message: "Retry queued",
        timestamp: new Date().toISOString()
      });
      await queryClient.refetchQueries({ queryKey: ["document", id], type: "active" });
      await queryClient.refetchQueries({ queryKey: ["documents"], type: "active" });
    }
  });

  const isEditable = useMemo(() => !doc.data?.is_finalized, [doc.data?.is_finalized]);
  const displayStatus = useMemo<DocumentStatus>(() => {
    if (!doc.data) return "queued";
    if (!progress) return doc.data.status;
    const progressIsFresh = progress.document_id === doc.data.id;
    if (!progressIsFresh) return doc.data.status;
    if (doc.data.status === "failed" && (progress.status === "queued" || progress.status === "processing")) {
      return progress.status;
    }
    return doc.data.status;
  }, [doc.data, progress]);

  if (!doc.data) return <p className="text-sm text-slate-400">Loading document...</p>;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker">Document Detail</p>
          <h2 className="text-2xl font-bold text-slate-900">{doc.data.filename}</h2>
        </div>
        <StatusBadge status={displayStatus} />
      </div>

      <div className="panel p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">Live Progress</p>
          <span className="text-xs text-slate-500">{progress?.progress ?? 0}%</span>
        </div>
        <p className="mt-1 text-sm text-slate-600">{progress?.step ?? "No events yet"}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500"
            style={{ width: `${progress?.progress ?? 0}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">{progress?.message ?? "Waiting for worker updates..."}</p>
      </div>

      <div className="panel grid gap-3 p-5">
        <input
          className="input-base"
          value={form.title}
          onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
          placeholder="Title"
          disabled={!isEditable}
        />
        <input
          className="input-base"
          value={form.category}
          onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}
          placeholder="Category"
          disabled={!isEditable}
        />
        <textarea
          className="input-base"
          value={form.summary}
          onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))}
          placeholder="Summary"
          rows={5}
          disabled={!isEditable}
        />
        <input
          className="input-base"
          value={form.keywords}
          onChange={(e) => setForm((v) => ({ ...v, keywords: e.target.value }))}
          placeholder="Keywords (comma separated)"
          disabled={!isEditable}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="btn-primary"
          disabled={!isEditable || updateMutation.isPending}
          onClick={() => updateMutation.mutate()}
        >
          Save Edits
        </button>
        <button
          className="btn-muted border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          disabled={doc.data.is_finalized || displayStatus !== "completed" || finalizeMutation.isPending}
          onClick={() => finalizeMutation.mutate()}
        >
          Finalize
        </button>
        <button
          className="btn-muted border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
          disabled={displayStatus !== "failed" || retryMutation.isPending}
          onClick={() => retryMutation.mutate()}
        >
          Retry
        </button>
        <a className="btn-muted" href={exportUrl(id, "json")}>
          Export JSON
        </a>
        <a className="btn-muted" href={exportUrl(id, "csv")}>
          Export CSV
        </a>
      </div>
    </section>
  );
}
