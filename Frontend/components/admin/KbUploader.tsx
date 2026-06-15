"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, FileUp, Link2, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { UploadFileResult } from "@/lib/types";

function ResultLine({ result }: { result: UploadFileResult }) {
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-success">
      <CheckCircle2 className="h-4 w-4" />
      {result.message} ({result.chunks_processed} chunks)
    </p>
  );
}

export function KbUploader() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");

  const fileMut = useMutation({
    mutationFn: (file: File) => adminApi.uploadFile(file),
  });
  const urlMut = useMutation({
    mutationFn: (u: string) => adminApi.uploadUrl(u),
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* File ingest */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
          <FileUp className="h-4 w-4 text-accent" /> Upload document
        </div>
        <p className="mb-4 text-xs text-muted">
          Markdown, text, or PDF — chunked and embedded into the knowledge base.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.txt,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFileName(file.name);
              fileMut.mutate(file);
            }
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={fileMut.isPending}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-2 py-8 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink"
        >
          {fileMut.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {fileName || "Choose a file"}
        </button>
        {fileMut.isError && (
          <p className="mt-3 text-sm text-danger">Upload failed.</p>
        )}
        {fileMut.data && <ResultLine result={fileMut.data} />}
      </section>

      {/* URL ingest */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
          <Link2 className="h-4 w-4 text-accent" /> Ingest from URL
        </div>
        <p className="mb-4 text-xs text-muted">
          Scrape a page&apos;s text into the knowledge base.
        </p>

        <Input
          type="url"
          placeholder="https://docs.example.com/page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          onClick={() => urlMut.mutate(url.trim())}
          disabled={!url.trim() || urlMut.isPending}
          className="mt-3 w-full"
        >
          {urlMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Ingest URL
        </Button>
        {urlMut.isError && (
          <p className="mt-3 text-sm text-danger">Could not ingest that URL.</p>
        )}
        {urlMut.data && <ResultLine result={urlMut.data} />}
      </section>
    </div>
  );
}
