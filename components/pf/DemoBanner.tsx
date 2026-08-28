"use client";

import { useA11y } from "@/lib/a11y";

export function DemoBanner() {
  const { textScale, setTextScale } = useA11y();

  return (
    <div className="w-full">
      <div className="bg-[#111111] text-white text-[11px] sm:text-xs px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="flex items-center gap-1" role="group" aria-label="Text size">
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
              className={`px-1.5 font-bold ${
                textScale === value ? "text-[var(--gold)]" : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="eyebrow">Unofficial prototype</span>
        <span className="opacity-40">|</span>
        <span>
          Simulated EPFO data — not connected to EPFO. Real services:{" "}
          <a
            href="https://www.epfindia.gov.in"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            epfindia.gov.in
          </a>
        </span>
      </div>
      <div className="tricolor-rule" />
    </div>
  );
}
