"use client";

import { useState } from "react";
import { Persona, totalEmployeeShare, totalEmployerShare, totalEpsShare } from "@/lib/mock/personas";
import { liveMemberIds } from "@/lib/liveMemberIds";
import { useSession } from "@/lib/session";
import { formatINR, formatDate, maskUAN } from "@/lib/format";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

export function MoneyMap({ persona }: { persona: Persona }) {
  const [asIs, setAsIs] = useState(false);
  const { lang } = useSession();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{t(lang, "Money Map")}</h3>
        <button
          onClick={() => setAsIs((v) => !v)}
          className="text-xs font-semibold rounded-full border border-[var(--border)] px-3 py-1 hover:bg-[var(--bg)]"
        >
          {asIs ? "← Back to PF Saathi view" : "See it as the current EPFO passbook →"}
        </button>
      </div>

      {asIs ? <AsIsPassbook persona={persona} /> : <SaathiMoneyMap persona={persona} />}
    </Card>
  );
}

function SaathiMoneyMap({ persona }: { persona: Persona }) {
  const { overrides } = useSession();
  const employee = totalEmployeeShare(persona);
  const employer = totalEmployerShare(persona);
  const eps = totalEpsShare(persona);
  const total = employee + employer + eps;
  const memberIds = liveMemberIds(persona, overrides);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Slice label="Your contribution" amount={employee} pct={(employee / total) * 100} color="var(--primary)" />
        <Slice label="Employer contribution" amount={employer} pct={(employer / total) * 100} color="var(--gold)" />
        <Slice label="Pension (EPS)" amount={eps} pct={(eps / total) * 100} color="var(--ok)" />
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        EPS has no withdrawable balance before 10 years of service — it converts to a monthly pension at 58.
      </p>
      <div className="space-y-2">
        {memberIds.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{m.employer}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatDate(m.from)} – {m.to ? formatDate(m.to) : "Present"}
                {!m.transferred && m.to && (
                  <span className="ml-2 text-[var(--warn)] font-semibold">Not transferred</span>
                )}
              </p>
            </div>
            <span className="tabular-nums font-semibold text-sm">{formatINR(m.balance)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slice({ label, amount, pct, color }: { label: string; amount: number; pct: number; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="tabular-nums font-bold text-lg" style={{ color }}>
        {formatINR(amount)}
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-[var(--bg)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// A deliberately unhelpful recreation of the real portal's PDF-style passbook —
// raw ledger rows, no explanation, to make the contrast with PF Saathi obvious.
function AsIsPassbook({ persona }: { persona: Persona }) {
  return (
    <div className="font-mono text-[11px] border border-neutral-400 bg-white text-black p-3 overflow-x-auto">
      <p className="font-bold mb-2">MEMBER PASSBOOK — UAN: {maskUAN(persona.uan)}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-400">
            <th className="text-left py-1 pr-2">EST. ID</th>
            <th className="text-left py-1 pr-2">ESTABLISHMENT NAME</th>
            <th className="text-right py-1 pr-2">EE SHARE</th>
            <th className="text-right py-1 pr-2">ER SHARE</th>
            <th className="text-right py-1">PENSION</th>
          </tr>
        </thead>
        <tbody>
          {persona.memberIds.map((m) => (
            <tr key={m.id} className="border-b border-neutral-200">
              <td className="py-1 pr-2 truncate max-w-[120px]">{m.id}</td>
              <td className="py-1 pr-2">{m.employer.toUpperCase()}</td>
              <td className="py-1 pr-2 text-right">{m.employeeShare}</td>
              <td className="py-1 pr-2 text-right">{m.employerShare}</td>
              <td className="py-1 text-right">{m.epsShare}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-neutral-500">
        * Data reflects last processed ECR. Contact your employer for discrepancies.
      </p>
    </div>
  );
}
