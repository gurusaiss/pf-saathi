"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Category = "General" | "Employee" | "Employer" | "Pensioner";

const FAQS: Record<Category, { q: string; a: string }[]> = {
  General: [
    {
      q: "What is EPFO, and what is PF Saathi's relationship to it?",
      a: "EPFO (Employees' Provident Fund Organisation) is the government body that runs India's provident fund, pension, and insurance schemes for salaried employees. PF Saathi is an unofficial prototype built on top of that idea — it uses simulated data to demonstrate a clearer, guided experience. It has no connection to EPFO's real systems.",
    },
    {
      q: "Is my data safe here?",
      a: "This prototype doesn't store or transmit any real personal data — everything runs on simulated demo accounts, kept only in your browser's local storage.",
    },
    {
      q: "Where do I go for my actual PF account?",
      a: "Visit the official EPFO Unified Member Portal at epfindia.gov.in, or use the UMANG app for real account access, claims, and passbook services.",
    },
  ],
  Employee: [
    {
      q: "Why was my claim rejected?",
      a: "The most common reasons are a name/DOB mismatch with Aadhaar, an unlinked Aadhaar or PAN, KYC not yet attested by your employer, or an invalid bank IFSC. Run the Claim Pre-Flight Check before filing — it checks for all of these up front.",
    },
    {
      q: "Where does my money from a previous job go?",
      a: "It doesn't move automatically. Each employer creates a new Member ID under the same UAN, and old balances sit untouched until you file a transfer (Form 13). Open PF Journey to see every account and start a transfer.",
    },
    {
      q: "How much tax will I pay if I withdraw early?",
      a: "If your service is under 5 years, TDS applies unless you file Form 15G/15H (assuming your total income is below the taxable limit). Open the Withdrawal Advisor to see your exact numbers before deciding.",
    },
  ],
  Employer: [
    {
      q: "What happens if a monthly contribution goes missing from an employee's record?",
      a: "It's usually a posting delay or an ECR filing gap rather than a lost payment. Employees can raise it through Contributions → File a grievance, which routes it through EPFiGMS and asks your nodal officer to confirm the ECR.",
    },
    {
      q: "What is an employer's contribution compliance signal?",
      a: "It's a simple visibility score — the share of an employee's visible months where a salary deduction has a matching EPFO contribution. It's not a certified audit, just an early signal worth checking before it becomes a dispute.",
    },
    {
      q: "Does PF Saathi have a full employer portal?",
      a: "Not yet — this prototype is built employee-first. For real employer functions (UAN management, ECR filing, employee enrollment), use the official EPFO employer portal.",
    },
  ],
  Pensioner: [
    {
      q: "How is my EPS monthly pension calculated?",
      a: "Monthly Pension = (Pensionable Salary × Pensionable Service) ÷ 70, where pensionable salary is capped at ₹15,000 and service is rounded to the nearest 6 months. See your own estimate on the Withdrawal Advisor page.",
    },
    {
      q: "What happens to a member's PF and pension after they pass away?",
      a: "Three separate benefits become payable: the full PF balance (Form 20 / Composite Claim Form), an EPS survivor pension for the spouse and eligible children (Form 10D), and an EDLI insurance payout up to ₹7,00,000 (Form 5(IF)). See the Survivor support guide for the full walkthrough.",
    },
    {
      q: "Why does e-Nomination matter so much for pensioners' families?",
      a: "Without a nomination on file, a family has to obtain a legal heir or succession certificate before any of these claims can be paid — a much longer process. Filing it in advance, from Family & Nomination, avoids that entirely.",
    },
  ],
};

const CATEGORIES: Category[] = ["General", "Employee", "Employer", "Pensioner"];

export default function Faq() {
  const [active, setActive] = useState<Category>("General");

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
        <h1 className="text-2xl font-extrabold text-[var(--primary)] mb-1">Frequently asked questions</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Grouped the way EPFO itself frames it — general, employee, employer, and pensioner.
        </p>

        <div className="flex flex-wrap gap-2 mb-6" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
                active === c
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {FAQS[active].map((f, i) => (
            <Card key={i}>
              <p className="font-bold text-sm mb-1">{f.q}</p>
              <p className="text-sm text-[var(--muted)]">{f.a}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
          >
            Check my own PF →
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)]"
          >
            New to PF? Start here →
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)]"
          >
            Tax & Pension Calculator →
          </Link>
        </div>
      </main>
    </div>
  );
}
