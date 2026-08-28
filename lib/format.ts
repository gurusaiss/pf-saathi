export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) return "₹" + (amount / 10000000).toFixed(2) + " Cr";
  if (amount >= 100000) return "₹" + (amount / 100000).toFixed(2) + " L";
  return formatINR(amount);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function maskUAN(uan: string): string {
  return "XXXX-XXXX-" + uan.slice(-4);
}

export function maskAccount(acc: string): string {
  if (acc.length <= 4) return acc;
  return "X".repeat(acc.length - 4) + acc.slice(-4);
}

export function serviceDuration(years: number, months: number): string {
  const y = years > 0 ? `${years} yr${years !== 1 ? "s" : ""}` : "";
  const m = months > 0 ? `${months} mo${months !== 1 ? "s" : ""}` : "";
  return [y, m].filter(Boolean).join(" ") || "0 mos";
}
