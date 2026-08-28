export interface MemberAccount {
  id: string; // member id, e.g. DLCPM00123450000012345
  employer: string;
  from: string; // ISO date
  to: string | null; // null = current
  transferred: boolean;
  balance: number;
  employeeShare: number;
  employerShare: number;
  epsShare: number;
}

export interface ContributionMonth {
  month: string; // ISO, first of month
  salaryDeductionShown: boolean;
  contributionVisible: boolean;
  amount: number;
}

export interface ClaimRecord {
  id: string;
  type: "PF Withdrawal" | "PF Transfer" | "Pension Withdrawal" | "Advance";
  form: "Form 19" | "Form 13" | "Form 10C" | "Form 31";
  filedOn: string;
  status: "Approved" | "Rejected" | "Processing" | "Pending Employer Action";
  amount: number;
  rejectionRemark?: string;
  rejectionReasonId?: string; // maps to rejectionRules.ts id
}

export interface Persona {
  uan: string;
  password: string;
  name: string;
  aadhaarName: string;
  dob: string;
  aadhaarDob: string;
  age: number;
  aadhaarLinked: boolean;
  panLinked: boolean;
  kycAttestedByEmployer: boolean;
  bankIfsc: string;
  bankIfscValid: boolean;
  bankAccount: string;
  dateOfExitFiled: boolean;
  nominationFiled: boolean;
  nominee?: string;
  serviceYears: number;
  serviceMonths: number;
  currentEmployer: string;
  memberIds: MemberAccount[];
  contributions: ContributionMonth[];
  claims: ClaimRecord[];
  scenarioTag: "job-change" | "claim-rejected" | "missing-contribution" | "nomination";
  scenarioSummary: string;
}
