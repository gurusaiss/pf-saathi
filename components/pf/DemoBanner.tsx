export function DemoBanner() {
  return (
    <div className="w-full">
      <div className="bg-[#111111] text-white text-center text-[11px] sm:text-xs py-1.5 px-4">
        <span className="eyebrow">Unofficial prototype</span>
        <span className="mx-2 opacity-50">|</span>
        Simulated EPFO data and workflows — not connected to EPFO. For real EPF services, visit{" "}
        <a
          href="https://www.epfindia.gov.in"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          epfindia.gov.in
        </a>
        .
      </div>
      <div className="tricolor-rule" />
    </div>
  );
}
