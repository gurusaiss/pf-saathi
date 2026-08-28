"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type TextScale = "normal" | "large" | "xl";
type Contrast = "normal" | "high";

interface A11yState {
  textScale: TextScale;
  setTextScale: (s: TextScale) => void;
  contrast: Contrast;
  setContrast: (c: Contrast) => void;
}

const A11yContext = createContext<A11yState | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [textScale, setTextScaleState] = useState<TextScale>("normal");
  const [contrast, setContrastState] = useState<Contrast>("normal");

  // Hydration-from-storage on mount — the server has no localStorage, so this
  // can't be read during render without a client/server mismatch.
  useEffect(() => {
    try {
      const savedScale = localStorage.getItem("pfsaathi_text_scale") as TextScale | null;
      const savedContrast = localStorage.getItem("pfsaathi_contrast") as Contrast | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedScale) setTextScaleState(savedScale);
      if (savedContrast) setContrastState(savedContrast);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-scale", textScale);
  }, [textScale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", contrast);
  }, [contrast]);

  function setTextScale(s: TextScale) {
    setTextScaleState(s);
    try {
      localStorage.setItem("pfsaathi_text_scale", s);
    } catch {}
  }

  function setContrast(c: Contrast) {
    setContrastState(c);
    try {
      localStorage.setItem("pfsaathi_contrast", c);
    } catch {}
  }

  return (
    <A11yContext.Provider value={{ textScale, setTextScale, contrast, setContrast }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}
