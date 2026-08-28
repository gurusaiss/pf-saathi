export interface TourStep {
  uan: string; // which persona should be logged in for this step
  route: string;
  title: string;
  description: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    uan: "100200300402",
    route: "/dashboard",
    title: "Meet Priya",
    description:
      "Two rejected withdrawal claims. PF Health is 45% — every check that can block a claim, in one place.",
  },
  {
    uan: "100200300402",
    route: "/claims",
    title: "The rejection, translated",
    description:
      'EPFO told her "NAME DIFFERS AS PER RECORD." Tap "What does this mean?" to see the plain-English version.',
  },
  {
    uan: "100200300402",
    route: "/claims/preflight",
    title: "Claim Pre-Flight — the hero feature",
    description:
      "Her score starts at 31%. Try tapping a few Fix buttons below and watch it climb toward 100% live.",
  },
  {
    uan: "100200300401",
    route: "/journey",
    title: "Now meet Rahul — three jobs, forgotten money",
    description: "₹1,24,900 has been sitting in two old accounts he never transferred.",
  },
  {
    uan: "100200300401",
    route: "/transfer",
    title: "Job-Change Autopilot",
    description: "One flow merges both old accounts into his current one. Try Confirm transfer.",
  },
  {
    uan: "100200300404",
    route: "/family",
    title: "Neha — 14 years of service, no nomination",
    description: "Without it, her family loses easy access to ₹7,00,000 of EDLI insurance.",
  },
];
