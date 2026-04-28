"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { uploadDocuments } from "@/lib/api";

const MAX_FILES_PER_UPLOAD = 3;

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectionError, setSelectionError] = useState("");
  const mutation = useMutation({
    mutationFn: () => uploadDocuments(files)
  });

  const disabled = useMemo(
    () => files.length === 0 || files.length > MAX_FILES_PER_UPLOAD || mutation.isPending,
    [files.length, mutation.isPending]
  );

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300/90">Ingestion</p>
        <h2 className="text-3xl font-bold text-white">Upload Documents</h2>
        <p className="text-sm text-slate-400">Send one or more files to the async processing queue.</p>
      </div>

      <div className="panel p-6">
        <input
          className="input-base block w-full cursor-pointer"
          type="file"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length > MAX_FILES_PER_UPLOAD) {
              setSelectionError(`You can select up to ${MAX_FILES_PER_UPLOAD} files at a time.`);
            } else {
              setSelectionError("");
            }
            setFiles(selected.slice(0, MAX_FILES_PER_UPLOAD));
          }}
        />
        <p className="mt-4 text-sm text-slate-300">
          Selected: <span className="font-semibold text-white">{files.length}</span> file(s)
        </p>
        <p className="mt-1 text-xs text-slate-400">Maximum allowed per upload: {MAX_FILES_PER_UPLOAD}</p>
        {selectionError ? (
          <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {selectionError}
          </p>
        ) : null}

        {files.length > 0 ? (
          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            {files.map((file) => (
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2" key={file.name}>
                {file.name} - {(file.size / 1024).toFixed(1)} KB
              </li>
            ))}
          </ul>
        ) : null}

        <button
          onClick={() => mutation.mutate()}
          disabled={disabled}
          className="btn-primary mt-5"
        >
          {mutation.isPending ? "Uploading..." : "Upload and Queue"}
        </button>
        {mutation.isSuccess ? (
          <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Queued documents: {mutation.data.document_ids.length}
          </p>
        ) : null}
        {mutation.isError ? (
          <p className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {(mutation.error as Error).message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
