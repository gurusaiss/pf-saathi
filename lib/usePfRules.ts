"use client";

import { useMemo } from "react";
import { useSession } from "./session";
import { personaToProfile } from "./rules/adapter";
import { runRules, healthScore, preflightScore, preflightChecks, attentionItems } from "./rules/rejectionRules";

export function usePfRules() {
  const { persona, overrides } = useSession();

  return useMemo(() => {
    if (!persona) return null;
    const profile = personaToProfile(persona, overrides);
    const results = runRules(profile);
    return {
      profile,
      results,
      health: healthScore(results),
      preflight: preflightScore(results),
      preflightRules: preflightChecks(results),
      attention: attentionItems(results),
      preflightAttention: attentionItems(preflightChecks(results)),
      ambientAttention: attentionItems(results).filter((r) => !r.claimRelevant),
    };
  }, [persona, overrides]);
}
