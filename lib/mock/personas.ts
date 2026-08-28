import { Persona } from "./types";
export type { Persona } from "./types";

// ---------------------------------------------------------------------------
// Persona 1 — Rahul Sharma — Job change / stranded balances
// ---------------------------------------------------------------------------
const rahul: Persona = {
  uan: "100200300401",
  password: "Demo123!",
  name: "Rahul Sharma",
  aadhaarName: "Rahul Sharma",
  dob: "1991-06-14",
  aadhaarDob: "1991-06-14",
  age: 34,
  aadhaarLinked: true,
  panLinked: true,
  kycAttestedByEmployer: true,
  bankIfsc: "HDFC0001234",
  bankIfscValid: true,
  bankAccount: "50100234567890",
  dateOfExitFiled: true,
  nominationFiled: true,
  nominee: "Sunita Sharma (Spouse)",
  serviceYears: 9,
  serviceMonths: 3,
  currentEmployer: "Nova Tech Systems",
  memberIds: [
    {
      id: "DLABC00112340000045671",
      employer: "ABC Technologies",
      from: "2016-05-01",
      to: "2019-07-31",
      transferred: false,
      balance: 68400,
      employeeShare: 34600,
      employerShare: 24300,
      epsShare: 9500,
    },
    {
      id: "MHXYZ00998760000078234",
      employer: "XYZ Systems Pvt Ltd",
      from: "2019-08-16",
      to: "2022-11-30",
      transferred: false,
      balance: 56500,
      employeeShare: 29100,
      employerShare: 20400,
      epsShare: 7000,
    },
    {
      id: "DLNVT00554430000091122",
      employer: "Nova Tech Systems",
      from: "2022-12-12",
      to: null,
      transferred: true,
      balance: 298640,
      employeeShare: 158200,
      employerShare: 110900,
      epsShare: 29540,
    },
  ],
  contributions: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2, "0")}-01`,
    salaryDeductionShown: true,
    contributionVisible: true,
    amount: 7200,
  })),
  claims: [],
  scenarioTag: "job-change",
  scenarioSummary:
    "Three employers since 2016. ₹1,24,900 sitting in two old accounts that were never transferred.",
};

// ---------------------------------------------------------------------------
// Persona 2 — Priya Nair — Claim rejected
// ---------------------------------------------------------------------------
const priya: Persona = {
  uan: "100200300402",
  password: "Demo123!",
  name: "PRIYA S NAIR",
  aadhaarName: "Priya Suresh Nair",
  dob: "1994-02-02",
  aadhaarDob: "1994-02-05",
  age: 31,
  aadhaarLinked: false, // seeding never completed — blocked by the name mismatch below
  panLinked: false,
  kycAttestedByEmployer: false, // employer hasn't digitally attested since the last mismatch
  bankIfsc: "ICIC0002211",
  bankIfscValid: false, // bank merged, old IFSC dead
  bankAccount: "003401567823",
  dateOfExitFiled: true,
  nominationFiled: true,
  nominee: "Suresh Nair (Father)",
  serviceYears: 4,
  serviceMonths: 8,
  currentEmployer: "Bluewave Analytics",
  memberIds: [
    {
      id: "KAABC00223340000011987",
      employer: "Coastal Softworks",
      from: "2019-06-01",
      to: "2021-09-30",
      transferred: true,
      balance: 41200,
      employeeShare: 21600,
      employerShare: 15100,
      epsShare: 4500,
    },
    {
      id: "KABLW00887760000023456",
      employer: "Bluewave Analytics",
      from: "2021-10-11",
      to: null,
      transferred: true,
      balance: 312800,
      employeeShare: 166000,
      employerShare: 116200,
      epsShare: 30600,
    },
  ],
  contributions: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2, "0")}-01`,
    salaryDeductionShown: true,
    contributionVisible: true,
    amount: 8100,
  })),
  claims: [
    {
      id: "CLM88213409",
      type: "PF Withdrawal",
      form: "Form 19",
      filedOn: "2025-05-12",
      status: "Rejected",
      amount: 354000,
      rejectionRemark: "CLAIM REJECTED: NAME DIFFERS AS PER RECORD, WRONG/INSUFFICIENT DATA",
      rejectionReasonId: "name-match",
    },
    {
      id: "CLM88219902",
      type: "PF Withdrawal",
      form: "Form 19",
      filedOn: "2025-06-30",
      status: "Rejected",
      amount: 354000,
      rejectionRemark: "CLAIM REJECTED: BANK DETAILS NOT VERIFIED / IFSC INVALID",
      rejectionReasonId: "bank-ifsc",
    },
  ],
  scenarioTag: "claim-rejected",
  scenarioSummary:
    "Two rejected withdrawal claims — EPFO name doesn't match Aadhaar, and the bank IFSC is dead after a merger.",
};

// ---------------------------------------------------------------------------
// Persona 3 — Arjun Kumar — Missing contribution
// ---------------------------------------------------------------------------
const arjun: Persona = {
  uan: "100200300403",
  password: "Demo123!",
  name: "Arjun Kumar",
  aadhaarName: "Arjun Kumar",
  dob: "1997-11-20",
  aadhaarDob: "1997-11-20",
  age: 28,
  aadhaarLinked: true,
  panLinked: true,
  kycAttestedByEmployer: true,
  bankIfsc: "SBIN0009876",
  bankIfscValid: true,
  bankAccount: "31234567890",
  dateOfExitFiled: true,
  nominationFiled: false,
  serviceYears: 2,
  serviceMonths: 4,
  currentEmployer: "Crestline Retail Pvt Ltd",
  memberIds: [
    {
      id: "TNCRL00445560000067812",
      employer: "Crestline Retail Pvt Ltd",
      from: "2023-05-01",
      to: null,
      transferred: true,
      balance: 78200,
      employeeShare: 41500,
      employerShare: 29000,
      epsShare: 7700,
    },
  ],
  contributions: [
    { month: "2025-01-01", salaryDeductionShown: true, contributionVisible: true, amount: 5400 },
    { month: "2025-02-01", salaryDeductionShown: true, contributionVisible: true, amount: 5400 },
    { month: "2025-03-01", salaryDeductionShown: true, contributionVisible: false, amount: 0 },
    { month: "2025-04-01", salaryDeductionShown: true, contributionVisible: true, amount: 5400 },
    { month: "2025-05-01", salaryDeductionShown: true, contributionVisible: true, amount: 5400 },
    { month: "2025-06-01", salaryDeductionShown: true, contributionVisible: true, amount: 5400 },
    { month: "2025-07-01", salaryDeductionShown: true, contributionVisible: true, amount: 5600 },
    { month: "2025-08-01", salaryDeductionShown: true, contributionVisible: true, amount: 5600 },
  ],
  claims: [],
  scenarioTag: "missing-contribution",
  scenarioSummary:
    "Salary slip shows a PF deduction for March, but the contribution never appeared in the EPFO record.",
};

// ---------------------------------------------------------------------------
// Persona 4 — Neha Rao — Nomination not filed
// ---------------------------------------------------------------------------
const neha: Persona = {
  uan: "100200300404",
  password: "Demo123!",
  name: "Neha Rao",
  aadhaarName: "Neha Rao",
  dob: "1983-09-09",
  aadhaarDob: "1983-09-09",
  age: 42,
  aadhaarLinked: true,
  panLinked: true,
  kycAttestedByEmployer: true,
  bankIfsc: "AXIS0004455",
  bankIfscValid: true,
  bankAccount: "912010045678123",
  dateOfExitFiled: true,
  nominationFiled: false,
  serviceYears: 14,
  serviceMonths: 7,
  currentEmployer: "Meridian Financial Services",
  memberIds: [
    {
      id: "MHMFS00332210000098765",
      employer: "Orion Consulting Group",
      from: "2011-02-01",
      to: "2018-03-31",
      transferred: true,
      balance: 189200,
      employeeShare: 99000,
      employerShare: 69300,
      epsShare: 20900,
    },
    {
      id: "MHMFS00776650000034521",
      employer: "Meridian Financial Services",
      from: "2018-04-16",
      to: null,
      transferred: true,
      balance: 612400,
      employeeShare: 324600,
      employerShare: 227200,
      epsShare: 60600,
    },
  ],
  contributions: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2, "0")}-01`,
    salaryDeductionShown: true,
    contributionVisible: true,
    amount: 12400,
  })),
  claims: [],
  scenarioTag: "nomination",
  scenarioSummary:
    "14+ years of service, healthy account — but no e-Nomination filed. Family's EDLI insurance and survivor pension are at risk.",
};

export const personas: Persona[] = [rahul, priya, arjun, neha];

export function getPersonaByUan(uan: string): Persona | undefined {
  return personas.find((p) => p.uan === uan);
}

export function totalBalance(p: Persona): number {
  return p.memberIds.reduce((sum, m) => sum + m.balance, 0);
}

export function totalEmployeeShare(p: Persona): number {
  return p.memberIds.reduce((sum, m) => sum + m.employeeShare, 0);
}

export function totalEmployerShare(p: Persona): number {
  return p.memberIds.reduce((sum, m) => sum + m.employerShare, 0);
}

export function totalEpsShare(p: Persona): number {
  return p.memberIds.reduce((sum, m) => sum + m.epsShare, 0);
}

export function strandedAccounts(p: Persona) {
  return p.memberIds.filter((m) => !m.transferred && m.balance > 0);
}
