"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { useTour } from "@/lib/tourState";
import { personas } from "@/lib/mock/personas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import {
  SwapIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  HeartIcon,
  ReceiptIcon,
  UserIcon,
} from "@/components/pf/Icons";

const SITUATIONS = [
  { Icon: SwapIcon, label: "I changed jobs", uan: "100200300401" },
  { Icon: AlertCircleIcon, label: "My claim was rejected", uan: "100200300402" },
  { Icon: AlertTriangleIcon, label: "My contribution is missing", uan: "100200300403" },
  { Icon: HeartIcon, label: "Protect my family & nominee", uan: "100200300404" },
  { Icon: ReceiptIcon, label: "I don't understand my PF", uan: "100200300401" },
  { Icon: UserIcon, label: "Check my PF profile", uan: "100200300401" },
];

type Audience = "employee" | "employer" | "pensioner";

export default function Home() {
  const { login, persona, lang, setLang } = useSession();
  const tour = useTour();
  const router = useRouter();
  const [uan, setUan] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [audience, setAudience] = useState<Audience>("employee");
  // Set the instant a login on this page sends the user somewhere specific
  // (e.g. a demo tile deep-linking into /contributions) — the redirect effect
  // below checks it so it doesn't clobber that destination with /dashboard.
  const explicitDestinationRef = useRef(false);

  useEffect(() => {
    if (persona && !explicitDestinationRef.current) router.replace("/dashboard");
  }, [persona, router]);

  if (persona) return null;

  function tryLogin(u: string, p: string, destination = "/dashboard") {
    const ok = login(u, p);
    if (ok) {
      explicitDestinationRef.current = destination !== "/dashboard";
      router.push(destination);
    } else {
      setError("UAN or password not recognised. Try one of the demo accounts below.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    tryLogin(uan, password);
  }

  function handleSituation(situationUan: string) {
    const persona = personas.find((p) => p.uan === situationUan)!;
    tryLogin(persona.uan, persona.password);
  }

  function openAs(situationUan: string, destination: string) {
    const persona = personas.find((p) => p.uan === situationUan)!;
    tryLogin(persona.uan, persona.password, destination);
  }

  return (
    <>
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-white text-sm font-extrabold tracking-tight">
              PF
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[var(--primary)]">PF Saathi</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--bg)]"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            <a
              href="#login"
              className="rounded-md border-[1.5px] border-[color:var(--primary)] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              Log in
            </a>
          </div>
        </div>
        <nav className="bg-[var(--primary)]">
          <div className="mx-auto max-w-7xl flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 text-xs sm:text-sm font-semibold overflow-x-auto">
            <Link href="/learn" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              Learn the basics
            </Link>
            <Link href="/survivor" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              Survivor support
            </Link>
            <Link href="/faq" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              FAQ
            </Link>
            <Link href="/calculator" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              Tax & Pension Calculator
            </Link>
            <button
              onClick={() => tour.start()}
              className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white"
            >
              60-second judge tour
            </button>
          </div>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-dark)_100%)]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <p className="eyebrow text-[var(--gold)]">
            Employees&apos; Provident Fund — made understandable
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
            {t(lang, "Understand your PF. Find what's wrong. Know what to do next.")}
          </h1>
          <p className="mt-4 max-w-3xl text-white/80 text-base sm:text-lg lg:text-xl">
            12% of your salary goes into EPF every month, and your employer adds 12% more. You&apos;ve
            had three jobs. Do you know where that money is?
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Promise title={t(lang, "You will know what's yours")} />
            <Promise title={t(lang, "Your claim will not be rejected")} />
            <Promise title={t(lang, "You will know what it costs")} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              className="text-base px-6 py-3 !bg-[var(--gold)] !text-[#1A1400] hover:!brightness-110"
              onClick={() => tour.start()}
            >
              ▶ Judge Mode — 60-second tour
            </Button>
            <Link href="/learn" className="text-sm font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
              New to PF? Start here →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <Stat value="24%" label="of your salary saved every month, combined" />
          <Stat value="10" label="rejection reasons checked before you file" />
          <Stat value="₹7L" label="EDLI cover most members never claim" />
          <Stat value="0" label="rupees this prototype ever touches for real" />
        </div>
      </section>

      <section className="bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg sm:text-xl font-bold mb-1">EPFO and You</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Every EPF member falls into one of three groups — pick yours to see what matters to you.
          </p>

          <div className="flex gap-2 mb-5" role="tablist">
            {(
              [
                ["employee", "For Employees"],
                ["employer", "For Employers"],
                ["pensioner", "For Pensioners"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={audience === value}
                onClick={() => setAudience(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
                  audience === value
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {audience === "employee" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AudienceTile
                title="Check your PF health"
                desc="One score across every rejection risk and account issue."
                cta="Open dashboard →"
                onClick={() => openAs("100200300402", "/dashboard")}
              />
              <AudienceTile
                title="Pre-flight your claim"
                desc="Catch the reason EPFO would reject it, before you file."
                cta="Run pre-flight →"
                onClick={() => openAs("100200300402", "/claims/preflight")}
              />
              <AudienceTile
                title="Find stranded balances"
                desc="Old employer, old account — see it and transfer it."
                cta="Open PF Journey →"
                onClick={() => openAs("100200300401", "/journey")}
              />
            </div>
          )}

          {audience === "employer" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AudienceTile
                title="Contribution compliance signal"
                desc="See the same gap-visibility view your employees see, before it becomes a grievance."
                cta="Open contributions →"
                onClick={() => openAs("100200300403", "/contributions")}
              />
              <AudienceTile
                title="Employer FAQ"
                desc="What a contribution gap means, and what's expected of you."
                cta="Read FAQ →"
                onClick={() => router.push("/faq")}
              />
              <AudienceTile
                title="Full employer portal"
                desc="UAN management, ECR filing and registration aren't built in this prototype — use EPFO's own portal for those."
                cta="Go to epfindia.gov.in ↗"
                onClick={() => window.open("https://www.epfindia.gov.in", "_blank", "noreferrer")}
              />
            </div>
          )}

          {audience === "pensioner" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AudienceTile
                title="Estimate your pension — no login"
                desc="Enter your own salary and service years to see the EPS formula worked out."
                cta="Open calculator →"
                onClick={() => router.push("/calculator")}
              />
              <AudienceTile
                title="Survivor claim guide"
                desc="Filing PF, EPS pension, and EDLI claims for a member who has passed away."
                cta="Open guide →"
                onClick={() => router.push("/survivor")}
              />
              <AudienceTile
                title="Pensioner FAQ"
                desc="Eligibility, family pension, and nomination questions."
                cta="Read FAQ →"
                onClick={() => router.push("/faq")}
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-lg sm:text-xl font-bold mb-1">{t(lang, "What do you need help with?")}</h2>
        <p className="text-sm text-[var(--muted)] mb-5">Pick what matches your situation — we&apos;ll pull up an account that shows exactly it.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SITUATIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSituation(s.uan)}
              className="group text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg)] group-hover:bg-[var(--primary)] transition-colors duration-200">
                <s.Icon className="h-5 w-5 text-[var(--primary)] group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
              </span>
              <p className="mt-3 text-sm font-semibold">{t(lang, s.label)}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="login" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
        <Card>
          <h3 className="font-bold mb-3">{t(lang, "Log in")}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[var(--muted)]">
                Universal Account Number (UAN)
              </label>
              <input
                value={uan}
                onChange={(e) => setUan(e.target.value)}
                placeholder="100200300401"
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted)]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Demo123!"
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-sm text-[var(--bad)]">{error}</p>}
            <Button type="submit" className="w-full">
              {t(lang, "Log in")}
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">{t(lang, "Demo access — click to try instantly")}</h3>
          <div className="space-y-2">
            {personas.map((p) => (
              <button
                key={p.uan}
                onClick={() => handleSituation(p.uan)}
                className="w-full text-left rounded-xl border border-[var(--border)] p-3 hover:border-[var(--primary)] hover:bg-[var(--bg)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span className="text-xs text-[var(--muted)] tabular-nums">UAN {p.uan}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{p.scenarioSummary}</p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Password for all demo accounts: <span className="tabular-nums font-semibold">Demo123!</span>
          </p>
        </Card>
      </section>
      </main>

      <footer className="bg-[var(--primary-dark)] text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white text-xs font-extrabold">
              PF
            </span>
            <span className="font-semibold text-white">PF Saathi</span>
            <span className="opacity-60">— an unofficial hackathon prototype</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/survivor" className="hover:text-white transition-colors">Survivor support</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/calculator" className="hover:text-white transition-colors">Calculator</Link>
            <a href="https://www.epfindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Real EPFO site ↗
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function Promise({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 flex items-center gap-2.5 shadow-sm">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ok-bg)] text-[var(--ok)] text-xs font-bold">
        ✓
      </span>
      <p className="text-sm font-semibold text-[var(--primary)]">{title}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] tabular-nums">{value}</p>
      <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}

function AudienceTile({
  title,
  desc,
  cta,
  onClick,
}: {
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <p className="font-bold text-sm">{title}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{desc}</p>
      <p className="mt-3 text-xs font-semibold text-[var(--primary)]">{cta}</p>
    </button>
  );
}
