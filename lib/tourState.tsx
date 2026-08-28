"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./session";
import { TOUR_STEPS } from "./tour";

interface TourState {
  active: boolean;
  stepIndex: number;
  start: () => void;
  next: () => void;
  stop: () => void;
}

const TourContext = createContext<TourState | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { login } = useSession();
  const router = useRouter();

  function goToStep(index: number) {
    const step = TOUR_STEPS[index];
    if (!step) return;
    login(step.uan, "Demo123!");
    router.push(step.route);
    setStepIndex(index);
  }

  function start() {
    setActive(true);
    goToStep(0);
  }

  function next() {
    if (stepIndex + 1 < TOUR_STEPS.length) {
      goToStep(stepIndex + 1);
    } else {
      stop();
    }
  }

  function stop() {
    setActive(false);
    setStepIndex(0);
  }

  return (
    <TourContext.Provider value={{ active, stepIndex, start, next, stop }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
