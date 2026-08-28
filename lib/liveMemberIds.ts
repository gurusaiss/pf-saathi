import { Persona, MemberAccount } from "./mock/types";
import { ProfileOverrides } from "./overrides";

// Merges the persona's static member accounts with the live transfer override,
// so "transferred" reflects fixes applied in this session, not just the mock baseline.
export function liveMemberIds(persona: Persona, overrides: ProfileOverrides): MemberAccount[] {
  return persona.memberIds.map((m) => ({
    ...m,
    transferred: overrides.transferred ? true : m.transferred,
  }));
}

export function liveStrandedAccounts(persona: Persona, overrides: ProfileOverrides): MemberAccount[] {
  return liveMemberIds(persona, overrides).filter((m) => !m.transferred && m.balance > 0);
}
