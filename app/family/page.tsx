"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { ReadAloud } from "@/components/ui/ReadAloud";
import { useToast } from "@/lib/useToast";

const STEPS = [
  "Confirm your family members and their relationship to you",
  "Allocate a share of your PF and EPS to each nominee",
  "Confirm the same or a different nominee for EDLI insurance",
  "e-Sign with Aadhaar OTP",
];

export default function Family() {
  const { persona, applyFix } = useSession();
  const rules = usePfRules();
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const toast = useToast(5000);

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  const nominationRule = rules.results.find((r) => r.id === "nomination")!;
  const filed = nominationRule.severity === "pass";

  function finish() {
    applyFix("nomination");
    setActive(false);
    setStep(0);
    toast.show("e-Nomination filed. Your family's EDLI and survivor pension claim is now protected.");
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Family &amp; Nomination</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Who gets your PF, pension, and insurance if something happens to you.
      </p>

      <Card className={`mb-6 ${filed ? "border-[var(--ok)] bg-[var(--ok-bg)]" : "border-[var(--bad)] bg-[var(--bad-bg)]"}`}>
        <p className="font-semibold text-sm">
          {filed ? "✓ e-Nomination is on file" : "You have not filed an e-Nomination"}
        </p>
        <p className="text-sm mt-1">
          {filed ? (
            <>Your nominee: <span className="font-semibold">{persona.nominee ?? "Confirmed during filing"}</span></>
          ) : (
            <>
              Without it, your family loses easy access to up to <span className="font-semibold">₹7,00,000</span>{" "}
              of EDLI insurance and your EPS survivor pension — they would have to go through a much
              longer legal claims process instead.
            </>
          )}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {!filed && !active && <Button onClick={() => setActive(true)}>File e-Nomination now →</Button>}
          <ReadAloud
            text={
              filed
                ? `e-Nomination is on file. Your nominee is ${persona.nominee ?? "confirmed during filing"}.`
                : "You have not filed an e-Nomination. Without it, your family loses easy access to up to seven lakh rupees of EDLI insurance and your EPS survivor pension — they would have to go through a much longer legal claims process instead."
            }
          />
        </div>
      </Card>

      {active && (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
              />
            ))}
          </div>
          <p className="font-semibold text-sm mb-1">Step {step + 1} of {STEPS.length}</p>
          <p className="text-sm text-[var(--muted)] mb-4">{STEPS[step]}</p>
          <Button
            onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : finish())}
          >
            {step < STEPS.length - 1 ? "Continue" : "Confirm e-Nomination"}
          </Button>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-bold">What is EDLI?</h3>
          <ReadAloud text="The Employees' Deposit Linked Insurance scheme is a free life insurance cover that comes automatically with your EPF membership. Your employer pays a small contribution for it, at no cost to you. If you die while in active service, your family can claim up to seven lakh rupees, on top of your PF balance and any EPS survivor pension. An e-Nomination is what tells EPFO who that payment should go to." />
        </div>
        <p className="text-sm text-[var(--muted)]">
          The Employees&apos; Deposit Linked Insurance scheme is a free life insurance cover that
          comes automatically with your EPF membership — your employer pays a small contribution
          for it, at no cost to you. If you die while in active service, your family can claim up to
          ₹7,00,000, on top of your PF balance and any EPS survivor pension. An e-Nomination is what
          tells EPFO who that payment should go to.
        </p>
      </Card>

      <p className="mt-4 text-sm">
        <Link href="/survivor" className="font-semibold text-[var(--primary)] underline underline-offset-2">
          Helping a family after a member has passed away? Start here →
        </Link>
      </p>

      {toast.message && <Toast message={toast.message} onClose={toast.dismiss} />}
    </Shell>
  );
}
