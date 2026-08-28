export function DemoBanner() {
  return (
    <div className="w-full">
      <div className="bg-[#111111] text-white text-[11px] sm:text-xs px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span aria-hidden className="text-sm leading-none">🇮🇳</span>
        <span className="eyebrow">Unofficial prototype</span>
        <span className="opacity-40">|</span>
        <span>
          Simulated EPFO data — not connected to EPFO. Real services:{" "}
          <a
            href="https://www.epfindia.gov.in"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            epfindia.gov.in
          </a>
        </span>
      </div>
      <div className="tricolor-rule" />
    </div>
  );
}
