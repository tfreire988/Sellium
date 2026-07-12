export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle
        cx="17"
        cy="17"
        r="14.5"
        fill="none"
        stroke="#B8763A"
        strokeWidth="2"
        strokeDasharray="86 4"
        transform="rotate(20 17 17)"
      />
      <circle
        cx="17.6"
        cy="16.5"
        r="13.6"
        fill="none"
        stroke="#B8763A"
        strokeWidth="0.9"
        opacity="0.5"
      />
      <text
        x="17"
        y="22.5"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="16"
        fontWeight="700"
        fill="#B8763A"
      >
        S
      </text>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-serif font-semibold ${className ?? ""}`}>
      Sellium
    </span>
  );
}
