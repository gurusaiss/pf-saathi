"use client";

import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { useSession } from "@/lib/session";
import { formatINR, formatDate } from "@/lib/format";
import { RuleCheckRow } from "@/components/pf/RuleCheckRow";
import { usePfRules } from "@/lib/usePfRules";
import { useState } from "react";
import { FIX_ACTIONS, FIX_DESCRIPTIONS, FIX_TITLES } from "@/lib/overrides";
import { useToast } from "@/lib/useToast";
import { Toast } from "@/components/ui/Toast";

const statusColor: Record<string, string> = {
  Approved: "text-[var(--ok)]",
  Rejected: "text-[var(--bad)]",
  Processing: "text-[var(--warn)]",
  "Pending Employer Action": "text-[var(--warn)]",
};

export default function Claims() {
  const { persona, applyFix } = useSession();
  const rules = usePfRules();
  const [openId, setOpenId] = useState<string | null>(null);
  const toast = useToast();

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  function handleFix(ruleId: string) {
    const rule = rules!.preflightRules.find((r) => r.id === ruleId);
    if (!rule?.fixRoute) return;
    const segment = rule.fixRoute.replace("/fix/", "");
    if (FIX_ACTIONS[segment]) {
      applyFix(segment);
      toast.show(`${FIX_TITLES[segment]} | ${FIX_DESCRIPTIONS[segment]}`);
    }
  }

  return (
    <Shell>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold">Claims</h1>
        <LinkButton href="/claims/preflight" variant="secondary">
          Run Pre-Flight →
        </LinkButton>
      </div>
      <p className="text-sm text-[var(--muted)] mb-6">
        Your claim history, translated. Every rejection includes exactly why it happened and how to
        fix it.
      </p>

      {persona.claims.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--muted)]">You have no claim history yet.</p>
          <div className="mt-3">
            <LinkButton href="/claims/preflight">Start a new claim →</LinkButton>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {persona.claims.map((c) => {
            const relatedRule = c.rejectionReasonId
              ? rules.results.find((r) => r.id === c.rejectionReasonId)
              : undefined;
            const open = openId === c.id;
            return (
              <Card key={c.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">
                      {c.type} · {c.form}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Filed {formatDate(c.filedOn)} · {formatINR(c.amount)}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${statusColor[c.status]}`}>{c.status}</span>
                </div>

                {c.rejectionRemark && (
                  <div className="mt-3 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-xs p-3">
                    {c.rejectionRemark}
                  </div>
                )}

                {c.status === "Rejected" && (
                  <button
                    onClick={() => setOpenId(open ? null : c.id)}
                    className="mt-3 text-sm font-semibold text-[var(--primary)] underline underline-offset-2"
                  >
                    {open ? "Hide explanation" : "What does this mean? →"}
                  </button>
                )}

                {open && relatedRule && (
                  <div className="mt-3 border-t border-[var(--border)] pt-3">
                    <RuleCheckRow rule={relatedRule} onFix={handleFix} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {toast.message && <Toast message={toast.message} onClose={toast.dismiss} />}
    </Shell>
  );
}
