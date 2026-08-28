"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ReadAloud } from "@/components/ui/ReadAloud";

const BENEFITS = [
  {
    title: "PF balance",
    form: "Composite Claim Form / Form 20",
    detail:
      "The full EPF balance (employee + employer share) is paid to the nominee, or to legal heirs if no nomination was filed.",
  },
  {
    title: "EPS survivor pension",
    form: "Form 10D",
    detail:
      "If the member had at least 1 month of service under EPS, a monthly pension is payable to the spouse and, in most cases, up to two children until they turn 25.",
  },
  {
    title: "EDLI insurance",
    form: "Form 5(IF)",
    detail:
      "A lump-sum insurance payout — up to ₹7,00,000 — paid separately from the PF balance, at no cost to the member.",
  },
];

const DOCUMENTS = [
  "Death certificate (original or attested copy)",
  "Aadhaar and bank details of each claimant",
  "Succession certificate or legal heir certificate — only if no e-Nomination was on file",
  "Guardianship certificate — only if any nominee is a minor",
  "Cancelled cheque for the bank account the payment should go to",
];

export default function Survivor() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-[var(--primary)]">
            ← PF Saathi
          </Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--primary)] mb-1">
          Filing a claim after a member has passed away
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          A guide for the family member handling this. There are three separate benefits, each with
          its own form — this page lays out all three in one place.
        </p>

        <div className="space-y-4 mb-6">
          {BENEFITS.map((b) => (
            <Card key={b.title}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-sm">{b.title}</p>
                <span className="text-xs font-mono text-[var(--muted)]">{b.form}</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-1">{b.detail}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="font-bold">Documents typically needed</h3>
            <ReadAloud
              text={`Documents typically needed: ${DOCUMENTS.join(". ")}.`}
            />
          </div>
          <ul className="text-sm space-y-1.5 list-disc list-inside text-[var(--muted)]">
            {DOCUMENTS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Card>

        <Card className="mb-6">
          <h3 className="font-bold mb-2">If an e-Nomination was already on file</h3>
          <p className="text-sm text-[var(--muted)]">
            This is the single biggest difference in how long this takes. With a valid nomination,
            EPFO pays the named nominee directly and does not require a succession or legal heir
            certificate — often the slowest step to obtain. Without one, every claimant has to prove
            their legal right to the amount before anything is paid.
          </p>
        </Card>

        <Card>
          <h3 className="font-bold mb-2">Where to start</h3>
          <p className="text-sm text-[var(--muted)]">
            All three claims can usually be filed together as one composite claim through the
            deceased member&apos;s UAN, either online (if the member&apos;s Aadhaar and bank details
            were already seeded) or physically through their last employer or the nearest EPFO
            office. If you&apos;re unsure which office to approach, your employer&apos;s HR team can
            usually point you to the correct jurisdiction.
          </p>
        </Card>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
          >
            Back to PF Saathi
          </Link>
        </div>
      </main>
    </div>
  );
}
