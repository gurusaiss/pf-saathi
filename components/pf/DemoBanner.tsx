export function DemoBanner() {
  return (
    <div className="w-full bg-[var(--primary)] text-[var(--primary-fg)] text-center text-xs sm:text-sm py-1.5 px-4">
      Demonstration prototype with simulated EPFO data and workflows — not connected to EPFO. For
      real EPF services, visit{" "}
      <a href="https://www.epfindia.gov.in" target="_blank" rel="noreferrer" className="underline">
        epfindia.gov.in
      </a>
      .
    </div>
  );
}
