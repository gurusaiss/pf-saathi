"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const { login, persona, lang, setLang } = useSession();
  const tour = useTour();
  const router = useRouter();
  const [uan, setUan] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (persona) router.replace("/dashboard");
  }, [persona, router]);

  if (persona) return null;

  function tryLogin(u: string, p: string, destination = "/dashboard") {
    const ok = login(u, p);
    if (ok) {
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

  return (
    <>
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 gap-3">
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
          <div className="mx-auto max-w-6xl flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 text-xs sm:text-sm font-semibold overflow-x-auto">
            <Link href="/learn" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              Learn the basics
            </Link>
            <Link href="/survivor" className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/85 hover:bg-white/10 hover:text-white">
              Survivor support
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-6 sm:pt-16">
        <p className="eyebrow text-[var(--gold)]">
          Employees&apos; Provident Fund — made understandable
        </p>
        <h1 className="mt-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--primary)] leading-tight max-w-4xl">
          {t(lang, "Understand your PF. Find what's wrong. Know what to do next.")}
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)] text-base sm:text-lg lg:text-xl">
          12% of your salary goes into EPF every month, and your employer adds 12% more. You&apos;ve
          had three jobs. Do you know where that money is?
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Promise title={t(lang, "You will know what's yours")} />
          <Promise title={t(lang, "Your claim will not be rejected")} />
          <Promise title={t(lang, "You will know what it costs")} />
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            className="text-base px-6 py-3"
            onClick={() => tour.start()}
          >
            ▶ Judge Mode — 60-second tour
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/learn" className="text-sm font-semibold text-[var(--primary)] underline underline-offset-2">
          New to PF? Start here →
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-bold mb-4">{t(lang, "What do you need help with?")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SITUATIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSituation(s.uan)}
              className="text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)] transition-colors"
            >
              <s.Icon className="h-6 w-6 text-[var(--primary)]" strokeWidth={1.6} />
              <p className="mt-2 text-sm font-semibold">{t(lang, s.label)}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="login" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
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
                className="w-full text-left rounded-xl border border-[var(--border)] p-3 hover:border-[var(--primary)] transition-colors"
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
    </>
  );
}

function Promise({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3">
      <p className="text-sm font-semibold text-[var(--primary)]">{title}</p>
    </div>
  );
}
