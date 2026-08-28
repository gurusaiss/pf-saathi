"use client";

import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useSession } from "@/lib/session";
import { useToast } from "@/lib/useToast";
import { formatMonthYear } from "@/lib/format";

const STEPS = [
  { label: "Grievance submitted", detail: "Your complaint is registered on EPFiGMS with a tracking number." },
  { label: "Acknowledged by EPFO", detail: "EPFO confirms receipt and forwards it to the relevant regional office." },
  { label: "Forwarded to employer", detail: "Your employer's nodal officer is asked to respond with an explanation or correction." },
  { label: "Resolved", detail: "The contribution is posted, or you receive a written explanation for the gap." },
];

export default function Grievance() {
  const { persona, overrides, applyFix } = useSession();
  const toast = useToast(5000);

  if (!persona) return <Shell><PageSkeleton /></Shell>;

  const filed = overrides.grievanceFiled ?? false;
  const gap = persona.contributions.find((c) => c.salaryDeductionShown && !c.contributionVisible);

  function fileGrievance() {
    applyFix("grievance");
    toast.show("Grievance filed on EPFiGMS. You'll be notified here as it progresses.");
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Grievance</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        When a contribution gap doesn&apos;t resolve on its own, this is the official next step —
        made trackable instead of a black box.
      </p>

      {gap ? (
        <Card className="mb-6">
          <p className="font-semibold text-sm">
            Missing contribution | {formatMonthYear(gap.month)}
          </p>
          <p className="text-sm text-[var(--muted)] mt-1">
            A salary deduction was shown on your slip that month with no matching contribution in
            your EPFO record.
          </p>
        </Card>
      ) : (
        <Card className="mb-6">
          <p className="text-sm text-[var(--ok)]">
            ✓ No unresolved contribution gaps on your record right now. You can still file a general
            grievance below if something else needs EPFO&apos;s attention.
          </p>
        </Card>
      )}

      {!filed ? (
        <Card>
          <h3 className="font-bold mb-2">File on EPFiGMS</h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            This submits a formal grievance to EPFO&apos;s Grievance Management System, citing the
            exact month and amount, and requests your employer&apos;s nodal officer to respond.
          </p>
          <Button onClick={fileGrievance}>File grievance →</Button>
        </Card>
      ) : (
        <Card>
          <h3 className="font-bold mb-4">Grievance status</h3>
          <div className="space-y-4">
            {STEPS.map((s, i) => {
              const done = i <= 1; // filing + acknowledgment happen immediately in this demo
              return (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full shrink-0 ${
                        done ? "bg-[var(--ok)]" : "bg-[var(--border)]"
                      }`}
                    />
                    {i < STEPS.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${done ? "bg-[var(--ok)]" : "bg-[var(--border)]"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${done ? "" : "text-[var(--muted)]"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            EPFO&apos;s typical response window is 30 days. You&apos;ll see this status update here
            as it moves.
          </p>
        </Card>
      )}

      {toast.message && <Toast message={toast.message} onClose={toast.dismiss} />}
    </Shell>
  );
}
