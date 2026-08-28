"use client";

import { useState } from "react";
import { RuleResult } from "@/lib/rules/rejectionRules";
import { SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReadAloud } from "@/components/ui/ReadAloud";

export function RuleCheckRow({
  rule,
  onFix,
}: {
  rule: RuleResult;
  onFix?: (ruleId: string) => void;
}) {
  const [showWhy, setShowWhy] = useState(false);
  const why = whyText(rule.id);

  return (
    <div className="border-b border-[var(--border)] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{rule.label}</span>
            <SeverityBadge severity={rule.severity} />
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">{rule.reason}</p>
          {rule.consequence && (
            <p className="mt-1 text-sm text-[var(--bad)]">⚠ {rule.consequence}</p>
          )}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {rule.severity !== "pass" && (
              <button
                onClick={() => setShowWhy((s) => !s)}
                aria-expanded={showWhy}
                className="min-h-[32px] text-xs font-semibold text-[var(--primary)] underline underline-offset-2"
              >
                {showWhy ? "Hide details" : "Why?"}
              </button>
            )}
            {rule.resolutionTime && (
              <span className="text-xs text-[var(--muted)]">⏱ {rule.resolutionTime}</span>
            )}
          </div>
          {showWhy && (
            <div className="mt-2 rounded-lg bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
              <p>{why}</p>
              <div className="mt-2">
                <ReadAloud text={`${rule.label}. ${rule.reason} ${why}`} />
              </div>
            </div>
          )}
        </div>
        {rule.severity !== "pass" && rule.fixLabel && (
          <Button
            variant="secondary"
            className="whitespace-nowrap shrink-0 min-h-[44px]"
            onClick={() => onFix?.(rule.id)}
          >
            {rule.fixLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function whyText(ruleId: string): string {
  const map: Record<string, string> = {
    "name-match":
      "EPFO matches your claim against your Aadhaar name, character for character. Even a middle initial vs full name counts as a mismatch and triggers a rejection.",
    "dob-match":
      "Your date of birth is cross-checked against Aadhaar during KYC verification. A mismatch — even by a few days — can flag your KYC as unverified.",
    "aadhaar-linked":
      "Most online claims (Form 19, 31, 10C) require Aadhaar-based OTP verification. Without a linked, verified Aadhaar, the claim form itself may not be submittable.",
    "pan-linked":
      "If your service is under 5 years, withdrawals attract TDS. Linking PAN gets you the standard rate — without it, the rate is significantly higher.",
    "kyc-attested":
      "Your employer must digitally approve your KYC documents (bank, Aadhaar, PAN) in the employer portal before EPFO will accept a claim from you.",
    "bank-ifsc":
      "Claim payments are transferred via NEFT using your registered IFSC. If the bank has since merged or the branch code changed, the transfer will fail.",
    "date-of-exit":
      "EPFO needs to know exactly when you left your previous employer. Without this date, both transfers and final withdrawals stay blocked, even if everything else is in order.",
    "service-tds":
      "Under the Income Tax rules, PF withdrawal before 5 years of continuous service is taxable. Form 15G/15H can help you avoid or reduce this if your income is below the taxable limit.",
    nomination:
      "e-Nomination determines who receives your PF, EPS survivor pension, and EDLI insurance if something happens to you. Without it, your family faces a much longer legal process to claim these benefits.",
    "unmerged-accounts":
      "Every job change creates a new Member ID. If you don't transfer the balance from an old one, it keeps sitting there — and after 3 years without any contribution, EPFO classifies it as inoperative and it stops earning interest.",
  };
  return map[ruleId] ?? "This check is part of EPFO's standard claim verification process.";
}
