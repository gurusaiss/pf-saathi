"use client";

import { useState, useEffect } from "react";

export function ReadAloud({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  // Starts false so SSR and the pre-hydration client render match (no window on
  // the server); flips true right after mount if the API is actually available.
  // Deliberately effect-based to avoid a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    } catch {
      setSpeaking(false);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={speaking ? "Stop reading aloud" : "Read this aloud"}
      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
    >
      {speaking ? "⏸ Stop" : "🔊 Listen"}
    </button>
  );
}
