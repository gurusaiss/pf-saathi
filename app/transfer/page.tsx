"use client";

import { useState } from "react";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { RuleCheckRow } from "@/components/pf/RuleCheckRow";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { liveStrandedAccounts } from "@/lib/liveMemberIds";
import { formatINR, formatDate } from "@/lib/format";
import { FIX_ACTIONS, FIX_DESCRIPTIONS, FIX_TITLES } from "@/lib/overrides";
import { useToast } from "@/lib/useToast";

const TRANSFER_PREREQS = ["aadhaar-linked", "kyc-attested", "date-of-exit"];

export default function Transfer() {
  const { persona, overrides, applyFix } = useSession();
  const rules = usePfRules();
  const toast = useToast(5000);
  const [done, setDone] = useState(false);

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  const stranded = liveStrandedAccounts(persona, overrides);
  const prereqRules = rules.preflightRules.filter((r) => TRANSFER_PREREQS.includes(r.id));
  const blockers = prereqRules.filter((r) => r.severity === "fail");
  const canTransfer = blockers.length === 0 && stranded.length > 0 && !done;

  function handleFix(ruleId: string) {
    const rule = rules!.preflightRules.find((r) => r.id === ruleId);
    if (!rule?.fixRoute) return;
    const segment = rule.fixRoute.replace("/fix/", "");
    if (FIX_ACTIONS[segment]) {
      applyFix(segment);
      toast.show(`${FIX_TITLES[segment]} | ${FIX_DESCRIPTIONS[segment]}`);
    }
  }

  function confirmTransfer() {
    applyFix("transfer");
    setDone(true);
    toast.show("Transfer initiated — funds will reflect in your current account within a few working days.");
  }

  if (stranded.length === 0 && !done) {
    return (
      <Shell>
        <h1 className="text-xl font-bold mb-1">Transfer</h1>
        <Card>
          <p className="text-sm text-[var(--ok)]">✓ All your previous accounts are already transferred. Nothing to do here.</p>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Transfer old accounts</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Move balances stranded in old member IDs into your current account, in one flow.
      </p>

      {done ? (
        <Card className="border-[var(--ok)] bg-[var(--ok-bg)]">
          <p className="font-semibold text-sm">✓ Transfer submitted (Form 13)</p>
          <p className="text-xs text-[var(--muted)] mt-2">What happens next:</p>
          <ol className="mt-1 text-xs text-[var(--muted)] list-decimal list-inside space-y-0.5">
            <li>Your current employer reviews and approves the request</li>
            <li>EPFO processes the transfer between the old and new accounts</li>
            <li>Your Money Map updates to reflect the merged balance</li>
          </ol>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <h3 className="font-bold mb-3">Accounts to transfer</h3>
            <div className="space-y-2">
              {stranded.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{m.employer}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatDate(m.from)} – {m.to ? formatDate(m.to) : ""}
                    </p>
                  </div>
                  <span className="tabular-nums font-semibold text-sm">{formatINR(m.balance)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold">
              Total to transfer: {formatINR(stranded.reduce((s, m) => s + m.balance, 0))}
            </p>
          </Card>

          <Card className="mb-6">
            <h3 className="font-bold mb-2">Before you continue</h3>
            <div>
              {prereqRules.map((r) => (
                <RuleCheckRow key={r.id} rule={r} onFix={handleFix} />
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button disabled={!canTransfer} onClick={confirmTransfer}>
              {canTransfer ? "Confirm transfer (Form 13) →" : "Resolve prerequisites to continue"}
            </Button>
          </div>
        </>
      )}

      {toast.message && <Toast message={toast.message} onClose={toast.dismiss} />}
    </Shell>
  );
}
