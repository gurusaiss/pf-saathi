"use client";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]">
      <div className="rounded-xl bg-[var(--ok)] text-white px-4 py-3 shadow-lg flex items-start gap-2">
        <span className="mt-0.5">✓</span>
        <p className="text-sm flex-1">{message}</p>
        <button onClick={onClose} className="text-white/80 hover:text-white text-sm">
          ✕
        </button>
      </div>
    </div>
  );
}
