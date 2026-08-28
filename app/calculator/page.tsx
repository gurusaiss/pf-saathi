"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import {
  futureValueLost,
  yearsToRetirement,
  estimateTds,
  estimatePension,
} from "@/lib/withdrawalMath";

export default function Calculator() {
  const [basic, setBasic] = useState(25000);
  const [years, setYears] = useState(4);
  const [months, setMonths] = useState(6);
  const [age, setAge] = useState(30);
  const [panLinked, setPanLinked] = useState(true);
  const [form15gFiled, setForm15gFiled] = useState(false);
  const [balance, setBalance] = useState(300000);

  const tds = estimateTds(years, months, form15gFiled, panLinked);
  const tdsAmount = Math.round(balance * tds.rate);
  const netReceived = balance - tdsAmount;
  const lostAtRetirement = futureValueLost(balance, age);
  const yearsLeft = yearsToRetirement(age);
  const pension = estimatePension(years, months, basic);

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
        <h1 className="text-2xl font-extrabold text-[var(--primary)] mb-1">PF Tax & Pension Calculator</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          No login needed. Enter your own numbers to estimate withdrawal tax and your EPS pension —
          the same formulas EPFO uses, worked out for you.
        </p>

        <Card className="mb-6">
          <h3 className="font-bold mb-4">Your details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Monthly Basic + DA (₹)">
              <input
                type="number"
                min={0}
                value={basic}
                onChange={(e) => setBasic(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </Field>
            <Field label="Current age">
              <input
                type="number"
                min={18}
                max={58}
                value={age}
                onChange={(e) => setAge(Math.max(18, Math.min(58, Number(e.target.value))))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </Field>
            <Field label="Service — years">
              <input
                type="number"
                min={0}
                max={45}
                value={years}
                onChange={(e) => setYears(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </Field>
            <Field label="Service — months">
              <input
                type="number"
                min={0}
                max={11}
                value={months}
                onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </Field>
            <Field label="PF balance you want to withdraw (₹)">
              <input
                type="number"
                min={0}
                value={balance}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={panLinked} onChange={(e) => setPanLinked(e.target.checked)} />
              PAN linked to UAN
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form15gFiled}
                onChange={(e) => setForm15gFiled(e.target.checked)}
              />
              Filed Form 15G/15H
            </label>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <p className="text-xs text-[var(--muted)]">You&apos;d receive today</p>
            <p className="tabular-nums text-2xl font-extrabold text-[var(--ok)] mt-1">
              {formatINR(netReceived)}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">{tds.reason}</p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--muted)]">Same amount left untouched to age 58</p>
            <p className="tabular-nums text-2xl font-extrabold text-[var(--bad)] mt-1">
              {formatINR(lostAtRetirement)}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              {yearsLeft > 0
                ? `Assuming ${yearsLeft} more year${yearsLeft !== 1 ? "s" : ""} at the current 8.25% EPF rate.`
                : "You're already at retirement age."}
            </p>
          </Card>
        </div>

        <Card>
          <h3 className="font-bold mb-2">Your EPS Pension, projected</h3>
          <p className="text-xs text-[var(--muted)] mb-3 font-mono">
            Monthly Pension = (Pensionable Salary × Pensionable Service) ÷ 70
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <p className="text-xs text-[var(--muted)]">Pensionable salary (capped at ₹15,000)</p>
              <p className="tabular-nums font-semibold">{formatINR(pension.pensionableSalary)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)]">Pensionable service (rounded)</p>
              <p className="tabular-nums font-semibold">{pension.pensionableServiceYears} years</p>
            </div>
          </div>
          {pension.eligible ? (
            <p className="text-sm">
              Projected monthly pension at 58:{" "}
              <span className="tabular-nums font-extrabold text-[var(--primary)]">
                {formatINR(pension.monthlyPension)}
              </span>
            </p>
          ) : (
            <p className="text-sm text-[var(--warn)]">
              ⚠ You need 10 years of pensionable service to qualify for a monthly pension. Below that,
              EPS offers a one-time withdrawal benefit (Form 10C) instead.
            </p>
          )}
          <p className="mt-3 text-xs text-[var(--muted)]">
            Illustrative estimate only — your actual pension depends on your full salary history and
            EPFO&apos;s final calculation.
          </p>
        </Card>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
          >
            Check my own PF account →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
