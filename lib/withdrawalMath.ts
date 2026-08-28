const INTEREST_RATE = 0.0825; // EPF declared rate, illustrative — verify against the current year's notified rate
const RETIREMENT_AGE = 58;
const EPS_PENSIONABLE_SALARY_CAP = 15000;
const EPS_MIN_SERVICE_YEARS = 10;

export function yearsToRetirement(age: number): number {
  return Math.max(0, RETIREMENT_AGE - age);
}

// Future value of a lump sum left untouched until retirement, compounding annually
// at the current EPF rate. Illustrative — actual future rates are not guaranteed.
export function futureValueLost(amount: number, age: number): number {
  const years = yearsToRetirement(age);
  return Math.round(amount * Math.pow(1 + INTEREST_RATE, years));
}

export interface TdsResult {
  applies: boolean;
  rate: number; // as a fraction, e.g. 0.1 for 10%
  reason: string;
}

// TDS on EPF withdrawal only applies if service is under 5 continuous years.
// 10% if PAN is linked, higher (typically the maximum marginal rate) if not.
// Form 15G/15H can bring it to nil if total income is below the taxable limit.
export function estimateTds(
  serviceYears: number,
  serviceMonths: number,
  form15gFiled: boolean,
  panLinked: boolean
): TdsResult {
  const totalMonths = serviceYears * 12 + serviceMonths;
  const under5Years = totalMonths < 60;

  if (!under5Years) {
    return { applies: false, rate: 0, reason: "Service is 5 years or more — no TDS applies on withdrawal." };
  }
  if (form15gFiled) {
    return {
      applies: false,
      rate: 0,
      reason: "Form 15G is on file, so no TDS is deducted (valid only if your total income is below the taxable limit).",
    };
  }
  if (panLinked) {
    return { applies: true, rate: 0.1, reason: "Service is under 5 years. With PAN linked, TDS is 10%." };
  }
  return {
    applies: true,
    rate: 0.3,
    reason: "Service is under 5 years and PAN is not linked, so TDS is deducted at the maximum marginal rate (30%).",
  };
}

// Rounds service to the nearest EPFO convention: 6+ months rounds up to the next full year.
export function roundedPensionableService(years: number, months: number): number {
  return months >= 6 ? years + 1 : years;
}

export interface PensionEstimate {
  eligible: boolean;
  pensionableSalary: number;
  pensionableServiceYears: number;
  monthlyPension: number;
}

// EPS-95 formula: Monthly Pension = (Pensionable Salary × Pensionable Service) / 70
// Pensionable Salary is capped at ₹15,000/month unless higher pension was specifically opted for.
// Requires at least 10 years of service to be eligible for the monthly pension (else Form 10C
// withdrawal benefit applies instead).
export function estimatePension(
  serviceYears: number,
  serviceMonths: number,
  monthlyBasic: number
): PensionEstimate {
  const pensionableServiceYears = roundedPensionableService(serviceYears, serviceMonths);
  const pensionableSalary = Math.min(monthlyBasic, EPS_PENSIONABLE_SALARY_CAP);
  const eligible = serviceYears >= EPS_MIN_SERVICE_YEARS;
  const monthlyPension = eligible
    ? Math.round((pensionableSalary * pensionableServiceYears) / 70)
    : 0;
  return { eligible, pensionableSalary, pensionableServiceYears, monthlyPension };
}

// Approximates a member's monthly Basic+DA from their most recent contribution
// (contribution ≈ 12% of Basic+DA). Used only to illustrate the pension formula.
export function approximateMonthlyBasic(latestContributionAmount: number): number {
  if (!latestContributionAmount) return 0;
  return Math.round(latestContributionAmount / 0.12);
}
