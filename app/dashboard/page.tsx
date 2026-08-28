"use client";

import Link from "next/link";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { ScoreRing } from "@/components/pf/ScoreRing";
import { MoneyMap } from "@/components/pf/MoneyMap";
import { SeverityBadge } from "@/components/ui/Badge";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { totalBalance } from "@/lib/mock/personas";
import { liveStrandedAccounts } from "@/lib/liveMemberIds";
import { formatINR, serviceDuration } from "@/lib/format";
import { t } from "@/lib/i18n";

export default function Dashboard() {
  const { persona, overrides, lang } = useSession();
  const rules = usePfRules();

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  const balance = totalBalance(persona);
  const stranded = liveStrandedAccounts(persona, overrides);

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Good to see you, {persona.name.split(" ")[0]}</h1>
      <p className="text-sm text-[var(--muted)] mb-6">{t(lang, "Here's your PF at a glance.")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-2">
          <p className="text-xs text-[var(--muted)]">{t(lang, "Total visible balance across all accounts")}</p>
          <p className="tabular-nums text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mt-1">
            {formatINR(balance)}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Stat label={t(lang, "Service history")} value={serviceDuration(persona.serviceYears, persona.serviceMonths)} />
            <Stat label={t(lang, "Employers")} value={String(persona.memberIds.length)} />
            <Stat
              label={t(lang, "Stranded balance")}
              value={stranded.length > 0 ? formatINR(stranded.reduce((s, m) => s + m.balance, 0)) : "None"}
              warn={stranded.length > 0}
            />
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-[var(--muted)] mb-2">{t(lang, "PF Health")}</p>
          <ScoreRing score={rules.health} size={104} />
          <p className="mt-2 text-xs text-[var(--muted)]">
            {(() => {
              const n = rules.ambientAttention.length + rules.preflightAttention.length;
              return `${n} item${n !== 1 ? "s" : ""} need${n === 1 ? "s" : ""} attention`;
            })()}
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">{t(lang, "Action Center")}</h3>
          <span className="text-xs text-[var(--muted)]">
            {rules.attention.length} item{rules.attention.length !== 1 ? "s" : ""}
          </span>
        </div>
        {rules.attention.length === 0 ? (
          <p className="text-sm text-[var(--ok)]">✓ Nothing needs your attention right now.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {rules.attention.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{r.reason}</p>
                </div>
                <SeverityBadge severity={r.severity} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/claims/preflight" className="text-sm font-semibold text-[var(--primary)] underline underline-offset-2">
            Run full claim pre-flight →
          </Link>
          <Link href="/withdraw" className="text-sm font-semibold text-[var(--primary)] underline underline-offset-2">
            What would withdrawing cost me? →
          </Link>
        </div>
      </Card>

      <MoneyMap persona={persona} />
    </Shell>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`tabular-nums font-semibold ${warn ? "text-[var(--warn)]" : ""}`}>{value}</p>
    </div>
  );
}
