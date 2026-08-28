"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Persona, getPersonaByUan } from "./mock/personas";
import { ProfileOverrides, FIX_ACTIONS } from "./overrides";

interface SessionState {
  persona: Persona | null;
  overrides: ProfileOverrides;
  login: (uan: string, password: string) => boolean;
  logout: () => void;
  applyFix: (fixType: string) => void;
  resetOverrides: () => void;
  lang: "en" | "hi";
  setLang: (l: "en" | "hi") => void;
}

const SessionContext = createContext<SessionState | null>(null);

const UAN_KEY = "pfsaathi_uan";
const overridesKey = (uan: string) => `pfsaathi_overrides_${uan}`;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [overrides, setOverrides] = useState<ProfileOverrides>({});
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [hydrated, setHydrated] = useState(false);

  // Reading localStorage during render would produce a client/server mismatch
  // (the server has no localStorage). This one-time hydration-from-storage
  // effect, gated by `hydrated` below, is the standard safe pattern for this
  // situation — intentional, not a smell the lint rule should flag.
  useEffect(() => {
    try {
      const savedUan = localStorage.getItem(UAN_KEY);
      if (savedUan) {
        const p = getPersonaByUan(savedUan);
        if (p) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPersona(p);
          const savedOverrides = localStorage.getItem(overridesKey(p.uan));
          if (savedOverrides) setOverrides(JSON.parse(savedOverrides));
        }
      }
      const savedLang = localStorage.getItem("pfsaathi_lang");
      if (savedLang === "hi" || savedLang === "en") setLang(savedLang);
    } catch {
      // localStorage unavailable — proceed logged out
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever the live overrides change, rather than
  // writing inline wherever they're set — that would mean computing the next
  // value from the `overrides` closure, which goes stale if two fixes are
  // applied before a re-render (e.g. two quick clicks) and silently drops one.
  useEffect(() => {
    if (!persona) return;
    try {
      localStorage.setItem(overridesKey(persona.uan), JSON.stringify(overrides));
    } catch {}
  }, [persona, overrides]);

  function login(uan: string, password: string): boolean {
    const p = getPersonaByUan(uan.trim());
    if (!p || p.password !== password) return false;
    setPersona(p);
    setOverrides({}); // fresh session — always starts from the real baseline
    try {
      localStorage.setItem(UAN_KEY, p.uan);
    } catch {}
    return true;
  }

  function logout() {
    setPersona(null);
    setOverrides({});
    try {
      localStorage.removeItem(UAN_KEY);
    } catch {}
  }

  const applyFix = useCallback((fixType: string) => {
    const field = FIX_ACTIONS[fixType];
    if (!field) return;
    setOverrides((prev) => ({ ...prev, [field]: true }));
  }, []);

  function resetOverrides() {
    setOverrides({});
  }

  function updateLang(l: "en" | "hi") {
    setLang(l);
    try {
      localStorage.setItem("pfsaathi_lang", l);
    } catch {}
  }

  if (!hydrated) return null;

  return (
    <SessionContext.Provider
      value={{ persona, overrides, login, logout, applyFix, resetOverrides, lang, setLang: updateLang }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
