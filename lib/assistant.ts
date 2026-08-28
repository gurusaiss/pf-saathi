import { Persona, totalBalance } from "./mock/personas";
import { liveStrandedAccounts } from "./liveMemberIds";
import { ProfileOverrides } from "./overrides";
import { formatINR } from "./format";
import { RuleResult } from "./rules/rejectionRules";

export interface AssistantQA {
  id: string;
  question: string;
  keywords: string[];
  answer: (persona: Persona, rules: RuleResult[], overrides: ProfileOverrides) => string;
}

export const QA_LIBRARY: AssistantQA[] = [
  {
    id: "where-is-my-money",
    question: "Where is all my PF money?",
    keywords: ["where", "money", "balance", "how much"],
    answer: (p, _rules, overrides) => {
      const total = totalBalance(p);
      const stranded = liveStrandedAccounts(p, overrides);
      if (stranded.length === 0) {
        return `Your total visible balance is ${formatINR(total)}, all consolidated in your current account with ${p.currentEmployer}.`;
      }
      return `Your total visible balance is ${formatINR(total)}, but it's split across ${p.memberIds.length} accounts. ${formatINR(
        stranded.reduce((s, m) => s + m.balance, 0)
      )} is still sitting in ${stranded.length} old account${stranded.length > 1 ? "s" : ""} you haven't transferred yet. Open PF Journey to see the full breakdown.`;
    },
  },
  {
    id: "why-rejected",
    question: "Why was my claim rejected?",
    keywords: ["rejected", "reject", "claim fail", "why did"],
    answer: (p) => {
      const rejected = p.claims.filter((c) => c.status === "Rejected");
      if (rejected.length === 0) return "You don't have any rejected claims on record right now.";
      return rejected
        .map(
          (c) =>
            `Your ${c.type} filed on ${new Date(c.filedOn).toLocaleDateString("en-IN")} was rejected. EPFO's remark: "${c.rejectionRemark}". Open Claims to see the plain-English explanation and the exact fix.`
        )
        .join(" ");
    },
  },
  {
    id: "can-i-withdraw",
    question: "Can I withdraw my PF right now?",
    keywords: ["withdraw", "can i take", "cash out"],
    answer: (p, rules) => {
      const blocking = rules.filter((r) => r.claimRelevant && r.severity === "fail");
      if (blocking.length === 0) {
        return "Based on the checks we can run, there's nothing that would block a withdrawal claim right now. Run the Claim Pre-Flight Check before filing to be sure.";
      }
      return `Based on the information available, ${blocking.length} issue${blocking.length > 1 ? "s" : ""} would likely cause a withdrawal claim to be rejected: ${blocking.map((r) => r.label).join(", ")}. Open Claim Pre-Flight to fix ${blocking.length > 1 ? "them" : "it"} first.`;
    },
  },
  {
    id: "what-is-eps",
    question: "What is EPS and do I have a pension?",
    keywords: ["eps", "pension"],
    answer: (p) =>
      `EPS (Employees' Pension Scheme) is the pension portion of your PF — 8.33% of your employer's contribution, capped at ₹1,250/month, goes into it. It isn't a balance you can see growing; it converts into a monthly pension after 10 years of service, from age 58. You currently have ${p.serviceYears} years ${p.serviceMonths} months of service.`,
  },
  {
    id: "nomination-why",
    question: "Why does nomination matter?",
    keywords: ["nomination", "nominee", "family", "edli"],
    answer: (p, rules) => {
      const filed = rules.find((r) => r.id === "nomination")?.severity === "pass";
      return filed
        ? `You've already filed your e-Nomination (${p.nominee ?? "confirmed during filing"}). Your family's claim to your PF, EPS survivor pension, and EDLI insurance is protected.`
        : "Without a filed e-Nomination, your family loses easy access to up to ₹7,00,000 of EDLI insurance and your EPS survivor pension if something happens to you — they'd have to go through a longer legal process instead. Open Family & Nomination to file it — it takes about two minutes.";
    },
  },
  {
    id: "contribution-missing",
    question: "Why is a month's contribution missing?",
    keywords: ["missing", "gap", "didn't deposit", "employer didn't pay"],
    answer: (p) => {
      const gap = p.contributions.find((c) => c.salaryDeductionShown && !c.contributionVisible);
      if (!gap) return "All your months currently show a matching contribution — no gaps on record.";
      const month = new Date(gap.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      return `${month} shows a salary deduction with no matching EPFO contribution yet. This alone doesn't prove your employer failed to deposit it — it can be a posting delay. Open Contributions for the recommended checks.`;
    },
  },
];

export function matchQuestion(input: string): AssistantQA | null {
  const lower = input.toLowerCase();
  let best: AssistantQA | null = null;
  let bestScore = 0;
  for (const qa of QA_LIBRARY) {
    const score = qa.keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }
  return bestScore > 0 ? best : null;
}
