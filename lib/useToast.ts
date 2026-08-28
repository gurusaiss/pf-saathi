"use client";

import { useRef, useState, useCallback } from "react";

export function useToast(duration = 4000) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (text: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage(text);
      timeoutRef.current = setTimeout(() => setMessage(null), duration);
    },
    [duration]
  );

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(null);
  }, []);

  return { message, show, dismiss };
}
