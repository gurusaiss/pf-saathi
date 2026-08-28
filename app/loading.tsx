export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="h-8 w-8 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
    </div>
  );
}
