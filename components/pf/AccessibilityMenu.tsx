"use client";

import { useState, useRef, useEffect } from "react";
import { useA11y } from "@/lib/a11y";

export function AccessibilityMenu() {
  const { textScale, setTextScale, contrast, setContrast } = useA11y();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={ref} className="fixed bottom-20 right-4 z-40 md:bottom-6">
      {open && (
        <div className="mb-2 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Text size
          </p>
          <div className="flex gap-2 mb-4">
            {(
              [
                ["normal", "A"],
                ["large", "A+"],
                ["xl", "A++"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTextScale(value)}
                aria-pressed={textScale === value}
                className={`flex-1 rounded-lg border py-2 text-sm font-semibold ${
                  textScale === value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Contrast
          </p>
          <div className="flex gap-2">
            {(
              [
                ["normal", "Normal"],
                ["high", "High contrast"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setContrast(value)}
                aria-pressed={contrast === value}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold ${
                  contrast === value
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] shadow-lg text-lg font-bold hover:opacity-90"
      >
        Aa
      </button>
    </div>
  );
}
