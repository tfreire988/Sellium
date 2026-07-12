export function MiniStamp({
  size,
  word,
  variant = "step",
}: {
  size: number;
  word: string;
  variant?: "step" | "video";
}) {
  if (variant === "video") {
    return (
      <svg width={size} height={size} viewBox="0 0 88 88" aria-hidden="true">
        <circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          stroke="#4F6B4A"
          strokeWidth="2.6"
          strokeDasharray="228 7"
          transform="rotate(28 44 44)"
        />
        <circle
          cx="44.8"
          cy="43.3"
          r="36.2"
          fill="none"
          stroke="#4F6B4A"
          strokeWidth="1"
          opacity="0.5"
        />
        <text
          x="44"
          y="49.5"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="13"
          fontWeight="500"
          letterSpacing="1.5"
          fill="#4F6B4A"
        >
          {word}
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 74 74" aria-hidden="true">
      <circle
        cx="37"
        cy="37"
        r="32"
        fill="none"
        stroke="#4F6B4A"
        strokeWidth="2.2"
        strokeDasharray="192 6"
        transform="rotate(30 37 37)"
      />
      <circle
        cx="37.8"
        cy="36.4"
        r="30.5"
        fill="none"
        stroke="#4F6B4A"
        strokeWidth="0.9"
        opacity="0.5"
      />
      <text
        x="37"
        y="42.5"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="12"
        fontWeight="500"
        letterSpacing="1.5"
        fill="#4F6B4A"
      >
        {word}
      </text>
    </svg>
  );
}
