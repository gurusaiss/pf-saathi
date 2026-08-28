// PF Saathi — core rules engine
// One engine, two surfaces: passive "PF Health" on the dashboard,
// active "Pre-Flight" when the user starts a claim.

export type Severity = "pass" | "warn" | "fail";

export interface RuleResult {
  id: string;
  label: string;
  severity: Severity;
  reason: string; // plain-English explanation of the current state
  consequence?: string; // what happens if unresolved
  fixLabel?: string; // CTA text, e.g. "Fix name mismatch"
  fixRoute?: string; // route for the fix flow
  resolutionTime?: string; // e.g. "~7 working days"
  claimRelevant: boolean; // true if this check can actually block a claim from being paid
}

export interface EmployeeProfile {
  uan: string;
  name: string;
  aadhaarName: string;
  dob: string;
  aadhaarDob: string;
  aadhaarLinked: boolean;
  panLinked: boolean;
  kycAttestedByEmployer: boolean;
  bankIfsc: string;
  bankIfscValid: boolean;
  dateOfExitFiled: boolean;
  nominationFiled: boolean;
  form15gFiled: boolean;
  serviceYears: number;
  serviceMonths: number;
  memberIds: {
    id: string;
    employer: string;
    from: string;
    to: string | null;
    transferred: boolean;
    balance: number;
  }[];
}

// Pure function — runs the same 14 checks whether called passively
// (dashboard "PF Health") or actively (pre-claim "Pre-Flight").
export function runRules(profile: EmployeeProfile): RuleResult[] {
  const results: RuleResult[] = [];

  // 1. Name vs Aadhaar
  const nameMatches =
    profile.name.trim().toLowerCase() === profile.aadhaarName.trim().toLowerCase();
  results.push({
    id: "name-match",
    label: "Name matches Aadhaar",
    severity: nameMatches ? "pass" : "fail",
    reason: nameMatches
      ? "Your EPFO name matches your Aadhaar record."
      : `EPFO has "${profile.name}", Aadhaar has "${profile.aadhaarName}". Claims are commonly rejected for this exact mismatch.`,
    consequence: nameMatches ? undefined : "Claim rejected: NAME DIFFERS AS PER RECORD.",
    fixLabel: nameMatches ? undefined : "Fix name mismatch",
    fixRoute: nameMatches ? undefined : "/fix/name-mismatch",
    resolutionTime: nameMatches ? undefined : "~7 working days (Joint Declaration)",
    claimRelevant: true,
  });

  // 2. DOB vs Aadhaar
  const dobMatches = profile.dob === profile.aadhaarDob;
  results.push({
    id: "dob-match",
    label: "Date of birth matches Aadhaar",
    severity: dobMatches ? "pass" : "warn",
    reason: dobMatches
      ? "Your date of birth matches your Aadhaar record."
      : `EPFO has ${profile.dob}, Aadhaar has ${profile.aadhaarDob}. Small mismatches can still trigger a rejection.`,
    consequence: dobMatches ? undefined : "May cause a data-mismatch rejection.",
    fixLabel: dobMatches ? undefined : "Fix date of birth",
    fixRoute: dobMatches ? undefined : "/fix/dob-mismatch",
    resolutionTime: dobMatches ? undefined : "~7 working days (Joint Declaration)",
    claimRelevant: true,
  });

  // 3. Aadhaar linked
  results.push({
    id: "aadhaar-linked",
    label: "Aadhaar linked and verified",
    severity: profile.aadhaarLinked ? "pass" : "fail",
    reason: profile.aadhaarLinked
      ? "Your Aadhaar is linked and verified with your UAN."
      : "Your Aadhaar is not linked to your UAN. Most online claims require this.",
    consequence: profile.aadhaarLinked ? undefined : "Online claim filing will be blocked.",
    fixLabel: profile.aadhaarLinked ? undefined : "Link Aadhaar",
    fixRoute: profile.aadhaarLinked ? undefined : "/fix/aadhaar-link",
    claimRelevant: true,
  });

  // 4. PAN linked (TDS)
  results.push({
    id: "pan-linked",
    label: "PAN linked",
    severity: profile.panLinked ? "pass" : "warn",
    reason: profile.panLinked
      ? "Your PAN is linked. Standard TDS rates apply if applicable."
      : "Your PAN is not linked. If your service is under 5 years, a higher TDS rate applies without PAN.",
    consequence: profile.panLinked ? undefined : "Higher TDS deduction on withdrawal.",
    fixLabel: profile.panLinked ? undefined : "Link PAN",
    fixRoute: profile.panLinked ? undefined : "/fix/pan-link",
    claimRelevant: true,
  });

  // 5. KYC attested by employer
  results.push({
    id: "kyc-attested",
    label: "KYC digitally attested by employer",
    severity: profile.kycAttestedByEmployer ? "pass" : "fail",
    reason: profile.kycAttestedByEmployer
      ? "Your KYC details have been digitally approved by your employer."
      : "Your employer has not yet digitally attested your KYC. This is required before EPFO will process most claims.",
    consequence: profile.kycAttestedByEmployer ? undefined : "Claim will be rejected or held pending KYC approval.",
    fixLabel: profile.kycAttestedByEmployer ? undefined : "Request KYC attestation",
    fixRoute: profile.kycAttestedByEmployer ? undefined : "/fix/kyc-attestation",
    resolutionTime: profile.kycAttestedByEmployer ? undefined : "Depends on employer response time",
    claimRelevant: true,
  });

  // 6. Bank IFSC valid
  results.push({
    id: "bank-ifsc",
    label: "Bank account details valid",
    severity: profile.bankIfscValid ? "pass" : "fail",
    reason: profile.bankIfscValid
      ? `Your linked bank account (IFSC ${profile.bankIfsc}) is valid.`
      : `The IFSC code on record (${profile.bankIfsc}) is no longer valid — often because the bank merged or the branch code changed.`,
    consequence: profile.bankIfscValid ? undefined : "Claim payment cannot be processed to this account.",
    fixLabel: profile.bankIfscValid ? undefined : "Update bank details",
    fixRoute: profile.bankIfscValid ? undefined : "/fix/bank-update",
    resolutionTime: profile.bankIfscValid ? undefined : "~3-5 working days after employer approval",
    claimRelevant: true,
  });

  // 7. Date of Exit filed
  results.push({
    id: "date-of-exit",
    label: "Date of exit recorded for previous employment",
    severity: profile.dateOfExitFiled ? "pass" : "fail",
    reason: profile.dateOfExitFiled
      ? "Your date of exit from your previous employer is on record."
      : "Your previous employer has not marked your date of exit. This silently blocks transfers and withdrawals.",
    consequence: profile.dateOfExitFiled ? undefined : "Transfer and withdrawal requests cannot be processed.",
    fixLabel: profile.dateOfExitFiled ? undefined : "Self-mark date of exit",
    fixRoute: profile.dateOfExitFiled ? undefined : "/fix/date-of-exit",
    resolutionTime: profile.dateOfExitFiled ? undefined : "Immediate if 2+ months since leaving",
    claimRelevant: true,
  });

  // 8. Service duration / TDS
  const totalMonths = profile.serviceYears * 12 + profile.serviceMonths;
  const under5Years = totalMonths < 60;
  const tdsResolved = !under5Years || profile.form15gFiled;
  results.push({
    id: "service-tds",
    label: "Service duration and tax impact",
    severity: tdsResolved ? "pass" : "warn",
    reason: !under5Years
      ? `Your service is ${profile.serviceYears}y ${profile.serviceMonths}m — over 5 years. No TDS applies on withdrawal.`
      : profile.form15gFiled
        ? `Your service is ${profile.serviceYears}y ${profile.serviceMonths}m — under 5 years, but Form 15G is on file, so TDS will not be deducted (subject to your total income being below the taxable limit).`
        : `Your service is ${profile.serviceYears}y ${profile.serviceMonths}m — under 5 years. TDS applies on withdrawal unless you file Form 15G/15H.`,
    consequence: tdsResolved ? undefined : "Up to 10-30% TDS deducted depending on PAN status.",
    fixLabel: tdsResolved ? undefined : "File Form 15G",
    fixRoute: tdsResolved ? undefined : "/fix/form-15g",
    claimRelevant: true,
  });

  // 9. Nomination filed
  results.push({
    id: "nomination",
    label: "e-Nomination filed",
    severity: profile.nominationFiled ? "pass" : "warn",
    reason: profile.nominationFiled
      ? "Your e-Nomination is on file. Your family is protected under EDLI and EPS survivor benefits."
      : "You have not filed an e-Nomination. Without it, your family's claim to EDLI insurance (up to ₹7,00,000) and pension benefits becomes far harder.",
    consequence: profile.nominationFiled ? undefined : "Family may lose access to EDLI insurance and survivor pension.",
    fixLabel: profile.nominationFiled ? undefined : "File e-Nomination",
    fixRoute: profile.nominationFiled ? undefined : "/fix/nomination",
    resolutionTime: profile.nominationFiled ? undefined : "~2 minutes",
    claimRelevant: false,
  });

  // 10. Unmerged member IDs / stranded balance
  const unmergedIds = profile.memberIds.filter((m) => !m.transferred && m.balance > 0);
  const strandedTotal = unmergedIds.reduce((sum, m) => sum + m.balance, 0);
  results.push({
    id: "unmerged-accounts",
    label: "All previous accounts transferred",
    severity: unmergedIds.length === 0 ? "pass" : "warn",
    reason:
      unmergedIds.length === 0
        ? "All your previous PF accounts have been transferred into your current account."
        : `You have ${unmergedIds.length} previous account${unmergedIds.length > 1 ? "s" : ""} not yet transferred, holding ₹${strandedTotal.toLocaleString("en-IN")} combined.`,
    consequence:
      unmergedIds.length === 0
        ? undefined
        : "Inoperative accounts (3+ years with no contribution) stop earning interest.",
    fixLabel: unmergedIds.length === 0 ? undefined : "Start transfer",
    fixRoute: unmergedIds.length === 0 ? undefined : "/fix/transfer",
    claimRelevant: false,
  });

  return results;
}

function scoreOf(results: RuleResult[]): number {
  if (results.length === 0) return 100;
  const weights: Record<Severity, number> = { pass: 1, warn: 0.5, fail: 0 };
  const total = results.reduce((sum, r) => sum + weights[r.severity], 0);
  return Math.round((total / results.length) * 100);
}

// PF Health — ambient, dashboard-level score across ALL checks.
export function healthScore(results: RuleResult[]): number {
  return scoreOf(results);
}

// Claim Pre-Flight — score across only the checks that can actually block
// a claim from being paid. This is the number shown before filing.
export function preflightScore(results: RuleResult[]): number {
  return scoreOf(results.filter((r) => r.claimRelevant));
}

export function preflightChecks(results: RuleResult[]): RuleResult[] {
  return results.filter((r) => r.claimRelevant);
}

export function attentionItems(results: RuleResult[]): RuleResult[] {
  return results.filter((r) => r.severity !== "pass");
}

/** @deprecated use healthScore or preflightScore */
export function readinessScore(results: RuleResult[]): number {
  return scoreOf(results);
}
