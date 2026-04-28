import { DocumentItem, DocumentListResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function uploadDocuments(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listDocuments(query: URLSearchParams): Promise<DocumentListResponse> {
  const res = await fetch(`${API_BASE}/documents?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getDocument(id: string): Promise<DocumentItem> {
  const res = await fetch(`${API_BASE}/documents/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch document");
  return res.json();
}

export async function updateDocument(id: string, payload: Record<string, unknown>): Promise<DocumentItem> {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function finalizeDocument(id: string) {
  const res = await fetch(`${API_BASE}/finalize/${id}`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function retryDocument(id: string) {
  const res = await fetch(`${API_BASE}/retry/${id}`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function exportUrl(id: string, format: "json" | "csv") {
  return `${API_BASE}/export/${id}?format=${format}`;
}

export function progressUrl(id: string) {
  return `${API_BASE}/progress/${id}`;
}
