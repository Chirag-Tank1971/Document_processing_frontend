import type { Metadata } from "next";

import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Async Document Workflow",
  description: "Document processing workflow dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
