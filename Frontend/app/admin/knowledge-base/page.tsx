"use client";

import { KbUploader } from "@/components/admin/KbUploader";

export default function KnowledgeBasePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Knowledge base</h1>
        <p className="text-sm text-muted">
          Add product docs, FAQs, and resolved tickets. New content is searchable
          by the agent within seconds.
        </p>
      </div>
      <KbUploader />
    </div>
  );
}
