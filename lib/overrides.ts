export interface ProfileOverrides {
  nameFixed?: boolean;
  dobFixed?: boolean;
  aadhaarLinked?: boolean;
  panLinked?: boolean;
  kycAttested?: boolean;
  bankFixed?: boolean;
  dateOfExitFiled?: boolean;
  form15gFiled?: boolean;
  nominationFiled?: boolean;
  transferred?: boolean;
  grievanceFiled?: boolean;
}

// Maps a rule's fixRoute segment ("/fix/name-mismatch") to the override it applies.
export const FIX_ACTIONS: Record<string, keyof ProfileOverrides> = {
  "name-mismatch": "nameFixed",
  "dob-mismatch": "dobFixed",
  "aadhaar-link": "aadhaarLinked",
  "pan-link": "panLinked",
  "kyc-attestation": "kycAttested",
  "bank-update": "bankFixed",
  "date-of-exit": "dateOfExitFiled",
  "form-15g": "form15gFiled",
  nomination: "nominationFiled",
  transfer: "transferred",
  grievance: "grievanceFiled",
};

export const FIX_TITLES: Record<string, string> = {
  "name-mismatch": "Fix name mismatch",
  "dob-mismatch": "Fix date of birth mismatch",
  "aadhaar-link": "Link Aadhaar",
  "pan-link": "Link PAN",
  "kyc-attestation": "Request KYC attestation",
  "bank-update": "Update bank details",
  "date-of-exit": "Self-mark date of exit",
  "form-15g": "File Form 15G",
  nomination: "File e-Nomination",
  transfer: "Transfer old accounts",
  grievance: "File a grievance (EPFiGMS)",
};

export const FIX_DESCRIPTIONS: Record<string, string> = {
  "name-mismatch":
    "Generates a Joint Declaration pre-filled with your EPFO record and your Aadhaar name, ready for your employer to co-sign.",
  "dob-mismatch":
    "Generates a Joint Declaration to correct your date of birth to match your Aadhaar record.",
  "aadhaar-link":
    "Initiates Aadhaar-based verification (OTP) to link and verify your Aadhaar with your UAN.",
  "pan-link": "Links your PAN to your UAN so standard TDS rates apply on withdrawal.",
  "kyc-attestation":
    "Sends a KYC attestation request to your employer's portal for digital approval.",
  "bank-update":
    "Updates your bank account and IFSC on record after your bank's post-merger migration.",
  "date-of-exit":
    "Self-marks your date of exit, available once 2+ months have passed with no further contribution from that employer.",
  "form-15g":
    "Files Form 15G to avoid TDS deduction on withdrawal, applicable if your total income is below the taxable limit.",
  nomination:
    "Starts the guided e-Nomination flow — takes about two minutes and protects your family's EDLI and survivor pension claim.",
  transfer:
    "Merges the balance from your old member ID(s) into your current account, so it keeps earning interest under one active account.",
  grievance:
    "Files a grievance on EPFiGMS, EPFO's official grievance redressal portal, and forwards it to your employer's nodal officer for a response.",
};
