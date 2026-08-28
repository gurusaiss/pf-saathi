"use client";

import { useRouter } from "next/navigation";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { ScoreRing } from "@/components/pf/ScoreRing";
import { RuleCheckRow } from "@/components/pf/RuleCheckRow";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { useToast } from "@/lib/useToast";
import { FIX_ACTIONS, FIX_DESCRIPTIONS, FIX_TITLES } from "@/lib/overrides";

export default function Preflight() {
  const { persona, applyFix } = useSession();
  const rules = usePfRules();
  const router = useRouter();
  const toast = useToast();

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  const readyToFile = rules.preflight >= 90;

  function handleFix(ruleId: string) {
    const rule = rules!.preflightRules.find((r) => r.id === ruleId);
    if (!rule?.fixRoute) return;
    const segment = rule.fixRoute.replace("/fix/", "");
    if (FIX_ACTIONS[segment]) {
      applyFix(segment);
      toast.show(`${FIX_TITLES[segment]} — ${FIX_DESCRIPTIONS[segment]}`);
    }
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Claim Pre-Flight Check</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Before you file, we check your claim against every reason EPFO commonly rejects one — so the
        claim you submit is the claim that gets paid.
      </p>

      <Card className="mb-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={rules.preflight} size={140} />
        <div>
          <p className="text-lg font-bold">
            {readyToFile ? "You're ready to file." : "Not ready to file yet."}
          </p>
          <p className="text-sm text-[var(--muted)] mt-1">
            {readyToFile
              ? "All claim-blocking checks pass. You can file your withdrawal or transfer with confidence."
              : `${rules.preflightAttention.length} issue${rules.preflightAttention.length !== 1 ? "s" : ""} would likely cause EPFO to reject this claim. Fix them below before filing.`}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold mb-2">Claim readiness checks</h3>
        <div>
          {rules.preflightRules.map((r) => (
            <RuleCheckRow key={r.id} rule={r} onFix={handleFix} />
          ))}
        </div>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button disabled={!readyToFile} onClick={() => router.push("/claims")}>
          {readyToFile ? "Proceed to file claim →" : "Resolve issues to continue"}
        </Button>
      </div>

      {toast.message && <Toast message={toast.message} onClose={toast.dismiss} />}
    </Shell>
  );
}
