"use client";

import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { useSession } from "@/lib/session";
import { formatINR, formatDate } from "@/lib/format";
import { liveMemberIds, liveStrandedAccounts } from "@/lib/liveMemberIds";

export default function Journey() {
  const { persona, overrides } = useSession();
  if (!persona) return <Shell><PageSkeleton /></Shell>;

  const stranded = liveStrandedAccounts(persona, overrides);
  const memberIds = liveMemberIds(persona, overrides);

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Your PF Journey</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Every employer, every account, in one place — including money you might have forgotten
        about.
      </p>

      {stranded.length > 0 && (
        <Card className="mb-6 border-[var(--warn)] bg-[var(--warn-bg)]">
          <p className="font-semibold text-sm">
            ⚠ {formatINR(stranded.reduce((s, m) => s + m.balance, 0))} is sitting in{" "}
            {stranded.length} account{stranded.length > 1 ? "s" : ""} you never transferred.
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            Accounts with no contribution for 3+ years stop earning interest. Transfer it into your
            current account to keep it growing.
          </p>
          <div className="mt-3">
            <LinkButton href="/transfer" variant="primary">
              Start transfer →
            </LinkButton>
          </div>
        </Card>
      )}

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-[var(--border)]" />
        {memberIds.map((m) => (
          <div key={m.id} className="relative mb-5">
            <div
              className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-[var(--surface)]"
              style={{ background: m.to ? (m.transferred ? "var(--ok)" : "var(--warn)") : "var(--primary)" }}
            />
            <Card>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{m.employer}</p>
                <span className="text-xs text-[var(--muted)]">
                  {m.to ? "Previous" : "Current"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {formatDate(m.from)} – {m.to ? formatDate(m.to) : "Present"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="tabular-nums font-bold">{formatINR(m.balance)}</span>
                {m.to && (
                  <span
                    className={`text-xs font-semibold ${m.transferred ? "text-[var(--ok)]" : "text-[var(--warn)]"}`}
                  >
                    {m.transferred ? "✓ Transferred" : "Not transferred"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs font-mono text-[var(--muted)] truncate">{m.id}</p>
            </Card>
          </div>
        ))}
      </div>
    </Shell>
  );
}
