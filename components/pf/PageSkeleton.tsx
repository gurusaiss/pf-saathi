export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-1/3 rounded bg-[var(--border)]" />
      <div className="h-4 w-2/3 rounded bg-[var(--border)]" />
      <div className="h-32 rounded-2xl bg-[var(--border)]" />
      <div className="h-24 rounded-2xl bg-[var(--border)]" />
    </div>
  );
}
