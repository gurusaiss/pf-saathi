"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSession } from "@/lib/session";
import { maskUAN } from "@/lib/format";
import { t } from "@/lib/i18n";
import { HomeIcon, CompassIcon, DocumentIcon, ChartIcon, FamilyIcon, ChatIcon } from "@/components/pf/Icons";

const NAV = [
  { href: "/dashboard", label: "Home", Icon: HomeIcon },
  { href: "/journey", label: "PF Journey", Icon: CompassIcon },
  { href: "/claims", label: "Claims", Icon: DocumentIcon },
  { href: "/contributions", label: "Contributions", Icon: ChartIcon },
  { href: "/family", label: "Family", Icon: FamilyIcon },
  { href: "/ask", label: "Ask", Icon: ChatIcon },
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
      <header className="sticky top-0 z-30 bg-[var(--primary)] text-white shadow-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15 text-sm font-extrabold tracking-tight">
              PF
            </span>
            <span className="text-base font-bold tracking-tight">PF Saathi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  pathname === href
                    ? "bg-white text-[var(--primary)]"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {t(lang, label)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-md border border-white/30 px-2 py-1 text-xs font-bold text-white hover:bg-white/10"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            <span className="hidden sm:inline text-xs text-white/70 tabular-nums font-medium">
              UAN {maskUAN(persona.uan)}
            </span>
            <button
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="text-xs font-bold text-white/85 hover:text-white"
            >
              {t(lang, "Log out")}
            </button>
          </div>
        </div>
        <div className="tricolor-rule" />
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)] grid grid-cols-6">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold ${
              pathname === href ? "text-[var(--primary)]" : "text-[var(--muted)]"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {t(lang, label)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
