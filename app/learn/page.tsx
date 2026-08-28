"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

const TOPICS = [
  {
    q: "What is PF?",
    a: "The Employees' Provident Fund is a compulsory retirement savings scheme for salaried employees in India, run by EPFO — a government body under the Ministry of Labour. A part of your salary is set aside every month and grows with interest until you retire or withdraw it.",
  },
  {
    q: "Why is money deducted from my salary?",
    a: "12% of your Basic pay + DA is deducted every month as your EPF contribution. It's compulsory if you work at a company with 20 or more employees.",
  },
  {
    q: "What does my employer contribute?",
    a: "Your employer adds another 12% of your Basic + DA. Of that, 8.33% (capped at ₹1,250/month) goes into your pension scheme (EPS), and the remaining 3.67% goes into your EPF balance alongside your own contribution.",
  },
  {
    q: "What is a UAN?",
    a: "Your Universal Account Number is a 12-digit number that stays the same for your entire working life. Every employer you work for creates a separate 'Member ID' linked to the same UAN.",
  },
  {
    q: "What happens when I change jobs?",
    a: "A new Member ID is created under your same UAN. Crucially, your balance from the old employer does NOT automatically move to the new one — you have to file a transfer (Form 13). If you never do, that money just sits there, and after 3 years without any contribution, it stops earning interest.",
  },
  {
    q: "What is EPS?",
    a: "The Employees' Pension Scheme is the pension part of your PF. Unlike your EPF balance, it isn't a pot of money you can watch grow — it's a formula-based monthly pension you start receiving at age 58, if you've completed at least 10 years of service.",
  },
  {
    q: "When can I claim my PF?",
    a: "You can withdraw fully at retirement, or after 2 continuous months of unemployment. Partial advances are allowed earlier for specific reasons — marriage, education, illness, or buying a house — each with its own rules and minimum service requirement.",
  },
];

export default function Learn() {
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
        <h1 className="text-2xl font-extrabold text-[var(--primary)] mb-1">New to PF?</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Seven things worth understanding before you ever need to file a claim.
        </p>

        <div className="space-y-4">
          {TOPICS.map((t, i) => (
            <Card key={i}>
              <p className="font-bold text-sm mb-1">
                {i + 1}. {t.q}
              </p>
              <p className="text-sm text-[var(--muted)]">{t.a}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
          >
            Check my own PF →
          </Link>
        </div>
      </main>
    </div>
  );
}
