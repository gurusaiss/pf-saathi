"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { useSession } from "@/lib/session";
import { formatINR, formatMonthYear } from "@/lib/format";

export default function Contributions() {
  const { persona } = useSession();
  const [selected, setSelected] = useState<string | null>(null);

  if (!persona) return <Shell><PageSkeleton /></Shell>;

  const gaps = persona.contributions.filter((c) => c.salaryDeductionShown && !c.contributionVisible);
  const activeMonth = selected
    ? persona.contributions.find((c) => c.month === selected)
    : gaps[0];
  const totalMonths = persona.contributions.length;
  const compliancePct = totalMonths > 0 ? Math.round(((totalMonths - gaps.length) / totalMonths) * 100) : 100;

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Contributions</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Every month, side by side — what your salary slip shows versus what shows up in your EPFO
        record.
      </p>

      {gaps.length > 0 && (
        <Card className="mb-6 border-[var(--warn)] bg-[var(--warn-bg)]">
          <p className="font-semibold text-sm">
            ⚠ {gaps.length} month{gaps.length > 1 ? "s" : ""} where a salary deduction doesn&apos;t
            appear in your EPFO record.
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            This alone does not establish that your employer failed to deposit it — it can also be a
            posting delay or a record-visibility issue. See the recommended checks below.
          </p>
        </Card>
      )}

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">Employer contribution signal</h3>
            <p className="text-xs text-[var(--muted)] mt-1 max-w-md">
              Based only on your own {totalMonths} visible months — not a certified compliance audit
              of your employer.
            </p>
          </div>
          <span
            className={`tabular-nums text-2xl font-extrabold ${
              compliancePct === 100 ? "text-[var(--ok)]" : compliancePct >= 80 ? "text-[var(--warn)]" : "text-[var(--bad)]"
            }`}
          >
            {compliancePct}%
          </span>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="font-bold mb-3">Contribution timeline</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {persona.contributions.map((c) => {
            const isGap = c.salaryDeductionShown && !c.contributionVisible;
            return (
              <button
                key={c.month}
                onClick={() => setSelected(c.month)}
                className={`rounded-lg border px-2 py-3 text-center text-xs transition-colors ${
                  isGap
                    ? "border-[var(--warn)] bg-[var(--warn-bg)]"
                    : "border-[var(--border)] hover:bg-[var(--bg)]"
                } ${selected === c.month ? "ring-2 ring-[var(--primary)]" : ""}`}
              >
                <p className="font-semibold">{formatMonthYear(c.month)}</p>
                <p className="mt-1">{isGap ? "⚠️" : "✅"}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {activeMonth && (
        <Card>
          <h3 className="font-bold mb-3">{formatMonthYear(activeMonth.month)}</h3>
          {activeMonth.salaryDeductionShown && !activeMonth.contributionVisible ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] mb-1">What we know</p>
                <ul className="text-sm space-y-1">
                  <li>✓ Salary deduction shown on your slip</li>
                  <li className="text-[var(--bad)]">✕ No corresponding contribution visible in your EPFO record</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] mb-1">What this does NOT tell us</p>
                <p className="text-sm text-[var(--muted)]">
                  A single gap alone does not establish that your employer failed to deposit the
                  amount. It could be a contribution posting delay, an ECR processing lag, or a
                  record-visibility issue.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)] mb-1">Recommended checks</p>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>Check your salary slip for the exact deduction amount</li>
                  <li>Check your EPFO passbook again after a few days — it may still be posting</li>
                  <li>Ask your employer&apos;s HR/finance team to confirm the ECR was filed</li>
                  <li>If it still doesn&apos;t appear after 2 cycles, raise it through EPFiGMS (official grievance route)</li>
                </ol>
                <div className="mt-3">
                  <Link
                    href="/grievance"
                    className="text-sm font-semibold text-[var(--primary)] underline underline-offset-2"
                  >
                    File a grievance on EPFiGMS →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--ok)]">
              ✓ Deduction shown on salary slip and matching contribution ({formatINR(activeMonth.amount)}) visible in
              your EPFO record.
            </p>
          )}
        </Card>
      )}
    </Shell>
  );
}
