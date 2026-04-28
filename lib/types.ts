export type DocumentStatus = "queued" | "processing" | "completed" | "failed";

export interface ProcessedResult {
  title?: string;
  category?: string;
  summary?: string;
  keywords: string[];
  raw_json?: Record<string, unknown>;
}

export interface DocumentItem {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: DocumentStatus;
  is_finalized: boolean;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
  result?: ProcessedResult | null;
}

export interface DocumentListResponse {
  items: DocumentItem[];
  total: number;
}

export interface ProgressEvent {
  document_id: string;
  job_id: string;
  step: string;
  progress: number;
  status: DocumentStatus;
  message?: string | null;
  error?: string | null;
  timestamp: string;
}
