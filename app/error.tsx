"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-semibold text-[var(--bad)] uppercase tracking-wide">
          Something went wrong
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-[var(--primary)]">
          This screen hit an error
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This is a prototype — try going back and re-entering that flow.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
