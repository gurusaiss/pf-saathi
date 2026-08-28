import { Severity } from "@/lib/rules/rejectionRules";

const styles: Record<Severity, string> = {
  pass: "bg-[var(--ok-bg)] text-[var(--ok)]",
  warn: "bg-[var(--warn-bg)] text-[var(--warn)]",
  fail: "bg-[var(--bad-bg)] text-[var(--bad)]",
};

const icons: Record<Severity, string> = {
  pass: "✓",
  warn: "!",
  fail: "✕",
};

const labels: Record<Severity, string> = {
  pass: "OK",
  warn: "Attention",
  fail: "Action needed",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[severity]}`}
    >
      <span aria-hidden>{icons[severity]}</span>
      {labels[severity]}
    </span>
  );
}
