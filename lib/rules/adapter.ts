import { Persona } from "../mock/types";
import { EmployeeProfile } from "./rejectionRules";
import { ProfileOverrides } from "../overrides";

export function personaToProfile(p: Persona, overrides: ProfileOverrides = {}): EmployeeProfile {
  return {
    uan: p.uan,
    name: overrides.nameFixed ? p.aadhaarName : p.name,
    aadhaarName: p.aadhaarName,
    dob: overrides.dobFixed ? p.aadhaarDob : p.dob,
    aadhaarDob: p.aadhaarDob,
    aadhaarLinked: overrides.aadhaarLinked ?? p.aadhaarLinked,
    panLinked: overrides.panLinked ?? p.panLinked,
    kycAttestedByEmployer: overrides.kycAttested ?? p.kycAttestedByEmployer,
    bankIfsc: overrides.bankFixed ? "HDFC0004455 (updated)" : p.bankIfsc,
    bankIfscValid: overrides.bankFixed ?? p.bankIfscValid,
    dateOfExitFiled: overrides.dateOfExitFiled ?? p.dateOfExitFiled,
    nominationFiled: overrides.nominationFiled ?? p.nominationFiled,
    form15gFiled: overrides.form15gFiled ?? false,
    serviceYears: p.serviceYears,
    serviceMonths: p.serviceMonths,
    memberIds: p.memberIds.map((m) => ({
      id: m.id,
      employer: m.employer,
      from: m.from,
      to: m.to,
      transferred: overrides.transferred ? true : m.transferred,
      balance: m.balance,
    })),
  };
}
