"use client";

import { useTour } from "@/lib/tourState";
import { TOUR_STEPS } from "@/lib/tour";
import { Button } from "@/components/ui/Button";

export function JudgeTourOverlay() {
  const { active, stepIndex, next, stop } = useTour();
  if (!active) return null;

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md md:bottom-6">
      <div className="rounded-2xl bg-[var(--primary)] text-[var(--primary-fg)] p-4 shadow-2xl">
        <div className="flex items-center gap-1 mb-2">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-[var(--gold)]" : "bg-white/25"}`}
            />
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
          Step {stepIndex + 1} of {TOUR_STEPS.length}
        </p>
        <p className="font-bold mt-1">{step.title}</p>
        <p className="text-sm text-white/85 mt-1">{step.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={stop} className="text-xs font-semibold text-white/70 hover:text-white">
            End tour
          </button>
          <Button
            onClick={next}
            className="!bg-white !text-[var(--primary)] hover:!opacity-90"
          >
            {isLast ? "Finish" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
