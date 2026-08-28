"use client";

import { useState } from "react";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { ReadAloud } from "@/components/ui/ReadAloud";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { totalEmployeeShare, totalEmployerShare } from "@/lib/mock/personas";
import { formatINR } from "@/lib/format";
import {
  futureValueLost,
  yearsToRetirement,
  estimateTds,
  estimatePension,
  approximateMonthlyBasic,
} from "@/lib/withdrawalMath";

export default function Withdraw() {
  const { persona, overrides } = useSession();
  const rules = usePfRules();
  // Lazy initializer: by the time this component mounts, SessionProvider has
  // already resolved `persona` from localStorage (it gates all children until
  // hydration completes), so it's safe to read here without an effect.
  const [amount, setAmount] = useState<number>(() =>
    persona ? Math.round((totalEmployeeShare(persona) + totalEmployerShare(persona)) * 0.3) : 0
  );

  const maxWithdrawable = persona ? totalEmployeeShare(persona) + totalEmployerShare(persona) : 0;

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  const panLinked = overrides.panLinked ?? persona.panLinked;
  const form15gFiled = overrides.form15gFiled ?? false;

  const tds = estimateTds(persona, form15gFiled, panLinked);
  const tdsAmount = Math.round(amount * tds.rate);
  const netReceived = amount - tdsAmount;
  const lostAtRetirement = futureValueLost(amount, persona.age);
  const years = yearsToRetirement(persona.age);

  const monthlyBasic = approximateMonthlyBasic(persona);
  const pension = estimatePension(persona, monthlyBasic);

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Withdrawal Advisor</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        What withdrawing today actually costs you at retirement — not just what you receive now.
      </p>

      <Card className="mb-6">
        <label className="text-xs font-semibold text-[var(--muted)]" htmlFor="withdraw-amount">
          How much do you want to withdraw?
        </label>
        <input
          id="withdraw-amount"
          type="range"
          min={0}
          max={maxWithdrawable}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full mt-2 accent-[var(--primary)]"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[var(--muted)]">₹0</span>
          <span className="tabular-nums text-2xl font-extrabold text-[var(--primary)]">
            {formatINR(amount)}
          </span>
          <span className="text-xs text-[var(--muted)]">{formatINR(maxWithdrawable)} max</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-xs text-[var(--muted)]">You&apos;d receive today</p>
          <p className="tabular-nums text-2xl font-extrabold text-[var(--ok)] mt-1">
            {formatINR(netReceived)}
          </p>
          {tds.applies && (
            <p className="text-xs text-[var(--warn)] mt-1">
              After {formatINR(tdsAmount)} TDS ({Math.round(tds.rate * 100)}%)
            </p>
          )}
        </Card>
        <Card>
          <p className="text-xs text-[var(--muted)]">Same amount left untouched to age 58</p>
          <p className="tabular-nums text-2xl font-extrabold text-[var(--bad)] mt-1">
            {formatINR(lostAtRetirement)}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {years > 0
              ? `Assuming ${years} more year${years !== 1 ? "s" : ""} at the current 8.25% EPF rate.`
              : "You're already at retirement age."}
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-1">
          <p className="font-semibold text-sm">Tax impact</p>
          <ReadAloud text={tds.reason} />
        </div>
        <p className="text-sm text-[var(--muted)]">{tds.reason}</p>
        {tds.applies && (
          <div className="mt-3 rounded-lg bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
            <span className="font-semibold text-[var(--fg)]">Consider a partial advance instead: </span>
            Form 31 advances for specific purposes — medical treatment, education, marriage, or
            housing — follow different rules and, depending on the reason, may not attract the same
            TDS as a full exit withdrawal. They also don&apos;t require you to leave your job.
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-bold">Your EPS Pension, projected</h3>
          <ReadAloud
            text={
              pension.eligible
                ? `Based on your pensionable service of ${pension.pensionableServiceYears} years and a pensionable salary of ${pension.pensionableSalary} rupees, your projected monthly pension at 58 is approximately ${pension.monthlyPension} rupees.`
                : `You have not yet reached the 10 years of service required for a monthly pension. You currently have ${persona.serviceYears} years and ${persona.serviceMonths} months.`
            }
          />
        </div>
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
            ⚠ You need 10 years of pensionable service to qualify for a monthly pension. You currently
            have {persona.serviceYears} years {persona.serviceMonths} months. Below 10 years, EPS
            offers a one-time withdrawal benefit (Form 10C) instead of a monthly pension — but any
            withdrawal here forfeits that service toward a future pension.
          </p>
        )}
        <p className="mt-3 text-xs text-[var(--muted)]">
          This is an illustrative estimate based on your latest visible contribution. Your actual
          pension depends on your full salary history and EPFO&apos;s final calculation.
        </p>
      </Card>
    </Shell>
  );
}
