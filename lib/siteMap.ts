export interface SiteRoute {
  path: string;
  label: string;
  description: string;
  keywords: string[];
  requiresLogin: boolean;
}

// Order matters for voice/text navigation matching: more specific routes are
// checked before the generic ones they'd otherwise be swallowed by (e.g.
// "claim pre-flight" must win over the plain "claims" match).
export const SITE_ROUTES: SiteRoute[] = [
  {
    path: "/claims/preflight",
    label: "Claim Pre-Flight Check",
    description: "Check a claim against every rejection reason before you file",
    keywords: ["preflight", "pre-flight", "pre flight", "ready to file", "before filing", "check my claim"],
    requiresLogin: true,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "Your PF health score and action center",
    keywords: ["dashboard", "home page", "my portal", "overview", "main page"],
    requiresLogin: true,
  },
  {
    path: "/journey",
    label: "PF Journey",
    description: "Every account and employer, in one timeline",
    keywords: ["journey", "my funds", "my fund", "my money", "my balance", "passbook", "money map"],
    requiresLogin: true,
  },
  {
    path: "/claims",
    label: "Claims",
    description: "Your claim history, explained in plain English",
    keywords: ["claim", "claims", "withdrawal history"],
    requiresLogin: true,
  },
  {
    path: "/contributions",
    label: "Contributions",
    description: "Salary slip vs EPFO record, month by month",
    keywords: ["contribution", "contributions", "salary deduction", "missing contribution", "ecr"],
    requiresLogin: true,
  },
  {
    path: "/family",
    label: "Family & Nomination",
    description: "File or check your e-Nomination",
    keywords: ["family", "nominee", "nomination", "edli"],
    requiresLogin: true,
  },
  {
    path: "/transfer",
    label: "Transfer old accounts",
    description: "Move stranded balances into your current account",
    keywords: ["transfer", "old account", "previous employer", "stranded", "merge account"],
    requiresLogin: true,
  },
  {
    path: "/withdraw",
    label: "Withdrawal Advisor",
    description: "What withdrawing today costs you at retirement",
    keywords: ["withdraw", "withdrawal", "tds", "pension estimate", "eps pension"],
    requiresLogin: true,
  },
  {
    path: "/grievance",
    label: "Grievance",
    description: "File and track an EPFiGMS grievance",
    keywords: ["grievance", "complaint", "my issue", "my issues", "epfigms"],
    requiresLogin: true,
  },
  {
    path: "/ask",
    label: "Ask",
    description: "Ask anything about your PF account",
    keywords: ["ask", "assistant", "chat"],
    requiresLogin: true,
  },
  {
    path: "/survivor",
    label: "Survivor support",
    description: "Filing a claim after a member has passed away",
    keywords: ["survivor", "death claim", "passed away", "nominee claim", "deceased"],
    requiresLogin: false,
  },
  {
    path: "/learn",
    label: "Learn the basics",
    description: "Seven things worth knowing before you file a claim",
    keywords: ["learn", "basics", "new to pf", "what is pf", "beginner"],
    requiresLogin: false,
  },
  {
    path: "/faq",
    label: "FAQ",
    description: "Common questions for employees, employers and pensioners",
    keywords: ["faq", "frequently asked", "questions"],
    requiresLogin: false,
  },
  {
    path: "/calculator",
    label: "Tax & Pension Calculator",
    description: "Estimate withdrawal TDS and your EPS pension — no login needed",
    keywords: ["calculator", "calculate", "tax", "tds", "pension calculator"],
    requiresLogin: false,
  },
  {
    path: "/",
    label: "Login page",
    description: "Sign in or try a demo account",
    keywords: ["login", "log in", "sign in", "log out", "logout", "sign out"],
    requiresLogin: false,
  },
];

export function matchRoute(input: string): SiteRoute | null {
  const lower = input.toLowerCase();
  for (const route of SITE_ROUTES) {
    if (route.keywords.some((k) => lower.includes(k))) return route;
  }
  return null;
}
