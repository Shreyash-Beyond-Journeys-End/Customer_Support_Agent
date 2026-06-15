"use client";

import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="border-t border-border bg-canvas/80 p-3 backdrop-blur sm:p-4">
      <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-3xl border border-border bg-surface p-1.5 pl-4 shadow-soft focus-within:border-accent/50">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Type your message…"
          className="max-h-40 flex-1 resize-none bg-transparent py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white shadow-soft transition-colors hover:bg-accent/90 disabled:opacity-40"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
      <p className="mx-auto mt-1.5 max-w-2xl px-2 text-[11px] text-muted">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  );
}
