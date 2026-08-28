import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
      <div>
        <p className="text-sm font-semibold text-[var(--gold)] uppercase tracking-wide">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[var(--primary)]">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          That page doesn&apos;t exist in this prototype.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
        >
          Back to PF Saathi
        </Link>
      </div>
    </div>
  );
}
