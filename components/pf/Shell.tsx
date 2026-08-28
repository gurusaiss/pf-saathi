"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSession } from "@/lib/session";
import { maskUAN } from "@/lib/format";
import { t } from "@/lib/i18n";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/journey", label: "PF Journey", icon: "🧭" },
  { href: "/claims", label: "Claims", icon: "📋" },
  { href: "/contributions", label: "Contributions", icon: "📊" },
  { href: "/family", label: "Family", icon: "❤️" },
  { href: "/ask", label: "Ask", icon: "💬" },
];

export function Shell({ children }: { children: ReactNode }) {
  const { persona, logout, lang, setLang } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!persona) router.replace("/");
  }, [persona, router]);

  if (!persona) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-30">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-[var(--primary)]">
            <span className="text-lg">PF Saathi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "text-[var(--fg)] hover:bg-[var(--bg)]"
                }`}
              >
                {t(lang, item.label)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--bg)]"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            <span className="hidden sm:inline text-xs text-[var(--muted)] tabular-nums">
              UAN {maskUAN(persona.uan)}
            </span>
            <button
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--bad)]"
            >
              {t(lang, "Log out")}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] grid grid-cols-6">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${
              pathname === item.href ? "text-[var(--primary)]" : "text-[var(--muted)]"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {t(lang, item.label)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
