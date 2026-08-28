"use client";

function colorFor(score: number) {
  if (score >= 80) return "var(--ok)";
  if (score >= 55) return "var(--warn)";
  return "var(--bad)";
}

export function ScoreRing({ score, size = 128 }: { score: number; size?: number }) {
  // Animated via a CSS transition on stroke-dashoffset (not a requestAnimationFrame
  // loop — rAF is throttled to near-zero in backgrounded/non-composited tabs, which
  // would leave the ring stuck). The prop itself drives the transition, no local
  // state needed.
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = colorFor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke="var(--border)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 700ms ease-out, stroke 300ms" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="tabular-nums text-3xl font-extrabold" style={{ color, transition: "color 300ms" }}>
          {score}%
        </span>
      </div>
    </div>
  );
}
